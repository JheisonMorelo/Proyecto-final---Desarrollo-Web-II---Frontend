import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRecepcionistaComponent } from './register-recepcionista.component';

describe('RegisterRecepcionistaComponent', () => {
  let component: RegisterRecepcionistaComponent;
  let fixture: ComponentFixture<RegisterRecepcionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterRecepcionistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterRecepcionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
