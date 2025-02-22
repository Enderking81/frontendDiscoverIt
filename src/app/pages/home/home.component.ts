import { Component, OnInit } from '@angular/core';
import { CatsService } from '../../cats.service.js';
import { PlaceprodCardsComponent } from '../../components/placeprod-cards/placeprod-cards.component';  
import { GridComponent } from '../../components/grid/grid.component'; 
import { forkJoin } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,  
  imports: [
    PlaceprodCardsComponent, GridComponent, HttpClientModule
  ],
})
export class HomeComponent implements OnInit {
  page: number = 1;
  catTypes: string[] = ['xsmall', 'small', 'medium', 'square'];
  cards: Array<{ id: number; imageUrl: string }> = [];

  constructor(private catsService: CatsService) {}

  ngOnInit(): void {
    this.fetchCards();
  }

  fetchCards(): void {
    const requests = this.catTypes.map((type) => this.catsService.getCatImage(type));

    forkJoin(requests).subscribe((data: any[]) => {
      this.cards = data.map((item, index) => ({
        id: index + (this.page - 1) * this.catTypes.length,
        imageUrl: item.url,
      }));
    }, (error) => {
      console.error('Error al obtener las imágenes:', error);
    }
  
  );
  }

  nextPage(): void {
    this.page += 1;
    this.fetchCards();
  }
}
