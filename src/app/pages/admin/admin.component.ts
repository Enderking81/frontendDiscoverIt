import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminStats } from '../../core/services/admin.service';
import { Place } from '../../core/services/places.service';
import { ToastService } from '../../core/services/toast.service';

const CATEGORIAS = [
  { id: 1, name: 'Restaurantes' }, { id: 2, name: 'Museos' },
  { id: 3, name: 'Bares' },        { id: 4, name: 'Parques' },
  { id: 5, name: 'Hoteles' },      { id: 6, name: 'Cafeterías' },
  { id: 7, name: 'Tiendas' },      { id: 8, name: 'Entretenimiento' },
];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminComponent implements OnInit {
  stats: AdminStats | null = null;
  lugares: Place[] = [];
  filtrados: Place[] = [];
  busqueda = '';
  cargando = true;

  editandoId: number | null = null;
  editForm: Partial<Place> = {};
  guardando = false;
  eliminandoId: number | null = null;

  readonly categorias = CATEGORIAS;

  readonly statCards = [
    { key: 'users',           label: 'Usuarios',          icon: 'users',   color: '#5B6EBF' },
    { key: 'places',          label: 'Lugares',           icon: 'map-pin', color: '#34C759' },
    { key: 'recommendations', label: 'Recomendaciones',   icon: 'star',    color: '#FF9F0A' },
    { key: 'comments',        label: 'Comentarios',       icon: 'chat',    color: '#FF453A' },
  ];

  constructor(private admin: AdminService, private toast: ToastService) {}

  ngOnInit() {
    this.admin.getStats().subscribe({ next: s => this.stats = s });
    this.admin.getPlaces().subscribe({
      next: (data) => { this.lugares = data; this.aplicarFiltro(); this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  statValue(key: string): string {
    if (!this.stats) return '—';
    return String((this.stats as any)[key] ?? '—');
  }

  onBusqueda(e: Event) {
    this.busqueda = (e.target as HTMLInputElement).value.toLowerCase();
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    this.filtrados = this.busqueda
      ? this.lugares.filter(p => p.name.toLowerCase().includes(this.busqueda))
      : [...this.lugares];
  }

  abrirEdicion(place: Place) {
    this.editandoId = place.id;
    this.editForm = { name: place.name, description: place.description, location: place.location, categoryId: place.categoryId, image: place.image };
  }

  cancelarEdicion() { this.editandoId = null; this.editForm = {}; }

  guardar(id: number) {
    this.guardando = true;
    this.admin.updatePlace(id, this.editForm).subscribe({
      next: (updated) => {
        const idx = this.lugares.findIndex(p => p.id === id);
        if (idx !== -1) this.lugares[idx] = { ...this.lugares[idx], ...updated };
        this.aplicarFiltro();
        this.editandoId = null;
        this.editForm   = {};
        this.guardando  = false;
        this.toast.show('Lugar actualizado', 'success');
      },
      error: () => { this.guardando = false; }
    });
  }

  confirmarEliminar(id: number) { this.eliminandoId = id; }
  cancelarEliminar()           { this.eliminandoId = null; }

  eliminar(id: number) {
    this.admin.deletePlace(id).subscribe({
      next: () => {
        this.lugares = this.lugares.filter(p => p.id !== id);
        this.aplicarFiltro();
        this.eliminandoId = null;
        this.toast.show('Lugar eliminado', 'success');
        if (this.stats) this.stats = { ...this.stats, places: this.stats.places - 1 };
      }
    });
  }

  getCatName(id: number) { return this.categorias.find(c => c.id === id)?.name ?? '—'; }
}
