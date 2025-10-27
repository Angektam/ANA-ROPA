import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {
  searchQuery = '';
  products = [
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
    console.log('Agregar al carrito:', product);
    alert(`¡${product.name} agregado al carrito!`);
  }

  onAddToWishlist(product: any) {
    console.log('Agregar a lista de deseos:', product);
    alert(`¡${product.name} agregado a tu lista de deseos!`);
  }
}
