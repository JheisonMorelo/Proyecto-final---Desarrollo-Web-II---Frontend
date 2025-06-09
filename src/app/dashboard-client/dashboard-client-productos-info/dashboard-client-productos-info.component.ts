// src/app/pages/dashboard/pages/products-info/products-info.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor
import { RouterModule } from '@angular/router'; // Para routerLink

// Define la interfaz para un producto si no la tienes ya en otro archivo compartido
// Si ya la tienes en un archivo de modelos compartido (ej. 'src/app/shared/models/product.model.ts'), impórtala de allí.
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
  selector: 'app-products-info',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard-client-productos-info.component.html',
  styleUrls: ['./dashboard-client-productos-info.component.css']
})
export class DashboardClientProductsInfoComponent implements OnInit {
  // Define los datos de los productos directamente aquí
  products: Product[] = [
    {
      id: 'PROD-001',
      name: 'Serum de Vitamina C Pura',
      description: 'Potente antioxidante que ilumina la piel, reduce manchas y mejora la producción de colágeno.',
      price: 120000,
      imageUrl: 'assets/images/serum_vitc.jpg', // Asegúrate de tener estas imágenes
      category: 'Facial',
      stock: 50
    },
    {
      id: 'PROD-002',
      name: 'Crema Hidratante Facial con Ácido Hialurónico',
      description: 'Hidratación profunda y duradera, dejando la piel suave y elástica. Ideal para todo tipo de piel.',
      price: 85000,
      imageUrl: 'assets/images/hidratante_hialuronico.jpg',
      category: 'Facial',
      stock: 75
    },
    {
      id: 'PROD-003',
      name: 'Protector Solar Facial SPF 50+ Invisible',
      description: 'Protección solar de amplio espectro, ligera y no grasa. Perfecta para uso diario.',
      price: 75000,
      imageUrl: 'assets/images/protector_solar.jpg',
      category: 'Facial',
      stock: 100
    },
    {
      id: 'PROD-004',
      name: 'Exfoliante Corporal con Sales Marinas',
      description: 'Elimina células muertas, suaviza y revitaliza la piel, dejándola lista para tratamientos posteriores.',
      price: 60000,
      imageUrl: 'assets/images/exfoliante_corporal.jpg',
      category: 'Corporal',
      stock: 40
    },
    {
      id: 'PROD-005',
      name: 'Aceite de Masaje Relajante con Lavanda',
      description: 'Formulado con aceites esenciales para una experiencia de masaje que calma cuerpo y mente.',
      price: 90000,
      imageUrl: 'assets/images/aceite_masaje.jpg',
      category: 'Bienestar',
      stock: 30
    },
    {
      id: 'PROD-006',
      name: 'Mascarilla Capilar Reparadora con Keratina',
      description: 'Nutre y repara el cabello dañado, devolviéndole brillo y fortaleza.',
      price: 55000,
      imageUrl: 'assets/images/mascarilla_capilar.jpg',
      category: 'Capilar',
      stock: 60
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // No necesitamos llamar a ningún servicio aquí, los datos ya están en el componente
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  }
}