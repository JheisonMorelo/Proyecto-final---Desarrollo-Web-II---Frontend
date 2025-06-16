import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientPedidosComponent } from './dashboard-client-pedidos.component';

describe('DashboardClientPedidosComponent', () => {
  let component: DashboardClientPedidosComponent;
  let fixture: ComponentFixture<DashboardClientPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClientPedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClientPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
