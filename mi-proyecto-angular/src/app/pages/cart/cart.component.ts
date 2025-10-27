import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section">
      <div class="hero-background">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Tu Selección de Moda Femenina</h1>
            <p class="hero-subtitle">Revisa las prendas que has seleccionado para realzar tu belleza</p>
          </div>
        </div>
      </div>
    </section>
    <section class="cart-section">
      <div class="container">
        <div class="empty-cart">
          <i class="fas fa-shopping-bag"></i>
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestra colección de moda femenina y encuentra prendas que realcen tu estilo</p>
          <a routerLink="/catalog" class="btn btn-primary">Explorar Catálogo</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      min-height: 40vh;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      z-index: -2;
    }
    .hero-content {
      text-align: center;
      color: white;
      max-width: 800px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }
    .hero-title {
      font-size: var(--text-4xl);
      font-weight: 700;
      margin-bottom: var(--space-4);
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .hero-subtitle {
      font-size: var(--text-xl);
      font-weight: 300;
      opacity: 0.9;
    }
    .cart-section {
      padding: var(--space-20) 0;
      background: var(--background-primary);
    }
    .empty-cart {
      text-align: center;
      padding: var(--space-16) 0;
    }
    .empty-cart i {
      font-size: 4rem;
      color: var(--primary-color);
      margin-bottom: var(--space-6);
    }
    .empty-cart h2 {
      font-size: var(--text-2xl);
      margin-bottom: var(--space-4);
      color: var(--text-color);
    }
    .empty-cart p {
      font-size: var(--text-lg);
      color: var(--text-light);
      margin-bottom: var(--space-8);
    }
  `]
})
export class CartComponent {}
