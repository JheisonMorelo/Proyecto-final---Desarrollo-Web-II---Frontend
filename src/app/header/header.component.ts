import { Component, HostListener, OnInit } from '@angular/core';
import {RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-landingpage-component',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isScrolled = false; // Propiedad para controlar si se ha hecho scroll

  constructor() { }

  ngOnInit(): void {
    // Es buena práctica inicializar la verificación de scroll por si la página ya carga con scroll
    this.checkScroll();
  }

  // Escucha el evento 'scroll' en la ventana del navegador
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.checkScroll();
  }

  checkScroll() {
    // Define el umbral de scroll en píxeles
    const scrollThreshold = 50; // Por ejemplo, 50px de scroll para activar el efecto

    // Comprueba si el scroll vertical de la ventana es mayor que el umbral
    if (window.pageYOffset > scrollThreshold) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }
}
