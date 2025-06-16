import { Component } from '@angular/core';
import { NavigationEnd, RouterModule, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // Importar Subscription


@Component({
  selector: 'app-admin-registration',
  imports: [RouterModule, CommonModule, RouterOutlet],
  templateUrl: './admin-registration.component.html',
  styleUrl: './admin-registration.component.css'
})
export class AdminRegistrationComponent {

  constructor(private router: Router) {}
    ngOnInit(): void {
  }
  closeAdminSession(): void {
    sessionStorage.removeItem('adminRegistrationAccess'); // Eliminar la bandera de acceso
    this.router.navigate(['/dashboard/home']); // Redirigir a una página segura del dashboard (ej. home)
  }
}
