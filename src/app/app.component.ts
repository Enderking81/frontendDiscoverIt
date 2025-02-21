import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, HomeComponent, HeaderComponent],
  standalone: true
})
export class AppComponent {
  landingPageTitle: string = 'Bienvenido a nuestra página';  // Inicialización aquí
  landingPageSubtitle: string = 'Descubre contenido interesante y más';  // Inicialización aquí
}
