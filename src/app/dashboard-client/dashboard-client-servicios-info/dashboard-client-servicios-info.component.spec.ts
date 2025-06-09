import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientServiciosInfoComponent } from './dashboard-client-servicios-info.component';

describe('DashboardClientServiciosInfoComponent', () => {
  let component: DashboardClientServiciosInfoComponent;
  let fixture: ComponentFixture<DashboardClientServiciosInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClientServiciosInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClientServiciosInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
