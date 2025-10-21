import { Product, Category } from '../models/product.model';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Vestidos', slug: 'vestidos' },
  { id: 2, name: 'Blusas', slug: 'blusas' },
  { id: 3, name: 'Pantalones', slug: 'pantalones' },
  { id: 4, name: 'Faldas', slug: 'faldas' },
  { id: 5, name: 'Chaquetas', slug: 'chaquetas' },
  { id: 6, name: 'Accesorios', slug: 'accesorios' }
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Vestido Elegante Negro',
    description: 'Vestido de noche elegante en color negro, perfecto para ocasiones especiales. Corte clásico que realza la silueta femenina.',
    price: 89.99,
    originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
    ],
    category: CATEGORIES[0],
    size: [
      { name: 'XS', available: true },
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: false },
      { name: 'XL', available: true }
    ],
    color: ['Negro', 'Azul Marino'],
    brand: 'Elegance',
    material: 'Poliester',
    isNew: false,
    isOnSale: true,
    stock: 15,
    rating: 4.5,
    reviews: 23,
    tags: ['elegante', 'noche', 'negro', 'formal']
  },
  {
    id: 2,
    name: 'Blusa Floral Primaveral',
    description: 'Blusa ligera con estampado floral, ideal para el día. Tejido suave y cómodo que se adapta a cualquier ocasión.',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
    ],
    category: CATEGORIES[1],
    size: [
      { name: 'XS', available: true },
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: false }
    ],
    color: ['Rosa', 'Azul', 'Verde'],
    brand: 'Spring Collection',
    material: 'Algodón',
    isNew: true,
    isOnSale: false,
    stock: 8,
    rating: 4.2,
    reviews: 12,
    tags: ['floral', 'primavera', 'casual', 'cómodo']
  },
  {
    id: 3,
    name: 'Pantalón Vaquero Clásico',
    description: 'Pantalón vaquero de corte clásico, perfecto para el día a día. Denim de alta calidad con acabados vintage.',
    price: 65.99,
    originalPrice: 80.00,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
    ],
    category: CATEGORIES[2],
    size: [
      { name: '24', available: true },
      { name: '26', available: true },
      { name: '28', available: true },
      { name: '30', available: false },
      { name: '32', available: true }
    ],
    color: ['Azul Claro', 'Azul Oscuro'],
    brand: 'Denim Co.',
    material: 'Denim',
    isNew: false,
    isOnSale: true,
    stock: 20,
    rating: 4.7,
    reviews: 45,
    tags: ['vaquero', 'clásico', 'casual', 'denim']
  },
  {
    id: 4,
    name: 'Falda Plisada Elegante',
    description: 'Falda plisada de longitud media, perfecta para la oficina o eventos semi-formales. Corte que favorece todas las siluetas.',
    price: 55.99,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
    ],
    category: CATEGORIES[3],
    size: [
      { name: 'XS', available: true },
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true }
    ],
    color: ['Negro', 'Gris', 'Azul Marino'],
    brand: 'Office Style',
    material: 'Poliester',
    isNew: true,
    isOnSale: false,
    stock: 12,
    rating: 4.3,
    reviews: 18,
    tags: ['plisada', 'oficina', 'elegante', 'versátil']
  },
  {
    id: 5,
    name: 'Chaqueta de Cuero Sintético',
    description: 'Chaqueta de cuero sintético con estilo rockero. Perfecta para darle un toque rebelde a cualquier outfit.',
    price: 95.99,
    originalPrice: 130.00,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
    ],
    category: CATEGORIES[4],
    size: [
      { name: 'XS', available: false },
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true }
    ],
    color: ['Negro', 'Marrón'],
    brand: 'Rock Style',
    material: 'Cuero Sintético',
    isNew: false,
    isOnSale: true,
    stock: 6,
    rating: 4.8,
    reviews: 31,
    tags: ['cuero', 'rockero', 'rebelde', 'invierno']
  },
  {
    id: 6,
    name: 'Bolso Elegante de Cuero',
    description: 'Bolso de mano elegante en cuero genuino. Diseño atemporal que complementa cualquier look.',
    price: 75.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
    ],
    category: CATEGORIES[5],
    size: [
      { name: 'Único', available: true }
    ],
    color: ['Negro', 'Marrón', 'Beige'],
    brand: 'Luxury Bags',
    material: 'Cuero Genuino',
    isNew: true,
    isOnSale: false,
    stock: 10,
    rating: 4.6,
    reviews: 27,
    tags: ['bolso', 'cuero', 'elegante', 'accesorio']
  }
];
