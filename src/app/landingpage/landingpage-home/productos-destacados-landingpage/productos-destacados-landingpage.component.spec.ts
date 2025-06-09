import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosDestacadosLandingpageComponent } from './productos-destacados-landingpage.component';

describe('ProductosDestacadosLandingpageComponent', () => {
  let component: ProductosDestacadosLandingpageComponent;
  let fixture: ComponentFixture<ProductosDestacadosLandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosDestacadosLandingpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosDestacadosLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
