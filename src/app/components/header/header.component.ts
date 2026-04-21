import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { SidebarService } from '../../core/services/sidebar.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, DropdownMenuComponent]
})
export class HeaderComponent {
  constructor(private sidebar: SidebarService, public theme: ThemeService) {}

  abrirSidebar() { this.sidebar.toggle(); }
  toggleTheme()  { this.theme.toggle(); }
}
