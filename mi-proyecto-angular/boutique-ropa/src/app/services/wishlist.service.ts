import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { WishlistItem, Product } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly API_URL = 'http://localhost:3000';
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadWishlistFromStorage();
  }

  // Get wishlist items
  getWishlist(): Observable<WishlistItem[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<WishlistItem[]>(`${this.API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(items => {
        this.wishlistSubject.next(items);
        this.saveWishlistToStorage(items);
      }),
      catchError(error => {
        console.error('Error fetching wishlist:', error);
        return throwError(() => error);
      })
    );
  }

  // Add item to wishlist
  addToWishlist(productId: number): Observable<WishlistItem> {
    const token = this.authService.getToken();
    
    // Si no hay autenticación, usar localStorage
    if (!token) {
      return new Observable(observer => {
        const currentWishlist = this.wishlistSubject.value;
        const newItem: WishlistItem = {
          id: Date.now(), // ID temporal
          userId: 0, // Sin usuario
          productId: productId,
          createdAt: new Date().toISOString()
        };
        
        const updatedWishlist = [...currentWishlist, newItem];
        this.wishlistSubject.next(updatedWishlist);
        this.saveWishlistToStorage(updatedWishlist);
        
        observer.next(newItem);
        observer.complete();
      });
    }

    // Si hay autenticación, usar API
    return this.http.post<WishlistItem>(`${this.API_URL}/wishlist`, {
      productId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(newItem => {
        const currentWishlist = this.wishlistSubject.value;
        this.wishlistSubject.next([...currentWishlist, newItem]);
        this.saveWishlistToStorage([...currentWishlist, newItem]);
      }),
      catchError(error => {
        console.error('Error adding to wishlist:', error);
        return throwError(() => error);
      })
    );
  }

  // Remove item from wishlist
  removeFromWishlist(productId: number): Observable<any> {
    const token = this.authService.getToken();
    
    // Si no hay autenticación, usar localStorage
    if (!token) {
      return new Observable(observer => {
        const currentWishlist = this.wishlistSubject.value;
        const updatedWishlist = currentWishlist.filter(item => item.productId !== productId);
        
        this.wishlistSubject.next(updatedWishlist);
        this.saveWishlistToStorage(updatedWishlist);
        
        observer.next({ success: true });
        observer.complete();
      });
    }

    return this.http.delete(`${this.API_URL}/wishlist/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(() => {
        const currentWishlist = this.wishlistSubject.value;
        const updatedWishlist = currentWishlist.filter(item => item.productId !== productId);
        this.wishlistSubject.next(updatedWishlist);
        this.saveWishlistToStorage(updatedWishlist);
      }),
      catchError(error => {
        console.error('Error removing from wishlist:', error);
        return throwError(() => error);
      })
    );
  }

  // Check if product is in wishlist
  isInWishlist(productId: number): boolean {
    const wishlist = this.wishlistSubject.value;
    return wishlist.some(item => item.productId === productId);
  }

  // Get wishlist count
  getWishlistCount(): number {
    return this.wishlistSubject.value.length;
  }

  // Clear wishlist
  clearWishlist(): Observable<any> {
    const token = this.authService.getToken();
    
    // Si no hay autenticación, limpiar localStorage
    if (!token) {
      return new Observable(observer => {
        this.wishlistSubject.next([]);
        this.saveWishlistToStorage([]);
        
        observer.next({ success: true });
        observer.complete();
      });
    }

    return this.http.delete(`${this.API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(() => {
        this.wishlistSubject.next([]);
        this.saveWishlistToStorage([]);
      }),
      catchError(error => {
        console.error('Error clearing wishlist:', error);
        return throwError(() => error);
      })
    );
  }

  // Toggle wishlist item (add if not present, remove if present)
  toggleWishlistItem(productId: number): Observable<any> {
    if (this.isInWishlist(productId)) {
      return this.removeFromWishlist(productId);
    } else {
      return this.addToWishlist(productId);
    }
  }

  // Get wishlist products (with full product details)
  getWishlistProducts(): Observable<Product[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<Product[]>(`${this.API_URL}/wishlist/products`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error fetching wishlist products:', error);
        return throwError(() => error);
      })
    );
  }

  // Private methods
  private loadWishlistFromStorage(): void {
    const wishlistStr = localStorage.getItem('wishlist');
    if (wishlistStr) {
      try {
        const wishlist = JSON.parse(wishlistStr);
        this.wishlistSubject.next(wishlist);
      } catch (error) {
        console.error('Error parsing wishlist from storage:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }

  private saveWishlistToStorage(wishlist: WishlistItem[]): void {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  // Sync wishlist with server when user logs in
  syncWishlist(): void {
    if (this.authService.isAuthenticated()) {
      this.getWishlist().subscribe({
        next: () => {
          console.log('Wishlist synced with server');
        },
        error: (error) => {
          console.error('Error syncing wishlist:', error);
        }
      });
    }
  }

  // Clear local wishlist when user logs out
  clearLocalWishlist(): void {
    this.wishlistSubject.next([]);
    localStorage.removeItem('wishlist');
  }
}
