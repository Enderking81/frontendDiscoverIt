import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-placeprod-cards',
  templateUrl: './placeprod-cards.component.html',
  styleUrls: ['./placeprod-cards.component.css'],
  standalone: true,  // Este componente es standalone
})
export class PlaceprodCardsComponent {
  @Input() cardData: Array<{ id: number; imageUrl: string }> = [];  // Recibimos la imagen como entrada
}
