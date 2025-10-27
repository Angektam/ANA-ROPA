import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, Category, FilterOptions } from '../../models/product.model';

@Component({
  selector: 'app-product-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.scss'
})
export class ProductFilter implements OnInit, OnChanges {
  @Input() categories: Category[] = [];
  @Input() products: Product[] = [];
  @Output() filtersChange = new EventEmitter<FilterOptions>();

  filters: FilterOptions = {};
  openSections: Set<string> = new Set(['category', 'price', 'size', 'color', 'brand', 'sort']);
  
  // Opciones de filtros
  priceRanges = [
    { label: 'Menos de $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Más de $200', min: 200, max: 1000 }
  ];

  sizes: string[] = [];
  colors: string[] = [];
  brands: string[] = [];
  occasions: string[] = ['Casual', 'Trabajo', 'Fiesta', 'Boda', 'Cita', 'Vacaciones'];
  styles: string[] = ['Elegante', 'Casual', 'Vintage', 'Moderno', 'Bohemio', 'Minimalista'];
  materials: string[] = ['Algodón', 'Seda', 'Lino', 'Lana', 'Poliéster', 'Encaje', 'Cuero'];

  ngOnInit() {
    this.extractFilterOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['products'] && changes['products'].currentValue) {
      this.extractFilterOptions();
    }
  }

  extractFilterOptions() {
    // Extraer tallas únicas
    this.sizes = [...new Set(this.products.flatMap(p => p.size.map((s: any) => s.name)))];
    
    // Extraer colores únicos
    this.colors = [...new Set(this.products.flatMap(p => p.color))];
    
    // Extraer marcas únicas
    this.brands = [...new Set(this.products.map(p => p.brand))];
  }

  onCategoryChange(categorySlug: string) {
    if (categorySlug) {
      this.filters.category = categorySlug;
    } else {
      delete this.filters.category;
    }
    this.emitFilters();
  }

  onPriceRangeChange(priceRange: { min: number; max: number } | null) {
    this.filters.priceRange = priceRange || undefined;
    this.emitFilters();
  }

  onSizeChange(size: string, checked: boolean) {
    if (!this.filters.size) {
      this.filters.size = [];
    }
    
    if (checked) {
      this.filters.size.push(size);
    } else {
      this.filters.size = this.filters.size.filter((s: any) => s !== size);
    }
    
    this.emitFilters();
  }

  onSizeChangeEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onSizeChange(target.value, target.checked);
  }

  onColorChange(color: string, checked: boolean) {
    if (!this.filters.color) {
      this.filters.color = [];
    }
    
    if (checked) {
      this.filters.color.push(color);
    } else {
      this.filters.color = this.filters.color.filter((c: any) => c !== color);
    }
    
    this.emitFilters();
  }

  onColorChangeEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onColorChange(target.value, target.checked);
  }

  onBrandChange(brand: string, checked: boolean) {
    if (!this.filters.brand) {
      this.filters.brand = [];
    }
    
    if (checked) {
      this.filters.brand.push(brand);
    } else {
      this.filters.brand = this.filters.brand.filter((b: any) => b !== brand);
    }
    
    this.emitFilters();
  }

  onBrandChangeEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onBrandChange(target.value, target.checked);
  }

  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filters.sortBy = target.value as any || undefined;
    this.emitFilters();
  }

  clearFilters() {
    this.filters = {};
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChange.emit({ ...this.filters });
  }

  isSizeSelected(size: string): boolean {
    return this.filters.size?.includes(size) || false;
  }

  isColorSelected(color: string): boolean {
    return this.filters.color?.includes(color) || false;
  }

  isBrandSelected(brand: string): boolean {
    return this.filters.brand?.includes(brand) || false;
  }

  hasActiveFilters(): boolean {
    return Object.keys(this.filters).some(key => {
      const value = this.filters[key as keyof FilterOptions];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    });
  }

  // Nuevos métodos para funcionalidades avanzadas
  getActiveFiltersCount(): number {
    let count = 0;
    Object.keys(this.filters).forEach(key => {
      const value = this.filters[key as keyof FilterOptions];
      if (Array.isArray(value)) {
        count += value.length;
      } else if (value !== undefined && value !== null && value !== '') {
        count++;
      }
    });
    return count;
  }

  toggleSection(section: string): void {
    if (this.openSections.has(section)) {
      this.openSections.delete(section);
    } else {
      this.openSections.add(section);
    }
  }

  isSectionOpen(section: string): boolean {
    return this.openSections.has(section);
  }

  getCategoryName(categorySlug: string): string {
    const category = this.categories.find(c => c.slug === categorySlug);
    return category ? category.name : categorySlug;
  }

  getPriceRangeLabel(priceRange: { min: number; max: number }): string {
    const range = this.priceRanges.find(r => r.min === priceRange.min && r.max === priceRange.max);
    return range ? range.label : `$${priceRange.min} - $${priceRange.max}`;
  }

  clearCategoryFilter(): void {
    this.filters.category = undefined;
    this.emitFilters();
  }

  clearPriceFilter(): void {
    this.filters.priceRange = undefined;
    this.emitFilters();
  }

  removeSizeFilter(size: string): void {
    if (this.filters.size) {
      this.filters.size = this.filters.size.filter(s => s !== size);
      if (this.filters.size.length === 0) {
        this.filters.size = undefined;
      }
      this.emitFilters();
    }
  }

  removeColorFilter(color: string): void {
    if (this.filters.color) {
      this.filters.color = this.filters.color.filter(c => c !== color);
      if (this.filters.color.length === 0) {
        this.filters.color = undefined;
      }
      this.emitFilters();
    }
  }

  removeBrandFilter(brand: string): void {
    if (this.filters.brand) {
      this.filters.brand = this.filters.brand.filter(b => b !== brand);
      if (this.filters.brand.length === 0) {
        this.filters.brand = undefined;
      }
      this.emitFilters();
    }
  }

  // Métodos para ocasiones
  onOccasionChange(occasion: string, checked: boolean) {
    if (!this.filters.occasion) {
      this.filters.occasion = [];
    }
    
    if (checked) {
      this.filters.occasion.push(occasion);
    } else {
      this.filters.occasion = this.filters.occasion.filter((o: any) => o !== occasion);
    }
    
    this.emitFilters();
  }

  onOccasionChangeEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onOccasionChange(target.value, target.checked);
  }

  isOccasionSelected(occasion: string): boolean {
    return this.filters.occasion?.includes(occasion) || false;
  }

  // Métodos para estilos
  onStyleChange(style: string, checked: boolean) {
    if (!this.filters.style) {
      this.filters.style = [];
    }
    
    if (checked) {
      this.filters.style.push(style);
    } else {
      this.filters.style = this.filters.style.filter((s: any) => s !== style);
    }
    
    this.emitFilters();
  }

  onStyleChangeEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onStyleChange(target.value, target.checked);
  }

  isStyleSelected(style: string): boolean {
    return this.filters.style?.includes(style) || false;
  }

  // Métodos para materiales
  onMaterialChange(material: string, checked: boolean) {
    if (!this.filters.material) {
      this.filters.material = [];
    }
    
    if (checked) {
      this.filters.material.push(material);
    } else {
      this.filters.material = this.filters.material.filter((m: any) => m !== material);
    }
    
    this.emitFilters();
  }

  onMaterialChangeEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onMaterialChange(target.value, target.checked);
  }

  isMaterialSelected(material: string): boolean {
    return this.filters.material?.includes(material) || false;
  }
}
