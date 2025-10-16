export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Vestidos' | 'Blusas' | 'Pantalones' | 'Faldas' | 'Abrigos' | 'Accesorios';
  sizes: string[];
  colors: string[];
  inStock: boolean;
}
