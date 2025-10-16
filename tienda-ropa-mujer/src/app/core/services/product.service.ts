import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly productsSignal = signal<Product[]>([
    {
      id: 'vst-001',
      name: 'Vestido Floral Primavera',
      description: 'Vestido ligero con estampado floral, ideal para primavera/verano.',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1520975922284-6c4b9a6f5d79?q=80&w=1200&auto=format&fit=crop',
      category: 'Vestidos',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Rosa', 'Blanco', 'Azul'],
      inStock: true,
    },
    {
      id: 'bls-002',
      name: 'Blusa Satinada Clásica',
      description: 'Blusa satinada con corte recto, elegante y cómoda.',
      price: 39.9,
      imageUrl: 'https://images.unsplash.com/photo-1520974735194-876676663e96?q=80&w=1200&auto=format&fit=crop',
      category: 'Blusas',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Negro', 'Champagne'],
      inStock: true,
    },
    {
      id: 'pnt-003',
      name: 'Pantalón Palazzo',
      description: 'Pantalón palazzo de tiro alto y caída fluida.',
      price: 49.5,
      imageUrl: 'https://images.unsplash.com/photo-1520975922284-6c4b9a6f5d79?q=80&w=1200&auto=format&fit=crop',
      category: 'Pantalones',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Beige', 'Negro'],
      inStock: true,
    },
  ]);

  readonly products = this.productsSignal.asReadonly();

  getById(productId: string): Product | undefined {
    return this.productsSignal().find(p => p.id === productId);
  }

  getCategories(): string[] {
    const categories = new Set(this.productsSignal().map(p => p.category));
    return Array.from(categories).sort();
  }
}
