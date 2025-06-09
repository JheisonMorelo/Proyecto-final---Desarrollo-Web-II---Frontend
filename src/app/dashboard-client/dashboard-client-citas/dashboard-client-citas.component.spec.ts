import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientCitasComponent } from './dashboard-client-citas.component';

describe('DashboardClientCitasComponent', () => {
  let component: DashboardClientCitasComponent;
  let fixture: ComponentFixture<DashboardClientCitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClientCitasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClientCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
