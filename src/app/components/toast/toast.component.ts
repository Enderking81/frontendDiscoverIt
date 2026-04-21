import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toasts$.subscribe(t => this.toasts = t);
  }

  dismiss(id: number) { this.toastService.dismiss(id); }
}
