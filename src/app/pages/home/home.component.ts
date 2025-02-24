// home.component.ts
import { Component } from '@angular/core';
import { GridComponent } from '../../components/grid/grid.component'; // Correcto: Importar sin .js

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [GridComponent], // Importar GridComponent aquí
})
export class HomeComponent {
  // Los datos de las tarjetas para pasar a GridComponent
  cards = [
    { id: 0, imageUrl: 'blob:http://localhost:4200/...' },
    { id: 1, imageUrl: 'blob:http://localhost:4200/...' },
  ];

  nextPage() {
    console.log('Next Page clicked');
  }
}
