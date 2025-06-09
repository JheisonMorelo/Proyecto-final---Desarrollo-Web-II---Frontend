import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientEmpresaInfoComponent } from './dashboard-client-empresa-info.component';

describe('DashboardClientEmpresaInfoComponent', () => {
  let component: DashboardClientEmpresaInfoComponent;
  let fixture: ComponentFixture<DashboardClientEmpresaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClientEmpresaInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClientEmpresaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
