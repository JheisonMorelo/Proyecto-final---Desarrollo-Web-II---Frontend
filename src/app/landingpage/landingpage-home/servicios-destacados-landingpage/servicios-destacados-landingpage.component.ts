import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServicioService } from '../../../services/Servicio/servicio-service.service'; // Solo importamos el servicio, no la interfaz ahora

// Interfaz para los datos de un servicio, tal como se espera del backend.
// Incluye el atributo accesorio 'full_image_url' que viene del modelo Laravel.
export interface Servicio {
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  urlImage: string | null; // Ruta relativa que Laravel guarda
  full_image_url?: string; // Atributo accesorio generado por Laravel
}

@Component({
  selector: 'app-servicios-destacados-landingpage',
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios-destacados-landingpage.component.html',
  styleUrl: './servicios-destacados-landingpage.component.css'
})
export class ServiciosDestacadosLandingpageComponent implements OnInit {
  services: Servicio[] = []; // Inicializamos como un array vacío

  // Define los códigos de los servicios que quieres mostrar como destacados.
  // ¡Estos códigos deben existir en tu base de datos de Laravel!
  private codigosServiciosDestacados: string[] = [
    'SERV-001', // Ejemplo: Limpieza Facial Profunda
    'SERV-002', // Ejemplo: Masaje Relajante
    'SERV-003'  // Ejemplo: Manicura & Pedicura Premium
    // Añade aquí los códigos de los servicios que quieras destacar.
  ];

  constructor(private servicioService: ServicioService) { }

  ngOnInit(): void {
    this.loadFeaturedServices();
  }

  private loadFeaturedServices(): void {
    this.codigosServiciosDestacados.forEach(codigo => {
      this.servicioService.getServicioByCodigo(codigo).subscribe({
        next: (data: any) => {
          // Asigna la propiedad 'link' dinámicamente si es necesario
          //servicio.link = `/servicios/${servicio.codigo}`;
          this.services.push(data.data);
        },
        error: (error) => {
          console.error(`Error al cargar el servicio con código ${codigo}:`, error);
          // Puedes manejar el error aquí (ej. mostrar un mensaje al usuario, un placeholder)
        }
      });
    });
  }
}