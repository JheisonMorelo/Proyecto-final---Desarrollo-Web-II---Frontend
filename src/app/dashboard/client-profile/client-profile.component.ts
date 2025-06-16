import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente, ApiResponse } from '../../services/Cita/cita-service.service'; // Reutilizar Cliente y ApiResponse
import { ClienteService } from '../../services/Cliente/cliente-service.service';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { ClientProfileEditComponent } from '../client-profile-edit/client-profile-edit.component'; // Importar el componente de edición
import { Router } from '@angular/router'; // Para redirigir en caso de eliminación

@Component({
  selector: 'app-client-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    ClientProfileEditComponent // Importar el componente de edición aquí
  ],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileViewComponent implements OnInit {

  clientProfile: Cliente | null = null;
  loading: boolean = true;
  error: string | null = null;
  isEditing: boolean = false; // Controla la visibilidad del formulario de edición

  constructor(
    private clienteService: ClienteService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClientProfile();
  }

  loadClientProfile(): void {
    this.loading = true;
    this.error = null;
    this.clienteService.getAuthenticatedClientProfile().subscribe({
      next: (response: ApiResponse<Cliente>) => {
        this.clientProfile = response.data;
        this.loading = false;
        console.log('Perfil del cliente cargado:', this.clientProfile);
      },
      error: (err) => {
        console.error('Error al cargar el perfil del cliente:', err);
        this.error = 'No se pudo cargar la información de tu perfil. Por favor, intenta de nuevo más tarde.';
        this.loading = false;
        Swal.fire('Error', this.error, 'error');
      }
    });
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }

  onProfileUpdated(): void {
    this.isEditing = false; // Ocultar el formulario de edición
    this.loadClientProfile(); // Recargar los datos del perfil
  }

  onEditCancelled(): void {
    this.isEditing = false; // Ocultar el formulario de edición sin recargar
  }

  deleteAccount(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción eliminará tu cuenta permanentemente y no se podrá revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar mi cuenta',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteAuthenticatedClientAccount().subscribe({
          next: (response: ApiResponse<any>) => {
            Swal.fire('Eliminada!', response.message, 'success');
            // Cerrar sesión y redirigir al landing page
            this.authService.logout(); // Asegúrate de que tu AuthService.logout() limpia el token
            this.router.navigate(['/']); // Redirigir al inicio o a la página de login
          },
          error: (err) => {
            console.error('Error al eliminar la cuenta:', err);
            let errorMessage = 'No se pudo eliminar tu cuenta. Por favor, intenta de nuevo más tarde.';
            if (err.error && err.error.message) {
              errorMessage = err.error.message;
            }
            Swal.fire('Error', errorMessage, 'error');
          }
        });
      }
    });
  }
}
