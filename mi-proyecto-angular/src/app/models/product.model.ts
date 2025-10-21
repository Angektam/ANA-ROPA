export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: Category;
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
}

export interface Category {
  id: number;
  name: string;
  slug: string;
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
