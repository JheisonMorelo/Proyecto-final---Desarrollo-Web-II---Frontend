import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientHomeComponent } from './dashboard-home.component';

describe('DashboardClientHomeComponent', () => {
  let component: DashboardClientHomeComponent;
  let fixture: ComponentFixture<DashboardClientHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClientHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClientHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
