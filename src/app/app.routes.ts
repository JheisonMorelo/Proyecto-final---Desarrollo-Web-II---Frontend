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

// Para el dashboard
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { DashboardClientCitasComponent } from './dashboard/dashboard-client-citas/dashboard-client-citas.component';
import { DashboardClientPedidosComponent } from './dashboard/dashboard-client-pedidos/dashboard-client-pedidos.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { AdminRegistrationGuard } from './guards/admin-registration/admin-registration.guard';
import { AdminAccessPanelComponent } from './registro_y_login_personal/admin-panel-access/admin-panel-access.component';
import { RegisterRecepcionistaComponent } from './admin-registration/register-recepcionista/register-recepcionista.component';
import { RegisterEspecialistaComponent } from './admin-registration/register-especialista/register-especialista.component';
import { RegisterAsistenteComponent } from './admin-registration/register-asistente/register-asistente.component';
import { PersonalLoginComponent } from './registro_y_login_personal/personal-login/personal-login.component';
import { AdminRegistrationComponent } from './admin-registration/admin-registration.component';
import { ClientProfileViewComponent } from './dashboard/client-profile/client-profile.component';
import { GestionarCitasComponent } from './dashboard/gestionar-citas/gestionar-citas.component';


export const routes: Routes = [
  {
    path: 'landingpage',
    component: LandingpageComponent,
    children: [
      { path: '', component: LandingpageHomeComponent },
      { path: 'nosotros', component: SobreNosotrosComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'registro', component: RegistroComponent },
      { path: 'login', component: LoginComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'mis-citas', component: DashboardClientCitasComponent },
      { path: 'mis-pedidos', component: DashboardClientPedidosComponent },
      { path: 'mi-perfil-client', component: ClientProfileViewComponent},
      { path: 'gestionar-citas', component: GestionarCitasComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin-access',
    component: AdminAccessPanelComponent,
  },
  {
    path: 'admin-registration',
    component: AdminRegistrationComponent,
    canActivate: [AdminRegistrationGuard],
    children: [
      {
        path: 'registrar-recepcionista',
        component: RegisterRecepcionistaComponent,
      },
      {
        path: 'registrar-especialista',
        component: RegisterEspecialistaComponent,
      },
      {
        path: 'registrar-asistente-ventas',
        component: RegisterAsistenteComponent,
      },
    ],
  },

  { path: 'personal-login', component: PersonalLoginComponent },

  { path: '', redirectTo: 'landingpage', pathMatch: 'full' },
  { path: '**', redirectTo: 'landingpage', pathMatch: 'full' },
];
