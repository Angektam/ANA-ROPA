import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart';
import { ToastService } from '../../services/toast.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-quick-view-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-view-modal.html',
  styleUrl: './quick-view-modal.scss'
})
export class QuickViewModalComponent {
  @Input() product: Product | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;
  selectedImageIndex: number = 0;

  Math = Math;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private wishlistService: WishlistService
  ) {}

  ngOnChanges() {
    if (this.product) {
      // Seleccionar primera talla y color disponibles
      if (this.product.size.length > 0) {
        this.selectedSize = this.product.size.find((s: any) => s.available)?.name || '';
      }
      if (this.product.color.length > 0) {
        this.selectedColor = this.product.color[0];
      }
      this.selectedImageIndex = 0;
      this.quantity = 1;
    }
  }

  closeModal() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  incrementQuantity() {
    if (this.quantity < (this.product?.stock || 99)) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product) return;

    if (this.selectedSize && this.selectedColor) {
      this.cartService.addToCart(this.product, this.quantity, this.selectedSize, this.selectedColor);
      this.toastService.success(`${this.product.name} añadido al carrito`);
      this.closeModal();
    } else {
      this.toastService.warning('Por favor selecciona talla y color');
    }
  }

  toggleWishlist() {
    if (!this.product) return;

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

  isInWishlist(): boolean {
    if (!this.product) return false;
    return this.wishlistService.isInWishlist(this.product.id);
  }

  getDiscountPercentage(): number {
    if (this.product?.originalPrice) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return 0;
  }

  getImages(): string[] {
    if (!this.product) return [];
    const images = [this.product.image];
    if (this.product.images && this.product.images.length > 0) {
      images.push(...this.product.images);
    }
    return images;
  }
}

