
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-placeprod-cards',
  templateUrl: './placeprod-cards.component.html',
  styleUrls: ['./placeprod-cards.component.css'],
  standalone: true,
})
export class PlaceprodCardsComponent implements OnInit {
  @Input() cardData!: { id: number; imageUrl: string };

  ngOnInit() {
    console.log('Card recibida en PlaceprodCardsComponent:', this.cardData);
  }
}


/* 
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-placeprod-cards',
  templateUrl: './placeprod-cards.component.html',
  styleUrls: ['./placeprod-cards.component.css'],
  standalone: true,
  imports: [CommonModule], // Agrega CommonModule aquí
})
export class PlaceprodCardsComponent {
  @Input() cardData!: { id: number; imageUrl: string };

  ngOnInit() {
    console.log('Card recibida en PlaceprodCardsComponent:', this.cardData);
  }
}

*/