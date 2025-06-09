import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientTeamInfoComponent } from './dashboard-client-team-info.component';

describe('DashboardClientTeamInfoComponent', () => {
  let component: DashboardClientTeamInfoComponent;
  let fixture: ComponentFixture<DashboardClientTeamInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClientTeamInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClientTeamInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
