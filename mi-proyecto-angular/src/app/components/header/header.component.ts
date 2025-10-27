import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  searchQuery = '';
  cartCount$: Observable<number>;
  wishlistCount$: Observable<number>;

  constructor(private cartService: CartService) {
    this.cartCount$ = this.cartService.getCartCount();
    this.wishlistCount$ = this.cartService.getWishlistCount();
  }

  ngOnInit(): void {
    // Los observables se suscriben automáticamente en el template
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Buscando:', this.searchQuery);
      // Aquí implementarías la lógica de búsqueda
      // Por ejemplo, navegar a la página de catálogo con filtros
    }
  }

  onQuickLinkClick(type: string) {
    console.log('Navegando a:', type);
    // Implementar navegación a diferentes secciones
  }

  onDropdownToggle(event: Event) {
    event.preventDefault();
    const dropdown = (event.target as HTMLElement).closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
    }
  }
}
