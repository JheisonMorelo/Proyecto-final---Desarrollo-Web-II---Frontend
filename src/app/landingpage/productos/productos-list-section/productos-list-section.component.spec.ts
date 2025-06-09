import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosListSectionComponent } from './productos-list-section.component';

describe('ProductosListSectionComponent', () => {
  let component: ProductosListSectionComponent;
  let fixture: ComponentFixture<ProductosListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosListSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
