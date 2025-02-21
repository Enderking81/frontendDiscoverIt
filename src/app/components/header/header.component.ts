import { Component, Input } from '@angular/core';
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { DropdownMenuComponent } from "../dropdown-menu/dropdown-menu.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [SearchBarComponent, DropdownMenuComponent]
})

export class HeaderComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
