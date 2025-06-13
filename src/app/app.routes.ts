import { Routes } from '@angular/router';

// Para landingpage
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LandingpageHomeComponent } from './landingpage/landingpage-home/landingpage-home.component';
import { ContactoComponent } from './landingpage/contacto/contacto.component';
import { LoginComponent } from './landingpage/login/login.component';
import { ProductosComponent } from './landingpage/productos/productos.component';
import { RegistroComponent } from './landingpage/registro/registro.component';
import { ServiciosComponent } from './landingpage/servicios/servicios.component';
import { SobreNosotrosComponent } from './landingpage/sobre-nosotros/sobre-nosotros.component';

// Para el dashboard del cliente
import { DashboardClientPageComponent } from './dashboard-client/dashboard-client-page.component';
import { DashboardClientHomeComponent } from './dashboard-client/dashboard-client-home/dashboard-client-home.component';
import { DashboardClientCitasComponent } from './dashboard-client/dashboard-client-citas/dashboard-client-citas.component';
import { DashboardClientPedidosComponent } from './dashboard-client/dashboard-client-pedidos/dashboard-client-pedidos.component';
import { DashboardClientEmpresaInfoComponent } from './dashboard-client/dashboard-client-empresa-info/dashboard-client-empresa-info.component';
import { DashboardClientProductsInfoComponent } from './dashboard-client/dashboard-client-productos-info/dashboard-client-productos-info.component';
import { DashboardClientServiciosInfoComponent } from './dashboard-client/dashboard-client-servicios-info/dashboard-client-servicios-info.component';
import { DashboardClientTeamInfoComponent } from './dashboard-client/dashboard-client-team-info/dashboard-client-team-info.component';
import { AuthGuard } from './guards/auth/auth.guard';


export const routes: Routes = [
    {
        path: 'landingpage', component: LandingpageComponent,
        children: [
            { path: '', component: LandingpageHomeComponent },
            { path: 'nosotros', component: SobreNosotrosComponent },
            { path: 'contacto', component: ContactoComponent },
            { path: 'servicios', component: ServiciosComponent },
            { path: 'productos', component: ProductosComponent },
            { path: 'registro', component: RegistroComponent },
            { path: 'login', component: LoginComponent },
            { path: '**', redirectTo: '' },
        ]
    },
    { 
        path: 'dashboard-client', component: DashboardClientPageComponent,
        children: [
            { path: '', component: DashboardClientHomeComponent},
            { path: 'citas', component:  DashboardClientCitasComponent},
            { path: 'pedidos', component: DashboardClientPedidosComponent},
            { path: 'empresa-info', component: DashboardClientEmpresaInfoComponent},
            { path: 'empresa-team', component: DashboardClientTeamInfoComponent},
            { path: 'empresa-servicios', component: DashboardClientServiciosInfoComponent},
            { path: 'empresa-productos', component: DashboardClientProductsInfoComponent}
        ]
    },
    { path: '', redirectTo: 'landingpage', pathMatch: 'full'},
    { path: '**', redirectTo: ''}

];
