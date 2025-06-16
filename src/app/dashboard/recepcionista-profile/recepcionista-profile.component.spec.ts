import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionistaProfileComponent } from './recepcionista-profile.component';

describe('RecepcionistaProfileComponent', () => {
  let component: RecepcionistaProfileComponent;
  let fixture: ComponentFixture<RecepcionistaProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionistaProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecepcionistaProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
