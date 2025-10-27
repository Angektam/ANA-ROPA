export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  size: string[];
  color: string[];
  material: string;
  isNew?: boolean;
  isOnSale?: boolean;
  isEcoFriendly?: boolean;
  isVegan?: boolean;
  isHandmade?: boolean;
  isExclusive?: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  tags?: string[];
  features?: string[];
  careInstructions?: string;
  shippingInfo?: string;
  returnPolicy?: string;
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
  occasion?: string[];
  style?: string[];
  material?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'rating' | 'newest';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  verified: boolean;
  helpful: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  joinDate: Date;
}
