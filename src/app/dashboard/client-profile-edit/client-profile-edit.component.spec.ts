import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProfileEditComponent } from './client-profile-edit.component';

describe('ClientProfileEditComponent', () => {
  let component: ClientProfileEditComponent;
  let fixture: ComponentFixture<ClientProfileEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProfileEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
