import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, AuthUser } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class ProfileComponent {
  usuario: AuthUser | null = null;

  // stats hardcodeadas por ahora — pueden venir de la API en el futuro
  stats = [
    { label: 'Recomendaciones', value: '—' },
    { label: 'Comentarios',     value: '—' },
    { label: 'Favoritos',       value: '—' },
  ];

  constructor(private auth: AuthService) {
    this.auth.currentUser$.subscribe(u => this.usuario = u);
  }

  get inicial() {
    return this.usuario?.nickname?.charAt(0).toUpperCase() ?? '?';
  }
}
