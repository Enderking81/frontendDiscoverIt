import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { PlaceService } from '../../core/services/place.service';
import { CategoryService } from '../../core/services/category.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { AuthService } from '../../core/services/auth.service';
import { Category, Place, PlaceFilters } from '../../core/models';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card.component';
import { MapComponent } from '../../components/map/map.component';

type ViewMode = 'grid' | 'map';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [PlaceCardComponent, SkeletonCardComponent, MapComponent]
})
export class HomeComponent implements OnInit {
  private readonly placeService = inject(PlaceService);
  private readonly categoryService = inject(CategoryService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // cada cambio de filtro dispara una nueva búsqueda en el backend
  private readonly filters$ = new BehaviorSubject<PlaceFilters>({});
  private readonly searchInput$ = new Subject<string>();

  places: Place[] = [];
  categories: Category[] = [];
  favoriteIds = new Set<number>();
  loading = true;
  activeCategoryId = 0; // 0 = todas las categorías
  searchTerm = '';
  view: ViewMode = 'grid';
  readonly skeletons = Array(8);

  ngOnInit() {
    this.categoryService.list().subscribe((categories) => (this.categories = categories));

    // switchMap descarta la respuesta anterior si el usuario cambia el filtro antes de que llegue
    this.filters$.pipe(
      tap(() => (this.loading = true)),
      switchMap((filters) => this.placeService.list(filters).pipe(catchError(() => of([])))),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((places) => {
      this.places = places;
      this.loading = false;
    });

    // espera a que el usuario deje de escribir para no pedir en cada tecla
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((term) => {
      this.searchTerm = term;
      this.applyFilters();
    });

    if (this.auth.isLoggedIn()) {
      this.favoriteService.list().subscribe((favorites) => (this.favoriteIds = new Set(favorites.map((p) => p.id))));
    }
  }

  onSearch(event: Event) {
    this.searchInput$.next((event.target as HTMLInputElement).value);
  }

  selectCategory(id: number) {
    this.activeCategoryId = id;
    this.applyFilters();
  }

  clearFilters() {
    this.activeCategoryId = 0;
    this.searchTerm = '';
    this.searchInput$.next('');
    this.applyFilters();
  }

  onToggleFavorite(place: Place) {
    // un invitado que quiere guardar un favorito primero tiene que iniciar sesión
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/' } });
      return;
    }
    const isFavorite = this.favoriteIds.has(place.id);
    this.favoriteService.toggle(place.id, isFavorite).subscribe(() => {
      const ids = new Set(this.favoriteIds);
      if (isFavorite) ids.delete(place.id);
      else ids.add(place.id);
      this.favoriteIds = ids;
    });
  }

  private applyFilters() {
    this.filters$.next({ categoryId: this.activeCategoryId || undefined, search: this.searchTerm });
  }
}
