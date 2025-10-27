import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private wishlistItems = new BehaviorSubject<number[]>([]);

  constructor() {
    // Cargar datos del localStorage al inicializar
    this.loadFromStorage();
  }

  // Carrito
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getCartCount(): Observable<number> {
    return new BehaviorSubject(
      this.cartItems.value.reduce((total, item) => total + item.quantity, 0)
    ).asObservable();
  }

  addToCart(product: any, size?: string, color?: string): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => 
      item.id === product.id && item.size === size && item.color === color
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size,
        color
      };
      currentItems.push(newItem);
    }

    this.cartItems.next([...currentItems]);
    this.saveToStorage();
  }

  removeFromCart(itemId: number, size?: string, color?: string): void {
    const currentItems = this.cartItems.value;
    const filteredItems = currentItems.filter(item => 
      !(item.id === itemId && item.size === size && item.color === color)
    );
    this.cartItems.next(filteredItems);
    this.saveToStorage();
  }

  updateQuantity(itemId: number, quantity: number, size?: string, color?: string): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => 
      item.id === itemId && item.size === size && item.color === color
    );

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId, size, color);
      } else {
        item.quantity = quantity;
        this.cartItems.next([...currentItems]);
        this.saveToStorage();
      }
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveToStorage();
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Wishlist
  getWishlistItems(): Observable<number[]> {
    return this.wishlistItems.asObservable();
  }

  getWishlistCount(): Observable<number> {
    return new BehaviorSubject(this.wishlistItems.value.length).asObservable();
  }

  addToWishlist(productId: number): void {
    const currentItems = this.wishlistItems.value;
    if (!currentItems.includes(productId)) {
      this.wishlistItems.next([...currentItems, productId]);
      this.saveToStorage();
    }
  }

  removeFromWishlist(productId: number): void {
    const currentItems = this.wishlistItems.value;
    const filteredItems = currentItems.filter(id => id !== productId);
    this.wishlistItems.next(filteredItems);
    this.saveToStorage();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.value.includes(productId);
  }

  toggleWishlist(productId: number): void {
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(productId);
    }
  }

  // Local Storage
  private saveToStorage(): void {
    localStorage.setItem('boutique-ana-cart', JSON.stringify(this.cartItems.value));
    localStorage.setItem('boutique-ana-wishlist', JSON.stringify(this.wishlistItems.value));
  }

  private loadFromStorage(): void {
    const cartData = localStorage.getItem('boutique-ana-cart');
    const wishlistData = localStorage.getItem('boutique-ana-wishlist');

    if (cartData) {
      this.cartItems.next(JSON.parse(cartData));
    }

    if (wishlistData) {
      this.wishlistItems.next(JSON.parse(wishlistData));
    }
  }
}
