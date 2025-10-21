// Mock services para desarrollo
export class MockAuthService {
  login(credentials: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { id: 1, name: 'Usuario Demo', email: credentials.email, role: 'customer' },
          token: 'mock-token-123'
        });
      }, 1000);
    });
  }

  register(userData: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { id: 2, name: userData.name, email: userData.email, role: 'customer' },
          token: 'mock-token-456'
        });
      }, 1000);
    });
  }

  logout() {
    console.log('Logout mock');
  }

  isAuthenticated() {
    return false;
  }

  getCurrentUser() {
    return null;
  }
}

export class MockWishlistService {
  getWishlist() {
    return Promise.resolve([]);
  }

  addToWishlist(productId: number) {
    return Promise.resolve({ id: 1, userId: 1, productId });
  }

  removeFromWishlist(productId: number) {
    return Promise.resolve();
  }

  isInWishlist(productId: number) {
    return false;
  }

  getWishlistCount() {
    return 0;
  }

  wishlist$ = { subscribe: () => ({ unsubscribe: () => {} }) };
}

export class MockReviewService {
  getProductReviews(productId: number) {
    return Promise.resolve([]);
  }

  getProductReviewStats(productId: number) {
    return Promise.resolve({
      averageRating: 4.5,
      totalReviews: 10,
      ratingDistribution: { 5: 5, 4: 3, 3: 2, 2: 0, 1: 0 }
    });
  }

  createReview(reviewData: any) {
    return Promise.resolve({
      id: 1,
      ...reviewData,
      user: { name: 'Usuario Demo' },
      createdAt: new Date().toISOString()
    });
  }

  getStarRating(rating: number) {
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

  formatReviewDate(dateString: string) {
    return 'Hace 2 días';
  }
}

export class MockCheckoutService {
  getShippingOptions() {
    return Promise.resolve([
      { id: 'standard', name: 'Envío Estándar', description: 'Entrega en 5-7 días', cost: 50, estimatedDays: '5-7 días', isDefault: true },
      { id: 'express', name: 'Envío Express', description: 'Entrega en 2-3 días', cost: 100, estimatedDays: '2-3 días' },
      { id: 'free', name: 'Envío Gratis', description: 'Envío gratis en compras mayores a $500', cost: 0, estimatedDays: '7-10 días' }
    ]);
  }

  getUserShippingAddresses() {
    return Promise.resolve([
      { id: 1, userId: 1, street: 'Calle Principal 123', city: 'Ciudad', state: 'Estado', zipCode: '12345', country: 'México', isDefault: true, createdAt: new Date().toISOString() }
    ]);
  }

  validateCoupon(code: string, orderTotal: number) {
    if (code === 'DESCUENTO10') {
      return Promise.resolve({
        id: 1,
        code: 'DESCUENTO10',
        description: '10% de descuento',
        type: 'percentage',
        value: 10,
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usedCount: 0,
        usageLimit: 100
      });
    }
    return Promise.reject(new Error('Código de cupón inválido'));
  }

  calculateCheckoutSummary(cartItems: any[], shippingCost: number = 0, coupon?: any) {
    const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.16;
    const discount = coupon ? (coupon.type === 'percentage' ? subtotal * (coupon.value / 100) : coupon.value) : 0;
    const total = subtotal + shippingCost + tax - discount;

    return {
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      coupon
    };
  }

  createOrder(checkoutData: any, cartItems: any[]) {
    return Promise.resolve({
      id: 1,
      orderNumber: 'BA-20241020-000001',
      status: 'pending',
      subtotal: checkoutData.subtotal || 0,
      shippingCost: checkoutData.shippingCost || 0,
      tax: checkoutData.tax || 0,
      total: checkoutData.total || 0,
      paymentMethod: checkoutData.paymentMethod,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    });
  }

  processPayment(paymentData: any) {
    return Promise.resolve({ success: true, transactionId: 'txn-123456' });
  }

  checkoutSummary$ = { subscribe: () => ({ unsubscribe: () => {} }) };
  setCheckoutSummary(summary: any) {
    console.log('Checkout summary set:', summary);
  }
}

