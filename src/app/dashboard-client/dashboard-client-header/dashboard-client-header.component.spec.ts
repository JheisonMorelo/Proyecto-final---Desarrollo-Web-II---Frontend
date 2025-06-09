import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientHeaderComponent } from './dashboard-client-header.component';

describe('DashboardClientHeaderComponent', () => {
  let component: DashboardClientHeaderComponent;
  let fixture: ComponentFixture<DashboardClientHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClientHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClientHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
