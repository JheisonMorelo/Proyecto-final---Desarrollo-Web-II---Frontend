import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLandingpageComponent } from './header-landingpage/header-landingpage.component';
import { HeroLandingpageComponent } from './hero-landingpage/hero-landingpage.component';
import { ServiciosDestacadosLandingpageComponent } from './servicios-destacados-landingpage/servicios-destacados-landingpage.component';
import { SobreNosotrosLandingpageComponent } from './sobre-nosotros-landingpage/sobre-nosotros-landingpage.component';
import { ClientesSatisfechosLandingpageComponent } from './clientes-satisfechos-landingpage/clientes-satisfechos-landingpage.component';
import { FooterLandingpageComponent } from './footer-landingpage/footer-landingpage.component';

@Component({
  selector: 'app-root', 
  imports: [RouterOutlet,
    HeaderLandingpageComponent,
    HeroLandingpageComponent,
    ServiciosDestacadosLandingpageComponent,
    SobreNosotrosLandingpageComponent,
    ClientesSatisfechosLandingpageComponent, 
    FooterLandingpageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
