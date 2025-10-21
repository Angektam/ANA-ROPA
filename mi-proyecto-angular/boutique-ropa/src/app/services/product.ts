import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, forkJoin, switchMap, of } from 'rxjs';
import { Product, Category, FilterOptions } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      switchMap(products => this.enrichProductsWithCategories(products))
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      switchMap(product => this.enrichProductsWithCategories([product])),
      map(products => products[0])
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getProductsByCategory(categorySlug: string): Observable<Product[]> {
    return this.getCategories().pipe(
      switchMap(categories => {
        const category = categories.find(c => c.slug === categorySlug);
        if (!category) return [];
        
        return this.http.get<Product[]>(`${this.apiUrl}/products?categoryId=${category.id}`).pipe(
          switchMap(products => this.enrichProductsWithCategories(products))
        );
      })
    );
  }

  searchProducts(products: Product[], query: string): Product[] {
    if (!query.trim()) {
      return products;
    }

    const searchTerm = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some((tag: any) => tag.toLowerCase().includes(searchTerm))
    );
  }

  filterProducts(products: Product[], filters: FilterOptions): Product[] {
    let filteredProducts = [...products];

    // Filtrar por categoría
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category?.slug === filters.category
      );
    }

    // Filtrar por rango de precio
    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(p =>
        p.price >= filters.priceRange!.min && p.price <= filters.priceRange!.max
      );
    }

    // Filtrar por talla
    if (filters.size && filters.size.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        p.size.some((s: any) => filters.size!.includes(s.name) && s.available)
      );
    }

    // Filtrar por color
    if (filters.color && filters.color.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        p.color.some((c: any) => filters.color!.includes(c))
      );
    }

    // Filtrar por marca
    if (filters.brand && filters.brand.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        filters.brand!.includes(p.brand)
      );
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
      }
    }

    return filteredProducts;
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?isNew=true&isOnSale=true`).pipe(
      switchMap(products => this.enrichProductsWithCategories(products.slice(0, 6)))
    );
  }

  getNewProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?isNew=true`).pipe(
      switchMap(products => this.enrichProductsWithCategories(products))
    );
  }

  getSaleProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?isOnSale=true`).pipe(
      switchMap(products => this.enrichProductsWithCategories(products))
    );
  }

  // Métodos para enriquecer productos con información de categorías
  private enrichProductsWithCategories(products: Product[]): Observable<Product[]> {
    return this.getCategories().pipe(
      map(categories => {
        return products.map(product => {
          const category = categories.find(c => c.id === product.categoryId);
          return { ...product, category };
        });
      })
    );
  }

  private enrichProductWithCategory(product: Product, categories?: Category[]): Observable<Product> {
    if (categories) {
      const category = categories.find(c => c.id === product.categoryId);
      return of({ ...product, category });
    }
    
    return this.getCategories().pipe(
      map(categories => {
        const category = categories.find(c => c.id === product.categoryId);
        return { ...product, category };
      })
    );
  }

  // Métodos para administración (CRUD)
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }
}