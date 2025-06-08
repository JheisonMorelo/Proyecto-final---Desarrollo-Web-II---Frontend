import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesHeroSectionComponent } from './services-hero-section.component';

describe('ServicesHeroSectionComponent', () => {
  let component: ServicesHeroSectionComponent;
  let fixture: ComponentFixture<ServicesHeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesHeroSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesHeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
