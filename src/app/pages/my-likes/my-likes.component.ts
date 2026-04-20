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
  likedIds = new Set<number>();
  cargando = true;
  readonly skeletons = Array(4);

  constructor(private places: PlacesService) {}

  ngOnInit() {
    this.places.getMyLikes().subscribe({
      next: (likes) => {
        // los likes incluyen el objeto Place_Product anidado
        this.lugares = likes.map((l: any) => l.Place_Product).filter(Boolean);
        this.likedIds = new Set(this.lugares.map(p => p.id));
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  onToggleLike(place: Place) {
    // saca el like y quita la card de la lista
    this.places.toggleLike(place.id, true).subscribe({
      next: () => {
        this.lugares = this.lugares.filter(p => p.id !== place.id);
        this.likedIds.delete(place.id);
      }
    });
  }
}
