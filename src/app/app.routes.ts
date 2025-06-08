import { Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';
import { ContactoComponent } from './contacto/contacto.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ProductosComponent } from './productos/productos.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: LandingpageComponent },
    { path: 'nosotros', component: SobreNosotrosComponent},
    { path: 'contacto', component: ContactoComponent},
    { path: 'servicios', component: ServiciosComponent},
    { path: 'productos', component: ProductosComponent},
    { path: 'registro', component: RegistroComponent},
    { path: 'login', component: LoginComponent},
    { path: '**', redirectTo: ''}
];
