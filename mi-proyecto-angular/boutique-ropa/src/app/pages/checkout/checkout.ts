import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CheckoutService, CheckoutRequest, ShippingOption, CheckoutSummary } from '../../services/checkout.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart';
import { CartItem, ShippingAddress } from '../../models/product.model';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  checkoutSummary: CheckoutSummary | null = null;
  shippingOptions: ShippingOption[] = [];
  userAddresses: ShippingAddress[] = [];
  
  isLoading = false;
  isAuthenticated = false;
  currentStep = 1;
  
  checkoutData: CheckoutRequest = {
    shippingAddressId: undefined,
    shippingAddress: undefined,
    paymentMethod: '',
    couponCode: '',
    notes: ''
  };
  
  newAddress: Omit<ShippingAddress, 'id' | 'userId' | 'createdAt'> = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'México',
    isDefault: false
  };
  
  couponCode = '';
  couponError = '';
  couponApplied = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check authentication
    this.subscriptions.push(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          this.loadUserData();
        } else {
          this.router.navigate(['/login']);
        }
      })
    );

    // Subscribe to cart changes
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.updateCheckoutSummary();
      })
    );

    // Subscribe to checkout summary
    this.subscriptions.push(
      this.checkoutService.checkoutSummary$.subscribe(summary => {
        this.checkoutSummary = summary;
      })
    );

    // Initialize
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.loadUserData();
    } else {
      this.router.navigate(['/login']);
    }

    this.cartItems = this.cartService.getCartItems();
    this.updateCheckoutSummary();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUserData() {
    this.loadShippingOptions();
    this.loadUserAddresses();
  }

  private loadShippingOptions() {
    this.checkoutService.getShippingOptions().subscribe({
      next: (options) => {
        this.shippingOptions = options;
        // Set default shipping option
        const defaultOption = options.find(opt => opt.isDefault);
        if (defaultOption) {
          this.updateCheckoutSummary(defaultOption);
        }
      },
      error: (error) => {
        console.error('Error loading shipping options:', error);
      }
    });
  }

  private loadUserAddresses() {
    this.checkoutService.getUserShippingAddresses().subscribe({
      next: (addresses) => {
        this.userAddresses = addresses;
        // Set default address
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          this.checkoutData.shippingAddressId = defaultAddress.id;
        }
      },
      error: (error) => {
        console.error('Error loading user addresses:', error);
      }
    });
  }

  private updateCheckoutSummary(shippingOption?: ShippingOption) {
    const shippingCost = shippingOption?.cost || 0;
    this.checkoutSummary = this.checkoutService.calculateCheckoutSummary(
      this.cartItems,
      shippingCost
    );
    
    if (shippingOption) {
      this.checkoutSummary.shippingOption = shippingOption;
    }
    
    this.checkoutService.setCheckoutSummary(this.checkoutSummary);
  }

  onShippingOptionChange(option: ShippingOption) {
    this.updateCheckoutSummary(option);
  }

  onAddressSelect(addressId: number) {
    this.checkoutData.shippingAddressId = addressId;
    this.checkoutData.shippingAddress = undefined; // Clear custom address
  }

  onCustomAddressChange() {
    this.checkoutData.shippingAddressId = undefined; // Clear selected address
  }

  saveNewAddress() {
    if (!this.isNewAddressValid()) {
      return;
    }

    this.isLoading = true;
    this.checkoutService.saveShippingAddress(this.newAddress).subscribe({
      next: (savedAddress) => {
        this.userAddresses.push(savedAddress);
        this.checkoutData.shippingAddressId = savedAddress.id;
        this.resetNewAddress();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving address:', error);
        this.isLoading = false;
      }
    });
  }

  validateCoupon() {
    if (!this.couponCode.trim()) {
      this.couponError = '';
      return;
    }

    const orderTotal = this.checkoutSummary?.subtotal || 0;
    this.checkoutService.validateCoupon(this.couponCode, orderTotal).subscribe({
      next: (coupon) => {
        this.couponError = '';
        this.couponApplied = true;
        this.checkoutData.couponCode = this.couponCode;
        
        // Update summary with coupon
        if (this.checkoutSummary) {
          this.checkoutSummary.coupon = coupon;
          this.checkoutSummary.discount = this.calculateDiscount(this.checkoutSummary.subtotal, coupon);
          this.checkoutSummary.total = this.checkoutSummary.subtotal + 
            this.checkoutSummary.shippingCost + 
            this.checkoutSummary.tax - 
            this.checkoutSummary.discount;
        }
      },
      error: (error) => {
        this.couponError = error.error?.message || 'Código de cupón inválido';
        this.couponApplied = false;
        this.checkoutData.couponCode = '';
      }
    });
  }

  removeCoupon() {
    this.couponCode = '';
    this.couponError = '';
    this.couponApplied = false;
    this.checkoutData.couponCode = '';
    
    // Recalculate summary without coupon
    this.updateCheckoutSummary();
  }

  private calculateDiscount(subtotal: number, coupon: any): number {
    if (!coupon.isActive) return 0;
    
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = subtotal * (coupon.value / 100);
    } else {
      discount = coupon.value;
    }

    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    return discount;
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step >= 1 && step <= 3) {
      this.currentStep = step;
    }
  }

  processPayment() {
    if (!this.isCheckoutValid()) {
      return;
    }

    this.isLoading = true;
    
    // Create order first
    this.checkoutService.createOrder(this.checkoutData, this.cartItems).subscribe({
      next: (order) => {
        // Process payment
        this.checkoutService.processPayment({
          orderId: order.id,
          paymentMethod: this.checkoutData.paymentMethod,
          paymentDetails: {} // In real app, this would contain payment details
        }).subscribe({
          next: (paymentResult) => {
            this.isLoading = false;
            if (paymentResult.success) {
              // Clear cart and redirect to success page
              this.cartService.clearCart();
              this.router.navigate(['/order-success'], { 
                queryParams: { orderId: order.id } 
              });
            } else {
              alert('Error en el pago. Por favor intenta nuevamente.');
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Payment error:', error);
            alert('Error en el pago. Por favor intenta nuevamente.');
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Order creation error:', error);
        alert('Error al crear la orden. Por favor intenta nuevamente.');
      }
    });
  }

  isCheckoutValid(): boolean {
    // Step 1: Shipping address
    if (this.currentStep === 1) {
      return !!(this.checkoutData.shippingAddressId || this.checkoutData.shippingAddress);
    }
    
    // Step 2: Payment method
    if (this.currentStep === 2) {
      return !!this.checkoutData.paymentMethod;
    }
    
    // Step 3: Review and confirm
    return true;
  }

  private isNewAddressValid(): boolean {
    return !!(
      this.newAddress.street &&
      this.newAddress.city &&
      this.newAddress.state &&
      this.newAddress.zipCode
    );
  }

  private resetNewAddress() {
    this.newAddress = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'México',
      isDefault: false
    };
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  }

  getCartItemsCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Dirección de Envío';
      case 2: return 'Método de Pago';
      case 3: return 'Revisar y Confirmar';
      default: return '';
    }
  }

  getStepIcon(step: number): string {
    switch (step) {
      case 1: return 'fas fa-map-marker-alt';
      case 2: return 'fas fa-credit-card';
      case 3: return 'fas fa-check-circle';
      default: return '';
    }
  }

  getSelectedAddress(): ShippingAddress | undefined {
    return this.userAddresses.find(addr => addr.id === this.checkoutData.shippingAddressId);
  }

  getPaymentIcon(method: string): string {
    switch (method) {
      case 'credit_card': return 'fas fa-credit-card';
      case 'debit_card': return 'fas fa-credit-card';
      case 'paypal': return 'fab fa-paypal';
      case 'bank_transfer': return 'fas fa-university';
      default: return 'fas fa-credit-card';
    }
  }

  getPaymentMethodName(method: string): string {
    switch (method) {
      case 'credit_card': return 'Tarjeta de Crédito';
      case 'debit_card': return 'Tarjeta de Débito';
      case 'paypal': return 'PayPal';
      case 'bank_transfer': return 'Transferencia Bancaria';
      default: return 'Método de Pago';
    }
  }

  getPaymentMethodDescription(method: string): string {
    switch (method) {
      case 'credit_card': return 'Visa, Mastercard, American Express';
      case 'debit_card': return 'Tarjeta de débito bancaria';
      case 'paypal': return 'Pago seguro con PayPal';
      case 'bank_transfer': return 'Transferencia directa desde tu banco';
      default: return 'Selecciona un método de pago';
    }
  }
}
