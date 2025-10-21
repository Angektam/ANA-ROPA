import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    // Cargar carrito desde localStorage si existe
    const savedCart = localStorage.getItem('boutique-cart');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
  }

  addToCart(product: Product, quantity: number = 1, selectedSize: string = '', selectedColor: string = ''): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(
      item => item.product.id === product.id && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor
    );

    if (existingItemIndex > -1) {
      // Si el producto ya existe, incrementar la cantidad
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      // Si es un nuevo producto, agregarlo al carrito
      const newItem: CartItem = {
        product,
        quantity,
        selectedSize,
        selectedColor
      };
      currentItems.push(newItem);
    }

    this.updateCart(currentItems);
  }

  removeFromCart(itemId: number, selectedSize: string = '', selectedColor: string = ''): void {
    const currentItems = this.cartItemsSubject.value;
    const filteredItems = currentItems.filter(
      item => !(item.product.id === itemId && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor)
    );
    this.updateCart(filteredItems);
  }

  updateQuantity(itemId: number, quantity: number, selectedSize: string = '', selectedColor: string = ''): void {
    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(
      item => item.product.id === itemId && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeFromCart(itemId, selectedSize, selectedColor);
      } else {
        currentItems[itemIndex].quantity = quantity;
        this.updateCart(currentItems);
      }
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getCartItemsCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    // Guardar en localStorage
    localStorage.setItem('boutique-cart', JSON.stringify(items));
  }

  isInCart(productId: number, selectedSize: string = '', selectedColor: string = ''): boolean {
    return this.cartItemsSubject.value.some(
      item => item.product.id === productId && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor
    );
  }
}
