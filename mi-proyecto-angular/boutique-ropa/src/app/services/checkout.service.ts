import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Order, OrderItem, ShippingAddress, Coupon, CartItem } from '../models/product.model';
import { AuthService } from './auth.service';

export interface CheckoutRequest {
  shippingAddressId?: number;
  shippingAddress?: ShippingAddress;
  paymentMethod: string;
  couponCode?: string;
  notes?: string;
}

export interface PaymentRequest {
  orderId: number;
  paymentMethod: string;
  paymentDetails: any;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimatedDays: string;
  isDefault?: boolean;
}

export interface CheckoutSummary {
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  coupon?: Coupon;
  shippingOption?: ShippingOption;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly API_URL = 'http://localhost:3000';
  private currentOrderSubject = new BehaviorSubject<Order | null>(null);
  private checkoutSummarySubject = new BehaviorSubject<CheckoutSummary | null>(null);
  
  public currentOrder$ = this.currentOrderSubject.asObservable();
  public checkoutSummary$ = this.checkoutSummarySubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get available shipping options
  getShippingOptions(): Observable<ShippingOption[]> {
    return this.http.get<ShippingOption[]>(`${this.API_URL}/shipping/options`)
      .pipe(
        catchError(error => {
          console.error('Error fetching shipping options:', error);
          return throwError(() => error);
        })
      );
  }

  // Calculate shipping cost
  calculateShipping(zipCode: string, weight?: number): Observable<number> {
    return this.http.post<{ cost: number }>(`${this.API_URL}/shipping/calculate`, {
      zipCode,
      weight
    }).pipe(
      map(response => response.cost),
      catchError(error => {
        console.error('Error calculating shipping:', error);
        return throwError(() => error);
      })
    );
  }

  // Validate coupon code
  validateCoupon(code: string, orderTotal: number): Observable<Coupon> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.post<Coupon>(`${this.API_URL}/coupons/validate`, {
      code,
      orderTotal
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error validating coupon:', error);
        return throwError(() => error);
      })
    );
  }

  // Calculate checkout summary
  calculateCheckoutSummary(
    cartItems: CartItem[],
    shippingCost: number = 0,
    coupon?: Coupon
  ): CheckoutSummary {
    const subtotal = cartItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );

    const tax = subtotal * 0.16; // 16% IVA en México
    const discount = coupon ? this.calculateDiscount(subtotal, coupon) : 0;
    const total = subtotal + shippingCost + tax - discount;

    return {
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      coupon
    };
  }

  // Create order
  createOrder(checkoutData: CheckoutRequest, cartItems: CartItem[]): Observable<Order> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    const orderData = {
      ...checkoutData,
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      }))
    };

    return this.http.post<Order>(`${this.API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(order => {
        this.currentOrderSubject.next(order);
      }),
      catchError(error => {
        console.error('Error creating order:', error);
        return throwError(() => error);
      })
    );
  }

  // Process payment
  processPayment(paymentData: PaymentRequest): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.post(`${this.API_URL}/payments/process`, paymentData, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(response => {
        // Update order status if payment is successful
        if ((response as any).success) {
          this.updateOrderStatus(paymentData.orderId, 'paid').subscribe();
        }
      }),
      catchError(error => {
        console.error('Error processing payment:', error);
        return throwError(() => error);
      })
    );
  }

  // Update order status
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.put<Order>(`${this.API_URL}/orders/${orderId}/status`, {
      status
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(updatedOrder => {
        this.currentOrderSubject.next(updatedOrder);
      }),
      catchError(error => {
        console.error('Error updating order status:', error);
        return throwError(() => error);
      })
    );
  }

  // Get order by ID
  getOrder(orderId: number): Observable<Order> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<Order>(`${this.API_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(order => {
        this.currentOrderSubject.next(order);
      }),
      catchError(error => {
        console.error('Error fetching order:', error);
        return throwError(() => error);
      })
    );
  }

  // Get user orders
  getUserOrders(): Observable<Order[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<Order[]>(`${this.API_URL}/orders/user`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error fetching user orders:', error);
        return throwError(() => error);
      })
    );
  }

  // Cancel order
  cancelOrder(orderId: number, reason?: string): Observable<Order> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.put<Order>(`${this.API_URL}/orders/${orderId}/cancel`, {
      reason
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(updatedOrder => {
        this.currentOrderSubject.next(updatedOrder);
      }),
      catchError(error => {
        console.error('Error cancelling order:', error);
        return throwError(() => error);
      })
    );
  }

  // Get order tracking info
  getOrderTracking(orderId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get(`${this.API_URL}/orders/${orderId}/tracking`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error fetching order tracking:', error);
        return throwError(() => error);
      })
    );
  }

  // Save shipping address
  saveShippingAddress(address: Omit<ShippingAddress, 'id' | 'userId' | 'createdAt'>): Observable<ShippingAddress> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.post<ShippingAddress>(`${this.API_URL}/shipping-addresses`, address, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error saving shipping address:', error);
        return throwError(() => error);
      })
    );
  }

  // Get user shipping addresses
  getUserShippingAddresses(): Observable<ShippingAddress[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<ShippingAddress[]>(`${this.API_URL}/shipping-addresses`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error fetching shipping addresses:', error);
        return throwError(() => error);
      })
    );
  }

  // Private helper methods
  private calculateDiscount(subtotal: number, coupon: Coupon): number {
    if (!coupon.isActive) return 0;
    
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    
    if (now < validFrom || now > validUntil) return 0;
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) return 0;
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 0;

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

  // Clear current order
  clearCurrentOrder(): void {
    this.currentOrderSubject.next(null);
    this.checkoutSummarySubject.next(null);
  }

  // Set checkout summary
  setCheckoutSummary(summary: CheckoutSummary): void {
    this.checkoutSummarySubject.next(summary);
  }
}
