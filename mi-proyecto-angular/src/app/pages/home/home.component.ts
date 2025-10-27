import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  newsletterEmail = '';
  Math = Math; // Hacer Math disponible en el template

  constructor(private cartService: CartService) {}
  featuredProducts = [
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
    }
  ];

  categories = [
    { name: 'Vestidos', icon: 'fas fa-female', count: 120 },
    { name: 'Blusas', icon: 'fas fa-tshirt', count: 85 },
    { name: 'Faldas', icon: 'fas fa-female', count: 65 },
    { name: 'Chaquetas', icon: 'fas fa-vest', count: 45 },
    { name: 'Accesorios', icon: 'fas fa-gem', count: 200 },
    { name: 'Zapatos', icon: 'fas fa-shoe-prints', count: 90 }
  ];

  testimonials = [
    {
      name: 'María González',
      text: 'La calidad de las prendas es excepcional. Me siento elegante y segura con cada compra.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
    },
    {
      name: 'Ana Rodríguez',
      text: 'El servicio al cliente es increíble. Siempre me ayudan a encontrar el look perfecto.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    },
    {
      name: 'Carmen López',
      text: 'Los diseños son únicos y la atención al detalle es impresionante. ¡Recomendado!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
    }
  ];

  onNewsletterSubmit() {
    if (this.newsletterEmail.trim()) {
      console.log('Suscripción al newsletter:', this.newsletterEmail);
      alert('¡Gracias por suscribirte! Te mantendremos informada sobre las últimas tendencias.');
      this.newsletterEmail = '';
    } else {
      alert('Por favor, ingresa un email válido.');
    }
  }

  onCategoryClick(category: string) {
    console.log('Navegando a categoría:', category);
    // Aquí implementarías la navegación a la categoría específica
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
