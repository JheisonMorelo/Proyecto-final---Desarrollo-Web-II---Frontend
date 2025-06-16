import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Importar CurrencyPipe
import Swal from 'sweetalert2'; // Para notificaciones

// Importar Servicio y ApiResponse desde cita-service.service.ts
import { Servicio, ApiResponse } from '../../services/Cita/cita-service.service';
// Importar ServicioService para las operaciones CRUD
import { ServicioService } from '../../services/Servicio/servicio-service.service';
// Importar AuthService para verificar el rol del usuario
import { AuthService } from '../../services/auth/auth.service';

// Importar el nuevo ServicioFormComponent
import { ServicioFormComponent } from '../servicio-form/servicio-form.component';

@Component({
  selector: 'app-gestionar-servicios',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe, // Usar CurrencyPipe para formatear el precio
    ServicioFormComponent // Importar el componente de formulario
  ],
  templateUrl: './gestionar-servicios.component.html',
  styleUrls: ['./gestionar-servicios.component.css']
})
export class GestionarServicioComponent implements OnInit {

  servicios: Servicio[] = []; // Array para almacenar los servicios
  loading: boolean = true; // Bandera para el estado de carga
  error: string | null = null; // Mensaje de error
  userRole: string | null = null; // Rol del usuario autenticado

  showServicioForm: boolean = false; // Bandera para mostrar/ocultar el formulario de servicio
  servicioToEdit: Servicio | null = null; // Servicio que se pasará al formulario para editar

  constructor(
    private servicioService: ServicioService, // Inyectar ServicioService
    private authService: AuthService // Inyectar AuthService
  ) { }

  ngOnInit(): void {
    // Suscribirse al rol del usuario desde AuthService para verificar permisos
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
      if (this.userRole === 'recepcionista') {
        this.loadAllServicios(); // Cargar servicios si el rol es recepcionista
      } else {
        this.loading = false;
        this.error = 'Acceso denegado. No tienes permiso para gestionar servicios.';
        Swal.fire('Acceso Denegado', this.error, 'warning');
      }
    });
  }

  /**
   * Carga todos los servicios desde el backend.
   */
  private loadAllServicios(): void {
    this.loading = true;
    this.error = null;
    this.servicioService.getAllServicios().subscribe({
      next: (response: ApiResponse<Servicio[]>) => {
        this.servicios = response.data || [];
        this.loading = false;
        if (this.servicios.length === 0 && response.message === 'No se encontraron servicios') {
          console.log('No hay servicios registrados.');
        }
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.error = 'No se pudieron cargar los servicios. Por favor, intenta de nuevo más tarde.';
        this.loading = false;
        Swal.fire('Error de Carga', 'No se pudieron cargar los servicios.', 'error');
      }
    });
  }

  /**
   * Muestra el formulario para agregar un nuevo servicio.
   */
  addNewServicio(): void {
    this.servicioToEdit = null; // Asegura que el formulario esté en modo creación
    this.showServicioForm = true; // Muestra el formulario
  }

  /**
   * Muestra el formulario para editar un servicio existente.
   * @param servicio El objeto Servicio a editar.
   */
  editServicio(servicio: Servicio): void {
    this.servicioToEdit = servicio; // Pasa el servicio al formulario
    this.showServicioForm = true; // Muestra el formulario
  }

  /**
   * Elimina un servicio después de la confirmación del usuario.
   * @param codigo El código del servicio a eliminar.
   * @param nombre El nombre del servicio (para el mensaje de confirmación).
   */
  deleteServicio(codigo: string, nombre: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar el servicio "${nombre}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioService.deleteServicio(codigo).subscribe({
          next: (response: ApiResponse<any>) => {
            Swal.fire('Eliminado', response.message || 'El servicio ha sido eliminado.', 'success');
            this.loadAllServicios(); // Recargar la lista después de la eliminación
          },
          error: (err) => {
            console.error('Error al eliminar servicio:', err);
            let errorMessage = 'No se pudo eliminar el servicio.';
            if (err.error && err.error.message) errorMessage = err.error.message;
            Swal.fire('Error', errorMessage, 'error');
          }
        });
      }
    });
  }

  /**
   * Maneja el evento de envío exitoso del formulario de servicio (desde ServicioFormComponent).
   */
  onServicioFormSubmitted(): void {
    this.showServicioForm = false; // Oculta el formulario
    this.loadAllServicios(); // Recarga la lista de servicios para ver los cambios
  }

  /**
   * Maneja el evento de cancelación del formulario de servicio (desde ServicioFormComponent).
   */
  onServicioFormCancelled(): void {
    this.showServicioForm = false; // Oculta el formulario
    this.servicioToEdit = null; // Limpia el servicio que se estaba editando
  }

  // Helper para el placeholder de imagen
  getPlaceholderImage(width: number, height: number): string {
    return `https://placehold.co/${width}x${height}/E91E63/ffffff?text=Servicio`;
  }
}