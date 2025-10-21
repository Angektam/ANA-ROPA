import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ProductReview, Product } from '../models/product.model';
import { AuthService } from './auth.service';

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly API_URL = 'http://localhost:3000';
  private reviewsSubject = new BehaviorSubject<ProductReview[]>([]);
  
  public reviews$ = this.reviewsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get reviews for a specific product
  getProductReviews(productId: number): Observable<ProductReview[]> {
    return this.http.get<ProductReview[]>(`${this.API_URL}/products/${productId}/reviews`)
      .pipe(
        tap(reviews => {
          this.reviewsSubject.next(reviews);
        }),
        catchError(error => {
          console.error('Error fetching product reviews:', error);
          return throwError(() => error);
        })
      );
  }

  // Get review statistics for a product
  getProductReviewStats(productId: number): Observable<ReviewStats> {
    return this.http.get<ReviewStats>(`${this.API_URL}/products/${productId}/reviews/stats`)
      .pipe(
        catchError(error => {
          console.error('Error fetching review stats:', error);
          return throwError(() => error);
        })
      );
  }

  // Create a new review
  createReview(reviewData: CreateReviewRequest): Observable<ProductReview> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.post<ProductReview>(`${this.API_URL}/reviews`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(newReview => {
        const currentReviews = this.reviewsSubject.value;
        this.reviewsSubject.next([...currentReviews, newReview]);
      }),
      catchError(error => {
        console.error('Error creating review:', error);
        return throwError(() => error);
      })
    );
  }

  // Update an existing review
  updateReview(reviewId: number, reviewData: UpdateReviewRequest): Observable<ProductReview> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.put<ProductReview>(`${this.API_URL}/reviews/${reviewId}`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(updatedReview => {
        const currentReviews = this.reviewsSubject.value;
        const updatedReviews = currentReviews.map(review => 
          review.id === reviewId ? updatedReview : review
        );
        this.reviewsSubject.next(updatedReviews);
      }),
      catchError(error => {
        console.error('Error updating review:', error);
        return throwError(() => error);
      })
    );
  }

  // Delete a review
  deleteReview(reviewId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.delete(`${this.API_URL}/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(() => {
        const currentReviews = this.reviewsSubject.value;
        const updatedReviews = currentReviews.filter(review => review.id !== reviewId);
        this.reviewsSubject.next(updatedReviews);
      }),
      catchError(error => {
        console.error('Error deleting review:', error);
        return throwError(() => error);
      })
    );
  }

  // Get user's reviews
  getUserReviews(): Observable<ProductReview[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<ProductReview[]>(`${this.API_URL}/reviews/user`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error fetching user reviews:', error);
        return throwError(() => error);
      })
    );
  }

  // Check if user has reviewed a product
  hasUserReviewedProduct(productId: number): Observable<boolean> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<boolean>(`${this.API_URL}/reviews/user/${productId}/has-reviewed`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error checking if user reviewed product:', error);
        return throwError(() => error);
      })
    );
  }

  // Get user's review for a specific product
  getUserReviewForProduct(productId: number): Observable<ProductReview | null> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<ProductReview | null>(`${this.API_URL}/reviews/user/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error fetching user review for product:', error);
        return throwError(() => error);
      })
    );
  }

  // Report a review as inappropriate
  reportReview(reviewId: number, reason: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.post(`${this.API_URL}/reviews/${reviewId}/report`, {
      reason
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error reporting review:', error);
        return throwError(() => error);
      })
    );
  }

  // Like/Unlike a review
  toggleReviewLike(reviewId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.post(`${this.API_URL}/reviews/${reviewId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error toggling review like:', error);
        return throwError(() => error);
      })
    );
  }

  // Get recent reviews (for admin dashboard)
  getRecentReviews(limit: number = 10): Observable<ProductReview[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<ProductReview[]>(`${this.API_URL}/reviews/recent?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Error fetching recent reviews:', error);
        return throwError(() => error);
      })
    );
  }

  // Helper methods
  getStarRating(rating: number): string[] {
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

  formatReviewDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hace 1 día';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`;
    } else {
      const years = Math.floor(diffDays / 365);
      return years === 1 ? 'Hace 1 año' : `Hace ${years} años`;
    }
  }
}
