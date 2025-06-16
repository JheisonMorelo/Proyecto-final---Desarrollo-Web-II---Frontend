// src/app/pages/home/components/products-featured/products-featured.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor, *ngIf
import { RouterModule } from '@angular/router'; // Para routerLink
import { ProductoService } from '../../../services/Producto/producto-service.service'; // Solo importamos el servicio, no la interfaz ahora

// Interfaz para los datos de un producto, tal como se espera del backend.
// Incluye el atributo accesorio 'full_image_url' que viene del modelo Laravel.
export interface Producto {
  codigo: string; // Tu 'id' ahora es 'codigo' según tu DB y controladores
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  urlImage: string | null; // Ruta relativa que Laravel guarda
  full_image_url?: string; // Atributo accesorio generado por Laravel
  // Si tienes una 'category' en tu DB que recibas del backend, agrégala aquí.
  // category?: string; 
}

@Component({
  selector: 'app-productos-destacados-landingpage',
  imports: [CommonModule, RouterModule],
  templateUrl: './productos-destacados-landingpage.component.html',
  styleUrl: './productos-destacados-landingpage.component.css',
})
export class ProductosDestacadosLandingpageComponent implements OnInit {
  products: Producto[] = []; // Inicializamos como un array vacío

  // Define los códigos de los productos que quieres mostrar como destacados.
  // ¡Estos códigos deben existir en tu base de datos de Laravel!
  private codigosProductosDestacados: string[] = [
    'PROD-001', // Ejemplo: Serum de Vitamina C Pura
    'PROD-002', // Ejemplo: Crema Hidratante Facial con Ácido Hialurónico
    'PROD-003', // Ejemplo: Exfoliante Corporal con Sales Marinas (asegúrate de que este exista si lo usas)
    // Añade aquí los códigos de los productos que quieras destacar.
  ];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  private loadFeaturedProducts(): void {
    this.codigosProductosDestacados.forEach((codigo) => {
      this.productoService.getProductoByCodigo(codigo).subscribe({
        next: (data: any) => {
          // Asigna la propiedad 'category' si tu backend la devuelve y la necesitas aquí.
          // Si no la devuelves, puedes dejarla fuera o asignarle un valor por defecto.
          // producto.category = 'Belleza';
          this.products.push(data.data);
        },
        error: (error) => {
          console.error(
            `Error al cargar el producto con código ${codigo}:`,
            error
          );
          // Puedes manejar el error aquí (ej. mostrar un mensaje al usuario, un placeholder)
        },
      });
    });
  }

  // Función para formatear el precio a moneda colombiana
  formatPrice(price: number): string {
    return price.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
    });
  }
}