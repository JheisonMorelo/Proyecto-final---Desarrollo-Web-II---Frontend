import { Component } from '@angular/core';
import { FooterLandingpageComponent } from '../footer-landingpage/footer-landingpage.component';
import { HeaderLandingpageComponent } from '../header-landingpage/header-landingpage.component';
import { HeroLandingpageComponent } from '../hero-landingpage/hero-landingpage.component';
import { ServiciosDestacadosLandingpageComponent } from '../servicios-destacados-landingpage/servicios-destacados-landingpage.component';
import { SobreNosotrosLandingpageComponent } from '../sobre-nosotros-landingpage/sobre-nosotros-landingpage.component';
import { ClientesSatisfechosLandingpageComponent } from '../clientes-satisfechos-landingpage/clientes-satisfechos-landingpage.component';

@Component({
  selector: 'app-landingpage',
  imports: [HeaderLandingpageComponent,
      HeroLandingpageComponent,
      ServiciosDestacadosLandingpageComponent,
      SobreNosotrosLandingpageComponent,
      ClientesSatisfechosLandingpageComponent, 
      FooterLandingpageComponent],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent {

}
