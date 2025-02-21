/*import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
  standalone: true
})
export class DropdownMenuComponent {
  isOpen = signal(false); // Variable para manejar la visibilidad

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }
}
*/

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';  // Necesario para *ngIf

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
  standalone: true,
  imports: [CommonModule] // Necesario para usar *ngIf
})
export class DropdownMenuComponent {
  isOpen = signal(false);  // Variable para manejar la visibilidad

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());  // Cambiar el valor de isOpen
  }
}
