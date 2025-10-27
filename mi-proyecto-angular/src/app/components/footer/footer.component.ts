import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  newsletterEmail = '';

  onNewsletterSubmit() {
    if (this.newsletterEmail.trim()) {
      console.log('Suscripción al newsletter desde footer:', this.newsletterEmail);
      alert('¡Gracias por suscribirte! Te mantendremos informada sobre las últimas tendencias.');
      this.newsletterEmail = '';
    } else {
      alert('Por favor, ingresa un email válido.');
    }
  }

  onLinkClick(link: string) {
    console.log('Navegando a:', link);
    // Aquí implementarías la navegación a diferentes secciones
  }
}
