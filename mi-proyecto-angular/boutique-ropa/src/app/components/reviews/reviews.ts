import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReviewService, CreateReviewRequest } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { ProductReview, Product, ReviewStats } from '../../models/product.model';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss'
})
export class ReviewsComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  
  reviews: ProductReview[] = [];
  reviewStats: ReviewStats | null = null;
  isLoading = false;
  isAuthenticated = false;
  showReviewForm = false;
  hasUserReviewed = false;
  userReview: ProductReview | null = null;
  
  newReview: CreateReviewRequest = {
    productId: 0,
    rating: 5,
    title: '',
    comment: ''
  };
  
  private subscriptions: Subscription[] = [];

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.product) {
      this.newReview.productId = this.product.id;
      this.loadReviews();
      this.loadReviewStats();
      this.checkUserReview();
    }

    // Subscribe to authentication changes
    this.subscriptions.push(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (isAuth && this.product) {
          this.checkUserReview();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadReviews() {
    this.isLoading = true;
    this.reviewService.getProductReviews(this.product.id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.isLoading = false;
      }
    });
  }

  private loadReviewStats() {
    this.reviewService.getProductReviewStats(this.product.id).subscribe({
      next: (stats) => {
        this.reviewStats = stats;
      },
      error: (error) => {
        console.error('Error loading review stats:', error);
      }
    });
  }

  private checkUserReview() {
    if (!this.isAuthenticated) return;

    this.reviewService.hasUserReviewedProduct(this.product.id).subscribe({
      next: (hasReviewed) => {
        this.hasUserReviewed = hasReviewed;
        if (hasReviewed) {
          this.loadUserReview();
        }
      },
      error: (error) => {
        console.error('Error checking user review:', error);
      }
    });
  }

  private loadUserReview() {
    this.reviewService.getUserReviewForProduct(this.product.id).subscribe({
      next: (review) => {
        this.userReview = review;
      },
      error: (error) => {
        console.error('Error loading user review:', error);
      }
    });
  }

  toggleReviewForm() {
    if (!this.isAuthenticated) {
      // Redirect to login
      return;
    }
    this.showReviewForm = !this.showReviewForm;
  }

  submitReview() {
    if (!this.isFormValid()) {
      return;
    }

    this.isLoading = true;
    this.reviewService.createReview(this.newReview).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.hasUserReviewed = true;
        this.userReview = review;
        this.showReviewForm = false;
        this.resetForm();
        this.loadReviewStats(); // Reload stats
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating review:', error);
        this.isLoading = false;
      }
    });
  }

  updateReview() {
    if (!this.userReview || !this.isFormValid()) {
      return;
    }

    this.isLoading = true;
    this.reviewService.updateReview(this.userReview.id, {
      rating: this.newReview.rating,
      title: this.newReview.title,
      comment: this.newReview.comment
    }).subscribe({
      next: (updatedReview) => {
        const index = this.reviews.findIndex(r => r.id === updatedReview.id);
        if (index !== -1) {
          this.reviews[index] = updatedReview;
        }
        this.userReview = updatedReview;
        this.showReviewForm = false;
        this.resetForm();
        this.loadReviewStats(); // Reload stats
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating review:', error);
        this.isLoading = false;
      }
    });
  }

  deleteReview() {
    if (!this.userReview || !confirm('¿Estás seguro de que quieres eliminar tu reseña?')) {
      return;
    }

    this.isLoading = true;
    this.reviewService.deleteReview(this.userReview.id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== this.userReview!.id);
        this.hasUserReviewed = false;
        this.userReview = null;
        this.showReviewForm = false;
        this.resetForm();
        this.loadReviewStats(); // Reload stats
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        this.isLoading = false;
      }
    });
  }

  reportReview(reviewId: number) {
    const reason = prompt('¿Por qué quieres reportar esta reseña?');
    if (reason) {
      this.reviewService.reportReview(reviewId, reason).subscribe({
        next: () => {
          alert('Reseña reportada. Gracias por tu feedback.');
        },
        error: (error) => {
          console.error('Error reporting review:', error);
        }
      });
    }
  }

  setRating(rating: number) {
    this.newReview.rating = rating;
  }

  getStars(rating: number): string[] {
    return this.reviewService.getStarRating(rating);
  }

  formatReviewDate(dateString: string): string {
    return this.reviewService.formatReviewDate(dateString);
  }

  isFormValid(): boolean {
    if (this.newReview.rating < 1 || this.newReview.rating > 5) {
      return false;
    }
    if (!this.newReview.title || this.newReview.title.trim().length < 3) {
      return false;
    }
    if (!this.newReview.comment || this.newReview.comment.trim().length < 10) {
      return false;
    }
    return true;
  }

  private resetForm() {
    this.newReview = {
      productId: this.product.id,
      rating: 5,
      title: '',
      comment: ''
    };
  }

  getRatingPercentage(rating: number): number {
    if (!this.reviewStats) return 0;
    const total = this.reviewStats.totalReviews;
    const count = this.reviewStats.ratingDistribution[rating as keyof typeof this.reviewStats.ratingDistribution];
    return total > 0 ? (count / total) * 100 : 0;
  }

  getAverageRating(): number {
    return this.reviewStats?.averageRating || 0;
  }

  getTotalReviews(): number {
    return this.reviewStats?.totalReviews || 0;
  }

  getRatingCount(rating: number): number {
    if (!this.reviewStats?.ratingDistribution) return 0;
    return this.reviewStats.ratingDistribution[rating as keyof typeof this.reviewStats.ratingDistribution] || 0;
  }
}
