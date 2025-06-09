// src/app/shared/footer/footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Importa RouterLink para los enlaces

@Component({
  selector: 'app-footer-landingpage-component',
  standalone: true,
  imports: [CommonModule, RouterLink], // Asegúrate de importar CommonModule y RouterLink
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css' // O .scss
})

export class FooterComponent {
  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }
}
