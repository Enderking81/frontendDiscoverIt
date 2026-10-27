import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { PlaceService } from '../../core/services/place.service';
import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../core/services/toast.service';
import { AdminStats, Category, Place, PlaceInput } from '../../core/models';

type AdminTab = 'places' | 'categories';
type EditTarget = number | 'new' | null; // id en edición, 'new' para un alta, null si no se edita nada

interface PlaceForm {
  name: string;
  categoryId: number | null;
  location: string;
  description: string;
  image: string;
  latitude: number | null;
  longitude: number | null;
}

const emptyPlaceForm = (): PlaceForm => ({
  name: '', categoryId: null, location: '', description: '', image: '', latitude: null, longitude: null
});

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  standalone: true,
  imports: [FormsModule, DecimalPipe, NgTemplateOutlet]
})
export class AdminComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly placeService = inject(PlaceService);
  private readonly categoryService = inject(CategoryService);
  private readonly toast = inject(ToastService);

  tab: AdminTab = 'places';
  stats: AdminStats | null = null;
  places: Place[] = [];
  categories: Category[] = [];
  search = '';
  loading = true;
  saving = false;

  editingPlaceId: EditTarget = null;
  placeForm: PlaceForm = emptyPlaceForm();
  deletingPlaceId: number | null = null;

  editingCategoryId: EditTarget = null;
  categoryForm = { name: '', description: '' };
  deletingCategoryId: number | null = null;

  readonly statCards: Array<{ key: keyof AdminStats; label: string; icon: string; color: string }> = [
    { key: 'users',           label: 'Usuarios',        icon: 'users',   color: '#5B6EBF' },
    { key: 'places',          label: 'Lugares',         icon: 'map-pin', color: '#34C759' },
    { key: 'categories',      label: 'Categorías',      icon: 'tag',     color: '#AF52DE' },
    { key: 'recommendations', label: 'Recomendaciones', icon: 'star',    color: '#FF9F0A' }
  ];

  get filteredPlaces(): Place[] {
    const term = this.search.trim().toLowerCase();
    return term ? this.places.filter((p) => p.name.toLowerCase().includes(term)) : this.places;
  }

  ngOnInit() {
    this.loadStats();
    this.loadCategories();
    this.placeService.list().subscribe({
      next: (places) => {
        this.places = places;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  categoryName(id: number | null): string {
    return this.categories.find((c) => c.id === id)?.name ?? '—';
  }

  // usa una versión chica de la imagen para la tabla
  thumbnail(url: string | null): string {
    return (url ?? '').replace('w=1600', 'w=60').replace('q=90', 'q=50');
  }

  // ---------- lugares ----------

  newPlace() {
    this.placeForm = emptyPlaceForm();
    this.editingPlaceId = 'new';
  }

  editPlace(place: Place) {
    this.placeForm = {
      name: place.name,
      categoryId: place.categoryId,
      location: place.location ?? '',
      description: place.description ?? '',
      image: place.image ?? '',
      latitude: place.latitude,
      longitude: place.longitude
    };
    this.editingPlaceId = place.id;
  }

  cancelPlace() {
    this.editingPlaceId = null;
  }

  savePlace() {
    const form = this.placeForm;
    if (!form.name.trim() || !form.categoryId) {
      this.toast.show('El nombre y la categoría son obligatorios', 'error');
      return;
    }

    const data: PlaceInput = {
      name: form.name.trim(),
      categoryId: Number(form.categoryId),
      location: form.location.trim() || null,
      description: form.description.trim() || null,
      image: form.image.trim() || null,
      latitude: form.latitude,
      longitude: form.longitude
    };
    const isNew = this.editingPlaceId === 'new';
    const request$ = isNew
      ? this.placeService.create(data)
      : this.placeService.update(this.editingPlaceId as number, data);

    this.saving = true;
    request$.subscribe({
      next: (saved) => {
        this.places = isNew ? [saved, ...this.places] : this.places.map((p) => (p.id === saved.id ? saved : p));
        this.editingPlaceId = null;
        this.saving = false;
        this.toast.show(isNew ? 'Lugar creado' : 'Lugar actualizado', 'success');
        if (isNew) this.loadStats();
      },
      error: () => (this.saving = false)
    });
  }

  deletePlace(id: number) {
    this.placeService.remove(id).subscribe(() => {
      this.places = this.places.filter((p) => p.id !== id);
      this.deletingPlaceId = null;
      this.toast.show('Lugar eliminado', 'success');
      this.loadStats();
    });
  }

  // ---------- categorías ----------

  newCategory() {
    this.categoryForm = { name: '', description: '' };
    this.editingCategoryId = 'new';
  }

  editCategory(category: Category) {
    this.categoryForm = { name: category.name, description: category.description ?? '' };
    this.editingCategoryId = category.id;
  }

  cancelCategory() {
    this.editingCategoryId = null;
  }

  saveCategory() {
    const name = this.categoryForm.name.trim();
    if (name.length < 2) {
      this.toast.show('El nombre de la categoría debe tener al menos 2 caracteres', 'error');
      return;
    }

    const data = { name, description: this.categoryForm.description.trim() || null };
    const isNew = this.editingCategoryId === 'new';
    const request$ = isNew
      ? this.categoryService.create(data)
      : this.categoryService.update(this.editingCategoryId as number, data);

    this.saving = true;
    request$.subscribe({
      next: () => {
        this.editingCategoryId = null;
        this.saving = false;
        this.toast.show(isNew ? 'Categoría creada' : 'Categoría actualizada', 'success');
        this.loadCategories();
        if (isNew) this.loadStats();
      },
      error: () => (this.saving = false)
    });
  }

  // el backend rechaza (409) borrar una categoría con lugares; el interceptor muestra el motivo
  deleteCategory(id: number) {
    this.categoryService.remove(id).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c.id !== id);
        this.toast.show('Categoría eliminada', 'success');
        this.loadStats();
      },
      complete: () => (this.deletingCategoryId = null),
      error: () => (this.deletingCategoryId = null)
    });
  }

  private loadStats() {
    this.adminService.getStats().subscribe((stats) => (this.stats = stats));
  }

  private loadCategories() {
    this.categoryService.list().subscribe((categories) => (this.categories = categories));
  }
}
