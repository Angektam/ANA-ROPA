import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {
  searchQuery = '';
  Math = Math; // Hacer Math disponible en el template

  constructor(private cartService: CartService) {}
  products = [
    {
      id: 1,
      name: 'Vestido Elegante de Noche',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
      category: 'Vestidos',
      rating: 4.8,
      isOnSale: true,
      description: 'Vestido elegante perfecto para ocasiones especiales. Corte clásico que realza la silueta femenina.',
      material: 'Seda y encaje',
      inStock: true,
      stock: 15
    },
    {
      id: 2,
      name: 'Blusa de Seda Premium',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      category: 'Blusas',
      rating: 4.6,
      isNew: true,
      description: 'Blusa de seda de alta calidad para el día a día. Diseño versátil y cómodo.',
      material: '100% Seda',
      inStock: true,
      stock: 8
    },
    {
      id: 3,
      name: 'Falda A-Line Clásica',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      category: 'Faldas',
      rating: 4.7,
      description: 'Falda clásica A-Line que nunca pasa de moda. Perfecta para el trabajo y eventos casuales.',
      material: 'Poliéster premium',
      inStock: true,
      stock: 12
    },
    {
      id: 4,
      name: 'Chaqueta Blazer Elegante',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      category: 'Chaquetas',
      rating: 4.9,
      isNew: true,
      description: 'Blazer elegante para ocasiones formales. Corte perfecto que realza la figura.',
      material: 'Lana y poliéster',
      inStock: true,
      stock: 6
    },
    {
      id: 5,
      name: 'Bolso de Mano de Lujo',
      price: 179.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      category: 'Accesorios',
      rating: 4.5,
      description: 'Bolso de mano elegante para complementar tu look. Diseño atemporal y funcional.',
      material: 'Cuero genuino',
      inStock: true,
      stock: 20
    },
    {
      id: 6,
      name: 'Vestido de Fiesta Brillante',
      price: 399.99,
      originalPrice: 499.99,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600',
      category: 'Vestidos',
      rating: 4.9,
      isOnSale: true,
      description: 'Vestido deslumbrante para fiestas y eventos especiales. Diseño único que te hará brillar.',
      material: 'Seda con detalles brillantes',
      inStock: true,
      stock: 4
    },
    {
      id: 7,
      name: 'Top de Encaje Romántico',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      category: 'Blusas',
      rating: 4.4,
      isNew: true,
      description: 'Top de encaje delicado con un toque romántico. Perfecto para citas y ocasiones especiales.',
      material: 'Encaje y seda',
      inStock: true,
      stock: 10
    },
    {
      id: 8,
      name: 'Falda Lápiz Profesional',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      category: 'Faldas',
      rating: 4.6,
      description: 'Falda lápiz elegante para el entorno profesional. Corte que realza la silueta.',
      material: 'Poliéster con elastano',
      inStock: true,
      stock: 14
    },
    {
      id: 9,
      name: 'Abrigo de Lana Elegante',
      price: 349.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      category: 'Chaquetas',
      rating: 4.8,
      description: 'Abrigo de lana elegante para las estaciones frías. Diseño atemporal y cálido.',
      material: '100% Lana',
      inStock: true,
      stock: 7
    },
    {
      id: 10,
      name: 'Zapatos de Tacón Clásicos',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      category: 'Zapatos',
      rating: 4.7,
      description: 'Zapatos de tacón clásicos que nunca pasan de moda. Cómodos y elegantes.',
      material: 'Cuero genuino',
      inStock: true,
      stock: 18
    },
    {
      id: 11,
      name: 'Collar de Perlas Elegante',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      category: 'Accesorios',
      rating: 4.5,
      description: 'Collar de perlas clásico que complementa cualquier outfit elegante.',
      material: 'Perlas cultivadas',
      inStock: true,
      stock: 25
    },
    {
      id: 12,
      name: 'Vestido de Día Casual',
      price: 119.99,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
      category: 'Vestidos',
      rating: 4.3,
      description: 'Vestido casual perfecto para el día a día. Cómodo y con estilo.',
      material: 'Algodón y elastano',
      inStock: true,
      stock: 22
    }
  ];

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Buscando en catálogo:', this.searchQuery);
      // Aquí implementarías la lógica de búsqueda en el catálogo
    }
  }

  onProductClick(product: any) {
    console.log('Ver producto:', product);
    // Aquí implementarías la navegación al detalle del producto
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
    alert(`¡${product.name} agregado al carrito!`);
  }

  onAddToWishlist(product: any) {
    this.cartService.toggleWishlist(product.id);
    const isInWishlist = this.cartService.isInWishlist(product.id);
    if (isInWishlist) {
      alert(`¡${product.name} agregado a tu lista de deseos!`);
    } else {
      alert(`¡${product.name} removido de tu lista de deseos!`);
    }
  }
}
