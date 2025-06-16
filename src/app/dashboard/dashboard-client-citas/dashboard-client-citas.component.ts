import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita, CitaService } from '../../services/Cita/cita-service.service'; // Importar CitaService y Cita
import { AuthService } from '../../services/auth/auth.service'; // Para obtener el rol del cliente
import Swal from 'sweetalert2'; // Para notificaciones
import { DatePipe } from '@angular/common'; // Para formatear fechas
import { CitaFormComponent } from '../cita-form/cita-form.component';

@Component({
  selector: 'app-dashboard-client-citas',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe, // Importar DatePipe para usarlo en el template
    CitaFormComponent
  ],
  templateUrl: './dashboard-client-citas.component.html',
  styleUrls: ['./dashboard-client-citas.component.css']
})
export class DashboardClientCitasComponent implements OnInit {

  citas: Cita[] = [];
  loading: boolean = true;
  error: string | null = null;
  userRole: string | null = null; // Rol del usuario logueado

  showCitaForm: boolean = false; // <-- NUEVO: Bandera para mostrar/ocultar el formulario
  citaToEdit: Cita | null = null; // <-- NUEVO: Cita a editar (para pasar al formulario)


  constructor(
    private citaService: CitaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
      if (this.userRole === 'cliente') { // Asegurarse de que solo clientes carguen sus propias citas aquí
        this.loadClientCitas();
      } else {
        this.loading = false;
        this.error = 'No tienes permiso para ver esta sección o no eres un cliente.';
        Swal.fire('Acceso Denegado', this.error, 'warning');
      }
    });
  }

  private loadClientCitas(): void {
    this.loading = true;
    this.error = null;

    this.citaService.getClientCitas().subscribe({
      next: (response) => {
        this.citas = response.data; // Asumiendo que response.data es el array de citas
        this.loading = false;
        console.log('Citas del cliente cargadas:', this.citas);
      },
      error: (err) => {
        console.error('Error al cargar las citas del cliente:', err);
        this.error = 'No se pudieron cargar tus citas. Por favor, intenta de nuevo más tarde.';
        this.loading = false;
        Swal.fire('Error de Carga', 'No se pudieron cargar tus citas.', 'error');
      }
    });
  }

  // --- Métodos placeholder para futuras funcionalidades (AGREGAR, EDITAR, ELIMINAR) ---

  addNewCita(): void {
    this.citaToEdit = null; // Asegurarse de que no estamos en modo edición
    this.showCitaForm = true; // Mostrar el formulario
  }

  editCita(cita: Cita): void {
    this.citaToEdit = cita; // Establecer la cita a editar
    this.showCitaForm = true; // Mostrar el formulario
  }

    // Manejar el evento cuando el formulario se envía con éxito
  onFormSubmitted(): void {
    this.showCitaForm = false; // Ocultar el formulario
    this.loadClientCitas(); // Recargar la lista de citas
  }

  // Manejar el evento cuando el formulario se cancela
  onFormCancelled(): void {
    this.showCitaForm = false; // Ocultar el formulario
    this.citaToEdit = null; // Limpiar la cita a editar
  }


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
            Swal.fire('Eliminado', response.message, 'success');
            this.loadClientCitas(); // Recargar la lista después de eliminar
          },
          error: (err) => {
            console.error('Error al eliminar cita:', err);
            // Mostrar mensaje de error detallado si está disponible en la respuesta del backend
            let errorMessage = 'No se pudo eliminar la cita.';
            if (err.error && err.error.message) {
              errorMessage = err.error.message;
            }
            Swal.fire('Error', errorMessage, 'error');
          }
        });
      }
    });
  }

  // Función para formatear el costo total
  formatCost(cost: number): string {
    if (cost === undefined || cost === null) {
      return 'N/A';
    }
    // Formato de moneda colombiana
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0 // No mostrar decimales para pesos colombianos
    }).format(cost);
  }
}
