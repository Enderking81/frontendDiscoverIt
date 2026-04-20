import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Place } from '../../core/services/places.service';

@Component({
  selector: 'app-place-card',
  templateUrl: './place-card.component.html',
  styleUrl: './place-card.component.css',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class PlaceCardComponent {
  @Input() place!: Place;
  @Input() liked = false;
  @Output() toggleLike = new EventEmitter<Place>();

  // genera estrellas llenas y vacías a partir del promedio
  get estrellas(): boolean[] {
    const rating = Math.round(this.place.average_rating ?? 0);
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  // fallback si la imagen falla o no hay URL
  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80';
  }

  onToggleLike(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.toggleLike.emit(this.place);
  }
}
