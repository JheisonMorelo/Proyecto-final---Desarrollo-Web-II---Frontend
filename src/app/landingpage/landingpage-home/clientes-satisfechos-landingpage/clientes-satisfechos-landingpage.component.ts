// src/app/pages/home/testimonials/testimonials.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor

interface Testimonial {
  quote: string;
  author: string;
  city: string; // Opcional, para dar más contexto
  imageUrl?: string; // Opcional, para la foto del cliente
}

@Component({
  selector: 'app-clientes-satisfechos-landingpage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes-satisfechos-landingpage.component.html',
  styleUrl: './clientes-satisfechos-landingpage.component.css' // O .scss
})
export class ClientesSatisfechosLandingpageComponent {
  testimonials: Testimonial[] = [
    {
      quote: '¡Absolutamente encantada con mi limpieza facial profunda! Mi piel nunca se había sentido tan fresca y luminosa. El personal es increíblemente profesional y amable. ¡Volveré sin dudarlo!',
      author: 'Sofía G.',
      city: 'Cartagena',
      imageUrl: '/images/img1.jpg' // Imagen de cliente
    },
    {
      quote: 'El mejor masaje relajante que he recibido en mucho tiempo. Me sentí completamente renovada y sin una pizca de estrés. Un verdadero oasis de paz en la ciudad.',
      author: 'Andrea M.',
      city: 'Barranquilla',
      imageUrl: '/images/img3.jpg'
    },
    {
      quote: 'Siempre salgo feliz con mis uñas. La manicura y pedicura son impecables y duraderas. Prestan atención a cada detalle y el ambiente es súper agradable.',
      author: 'Valeria C.',
      city: 'Medellín',
      imageUrl: '/images/img2.jpg'
    }
    // Puedes añadir más testimonios aquí
  ];
}