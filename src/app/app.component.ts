import { Component} from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs'; // Importar Subscription
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  private adminSessionSubscription: Subscription | undefined;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Suscribirse a los eventos del Router para detectar cambios de ruta
    this.adminSessionSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        console.log('Navegación detectada:', currentUrl);

        // Define las rutas que forman parte del "área de administración de registro"
        const isInAdminArea =
          currentUrl.startsWith('/admin-registration');

        // Si la bandera de acceso temporal está activa Y NO estamos en el área admin
        if (sessionStorage.getItem('adminRegistrationAccess') === 'true' && !isInAdminArea) {
          sessionStorage.removeItem('adminRegistrationAccess'); // Eliminar la bandera de acceso
          console.log('Acceso de administrador temporal cerrado automáticamente por navegación fuera del panel de registro de personal.');
          // Opcional: podrías mostrar un Swal o un mensaje discreto aquí si lo consideras necesario.
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'info',
            title: 'Sesión de administrador cerrada'
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.adminSessionSubscription) {
      this.adminSessionSubscription.unsubscribe();
    }
  }
}
