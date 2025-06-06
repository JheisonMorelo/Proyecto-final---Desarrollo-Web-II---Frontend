import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define una interfaz para la estructura de un miembro del equipo
interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  borderColor: string; // Para el color del borde de la imagen, si quieres que sea dinámico
}

@Component({
  selector: 'app-team-section',
  imports: [CommonModule],
  templateUrl: './team-section.component.html',
  styleUrls: ['./team-section.component.css']
})

export class TeamSectionComponent implements OnInit {

  // Arreglo de miembros del equipo
  teamMembers: TeamMember[] = [
    {
      name: 'María Camila',
      role: 'Propietaria y Cosmetóloga Jefa',
      description: 'Con más de 15 años de experiencia, María es la mente y el corazón de nuestro centro. Especializada en tratamientos faciales avanzados y rejuvenecimiento, su pasión es transformar y realzar la belleza natural.',
      image: '/images/team-maria.jpg',
      borderColor: 'border-primary' // Clase de Bootstrap para el borde
    },
    {
      name: 'Laura G.',
      role: 'Recepcionista y Coordinadora de Clientes',
      description: 'Laura es la primera sonrisa que recibes. Experta en atención al cliente y organización, asegura que tu experiencia desde la reserva hasta la despedida sea impecable y placentera.',
      image: '/images/team-laura.jpg',
      borderColor: 'border-pink' // Clase personalizada para el borde (definida en CSS si es necesario)
    },
    {
      name: 'Sofía M.',
      role: 'Masajista Terapéutica y Wellness Coach',
      description: 'Con un enfoque holístico, Sofía te guiará en un viaje de relajación profunda a través de masajes terapéuticos y técnicas de bienestar que restaurarán tu energía y calma.',
      image: '/images/team-sofia.jpg',
      borderColor: 'border-primary'
    },
    {
      name: 'David R.',
      role: 'Asesor de Productos y Ventas',
      description: 'David es tu guía en el mundo de nuestros productos de belleza. Te asesorará en las mejores opciones para tu tipo de piel y necesidades, asegurando que lleves a casa el cuidado adecuado.',
      image: '/images/team-david.jpg',
      borderColor: 'border-pink'
    }
    // Puedes añadir más miembros aquí
  ];

  constructor() { }

  ngOnInit(): void {
  }

}