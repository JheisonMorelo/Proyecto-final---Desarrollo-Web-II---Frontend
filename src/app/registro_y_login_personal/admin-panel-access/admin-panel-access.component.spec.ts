import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelAccessComponent } from './admin-panel-access.component';

describe('AdminPanelAccessComponent', () => {
  let component: AdminPanelAccessComponent;
  let fixture: ComponentFixture<AdminPanelAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPanelAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPanelAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
