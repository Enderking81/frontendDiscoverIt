import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { ToastService } from '../../core/services/toast.service';
import { MyProfile, Place, ProfileInput, User } from '../../core/models';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';

interface ProfileForm {
  nickname: string;
  bio: string;
  location: string;
  birthdate: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, PlaceCardComponent]
})
export class ProfileComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  user: User | null = null;
  profile: MyProfile | null = null;
  loading = true;

  editing = false;
  saving = false;
  form: ProfileForm = { nickname: '', bio: '', location: '', birthdate: '' };

  confirmingDelete = false;
  deleting = false;

  favorites: Place[] = [];
  loadingFavorites = true;

  ngOnInit() {
    this.auth.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => (this.user = user));
    this.loadProfile();
    this.loadFavorites();
  }

  get initial(): string {
    return this.user?.nickname.charAt(0).toUpperCase() ?? '?';
  }

  get stats() {
    return [
      { label: 'Recomendaciones', value: this.profile?.stats.recommendations ?? '—' },
      { label: 'Favoritos',       value: this.profile?.stats.favorites ?? '—' }
    ];
  }

  loadProfile() {
    this.loading = true;
    this.userService.getMe().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  loadFavorites() {
    this.favoriteService.list().subscribe({
      next: (places) => {
        this.favorites = places;
        this.loadingFavorites = false;
      },
      error: () => (this.loadingFavorites = false)
    });
  }

  startEdit() {
    const data = this.profile?.Profile;
    this.form = {
      nickname: this.user?.nickname ?? '',
      bio: data?.bio ?? '',
      location: data?.location ?? '',
      birthdate: data?.birthdate ?? ''
    };
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
  }

  saveProfile() {
    const nickname = this.form.nickname.trim();
    if (nickname.length < 3) {
      this.toast.show('El nombre de usuario debe tener al menos 3 caracteres', 'error');
      return;
    }

    // los campos vacíos se mandan como null para poder borrarlos
    const data: ProfileInput = {
      nickname,
      bio: this.form.bio.trim() || null,
      location: this.form.location.trim() || null,
      birthdate: this.form.birthdate || null
    };

    this.saving = true;
    this.userService.updateMe(data).subscribe({
      next: () => {
        this.saving = false;
        this.editing = false;
        this.toast.show('Perfil actualizado', 'success');
        this.loadProfile();
      },
      error: () => (this.saving = false)
    });
  }

  deleteAccount() {
    this.deleting = true;
    this.userService.deleteMe().subscribe({
      next: () => {
        this.auth.clearSession();
        this.toast.show('Tu cuenta fue eliminada', 'info');
        this.router.navigate(['/']);
      },
      error: () => (this.deleting = false)
    });
  }

  onRemoveFavorite(place: Place) {
    this.favorites = this.favorites.filter((p) => p.id !== place.id);
    this.favoriteService.toggle(place.id, true).subscribe(() => this.loadProfile());
  }
}
