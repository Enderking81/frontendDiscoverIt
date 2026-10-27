import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Place } from '../../core/models';
import { ImageFallbackComponent } from '../image-fallback/image-fallback.component';

@Component({
  selector: 'app-place-card',
  templateUrl: './place-card.component.html',
  styleUrl: './place-card.component.css',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageFallbackComponent]
})
export class PlaceCardComponent {
  @Input() place!: Place;
  @Input() liked = false;
  @Input() index = 0;           // para el gradiente de fallback
  @Output() toggleLike = new EventEmitter<Place>();

  get stars(): boolean[] {
    const rating = Math.round(this.place.average_rating ?? 0);
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  onToggleLike(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.toggleLike.emit(this.place);
  }
}
