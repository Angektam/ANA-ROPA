import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="auth-section">
      <div class="container">
        <div class="auth-card">
          <div class="auth-logo">
            <div class="logo-icon">
              <i class="fas fa-gem"></i>
            </div>
            <h1>Boutique Ana</h1>
          </div>
          <h2 class="auth-title">¡Únete a nuestra comunidad!</h2>
          <p class="auth-subtitle">Crea tu cuenta y descubre la moda femenina más elegante</p>
          <form class="auth-form">
            <div class="form-group">
              <label for="name">Nombre completo</label>
              <input type="text" id="name" class="form-input" placeholder="Tu nombre completo">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" class="form-input" placeholder="tu@email.com">
            </div>
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input type="password" id="password" class="form-input" placeholder="Tu contraseña">
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirmar contraseña</label>
              <input type="password" id="confirmPassword" class="form-input" placeholder="Confirma tu contraseña">
            </div>
            <button type="submit" class="btn btn-primary btn-full">Crear Cuenta</button>
          </form>
          <p class="auth-link">
            ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      background: var(--background-secondary);
      padding: var(--space-8) 0;
    }
    .auth-card {
      max-width: 400px;
      margin: 0 auto;
      background: var(--background-primary);
      padding: var(--space-8);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
      text-align: center;
    }
    .auth-logo {
      margin-bottom: var(--space-6);
    }
    .logo-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-4);
    }
    .logo-icon i {
      font-size: 24px;
      color: white;
    }
    .auth-logo h1 {
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--text-color);
      margin: 0;
    }
    .auth-title {
      font-size: var(--text-2xl);
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: var(--space-2);
    }
    .auth-subtitle {
      color: var(--text-light);
      margin-bottom: var(--space-8);
    }
    .auth-form {
      margin-bottom: var(--space-6);
    }
    .form-group {
      margin-bottom: var(--space-4);
      text-align: left;
    }
    .form-group label {
      display: block;
      margin-bottom: var(--space-2);
      font-weight: 500;
      color: var(--text-color);
    }
    .form-input {
      width: 100%;
      padding: var(--space-3);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius);
      font-size: var(--text-base);
      transition: all var(--transition-base);
    }
    .form-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
    }
    .btn-full {
      width: 100%;
      padding: var(--space-4);
      font-size: var(--text-base);
    }
    .auth-link {
      color: var(--text-light);
    }
    .auth-link a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }
    .auth-link a:hover {
      color: var(--accent-color);
    }
  `]
})
export class RegisterComponent {}
