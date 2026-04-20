import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, AuthUser } from '../../core/services/auth.service';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class DropdownMenuComponent {
  isOpen = signal(false);
  // el componente se suscribe al estado de usuario del AuthService
  usuario: AuthUser | null = null;

  constructor(public auth: AuthService) {
    // cada vez que cambia el usuario logueado, actualizamos la vista
    auth.currentUser$.subscribe(user => this.usuario = user);
  }

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  cerrarSesion() {
    this.isOpen.set(false);
    this.auth.logout();
  }
}
