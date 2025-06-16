import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAsistenteComponent } from './register-asistente.component';

describe('RegisterAsistenteComponent', () => {
  let component: RegisterAsistenteComponent;
  let fixture: ComponentFixture<RegisterAsistenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAsistenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAsistenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
