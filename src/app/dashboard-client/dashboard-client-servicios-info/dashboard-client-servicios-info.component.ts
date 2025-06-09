// src/app/pages/dashboard/pages/services-info/services-info.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor
import { RouterModule } from '@angular/router'; // Para routerLink

// Define la interfaz para un servicio si no la tienes ya en otro archivo compartido
// Si ya la tienes en un archivo de modelos compartido (ej. 'src/app/shared/models/service.model.ts'), impórtala de allí.
export interface Service {
  name: string;
  description: string;
  priceRange: string;
  imageUrl: string;
  details?: string[]; // Detalles adicionales
}

@Component({
  selector: 'app-services-info',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard-client-servicios-info.component.html',
  styleUrls: ['./dashboard-client-servicios-info.component.css']
})
export class DashboardClientServiciosInfoComponent implements OnInit {
  // Define los datos de los servicios directamente aquí
  services: Service[] = [
    {
      name: 'Tratamientos Faciales',
      description: 'Variedad de tratamientos para el cuidado y rejuvenecimiento de la piel del rostro, incluyendo limpiezas profundas, hidratación, anti-edad y control de acné.',
      priceRange: '$80.000 - $300.000',
      imageUrl: 'assets/images/facial_treatment.jpg', // Asegúrate de tener estas imágenes
      details: [
        'Limpieza Facial Profunda',
        'Hidratación con Ácido Hialurónico',
        'Tratamiento Anti-acné',
        'Peeling Químico Suave',
        'Mascarillas Personalizadas',
        'Radiofrecuencia Facial'
      ]
    },
    {
      name: 'Masajes Relajantes y Terapéuticos',
      description: 'Experiencias de relajación y alivio muscular, desde masajes descontracturantes hasta masajes con piedras calientes y aromaterapia.',
      priceRange: '$70.000 - $250.000',
      imageUrl: 'assets/images/massage.jpg',
      details: [
        'Masaje Relajante Corporal',
        'Masaje Descontracturante',
        'Drenaje Linfático',
        'Masaje con Piedras Calientes',
        'Masaje de Espalda y Cuello',
        'Aromaterapia'
      ]
    },
    {
      name: 'Depilación Láser',
      description: 'Tecnología de última generación para una depilación duradera y eficaz en diversas áreas del cuerpo, ofreciendo comodidad y resultados visibles.',
      priceRange: 'Desde $50.000 por sesión',
      imageUrl: 'assets/images/laser_hair_removal.jpg',
      details: [
        'Depilación Láser de Diodo',
        'Depilación de Piernas Completas',
        'Depilación de Axilas',
        'Depilación de Bikini',
        'Depilación Facial'
      ]
    },
    {
      name: 'Manicure y Pedicure',
      description: 'Servicios profesionales para el cuidado estético de manos y pies, incluyendo esmaltado tradicional, semipermanente y tratamientos de spa.',
      priceRange: '$30.000 - $90.000',
      imageUrl: 'assets/images/manicure_pedicure.jpg',
      details: [
        'Manicure Clásico',
        'Pedicure Spa',
        'Esmaltado Semipermanente (Gel)',
        'Uñas Acrílicas/Gel',
        'Tratamiento de Parafina'
      ]
    },
    {
      name: 'Tratamientos Corporales',
      description: 'Programas y tratamientos diseñados para mejorar la silueta, reducir celulitis y estrías, y reafirmar la piel.',
      priceRange: '$90.000 - $400.000',
      imageUrl: 'assets/images/body_treatment.jpg',
      details: [
        'Maderoterapia',
        'Cavitación y Radiofrecuencia Corporal',
        'Drenaje Linfático',
        'Envolturas Corporales',
        'Tratamiento Anti-celulitis',
        'Reafirmación de Glúteos'
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // No necesitamos llamar a ningún servicio aquí, los datos ya están en el componente
  }
}