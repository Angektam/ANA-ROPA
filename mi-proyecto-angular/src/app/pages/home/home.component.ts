import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  newsletterEmail = '';
  featuredProducts = [
    {
      id: 1,
      name: 'Vestido Elegante de Noche',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      category: 'Vestidos',
      rating: 4.8,
      isOnSale: true
    },
    {
      id: 2,
      name: 'Blusa de Seda Premium',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
      category: 'Blusas',
      rating: 4.6,
      isNew: true
    },
    {
      id: 3,
      name: 'Falda A-Line Clásica',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
      category: 'Faldas',
      rating: 4.7
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
}
