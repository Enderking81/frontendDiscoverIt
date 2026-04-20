import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlacesService, Place } from '../../core/services/places.service';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-my-likes',
  templateUrl: './my-likes.component.html',
  styleUrl: './my-likes.component.css',
  standalone: true,
  imports: [CommonModule, RouterLink, PlaceCardComponent, SkeletonCardComponent]
})
export class MyLikesComponent implements OnInit {
  lugares: Place[] = [];
  cargando = true;
  readonly skeletons = Array(4);

  constructor(private places: PlacesService) {}

  ngOnInit() {
    this.places.getMyLikes().subscribe({
      next: (likes: any[]) => {
        // el backend devuelve UserLike[] con Place_Product anidado (con Category)
        this.lugares = likes
          .map(l => l.Place_Product)
          .filter(Boolean);
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  onToggleLike(place: Place) {
    // quitar el like y remover la card de la lista inmediatamente (UX optimista)
    this.lugares = this.lugares.filter(p => p.id !== place.id);
    this.places.toggleLike(place.id, true).subscribe();
  }
}
