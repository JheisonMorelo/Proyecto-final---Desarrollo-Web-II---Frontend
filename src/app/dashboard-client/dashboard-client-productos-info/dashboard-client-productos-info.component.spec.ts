import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientProductosInfoComponent } from './dashboard-client-productos-info.component';

describe('DashboardClientProductosInfoComponent', () => {
  let component: DashboardClientProductosInfoComponent;
  let fixture: ComponentFixture<DashboardClientProductosInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClientProductosInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClientProductosInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
