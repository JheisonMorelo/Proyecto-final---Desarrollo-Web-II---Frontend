import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoginComponent } from './personal-login.component';

describe('PersonalLoginComponent', () => {
  let component: PersonalLoginComponent;
  let fixture: ComponentFixture<PersonalLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
