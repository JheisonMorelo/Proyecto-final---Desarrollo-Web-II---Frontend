import { Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';
import { ContactoComponent } from './contacto/contacto.component';

export const routes: Routes = [
    { path: '', component: LandingpageComponent },
    { path: 'sobre-nosotros', component: SobreNosotrosComponent},
    { path: 'contacto', component: ContactoComponent},
    { path: '**', redirectTo: ''}
];
