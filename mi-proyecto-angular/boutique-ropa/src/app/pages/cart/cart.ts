import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;
  itemsCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getCartTotal();
      this.itemsCount = this.cartService.getCartItemsCount();
    });
  }

  updateQuantity(item: CartItem, quantity: number) {
    this.cartService.updateQuantity(
      item.product.id, 
      quantity, 
      item.selectedSize, 
      item.selectedColor
    );
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(
      item.product.id, 
      item.selectedSize, 
      item.selectedColor
    );
  }

  clearCart() {
    this.cartService.clearCart();
  }

  proceedToCheckout() {
    // Aquí implementarías la lógica de checkout
    console.log('Proceder al checkout');
  }
}
