// src/app/pages/about-us-page/components/about-us-why-choose-us-section/about-us-why-choose-us-section.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define una interfaz para la estructura de una característica
interface Feature {
  icon: string; // Clase del icono (ej. 'bi bi-gem')
  title: string;
  description: string;
}

@Component({
  selector: 'app-por-que-elegirnos-section',
  imports: [CommonModule],
  templateUrl: './por-que-elegirnos-section.component.html',
  styleUrls: ['./por-que-elegirnos-section.component.css']
})
export class PorQueElegirnosSectionComponent implements OnInit {

  // Arreglo de características
  features: Feature[] = [
    {
      icon: 'bi bi-gem',
      title: 'Calidad y Excelencia',
      description: 'Solo utilizamos productos premium y técnicas de vanguardia para garantizar resultados sobresalientes.'
    },
    {
      icon: 'bi bi-hand-heart',
      title: 'Atención Personalizada',
      description: 'Cada tratamiento es adaptado a tus necesidades únicas, con un enfoque cálido y profesional.'
    },
    {
      icon: 'bi bi-award',
      title: 'Profesionales Certificados',
      description: 'Nuestro equipo está altamente cualificado y en constante formación para ofrecer lo mejor.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}