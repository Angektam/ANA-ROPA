import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart';
import { ToastService } from '../../services/toast.service';
import { WishlistService } from '../../services/wishlist.service';
import { QuickViewModalComponent } from '../quick-view-modal/quick-view-modal';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, FormsModule, QuickViewModalComponent],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard implements OnInit {
  @Input() product!: Product;
  @Input() priority: boolean = false; // Para imágenes priority (LCP)
  @Output() addToCart = new EventEmitter<Product>();
  
  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;
  isAddingToCart: boolean = false;
  showQuickView: boolean = false;

  // Exponer Math para usar en el template
  Math = Math;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    // Seleccionar automáticamente la primera talla y color disponibles
    if (this.product.size.length > 0) {
      this.selectedSize = this.product.size.find((s: any) => s.available)?.name || '';
    }
    if (this.product.color.length > 0) {
      this.selectedColor = this.product.color[0];
    }
  }

  onAddToCart() {
    if (this.selectedSize && this.selectedColor) {
      this.isAddingToCart = true;
      
      // Simular delay de carga
      setTimeout(() => {
        this.cartService.addToCart(this.product, this.quantity, this.selectedSize, this.selectedColor);
        this.addToCart.emit(this.product);
        this.isAddingToCart = false;
        
        // Mostrar toast de éxito
        this.toastService.success(`${this.product.name} añadido al carrito`);
      }, 500);
    } else {
      // Mostrar toast de advertencia si no hay talla/color seleccionado
      this.toastService.warning('Por favor selecciona talla y color');
    }
  }

  onSizeChange(size: string) {
    this.selectedSize = size;
  }

  onColorChange(color: string) {
    this.selectedColor = color;
  }

  getDiscountPercentage(): number {
    if (this.product.originalPrice) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return 0;
  }

  isInCart(): boolean {
    return this.cartService.isInCart(this.product.id, this.selectedSize, this.selectedColor);
  }

  // Métodos para funcionalidades avanzadas
  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }

  toggleWishlist(): void {
    if (this.isInWishlist()) {
      this.wishlistService.removeFromWishlist(this.product.id);
      this.toastService.info('Eliminado de favoritos');
    } else {
      this.wishlistService.addToWishlist(this.product.id).subscribe({
        next: () => {
          this.toastService.success('Añadido a favoritos ❤️');
        },
        error: () => {
          this.toastService.error('Error al añadir a favoritos');
        }
      });
    }
  }

  onQuickView(): void {
    this.showQuickView = true;
  }

  closeQuickView(): void {
    this.showQuickView = false;
  }

  onCompare(): void {
    // TODO: Implementar comparación de productos
    this.toastService.info('Función de comparar próximamente');
  }

  onProductClick(event: Event): void {
    // No hacer nada por ahora - se puede implementar navegación a detalle
  }
}
