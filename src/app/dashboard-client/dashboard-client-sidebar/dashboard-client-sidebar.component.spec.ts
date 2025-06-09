import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientSidebarComponent } from './dashboard-client-sidebar.component';

describe('DashboardClientSidebarComponent', () => {
  let component: DashboardClientSidebarComponent;
  let fixture: ComponentFixture<DashboardClientSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClientSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClientSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
