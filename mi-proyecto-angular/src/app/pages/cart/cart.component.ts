import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  totalPrice$: Observable<number>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.getCartItems();
    this.totalPrice$ = new Observable(observer => {
      this.cartItems$.subscribe(items => {
        observer.next(this.cartService.getTotalPrice());
      });
    });
  }

  ngOnInit(): void {
    // Los observables se suscriben automáticamente en el template
  }

  updateQuantity(item: CartItem, quantity: number): void {
    this.cartService.updateQuantity(item.id, quantity, item.size, item.color);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id, item.size, item.color);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
