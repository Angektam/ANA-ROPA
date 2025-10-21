export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  categoryId: number;
  category?: Category; // Para cuando se haga join con categorías
  size: Size[];
  color: string[];
  brand: string;
  material: string;
  isNew?: boolean;
  isOnSale?: boolean;
  stock: number;
  rating: number;
  reviews: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Size {
  name: string;
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface FilterOptions {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  size?: string[];
  color?: string[];
  brand?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'rating' | 'newest';
}

// Interfaces completas para el sistema
export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingAddress {
  id: number;
  userId: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddressId?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  shippingAddress?: ShippingAddress;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedSize?: string;
  selectedColor?: string;
  createdAt?: string;
  product?: Product;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  product?: Product;
}

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  createdAt?: string;
  product?: Product;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
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

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
