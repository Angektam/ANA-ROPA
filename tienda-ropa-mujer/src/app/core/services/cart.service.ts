import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>([]);

  readonly items = this.itemsSignal.asReadonly();
  readonly totalItems = computed(() => this.itemsSignal().reduce((acc, item) => acc + item.quantity, 0));
  readonly subtotal = computed(() => this.itemsSignal().reduce((acc, item) => acc + item.quantity * item.product.price, 0));
  readonly shipping = computed(() => (this.subtotal() > 100 ? 0 : this.subtotal() > 0 ? 4.99 : 0));
  readonly total = computed(() => this.subtotal() + this.shipping());

  add(product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string): void {
    const existingIndex = this.itemsSignal().findIndex(i => i.product.id === product.id && i.selectedSize === selectedSize && i.selectedColor === selectedColor);
    if (existingIndex >= 0) {
      const updated = [...this.itemsSignal()];
      updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
      this.itemsSignal.set(updated);
      return;
    }
    this.itemsSignal.update(list => [...list, { product, quantity, selectedSize, selectedColor }]);
  }

  remove(productId: string, selectedSize?: string, selectedColor?: string): void {
    this.itemsSignal.update(list => list.filter(i => !(i.product.id === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor)));
  }

  updateQuantity(productId: string, quantity: number, selectedSize?: string, selectedColor?: string): void {
    if (quantity <= 0) {
      this.remove(productId, selectedSize, selectedColor);
      return;
    }
    const index = this.itemsSignal().findIndex(i => i.product.id === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor);
    if (index >= 0) {
      const updated = [...this.itemsSignal()];
      updated[index] = { ...updated[index], quantity };
      this.itemsSignal.set(updated);
    }
  }

  clear(): void {
    this.itemsSignal.set([]);
  }
}
