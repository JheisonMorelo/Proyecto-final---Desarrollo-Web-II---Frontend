import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor, *ngIf
import { RouterModule } from '@angular/router'; // Para routerLink
import { ProductoService } from '../../../services/Producto/producto-service.service';
import { Producto } from '../../../services/Cita/cita-service.service';

@Component({
  selector: 'app-productos-list-section', // Nuevo selector más general
  standalone: true, 
  imports: [
    CommonModule,  
    RouterModule   
  ],
  templateUrl: './productos-list-section.component.html', // Adaptar el nombre del template
  styleUrls: ['./productos-list-section.component.css']  // Adaptar el nombre del CSS
})
export class ProductosListSectionComponent implements OnInit { // Nuevo nombre de clase para el componente

  products: Producto[] = []; // Array para almacenar todos los productos
  loading: boolean = true;    // Indicador de carga
  error: string | null = null; // Para mostrar mensajes de error

  constructor(private productoService: ProductoService) { } // Inyecta el ProductoService

  ngOnInit(): void {
    this.loadAllProducts(); // Llama a la función para cargar todos los productos al inicializar
  }

  private loadAllProducts(): void {
    this.loading = true; // Inicia el estado de carga
    this.error = null;   // Limpia errores anteriores

    this.productoService.getAllProductos().subscribe({
      next: (response: any) => { // El backend devuelve un objeto con 'data' y 'message'
        this.products = response.data || []; // Accede al array de productos dentro de la propiedad 'data'
        this.loading = false; // Finaliza el estado de carga
      },
      error: (err) => {
        console.error('Error al cargar todos los productos:', err);
        this.error = 'No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.';
        this.loading = false; // Finaliza el estado de carga con error
      }
    });
  }

  // Función para formatear el precio a moneda colombiana
  formatPrice(price: number): string {
    if (price === undefined || price === null) {
      return 'N/A'; // O cualquier valor predeterminado
    }
    return price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  }
}