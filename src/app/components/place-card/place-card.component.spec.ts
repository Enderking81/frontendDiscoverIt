import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PlaceCardComponent } from './place-card.component';
import { Place } from '../../core/models';

const PLACE: Place = {
  id: 1,
  name: 'Monumento a la Bandera',
  description: 'Monumento nacional',
  location: 'Av. Belgrano, Rosario',
  categoryId: 2,
  image: null,
  average_rating: 3.6,
  latitude: null,
  longitude: null,
  Category: { id: 2, name: 'Museos' }
};

describe('PlaceCardComponent', () => {
  let fixture: ComponentFixture<PlaceCardComponent>;
  let component: PlaceCardComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceCardComponent);
    component = fixture.componentInstance;
    component.place = PLACE;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('muestra el nombre y la categoría del lugar', () => {
    expect(element.textContent).toContain('Monumento a la Bandera');
    expect(element.textContent).toContain('Museos');
  });

  it('redondea el rating para pintar las estrellas', () => {
    // 3.6 se redondea a 4 estrellas llenas
    expect(component.stars).toEqual([true, true, true, true, false]);
  });

  it('emite toggleLike con el lugar al tocar el corazón, sin navegar al detalle', () => {
    let emitted: Place | undefined;
    component.toggleLike.subscribe((place) => (emitted = place));
    const event = new MouseEvent('click', { cancelable: true });

    component.onToggleLike(event);

    expect(emitted).toEqual(PLACE);
    expect(event.defaultPrevented).toBeTrue();
  });
});
