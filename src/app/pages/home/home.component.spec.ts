import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { environment } from '../../../environments/environment';
import { Category, Place } from '../../core/models';

const CATEGORIES: Category[] = [
  { id: 1, name: 'Bares', description: null },
  { id: 2, name: 'Museos', description: null }
];
const place = (id: number, name: string, categoryId: number): Place => ({
  id, name, categoryId, description: null, location: 'Rosario', image: null,
  average_rating: null, latitude: null, longitude: null
});

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let http: HttpTestingController;
  const placesUrl = `${environment.apiUrl}/places`;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(HomeComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(`${environment.apiUrl}/categories`).flush(CATEGORIES);
  });

  afterEach(() => http.verify());

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  it('muestra las categorías de la API como filtros, con "Todos" primero', () => {
    http.expectOne(placesUrl).flush([]);
    fixture.detectChanges();
    const pills = [...fixture.nativeElement.querySelectorAll('.pill')].map((p: Element) => p.textContent?.trim());
    expect(pills.slice(0, 3)).toEqual(['Todos', 'Bares', 'Museos']);
  });

  it('muestra las cards de los lugares que devuelve el backend', () => {
    http.expectOne(placesUrl).flush([place(1, 'Bar El Cairo', 1), place(2, 'Museo Castagnino', 2)]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-place-card').length).toBe(2);
    expect(text()).toContain('Bar El Cairo');
  });

  it('al elegir una categoría pide al backend solo esa categoría', () => {
    http.expectOne(placesUrl).flush([]);
    fixture.componentInstance.selectCategory(2);

    const req = http.expectOne((r) => r.url === placesUrl);
    expect(req.request.params.get('categoryId')).toBe('2');
    req.flush([place(2, 'Museo Castagnino', 2)]);
  });

  it('la búsqueda espera a que el usuario deje de escribir (debounce)', fakeAsync(() => {
    http.expectOne(placesUrl).flush([]);
    const input = fixture.nativeElement.querySelector('.search-input') as HTMLInputElement;

    for (const value of ['c', 'ca', 'cai']) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      tick(100);
    }
    http.expectNone((r) => r.url === placesUrl); // todavía no pasaron 300ms desde la última tecla
    tick(300);

    const req = http.expectOne((r) => r.url === placesUrl);
    expect(req.request.params.get('search')).toBe('cai');
    req.flush([]);
  }));

  it('sin resultados muestra el estado vacío con un botón para limpiar filtros', () => {
    http.expectOne(placesUrl).flush([]);
    fixture.detectChanges();
    expect(text()).toContain('No encontramos lugares con ese filtro.');
    expect(text()).toContain('Ver todos');
  });

  it('un invitado que toca el corazón va al login en vez de guardar el favorito', () => {
    http.expectOne(placesUrl).flush([place(1, 'Bar El Cairo', 1)]);
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.componentInstance.onToggleFavorite(place(1, 'Bar El Cairo', 1));

    expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/' } });
    http.expectNone(`${environment.apiUrl}/favorites/1`);
  });
});
