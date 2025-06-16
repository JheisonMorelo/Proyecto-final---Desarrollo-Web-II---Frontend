import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorQueElegirnosSectionComponent } from './por-que-elegirnos-section.component';

describe('PorQueElegirnosSectionComponent', () => {
  let component: PorQueElegirnosSectionComponent;
  let fixture: ComponentFixture<PorQueElegirnosSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PorQueElegirnosSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PorQueElegirnosSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
