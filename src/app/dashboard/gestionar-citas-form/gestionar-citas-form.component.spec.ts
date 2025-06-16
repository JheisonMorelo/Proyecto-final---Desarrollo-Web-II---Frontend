import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarCitasFormComponent } from './gestionar-citas-form.component';

describe('GestionarCitasFormComponent', () => {
  let component: GestionarCitasFormComponent;
  let fixture: ComponentFixture<GestionarCitasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarCitasFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarCitasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
