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
    // Inicializar sin toasts - solo mostrar cuando sea necesario
    this.toasts = [];
  }
}
