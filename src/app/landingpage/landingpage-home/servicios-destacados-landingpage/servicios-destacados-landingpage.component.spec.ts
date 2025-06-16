import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosDestacadosLandingpageComponent } from './servicios-destacados-landingpage.component';

describe('ServiciosDestacadosLandingpageComponent', () => {
  let component: ServiciosDestacadosLandingpageComponent;
  let fixture: ComponentFixture<ServiciosDestacadosLandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosDestacadosLandingpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosDestacadosLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
