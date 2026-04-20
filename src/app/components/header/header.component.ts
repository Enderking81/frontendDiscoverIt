import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterLink, DropdownMenuComponent]
})
export class HeaderComponent {}
