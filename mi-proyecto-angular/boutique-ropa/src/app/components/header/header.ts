import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { User } from '../../models/product.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {
  cartItemsCount = 0;
  wishlistCount = 0;
  isAuthenticated = false;
  currentUser: User | null = null;
  showUserMenu = false;
  showCategoriesMenu = false;
  showMobileMenu = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to cart changes
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItemsCount = this.cartService.getCartItemsCount();
      })
    );

    // Subscribe to authentication changes
    this.subscriptions.push(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          this.currentUser = this.authService.getCurrentUser();
          this.wishlistService.syncWishlist();
        } else {
          this.currentUser = null;
          this.wishlistService.clearLocalWishlist();
        }
      })
    );

    // Subscribe to wishlist changes
    this.subscriptions.push(
      this.wishlistService.wishlist$.subscribe(items => {
        this.wishlistCount = this.wishlistService.getWishlistCount();
      })
    );

    // Initialize current state
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.currentUser = this.authService.getCurrentUser();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showCategoriesMenu = false; // Cerrar categorías si está abierto
  }

  toggleCategoriesMenu() {
    this.showCategoriesMenu = !this.showCategoriesMenu;
    this.showUserMenu = false; // Cerrar user menu si está abierto
  }

  closeCategoriesMenu() {
    this.showCategoriesMenu = false;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/']);
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  closeAllMenus() {
    this.showUserMenu = false;
    this.showCategoriesMenu = false;
  }

  // Close menu when clicking outside
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.showUserMenu = false;
    }
    if (!target.closest('.dropdown')) {
      this.showCategoriesMenu = false;
    }
  }
}
