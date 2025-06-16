import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Importa DatePipe para formatear fechas
import { Cita, CitaService } from '../../services/Cita/cita-service.service'; // Importa Cita y CitaService
import { AuthService } from '../../services/auth/auth.service'; // Para verificar el rol
import Swal from 'sweetalert2'; // Para notificaciones
import { GestionarCitasFormComponent } from '../gestionar-citas-form/gestionar-citas-form.component';

@Component({
  selector: 'app-gestionar-citas',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    GestionarCitasFormComponent
  ],
  templateUrl: './gestionar-citas.component.html',
  styleUrls: ['./gestionar-citas.component.css']
})
export class GestionarCitasComponent implements OnInit {

  citas: Cita[] = [];
  loading: boolean = true;
  error: string | null = null;
  userRole: string | null = null; // Para verificar el rol del usuario logueado

  showCitaForm: boolean = false; // Bandera para controlar la visibilidad del formulario
  citaToEdit: Cita | null = null; // Objeto Cita para pre-llenar el formulario en modo edición

  constructor(
    private citaService: CitaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Suscribirse al rol del usuario para determinar qué citas cargar
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
      // Solo si el usuario es recepcionista o administrador, carga TODAS las citas
      if (this.userRole === 'recepcionista') {
        this.loadAllCitas();
      } else {
        this.loading = false;
        this.error = 'No tienes permiso para ver esta sección.';
        Swal.fire('Acceso Denegado', this.error, 'warning');
      }
    });
  }

  /**
   * Carga todas las citas desde el backend.
   */
  private loadAllCitas(): void {
    this.loading = true;
    this.error = null;

    this.citaService.getAllCitas().subscribe({
      next: (response) => {
        this.citas = response.data || []; // Asegúrate de que response.data sea un array, incluso si está vacío
        this.loading = false;
        console.log('Todas las citas cargadas:', this.citas);
        if (this.citas.length === 0 && response.message === 'No se encontraron citas') {
          console.log('No hay citas registradas, mostrando mensaje informativo.');
        }
      },
      error: (err) => {
        console.error('Error al cargar todas las citas:', err);
        this.error = 'No se pudieron cargar las citas. Por favor, intenta de nuevo más tarde.';
        this.loading = false;
        Swal.fire('Error de Carga', 'No se pudieron cargar las citas.', 'error');
      }
    });
  }

  /**
   * Abre el formulario para agregar una nueva cita.
   */
  addNewCita(): void {
    this.citaToEdit = null; // Asegúrate de que no estamos en modo edición
    this.showCitaForm = true; // Muestra el formulario
  }

  /**
   * Abre el formulario para editar una cita existente.
   * @param cita La cita a editar.
   */
  editCita(cita: Cita): void {
    this.citaToEdit = cita; // Establece la cita a editar
    this.showCitaForm = true; // Muestra el formulario
  }

  /**
   * Elimina una cita después de la confirmación.
   * @param codigo El código de la cita a eliminar.
   */
  deleteCita(codigo: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar la cita con código ${codigo}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.citaService.deleteCita(codigo).subscribe({
          next: (response) => {
            Swal.fire('Eliminada', response.message, 'success');
            this.loadAllCitas(); // Recarga la lista de citas después de la eliminación
          },
          error: (err) => {
            console.error('Error al eliminar cita:', err);
            Swal.fire('Error', 'No se pudo eliminar la cita.', 'error');
          }
        });
      }
    });
  }

  /**
   * Maneja el evento de envío exitoso del formulario de cita.
   */
  onFormSubmitted(): void {
    this.showCitaForm = false; // Oculta el formulario
    this.loadAllCitas(); // Recarga la lista de citas
  }

  /**
   * Maneja el evento de cancelación del formulario de cita.
   */
  onFormCancelled(): void {
    this.showCitaForm = false; // Oculta el formulario
    this.citaToEdit = null; // Limpia la cita que se estaba editando
  }

  /**
   * Formatea un número como moneda colombiana (COP).
   * @param cost El costo a formatear.
   * @returns Una cadena con el costo formateado.
   */
  formatCost(cost: number | undefined | null): string {
    if (cost === undefined || cost === null) {
      return 'N/A';
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(cost);
  }
}