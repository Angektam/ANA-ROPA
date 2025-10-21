import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart';
import { Product, WishlistItem } from '../../models/product.model';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss'
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: WishlistItem[] = [];
  isLoading = false;
  isAuthenticated = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private wishlistService: WishlistService,
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
          this.loadWishlist();
        } else {
          this.router.navigate(['/login']);
        }
      })
    );

    // Subscribe to wishlist changes
    this.subscriptions.push(
      this.wishlistService.wishlist$.subscribe(items => {
        this.wishlistItems = items;
      })
    );

    // Initialize
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.loadWishlist();
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadWishlist() {
    this.isLoading = true;
    this.wishlistService.getWishlist().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading wishlist:', error);
      }
    });
  }

  removeFromWishlist(productId: number) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        console.log('Item removed from wishlist');
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
      }
    });
  }

  addToCart(product: Product, size?: string, color?: string) {
    if (!size || !color) {
      // If no size/color selected, show a message or redirect to product page
      console.log('Please select size and color');
      return;
    }

    this.cartService.addToCart(product, 1, size, color);
    this.removeFromWishlist(product.id);
  }

  moveToCart(item: WishlistItem) {
    if (item.product) {
      // For now, we'll add with default size/color
      // In a real app, you'd want to show a modal to select size/color
      const defaultSize = item.product.size?.[0]?.name || 'M';
      const defaultColor = item.product.color?.[0] || 'Negro';
      
      this.addToCart(item.product, defaultSize, defaultColor);
    }
  }

  clearWishlist() {
    if (confirm('¿Estás seguro de que quieres vaciar tu lista de deseos?')) {
      this.wishlistService.clearWishlist().subscribe({
        next: () => {
          console.log('Wishlist cleared');
        },
        error: (error) => {
          console.error('Error clearing wishlist:', error);
        }
      });
    }
  }

  goToProduct(productId: number) {
    this.router.navigate(['/catalog'], { queryParams: { product: productId } });
  }

  goToCatalog() {
    this.router.navigate(['/catalog']);
  }

  getTotalItems(): number {
    return this.wishlistItems.length;
  }

  getTotalValue(): number {
    return this.wishlistItems.reduce((total, item) => {
      return total + (item.product?.price || 0);
    }, 0);
  }

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('fas fa-star');
      } else if (i - 0.5 <= rating) {
        stars.push('fas fa-star-half-alt');
      } else {
        stars.push('far fa-star');
      }
    }
    return stars;
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
  }

  getStockIcon(stock: number): string {
    if (stock === 0) return 'fa-times-circle';
    if (stock <= 5) return 'fa-exclamation-triangle';
    return 'fa-check-circle';
  }

  getStockText(stock: number): string {
    if (stock === 0) return 'Agotado';
    if (stock <= 5) return `Solo quedan ${stock} unidades`;
    return 'Disponible';
  }
}
