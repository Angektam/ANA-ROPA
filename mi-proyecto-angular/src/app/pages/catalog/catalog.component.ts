import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {
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
}
