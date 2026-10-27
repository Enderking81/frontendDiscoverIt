import {
  AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, ViewChild, inject
} from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Place } from '../../core/models';

const ROSARIO_CENTER: L.LatLngExpression = [-32.9468, -60.6393];

// los datos se insertan como HTML en el popup: se escapan para evitar inyección de código
const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  standalone: true
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() places: Place[] = [];
  @Input() height?: number; // alto opcional en px (por defecto lo define el CSS)
  @ViewChild('mapEl') mapEl!: ElementRef<HTMLDivElement>;

  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private map?: L.Map;
  private markers = L.layerGroup();
  private resizeObserver?: ResizeObserver;

  get placesWithCoordinates(): Place[] {
    return this.places.filter((p) => p.latitude != null && p.longitude != null);
  }

  ngAfterViewInit() {
    // Leaflet escucha eventos del mouse todo el tiempo: corre fuera de Angular para no disparar detección de cambios
    this.zone.runOutsideAngular(() => this.initMap());
    this.renderMarkers();
  }

  ngOnChanges() {
    if (this.map) this.renderMarkers();
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  private initMap() {
    const element = this.mapEl.nativeElement;
    // sin vista inicial: renderMarkers la define, así no se piden tiles de un zoom que se descarta enseguida
    this.map = L.map(element, { scrollWheelZoom: false });

    // OpenStreetMap no requiere API key (los tiles de CARTO dejaron de funcionar sin una)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(this.map);

    this.markers.addTo(this.map);

    // si el contenedor cambia de tamaño (rotar el celular, abrir el sidebar) Leaflet tiene que recalcular
    this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
    this.resizeObserver.observe(element);

    // el link del popup navega con el router de Angular en vez de recargar toda la página
    element.addEventListener('click', (event) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-place-id]');
      if (!link) return;
      event.preventDefault();
      this.zone.run(() => this.router.navigate(['/places', link.dataset['placeId']]));
    });
  }

  private renderMarkers() {
    if (!this.map) return;
    this.markers.clearLayers();

    const places = this.placesWithCoordinates;
    for (const place of places) {
      L.marker([place.latitude!, place.longitude!], { icon: this.pinIcon(), title: place.name, alt: place.name })
        .bindPopup(this.popupHtml(place), { maxWidth: 220, className: 'di-popup-wrap' })
        .addTo(this.markers);
    }

    // encuadra todos los lugares; con uno solo (página de detalle) se centra en él
    if (places.length === 1) {
      this.map.setView([places[0].latitude!, places[0].longitude!], 16);
    } else if (places.length > 1) {
      const bounds = L.latLngBounds(places.map((p) => [p.latitude!, p.longitude!] as L.LatLngTuple));
      this.map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
    } else {
      this.map.setView(ROSARIO_CENTER, 13);
    }
  }

  private popupHtml(place: Place): string {
    const image = place.image ? `<img src="${escapeHtml(place.image.replace('w=1600', 'w=440'))}" alt="" />` : '';
    const category = place.Category ? `<span class="di-popup-cat">${escapeHtml(place.Category.name)}</span>` : '';
    return `
      <div class="di-popup">
        ${image}
        <div class="di-popup-body">
          <h4>${escapeHtml(place.name)}</h4>
          ${category}
          <a href="/places/${place.id}" data-place-id="${place.id}" class="di-popup-link">Ver detalle →</a>
        </div>
      </div>`;
  }

  private pinIcon() {
    return L.divIcon({
      className: '',
      html: `<div class="di-pin"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -40]
    });
  }
}
