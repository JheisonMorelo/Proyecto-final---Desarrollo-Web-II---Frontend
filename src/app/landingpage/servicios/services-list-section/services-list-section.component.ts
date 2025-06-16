import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor
import { RouterModule } from '@angular/router'; // Necesario para routerLink
import { ServicioService} from '../../../services/Servicio/servicio-service.service'; // Importa el servicio y la interfaz Servicio
import { Servicio } from '../../../services/Cita/cita-service.service'; // Importa la interfaz Servicio


@Component({
  selector: 'app-services-list-section',
  standalone: true, // Asumimos que es un componente standalone
  imports: [CommonModule, RouterModule], // Añadir RouterModule aquí si usas routerLink
  templateUrl: './services-list-section.component.html',
  styleUrls: ['./services-list-section.component.css']
})
export class ServicesListSectionComponent implements OnInit {

  // services ahora será un array de la interfaz Servicio importada del backend
  services: Servicio[] = []; 
  loading: boolean = true; // Para mostrar un indicador de carga
  error: string | null = null; // Para mostrar mensajes de error

  constructor(private servicioService: ServicioService) { } // Inyecta el ServicioService

  ngOnInit(): void {
    this.loadAllServices(); // Carga todos los servicios al inicializar el componente
  }

  private loadAllServices(): void {
    this.loading = true; // Inicia el estado de carga
    this.error = null;   // Limpia errores anteriores

    this.servicioService.getAllServicios().subscribe({
      next: (data: any) => { // El backend devuelve un objeto con 'data' y 'message'
        this.services = data.data || []; // Accede al array de servicios dentro de la propiedad 'data'
        this.loading = false; // Finaliza el estado de carga
      },
      error: (err) => {
        console.error('Error al cargar todos los servicios:', err);
        this.error = 'No se pudieron cargar los servicios. Por favor, intenta de nuevo más tarde.';
        this.loading = false; // Finaliza el estado de carga con error
      }
    });
  }

  // Función para formatear el precio a moneda colombiana, similar a la que ya tienes en productos
  formatPrice(price: number | string): string {
    // Si el precio viene como string (ej. "Desde $120.000"), lo usamos directamente.
    // Si viene como number, lo formateamos.
    if (typeof price === 'string') {
      return price;
    }
    if (price === undefined || price === null) {
      return 'N/A'; 
    }
    return price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  }
}