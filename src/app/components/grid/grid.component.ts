// grid.component.ts
import { Component, Input } from '@angular/core';
import { PlaceprodCardsComponent } from '../placeprod-cards/placeprod-cards.component';
import { CatsService } from '../../cats.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  standalone: true,
  imports: [PlaceprodCardsComponent, CommonModule], // Importar correctamente el componente dependiente
})
export class GridComponent {
  @Input() cards: Array<{ id: number; imageUrl: string }> = [];  // Asegúrate de que cards esté marcado como @Input()

  constructor(private CatsService: CatsService) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    for (let i = 0; i < 4; i++) {
      this.CatsService.getCatImage('square').subscribe({
        next: (blob) => {
          const objectURL = URL.createObjectURL(blob);
          this.cards.push({ id: i, imageUrl: objectURL });
        },
        error: (err) => console.error('Error cargando imagen:', err),
      });
    }
  }
}
