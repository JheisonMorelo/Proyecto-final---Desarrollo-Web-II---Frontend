import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-landingpage',
  imports: [],
  templateUrl: './header-landingpage.component.html',
  styleUrl: './header-landingpage.component.css'
})
export class HeaderLandingpageComponent {
  isScrolled: boolean = false; // Estado para controlar si el usuario ha hecho scroll

  constructor() { }

  ngOnInit(): void {
    // Inicializar el estado de scroll al cargar la página
    this.checkScroll();
  }

  // Escucha el evento 'scroll' de la ventana
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  // Función para verificar la posición de scroll
  checkScroll() {
    // Si el scroll vertical es mayor que 50px, consideramos que ha habido scroll
    // Puedes ajustar este valor (por ejemplo, 100px)
    this.isScrolled = (window.scrollY > 50);
  }
}
