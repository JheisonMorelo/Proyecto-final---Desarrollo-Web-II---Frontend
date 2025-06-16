import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterLandingpageComponent } from './footer.component';

describe('FooterLandingpageComponent', () => {
  let component: FooterLandingpageComponent;
  let fixture: ComponentFixture<FooterLandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterLandingpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
