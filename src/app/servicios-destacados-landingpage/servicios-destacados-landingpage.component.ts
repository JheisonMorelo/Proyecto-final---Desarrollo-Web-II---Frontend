import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor
import { RouterLink } from '@angular/router'; // Para los enlaces a los servicios


interface Service {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  link: string; // La ruta a la página de detalle del servicio
}

@Component({
  selector: 'app-servicios-destacados-landingpage',
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios-destacados-landingpage.component.html',
  styleUrl: './servicios-destacados-landingpage.component.css'
})

export class ServiciosDestacadosLandingpageComponent {
  services: Service[] = [
    {
      id: 1,
      name: 'Limpieza Facial Profunda',
      description: 'Purifica y revitaliza tu piel para un aspecto radiante y saludable.',
      imageUrl: '/assets/images/service-facial.jpg', // ¡Asegúrate de tener esta imagen!
      link: '/servicios/limpieza-facial'
    },
    {
      id: 2,
      name: 'Masaje Relajante',
      description: 'Libera tensiones y sumérgete en un estado de profunda calma y bienestar.',
      imageUrl: '/assets/images/service-massage.jpg', // ¡Asegúrate de tener esta imagen!
      link: '/servicios/masaje'
    },
    {
      id: 3,
      name: 'Manicura & Pedicura Premium',
      description: 'Cuidado completo para manos y pies, con acabados impecables y duraderos.',
      imageUrl: '/assets/images/service-nails.jpg', // ¡Asegúrate de tener esta imagen!
      link: '/servicios/manicura-pedicura'
    }
    // Puedes añadir más servicios destacados aquí
  ];
}
