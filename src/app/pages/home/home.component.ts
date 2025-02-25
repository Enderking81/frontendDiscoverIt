// home.component.ts
import { Component, OnInit } from '@angular/core';
import { GridComponent } from '../../components/grid/grid.component';
import {placeProduct} from "../../model/placeProduct";
import {PlaceProdService} from "../../services/place-prod.service"; // Correcto: Importar sin .js

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [GridComponent], // Importar GridComponent aquí
})
export class HomeComponent {
  constructor(
      private placeProdService: PlaceProdService) { }

  // Los datos de las tarjetas para pasar a GridComponent
  cards: placeProduct[] = []


  nextPage() {
    console.log('Next Page clicked');
  }
}