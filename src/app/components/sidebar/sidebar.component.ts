import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SidebarService } from '../../core/services/sidebar.service';
import { AuthService, AuthUser } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;       // nombre del ícono SVG
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio',        route: '/',         icon: 'home' },
  { label: 'Mi Perfil',     route: '/profile',  icon: 'user' },
  { label: 'Mis Favoritos', route: '/my-likes', icon: 'heart' },
  { label: 'Admin Panel',   route: '/admin',    icon: 'shield', adminOnly: true },
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
  usuario: AuthUser | null = null;
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
      this.usuario = user;
      // filtra los items según si el usuario es admin
      this.navItems = NAV_ITEMS.filter(i => !i.adminOnly || user?.isAdmin);
    });
  }

  cerrar() { this.sidebar.close(); }

  navegarY(route: string) {
    this.router.navigate([route]);
    this.sidebar.close();
  }

  cerrarSesion() {
    this.auth.logout();
    this.sidebar.close();
  }

  // cierra el sidebar al presionar Escape
  @HostListener('document:keydown.escape')
  onEsc() { this.sidebar.close(); }

  // SVGs inline por nombre para evitar dependencia de librería de íconos
  getIcon(name: string): string {
    const icons: Record<string, string> = {
      home:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      user:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      heart:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
      shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    };
    return icons[name] ?? '';
  }
}
