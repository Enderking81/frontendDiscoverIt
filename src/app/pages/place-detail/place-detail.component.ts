import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlacesService, Place, Comment, Recommendation } from '../../core/services/places.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrl: './place-detail.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class PlaceDetailComponent implements OnInit {
  place: Place | null = null;
  comentarios: Comment[] = [];
  recomendaciones: Recommendation[] = [];
  liked = false;
  cargando = true;

  // formulario de nuevo comentario
  nuevoComentario = '';
  enviandoComentario = false;

  // formulario de nueva recomendación
  nuevoPuntaje = 5;
  nuevaDescripcion = '';
  enviandoRec = false;

  get estaLogueado() { return this.auth.estaLogueado(); }
  get usuario() { return this.auth.currentUser$.value; }

  constructor(
    private route: ActivatedRoute,
    private places: PlacesService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarTodo(id);
  }

  cargarTodo(id: number) {
    // carga lugar, comentarios y recomendaciones al mismo tiempo
    this.places.getById(id).subscribe({ next: p => { this.place = p; this.cargando = false; } });
    this.places.getComments(id).subscribe({ next: c => this.comentarios = c });
    this.places.getRecommendations(id).subscribe({ next: r => this.recomendaciones = r });

    if (this.auth.estaLogueado()) {
      this.places.getMyLikes().subscribe({
        next: (likes) => { this.liked = likes.some(l => l.placeProductId === id); }
      });
    }
  }

  onToggleLike() {
    if (!this.place || !this.estaLogueado) return;
    this.places.toggleLike(this.place.id, this.liked).subscribe({
      next: () => { this.liked = !this.liked; }
    });
  }

  onEnviarComentario() {
    if (!this.place || !this.nuevoComentario.trim()) return;
    this.enviandoComentario = true;
    this.places.addComment(this.place.id, this.nuevoComentario).subscribe({
      next: () => {
        this.nuevoComentario = '';
        this.enviandoComentario = false;
        // recarga comentarios para mostrar el nuevo
        this.places.getComments(this.place!.id).subscribe({ next: c => this.comentarios = c });
      },
      error: () => { this.enviandoComentario = false; }
    });
  }

  onEnviarRecomendacion() {
    if (!this.place) return;
    this.enviandoRec = true;
    this.places.addRecommendation(this.place.id, this.nuevoPuntaje, this.nuevaDescripcion).subscribe({
      next: () => {
        this.nuevaDescripcion = '';
        this.enviandoRec = false;
        // recarga lugar (por el average_rating actualizado) y recomendaciones
        this.places.getById(this.place!.id).subscribe({ next: p => this.place = p });
        this.places.getRecommendations(this.place!.id).subscribe({ next: r => this.recomendaciones = r });
      },
      error: () => { this.enviandoRec = false; }
    });
  }

  get estrellas(): boolean[] {
    const r = Math.round(this.place?.average_rating ?? 0);
    return Array.from({ length: 5 }, (_, i) => i < r);
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80';
  }

  puntajeArray(n: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < n);
  }
}
