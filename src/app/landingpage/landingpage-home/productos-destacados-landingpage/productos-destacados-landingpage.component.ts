// src/app/pages/home/components/products-featured/products-featured.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor, *ngIf
import { RouterModule } from '@angular/router'; // Para routerLink

// Define la interfaz para un producto si no la tienes ya en un archivo compartido
// Si ya la tienes en un archivo de modelos compartido (ej. 'src/app/shared/models/data.models.ts'), impórtala de allí.
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

@Component({
  selector: 'app-productos-destacados-landingpage', // Selector HTML para usar este componente
  standalone: true, // ¡Es un componente standalone!
  imports: [
    CommonModule,  // Necesario para directivas estructurales (*ngFor, *ngIf)
    RouterModule   // Necesario si usas routerLink en el HTML
  ],
  templateUrl: './productos-destacados-landingpage.component.html',
  styleUrls: ['./productos-destacados-landingpage.component.css']
})
export class ProductosDestacadosLandingpageComponent implements OnInit {

  // Array de productos destacados con sus datos
  products: Product[] = [
    {
      id: 'PROD-001',
      name: 'Serum de Vitamina C Pura',
      description: 'Potente antioxidante que ilumina la piel y mejora el tono. Ideal para una piel radiante.',
      price: 120000, // Precio en COP
      imageUrl: 'assets/images/serum_vitc.jpg', // Ruta a tu imagen
      category: 'Facial',
      stock: 50
    },
    {
      id: 'PROD-002',
      name: 'Crema Hidratante Facial con Ácido Hialurónico',
      description: 'Hidratación profunda que deja la piel suave, flexible y con aspecto saludable.',
      price: 85000,
      imageUrl: 'assets/images/hidratante_hialuronico.jpg',
      category: 'Facial',
      stock: 75
    },
    {
      id: 'PROD-004', // Usamos el ID de ejemplo que tenías
      name: 'Exfoliante Corporal con Sales Marinas',
      description: 'Renueva tu piel eliminando impurezas y células muertas, dejando una sensación sedosa.',
      price: 60000,
      imageUrl: 'assets/images/exfoliante_corporal.jpg',
      category: 'Corporal',
      stock: 40
    }
    // Puedes añadir más productos destacados si lo deseas
  ];

  constructor() { }

  ngOnInit(): void {
    // Aquí no se necesita lógica de inicialización compleja,
    // ya que los datos están definidos directamente.
  }

  // Función para formatear el precio a moneda colombiana
  formatPrice(price: number): string {
    return price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  }
}