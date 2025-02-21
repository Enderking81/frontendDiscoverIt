import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component.js';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component.js';
import { DropdownMenuComponent } from '../../components/dropdown-menu/dropdown-menu.component.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [HeaderComponent, SearchBarComponent, DropdownMenuComponent],
  standalone: true
})
export class HomeComponent {
  landingPageTitle: string = 'Bienvenido a la Página';
  landingPageSubtitle: string = 'Explora, disfruta y comparte contenido.';
}
