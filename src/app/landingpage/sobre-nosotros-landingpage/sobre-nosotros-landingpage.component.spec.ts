import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreNosotrosLandingpageComponent } from './sobre-nosotros-landingpage.component';

describe('SobreNosotrosLandingpageComponent', () => {
  let component: SobreNosotrosLandingpageComponent;
  let fixture: ComponentFixture<SobreNosotrosLandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreNosotrosLandingpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreNosotrosLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
