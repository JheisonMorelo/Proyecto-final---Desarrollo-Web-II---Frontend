import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyLandingpageComponent } from './body-landingpage.component';

describe('BodyLandingpageComponent', () => {
  let component: BodyLandingpageComponent;
  let fixture: ComponentFixture<BodyLandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyLandingpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
