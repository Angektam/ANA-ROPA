import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.html',
  styleUrls: ['./toast-container.scss']
})
export class ToastContainerComponent {
  toasts: any[] = [];

  constructor() {
    // Simular algunos toasts para demostración
    this.toasts = [
      {
        id: 1,
        type: 'success',
        title: '¡Bienvenida!',
        message: 'Has iniciado sesión correctamente',
        icon: 'fas fa-check-circle'
      }
    ];
  }
}
