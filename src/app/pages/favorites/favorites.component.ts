import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { ToastService } from '../../core/services/toast.service';
import { Place } from '../../core/models';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
  standalone: true,
  imports: [RouterLink, PlaceCardComponent, SkeletonCardComponent]
})
export class FavoritesComponent implements OnInit {
  private readonly favoriteService = inject(FavoriteService);
  private readonly toast = inject(ToastService);

  places: Place[] = [];
  loading = true;
  readonly skeletons = Array(4);

  ngOnInit() {
    this.favoriteService.list().subscribe({
      next: (places) => {
        this.places = places;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  // se saca de la lista al instante; si el backend falla se vuelve a poner
  onRemove(place: Place) {
    const previous = this.places;
    this.places = this.places.filter((p) => p.id !== place.id);
    this.favoriteService.toggle(place.id, true).subscribe({
      next: () => this.toast.show('Quitado de favoritos', 'success'),
      error: () => (this.places = previous)
    });
  }
}
