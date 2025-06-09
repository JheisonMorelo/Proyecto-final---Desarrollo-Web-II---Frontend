import { Component } from '@angular/core';
import { ProductsHeroSectionComponent } from './products-hero-section/products-hero-section.component';
import { ProductosListSectionComponent } from './productos-list-section/productos-list-section.component';

@Component({
  selector: 'app-productos',
  imports: [ProductsHeroSectionComponent, ProductosListSectionComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

}
