import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { HeaderComponent } from "./components/header/header.component";
import { PlaceprodCardsComponent } from './components/placeprod-cards/placeprod-cards.component.js';
import { GridComponent } from './components/grid/grid.component.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, HomeComponent, HeaderComponent, PlaceprodCardsComponent, GridComponent],
  standalone: true
})
export class AppComponent {
  landingPageTitle: string = 'Bienvenido a nuestra página';  
  landingPageSubtitle: string = 'Descubre contenido interesante y más';  
}
