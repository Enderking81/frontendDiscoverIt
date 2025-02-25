import { Component, Input } from '@angular/core';
import { PlaceprodCardsComponent } from '../placeprod-cards/placeprod-cards.component';
import { CommonModule } from '@angular/common';
import { PlaceProdService } from '../../services/place-prod.service.js';
import {placeProduct} from "../../model/placeProduct";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  standalone: true,
  imports: [PlaceprodCardsComponent, CommonModule], // Importar correctamente el componente dependiente
})
export class GridComponent {
  cards: placeProduct[] = [];

  constructor(
      private placeProdService: PlaceProdService) {}

  ngOnInit() {
    //  this.loadImages();
    this.loadCards()
  }

  loadCards() {
    this.placeProdService.getAll()
        .subscribe(
            res => {
              this.cards.push(...res)
            }
        )
  }
}