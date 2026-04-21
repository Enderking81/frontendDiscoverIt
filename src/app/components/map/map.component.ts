import { Component, Input, OnChanges, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Place } from '../../core/services/places.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  standalone: true,
  imports: []
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() places: Place[] = [];
  @ViewChild('mapEl') mapEl!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private markers: L.Marker[] = [];

  ngAfterViewInit() {
    this.initMap();
    this.renderMarkers();
  }

  ngOnChanges() {
    if (!this.map) return;
    this.clearMarkers();
    this.renderMarkers();
  }

  ngOnDestroy() {
    this.map?.remove();
    this.map = undefined;
  }

  private initMap() {
    this.map = L.map(this.mapEl.nativeElement, {
      center: [-32.9468, -60.6393], // centro de Rosario
      zoom: 14,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);
  }

  private pinIcon() {
    return L.divIcon({
      className: '',
      html: `<div class="di-pin"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -40]
    });
  }

  private renderMarkers() {
    if (!this.map) return;
    for (const p of this.places) {
      if (p.latitude == null || p.longitude == null) continue;

      const imgThumb = p.image.replace('w=1600', 'w=400').replace('q=90', 'q=70');
      const cat = p.Category?.name ?? '';
      const popup = `
        <div class="di-popup">
          <img src="${imgThumb}" alt="${p.name}" />
          <div class="di-popup-body">
            <h4>${p.name}</h4>
            ${cat ? `<span class="di-popup-cat">${cat}</span>` : ''}
            <a href="/places/${p.id}" class="di-popup-link">Ver detalle →</a>
          </div>
        </div>`;

      const marker = L.marker([p.latitude, p.longitude], { icon: this.pinIcon() });
      marker.bindPopup(popup, { maxWidth: 220, className: 'di-popup-wrap' });
      marker.addTo(this.map!);
      this.markers.push(marker);
    }
  }

  private clearMarkers() {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }
}
