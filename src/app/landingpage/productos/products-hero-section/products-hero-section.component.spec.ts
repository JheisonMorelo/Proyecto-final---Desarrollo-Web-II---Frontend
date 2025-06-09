import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsHeroSectionComponent } from './products-hero-section.component';

describe('ProductsHeroSectionComponent', () => {
  let component: ProductsHeroSectionComponent;
  let fixture: ComponentFixture<ProductsHeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsHeroSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsHeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
