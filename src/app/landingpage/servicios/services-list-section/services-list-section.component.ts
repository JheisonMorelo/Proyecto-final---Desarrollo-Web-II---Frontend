import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServiceItem {
  category: string; // Para agrupar los servicios
  name: string;
  description: string;
  price: string; // O number, si quieres operar con él
  image: string; // Ruta a la imagen del servicio
  // Puedes añadir un icono si lo deseas para servicios sin imagen específica
  icon?: string;
}

@Component({
  selector: 'app-services-list-section',
  imports: [CommonModule],
  templateUrl: './services-list-section.component.html',
  styleUrls: ['./services-list-section.component.css']
})
export class ServicesListSectionComponent implements OnInit {

  services: ServiceItem[] = [
    {
      category: 'Tratamientos Corporales',
      name: 'Reducción de Peso y Medidas',
      description: 'Programas corporales avanzados para la reducción de grasa localizada y modelado de la silueta.',
      price: 'Desde $120.000',
      image: '/images/service-corporal-reduccion.jpg', // Asegúrate de tener esta imagen
      icon: 'bi bi-lightning' // Icono opcional
    },
    {
      category: 'Tratamientos Corporales',
      name: 'Post Operatorios',
      description: 'Cuidados especializados para una recuperación óptima después de cirugías estéticas.',
      price: 'Consulta',
      image: '/images/service-post-operatorio.jpg', // Asegúrate de tener esta imagen
      icon: 'bi bi-bandaid'
    },
    {
      category: 'Tratamientos Faciales',
      name: 'Rejuvenecimiento Facial',
      description: 'Tratamientos anti-edad para reducir líneas de expresión y mejorar la firmeza de la piel.',
      price: 'Desde $90.000',
      image: '/images/service-facial-rejuvenecimiento.jpg', // Asegúrate de tener esta imagen
      icon: 'bi bi-mask'
    },
    {
      category: 'Tratamientos Faciales',
      name: 'Manchas, Acné y Melasmas',
      description: 'Protocolos específicos para tratar y mejorar afecciones como manchas, acné y melasmas.',
      price: 'Desde $85.000',
      image: '/images/service-facial-manchas-acne.jpg', // Asegúrate de tener esta imagen
      icon: 'bi bi-person-x'
    },
    {
      category: 'Depilación',
      name: 'Depilación Láser Diodo TRIONDA',
      description: 'Tecnología láser de última generación para una depilación eficaz, indolora y duradera.',
      price: 'Consulta por zona',
      image: '/images/service-depilacion-laser.jpg', // Asegúrate de tener esta imagen
      icon: 'bi bi-lightbulb'
    },
    {
      category: 'Maquillaje Permanente',
      name: 'Cejas Micropigmentadas',
      description: 'Diseño y relleno de cejas para una mirada definida y natural con técnicas de micropigmentación.',
      price: 'Desde $200.000',
      image: '/images/service-cejas-micropigmentadas.jpg', // Asegúrate de tener esta imagen
      icon: 'bi bi-pencil'
    },
    {
      category: 'Maquillaje Permanente',
      name: 'Labios Micropigmentados',
      description: 'Realza la forma y color de tus labios para un aspecto voluminoso y definido.',
      price: 'Desde $250.000',
      image: '/images/service-labios-micropigmentados.jpg', // Asegúrate de tener esta imagen
      icon: 'bi bi-lips'
    },
    {
      category: 'Venta de Productos',
      name: 'Productos Faciales y Corporales',
      description: 'Amplia gama de productos profesionales para el cuidado y mantenimiento de tu piel en casa.',
      price: 'Desde $20.000',
      image: '/images/service-venta-productos.jpg', // Asegúrate de tener esta imagen
      icon: 'bi bi-shop'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}