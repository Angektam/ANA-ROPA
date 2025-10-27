import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMenuOpen = false;
  searchQuery = '';
  cartCount = 0;
  wishlistCount = 0;

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
