import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceprodCardsComponent } from './placeprod-cards.component';

describe('PlaceprodCardsComponent', () => {
  let component: PlaceprodCardsComponent;
  let fixture: ComponentFixture<PlaceprodCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceprodCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceprodCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
