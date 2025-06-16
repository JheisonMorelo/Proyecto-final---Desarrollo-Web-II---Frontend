import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroLandingpageComponent } from './hero-landingpage.component';

describe('HeroLandingpageComponent', () => {
  let component: HeroLandingpageComponent;
  let fixture: ComponentFixture<HeroLandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroLandingpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
