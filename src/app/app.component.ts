import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { HeaderComponent } from "./components/header/header.component";
import { PlaceprodCardsComponent } from './components/placeprod-cards/placeprod-cards.component.js';
import { GridComponent } from './components/grid/grid.component.js';
import { PlaceProductPageComponent } from './pages/place-product-page/place-product-page.component.js';
import { LoginPageComponent } from './pages/login-page/login-page.component.js';
import { RegisterPageComponent } from './pages/register-page/register-page.component.js';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, 
    HomeComponent, 
    HeaderComponent, 
    PlaceprodCardsComponent, 
    GridComponent, 
    PlaceProductPageComponent, 
    LoginPageComponent, 
    RegisterPageComponent,
    ProfilePageComponent
  ],
  standalone: true
})
export class AppComponent {
  landingPageTitle: string = 'Bienvenido a nuestra página'; 
  landingPageSubtitle: string = 'Descubre contenido interesante y más';  
}
