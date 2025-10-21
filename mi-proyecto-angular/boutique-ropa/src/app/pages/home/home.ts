import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  featuredProducts: Product[] = [];
  newProducts: Product[] = [];
  saleProducts: Product[] = [];
  loading = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadFeaturedProducts();
    this.loadNewProducts();
    this.loadSaleProducts();
  }

  loadFeaturedProducts() {
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
      }
    });
  }

  loadNewProducts() {
    this.productService.getNewProducts().subscribe({
      next: (products) => {
        this.newProducts = products.slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading new products:', error);
      }
    });
  }

  loadSaleProducts() {
    this.productService.getSaleProducts().subscribe({
      next: (products) => {
        this.saleProducts = products.slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading sale products:', error);
      }
    });
  }

  onProductAdded(product: Product) {
    console.log('Producto agregado al carrito:', product.name);
  }
}
