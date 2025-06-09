import { Component, HostListener, NgModule, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header-landingpage-component',
  imports: [RouterLink, NgbModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isScrolled: boolean = false; // Propiedad para controlar el estilo del navbar al hacer scroll
  isMenuCollapsed: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  // Listener para el evento scroll de la ventana
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Si el scroll vertical es mayor a 50px, activa el estilo 'scrolled'
    this.isScrolled = window.pageYOffset > 50;
  }
}