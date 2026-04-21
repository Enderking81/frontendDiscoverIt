import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, AuthUser, FullProfile } from '../../core/services/auth.service';
import { PlacesService, Place } from '../../core/services/places.service';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PlaceCardComponent]
})
export class ProfileComponent implements OnInit {
  usuario: AuthUser | null = null;
  perfil: FullProfile | null = null;
  cargando = true;

  // modo edición
  editando = false;
  editNickname = '';
  editBio = '';
  guardando = false;
  editError = '';
  editExito = false;

  // sección de favoritos
  favoritos: Place[] = [];
  likedIds = new Set<number>();
  cargandoFavoritos = true;

  constructor(private auth: AuthService, private places: PlacesService) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => this.usuario = u);
    this.cargarPerfil();
    this.cargarFavoritos();
  }

  cargarPerfil() {
    this.cargando = true;
    this.auth.getFullProfile().subscribe({
      next: (p) => { this.perfil = p; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  cargarFavoritos() {
    this.cargandoFavoritos = true;
    this.places.getMyLikes().subscribe({
      next: (likes: any[]) => {
        this.favoritos = likes.map(l => l.Place_Product).filter(Boolean);
        this.favoritos.forEach(p => this.likedIds.add(p.id));
        this.cargandoFavoritos = false;
      },
      error: () => { this.cargandoFavoritos = false; }
    });
  }

  get inicial() { return this.usuario?.nickname?.charAt(0).toUpperCase() ?? '?'; }

  get stats() {
    if (!this.perfil) return [
      { label: 'Recomendaciones', value: '—', icon: 'star' },
      { label: 'Comentarios',     value: '—', icon: 'chat' },
      { label: 'Favoritos',       value: '—', icon: 'heart' },
    ];
    return [
      { label: 'Recomendaciones', value: String(this.perfil.stats.recomendaciones), icon: 'star' },
      { label: 'Comentarios',     value: String(this.perfil.stats.comentarios),     icon: 'chat' },
      { label: 'Favoritos',       value: String(this.perfil.stats.likes),           icon: 'heart' },
    ];
  }

  abrirEdicion() {
    this.editNickname = this.usuario?.nickname ?? '';
    this.editBio      = this.perfil?.Profile?.bio ?? '';
    this.editando     = true;
    this.editError    = '';
    this.editExito    = false;
  }

  cancelarEdicion() { this.editando = false; }

  guardarPerfil() {
    if (!this.editNickname.trim()) { this.editError = 'El nombre de usuario no puede estar vacío'; return; }
    this.guardando = true;
    this.editError = '';

    this.auth.updateProfile({ nickname: this.editNickname.trim(), bio: this.editBio }).subscribe({
      next: () => {
        this.guardando = false;
        this.editando  = false;
        this.editExito = true;
        this.cargarPerfil();
        setTimeout(() => this.editExito = false, 3000);
      },
      error: (err) => {
        this.editError = err.error?.error || 'Error al guardar';
        this.guardando = false;
      }
    });
  }

  onToggleLike(place: Place) {
    // quitamos el favorito y lo removemos de la lista (UX optimista)
    this.favoritos = this.favoritos.filter(p => p.id !== place.id);
    this.likedIds.delete(place.id);
    this.places.toggleLike(place.id, true).subscribe();
  }
}
