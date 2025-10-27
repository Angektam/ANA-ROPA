import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section">
      <div class="hero-background">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Finalizar Compra</h1>
            <p class="hero-subtitle">Completa tu pedido de moda femenina</p>
          </div>
        </div>
      </div>
    </section>
    <section class="checkout-section">
      <div class="container">
        <div class="checkout-content">
          <h2>Proceso de Checkout</h2>
          <p>Funcionalidad de checkout en desarrollo...</p>
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
    .checkout-section {
      padding: var(--space-20) 0;
      background: var(--background-primary);
    }
    .checkout-content {
      text-align: center;
      padding: var(--space-16) 0;
    }
    .checkout-content h2 {
      font-size: var(--text-2xl);
      margin-bottom: var(--space-4);
      color: var(--text-color);
    }
    .checkout-content p {
      font-size: var(--text-lg);
      color: var(--text-light);
    }
  `]
})
export class CheckoutComponent {}
