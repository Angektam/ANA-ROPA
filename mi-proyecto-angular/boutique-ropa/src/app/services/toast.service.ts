import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private nextId = 1;

  show(toast: Omit<Toast, 'id'>) {
    const newToast: Toast = {
      ...toast,
      id: this.nextId++,
      duration: toast.duration || 3000,
      icon: toast.icon || this.getDefaultIcon(toast.type)
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    // Auto remove after duration
    if (newToast.duration) {
      setTimeout(() => {
        this.remove(newToast.id);
      }, newToast.duration);
    }
  }

  success(message: string, duration?: number) {
    this.show({ type: 'success', message, duration });
  }

  error(message: string, duration?: number) {
    this.show({ type: 'error', message, duration });
  }

  warning(message: string, duration?: number) {
    this.show({ type: 'warning', message, duration });
  }

  info(message: string, duration?: number) {
    this.show({ type: 'info', message, duration });
  }

  remove(id: number) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
  }

  private getDefaultIcon(type: Toast['type']): string {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-times-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    return icons[type];
  }
}

