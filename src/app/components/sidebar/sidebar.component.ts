import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SidebarService } from '../../core/services/sidebar.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

interface NavItem {
  label: string;
  route: string;
  icon: string;       // nombre del ícono SVG
  authOnly?: boolean;  // solo con sesión iniciada
  adminOnly?: boolean; // solo administradores
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio',        route: '/',         icon: 'home' },
  { label: 'Mi Perfil',     route: '/profile',  icon: 'user', authOnly: true },
  { label: 'Mis Favoritos', route: '/favorites', icon: 'heart', authOnly: true },
  { label: 'Administración', route: '/admin',   icon: 'shield', adminOnly: true },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  user: User | null = null;
  navItems: NavItem[] = [];

  constructor(
    private sidebar: SidebarService,
    private auth: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    // reacciona en tiempo real al estado del sidebar y del usuario
    this.sidebar.open$.subscribe(v => this.isOpen = v);
    this.auth.currentUser$.subscribe(user => {
      this.user = user;
      // filtra los items según si el usuario es admin
      this.navItems = NAV_ITEMS.filter((i) => (!i.authOnly || user) && (!i.adminOnly || user?.isAdmin));
    });
  }

  close() { this.sidebar.close(); }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.sidebar.close();
  }

  logout() {
    this.auth.logout();
    this.sidebar.close();
  }

  // cierra el sidebar al presionar Escape
  @HostListener('document:keydown.escape')
  onEsc() { this.sidebar.close(); }

}
