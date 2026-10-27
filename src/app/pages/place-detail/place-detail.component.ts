import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaceService } from '../../core/services/place.service';
import { RecommendationService } from '../../core/services/recommendation.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { PlaceDetail, Rating, Recommendation, User } from '../../core/models';
import { MapComponent } from '../../components/map/map.component';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrl: './place-detail.component.css',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, DecimalPipe, MapComponent]
})
export class PlaceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly placeService = inject(PlaceService);
  private readonly recommendationService = inject(RecommendationService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  place: PlaceDetail | null = null;
  loading = true;
  isFavorite = false;

  // formulario de recomendación (sirve para crear y para editar la propia)
  points: Rating = 5;
  description = '';
  editing = false;
  saving = false;
  deletingId: number | null = null;
  readonly ratingOptions: Rating[] = [1, 2, 3, 4, 5];

  get currentUser(): User | null { return this.auth.currentUser$.value; }
  get isLoggedIn(): boolean { return this.auth.isLoggedIn(); }

  // la recomendación del usuario logueado, si ya recomendó este lugar
  get myRecommendation(): Recommendation | undefined {
    return this.place?.Recommendations.find((r) => r.idUser === this.currentUser?.id);
  }

  get showForm(): boolean {
    return this.isLoggedIn && (!this.myRecommendation || this.editing);
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPlace(id);

    if (this.isLoggedIn) {
      this.favoriteService.list().subscribe((favorites) => (this.isFavorite = favorites.some((p) => p.id === id)));
    }
  }

  loadPlace(id: number) {
    this.placeService.getById(id).subscribe({
      next: (place) => {
        this.place = place;
        this.loading = false;
      },
      error: () => {
        this.place = null;
        this.loading = false;
      }
    });
  }

  onToggleFavorite() {
    if (!this.place) return;
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/places/${this.place.id}` } });
      return;
    }
    this.favoriteService.toggle(this.place.id, this.isFavorite).subscribe(() => {
      this.isFavorite = !this.isFavorite;
      this.toast.show(this.isFavorite ? 'Guardado en favoritos' : 'Quitado de favoritos', 'success');
    });
  }

  startEdit(recommendation: Recommendation) {
    this.points = recommendation.points;
    this.description = recommendation.description ?? '';
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
    this.resetForm();
  }

  submitRecommendation() {
    if (!this.place) return;
    const placeId = this.place.id;
    const data = { points: this.points, description: this.description.trim() };
    const mine = this.myRecommendation;

    this.saving = true;
    const request$ = mine && this.editing
      ? this.recommendationService.update(mine.id, data)
      : this.recommendationService.create(placeId, data);

    request$.subscribe({
      next: () => {
        this.toast.show(mine ? 'Recomendación actualizada' : '¡Gracias por tu recomendación!', 'success');
        this.saving = false;
        this.editing = false;
        this.resetForm();
        // se recarga el lugar para ver el rating promedio recalculado
        this.loadPlace(placeId);
      },
      error: () => (this.saving = false)
    });
  }

  // el autor borra la suya; un administrador puede borrar cualquiera
  canDelete(recommendation: Recommendation): boolean {
    return recommendation.idUser === this.currentUser?.id || !!this.currentUser?.isAdmin;
  }

  deleteRecommendation(recommendation: Recommendation) {
    if (!this.place) return;
    const placeId = this.place.id;
    this.recommendationService.remove(recommendation.id).subscribe(() => {
      this.toast.show('Recomendación eliminada', 'success');
      this.deletingId = null;
      this.editing = false;
      this.loadPlace(placeId);
    });
  }

  starsFor(points: number): boolean[] {
    return this.ratingOptions.map((n) => n <= points);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = FALLBACK_IMAGE;
  }

  private resetForm() {
    this.points = 5;
    this.description = '';
  }
}
