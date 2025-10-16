import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number; // >= 1
  selectedSize?: string;
  selectedColor?: string;
}
