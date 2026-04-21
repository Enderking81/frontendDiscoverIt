import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toasts$ = new BehaviorSubject<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info', duration = 4000) {
    const toast: Toast = { id: ++this.counter, message, type };
    this.toasts$.next([...this.toasts$.value, toast]);
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  dismiss(id: number) {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }
}
