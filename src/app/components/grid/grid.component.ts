import { Component, Input } from '@angular/core';
import { PlaceprodCardsComponent } from '../placeprod-cards/placeprod-cards.component';  
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  standalone: true,  
  imports: [PlaceprodCardsComponent, HttpClientModule],
})
export class GridComponent {
  @Input() cards: Array<{ id: number; imageUrl: string }> = [];  
}
