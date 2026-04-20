import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacesService, Place } from '../../core/services/places.service';
import { AuthService } from '../../core/services/auth.service';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card.component';

// categorías para los filtros en pills (sincronizadas con el seeder)
const CATEGORIAS = [
  { id: 0,  label: 'Todos' },
  { id: 1,  label: 'Restaurantes' },
  { id: 2,  label: 'Museos' },
  { id: 3,  label: 'Bares' },
  { id: 4,  label: 'Parques' },
  { id: 5,  label: 'Hoteles' },
  { id: 6,  label: 'Cafeterías' },
  { id: 7,  label: 'Tiendas' },
  { id: 8,  label: 'Entretenimiento' },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [CommonModule, PlaceCardComponent, SkeletonCardComponent]
})
export class HomeComponent implements OnInit {
  todos: Place[] = [];
  filtrados: Place[] = [];
  likedIds = new Set<number>();
  cargando = true;
  categoriaActiva = 0;
  busqueda = '';
  readonly categorias = CATEGORIAS;
  readonly skeletons = Array(8); // 8 placeholders de skeleton

  constructor(private places: PlacesService, private auth: AuthService) {}

  ngOnInit() {
    // carga lugares y likes del usuario en paralelo
    this.places.getAll().subscribe({
      next: (data) => {
        this.todos = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });

    // solo carga los likes si el usuario está logueado
    if (this.auth.estaLogueado()) {
      this.places.getMyLikes().subscribe({
        next: (likes) => likes.forEach(l => this.likedIds.add(l.placeProductId))
      });
    }
  }

  seleccionarCategoria(id: number) {
    this.categoriaActiva = id;
    this.aplicarFiltros();
  }

  onBusqueda(e: Event) {
    this.busqueda = (e.target as HTMLInputElement).value.toLowerCase();
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.filtrados = this.todos.filter(p => {
      const matchCategoria = this.categoriaActiva === 0 || p.categoryId === this.categoriaActiva;
      const matchBusqueda  = !this.busqueda || p.name.toLowerCase().includes(this.busqueda)
                                            || p.location.toLowerCase().includes(this.busqueda);
      return matchCategoria && matchBusqueda;
    });
  }

  onToggleLike(place: Place) {
    if (!this.auth.estaLogueado()) return;
    const liked = this.likedIds.has(place.id);
    this.places.toggleLike(place.id, liked).subscribe({
      next: () => {
        liked ? this.likedIds.delete(place.id) : this.likedIds.add(place.id);
        // forzamos detección de cambios con un nuevo Set
        this.likedIds = new Set(this.likedIds);
      }
    });
  }

  isLiked(place: Place) { return this.likedIds.has(place.id); }
}
