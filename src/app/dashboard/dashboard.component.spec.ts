import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientPageComponent } from './dashboard.component';

describe('DashboardClientPageComponent', () => {
  let component: DashboardClientPageComponent;
  let fixture: ComponentFixture<DashboardClientPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClientPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClientPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
