import { Component } from '@angular/core';
import { HeroLandingpageComponent } from './hero-landingpage/hero-landingpage.component';
import { ServiciosDestacadosLandingpageComponent } from './servicios-destacados-landingpage/servicios-destacados-landingpage.component';
import { ProductosDestacadosLandingpageComponent } from './productos-destacados-landingpage/productos-destacados-landingpage.component';
import { SobreNosotrosLandingpageComponent } from './sobre-nosotros-landingpage/sobre-nosotros-landingpage.component';
import { ClientesSatisfechosLandingpageComponent } from './clientes-satisfechos-landingpage/clientes-satisfechos-landingpage.component';
import { AccessAdminComponent } from './access-admin/access-admin.component';

@Component({
  selector: 'app-landingpage-home',
  imports: [HeroLandingpageComponent,
    ServiciosDestacadosLandingpageComponent,
    ProductosDestacadosLandingpageComponent,
    SobreNosotrosLandingpageComponent,
    ClientesSatisfechosLandingpageComponent,
    AccessAdminComponent],
  templateUrl: './landingpage-home.component.html',
  styleUrl: './landingpage-home.component.css'
})
export class LandingpageHomeComponent {

}
