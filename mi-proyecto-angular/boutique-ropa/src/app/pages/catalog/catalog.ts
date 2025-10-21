import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, Category, FilterOptions } from '../../models/product.model';
import { ProductService } from '../../services/product';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductFilter } from '../../components/product-filter/product-filter';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, FormsModule, ProductCard, ProductFilter],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss'
})
export class Catalog implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  loading = false;
  searchQuery = '';
  currentFilters: FilterOptions = {};
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;

  // Exponer Math para usar en el template
  Math = Math;

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.applyFilters();
  }

  onFiltersChange(filters: FilterOptions) {
    this.currentFilters = filters;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let products = [...this.products];

    // Aplicar búsqueda
    if (this.searchQuery && this.searchQuery.trim()) {
      const searchTerm = this.searchQuery.toLowerCase().trim();
      
      products = products.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const descriptionMatch = product.description.toLowerCase().includes(searchTerm);
        const tagsMatch = product.tags && product.tags.some((tag: any) => 
          tag.toLowerCase().includes(searchTerm)
        );
        const brandMatch = product.brand && product.brand.toLowerCase().includes(searchTerm);
        const categoryMatch = product.category?.name.toLowerCase().includes(searchTerm);
        
        return nameMatch || descriptionMatch || tagsMatch || brandMatch || categoryMatch;
      });
    }

    // Aplicar filtros
    if (this.currentFilters.category) {
      products = products.filter(p => 
        p.category?.slug === this.currentFilters.category
      );
    }

    if (this.currentFilters.priceRange) {
      products = products.filter(p => 
        p.price >= this.currentFilters.priceRange!.min && 
        p.price <= this.currentFilters.priceRange!.max
      );
    }

    if (this.currentFilters.size && this.currentFilters.size.length > 0) {
      products = products.filter(p =>
        p.size.some((s: any) => this.currentFilters.size!.includes(s.name) && s.available)
      );
    }

    if (this.currentFilters.color && this.currentFilters.color.length > 0) {
      products = products.filter(p =>
        p.color.some((c: any) => this.currentFilters.color!.includes(c))
      );
    }

    if (this.currentFilters.brand && this.currentFilters.brand.length > 0) {
      products = products.filter(p =>
        this.currentFilters.brand!.includes(p.brand)
      );
    }

    // Aplicar ordenamiento
    if (this.currentFilters.sortBy) {
      switch (this.currentFilters.sortBy) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
      }
    }

    this.filteredProducts = products;
    this.totalItems = products.length;
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onProductAdded(product: Product) {
    // Aquí podrías mostrar una notificación de éxito
    console.log('Producto agregado al carrito:', product.name);
  }

  clearFilters() {
    this.searchQuery = '';
    this.currentFilters = {};
    this.currentPage = 1;
    this.applyFilters();
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  get hasActiveFilters(): boolean {
    const hasSearch = !!(this.searchQuery && this.searchQuery.trim() !== '');
    const hasCategoryFilter = !!(this.currentFilters.category && this.currentFilters.category !== '');
    const hasPriceFilter = this.currentFilters.priceRange !== undefined;
    const hasSizeFilter = !!(this.currentFilters.size && this.currentFilters.size.length > 0);
    const hasColorFilter = !!(this.currentFilters.color && this.currentFilters.color.length > 0);
    const hasBrandFilter = !!(this.currentFilters.brand && this.currentFilters.brand.length > 0);
    const hasSortFilter = !!this.currentFilters.sortBy;
    
    return hasSearch || hasCategoryFilter || hasPriceFilter || hasSizeFilter || hasColorFilter || hasBrandFilter || hasSortFilter;
  }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 7) {
      // Si hay 7 páginas o menos, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con puntos suspensivos
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.searchQuery && this.searchQuery.trim()) count++;
    if (this.currentFilters.category) count++;
    if (this.currentFilters.priceRange) count++;
    if (this.currentFilters.size && this.currentFilters.size.length > 0) count += this.currentFilters.size.length;
    if (this.currentFilters.color && this.currentFilters.color.length > 0) count += this.currentFilters.color.length;
    if (this.currentFilters.brand && this.currentFilters.brand.length > 0) count += this.currentFilters.brand.length;
    if (this.currentFilters.sortBy) count++;
    return count;
  }
}
