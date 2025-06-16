import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
// Importa las interfaces y servicios
import { Cita, CitaService, Servicio, CitaUpdateInput, ApiResponse, ClientCitaInput } from '../../services/Cita/cita-service.service'; 
import { ClienteService } from '../../services/Cliente/cliente-service.service';
import { RecepcionistaService } from '../../services/Recepcionista/recepcionista-service.service';
import { ServicioService } from '../../services/Servicio/servicio-service.service';
import { AuthService, UserData } from '../../services/auth/auth.service'; 
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './cita-form.component.html',
  styleUrls: ['./cita-form.component.css']
})
export class CitaFormComponent implements OnInit {
  @Input() citaToEdit: Cita | null = null; // Para pre-llenar el formulario si es una edición
  @Output() formSubmitted = new EventEmitter<void>(); // Emite cuando el formulario se envía con éxito
  @Output() formCancelled = new EventEmitter<void>(); // Emite cuando se cancela el formulario

  citaForm: FormGroup;
  // Ya no necesitamos 'clientes' ni 'recepcionistas' para el cliente en el formulario de creación
  // clientes: Cliente[] = []; 
  // recepcionistas: Recepcionista[] = [];
  serviciosDisponibles: Servicio[] = [];
  
  selectedServices: Servicio[] = []; 
  totalCostoServicios: number = 0; 
  
  // Estos se usarán para mostrar información en el template, no para el formulario de envío
  authenticatedClientCedula: string | null = null;
  authenticatedClientName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    // private clienteService: ClienteService, // Ya no es necesario cargar clientes para este form de cliente
    // private recepcionistaService: RecepcionistaService, // Ya no es necesario cargar recepcionistas
    private servicioService: ServicioService,
    private authService: AuthService
  ) {
    this.citaForm = this.fb.group({
      // Eliminamos 'codigo', 'idCliente', 'idRecepcionista' del formulario de cliente
      fechaCita: ['', [Validators.required]],
      // 'estado' será "Pendiente" por defecto en el backend
      // 'costoTotal' se calculará y se pasará, no será un input del usuario
    });
  }

  ngOnInit(): void {
    // Solo necesitamos cargar los servicios disponibles
    this.servicioService.getAllServicios().pipe(map((res: ApiResponse<Servicio[]>) => res.data))
    .subscribe({
      next: (serviciosData) => {
        this.serviciosDisponibles = serviciosData;

        // Obtener datos del cliente autenticado para mostrar en el encabezado si es necesario
        this.authService.currentUser$.subscribe((user: UserData | null) => { 
          this.authService.userRole$.subscribe(role => {
            if (user && role === 'cliente') { 
              this.authenticatedClientCedula = user.cedula;
              this.authenticatedClientName = user.nombre;
              // No necesitamos setear idCliente en el form, lo gestiona el backend
            }
          });
        });

        if (this.citaToEdit) {
          this.patchFormForEdit();
        } else {
          // Si es una nueva cita, aseguramos que la fecha mínima sea hoy
          const today = new Date();
          const year = today.getFullYear();
          const month = (today.getMonth() + 1).toString().padStart(2, '0');
          const day = today.getDate().toString().padStart(2, '0');
          const hours = today.getHours().toString().padStart(2, '0');
          const minutes = today.getMinutes().toString().padStart(2, '0');
          const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
          
          // Establecer la fecha mínima en el input (requiere referencia al elemento si no está con formControlName)
          // Para formControlName, el input 'datetime-local' maneja el min automáticamente si el valor es válido.
          // Aquí sólo pre-llenamos con la fecha actual si es un nuevo registro
          this.citaForm.patchValue({
            fechaCita: minDateTime
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar datos para el formulario de cita:', err);
        Swal.fire('Error', 'No se pudieron cargar los datos necesarios para el formulario de cita.', 'error');
      }
    });
  }

  patchFormForEdit(): void {
    if (this.citaToEdit) {
      // Para edición, podríamos necesitar el código y el ID del cliente si se permite la edición de ciertos campos
      // Pero para este pedido, el cliente solo editará fecha y servicios.
      this.citaForm.patchValue({
        fechaCita: this.citaToEdit.fechaCita ? new Date(this.citaToEdit.fechaCita).toISOString().slice(0, 16) : '',
        // 'estado' y 'costoTotal' no son editables directamente por el cliente en este form
      });
      // El campo 'codigo' no existe en el form para cliente, pero se necesita para updateCita
      // 'idCliente' e 'idRecepcionista' tampoco se muestran/editan
      
      // Pre-seleccionar los servicios existentes en la cita
      if (this.citaToEdit.servicios && this.citaToEdit.servicios.length > 0) {
        this.selectedServices = this.citaToEdit.servicios.filter(
            s => this.serviciosDisponibles.some(ds => ds.codigo === s.codigo)
        );
        this.calculateTotalCost();
      }
    }
  }

  onServiceSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCodigo = selectElement.value;
    const selectedServicio = this.serviciosDisponibles.find(s => s.codigo === selectedCodigo);

    if (selectedServicio && !this.selectedServices.some(ss => ss.codigo === selectedCodigo)) {
      this.selectedServices.push(selectedServicio);
      this.calculateTotalCost();
    }
    selectElement.value = ''; 
  }

  removeService(index: number): void {
    this.selectedServices.splice(index, 1);
    this.calculateTotalCost();
  }

  calculateTotalCost(): void {
    this.totalCostoServicios = this.selectedServices.reduce((sum, servicio) => sum + (servicio.precio || 0), 0);
  }

  get f() { return this.citaForm.controls; }

  shouldShowServiceSelectionError(): boolean {
    // Solo mostrar si intentó enviar o si ya hay un error en el form y no hay servicios
    return this.selectedServices.length === 0 && (this.citaForm.touched || this.citaForm.dirty);
  }

  onSubmit(): void {
    if (this.citaForm.invalid || this.selectedServices.length === 0) {
      this.citaForm.markAllAsTouched();
      // Marcar el formulario como dirty y touched para que el mensaje de error de servicios aparezca
      if (this.selectedServices.length === 0) {
        this.citaForm.markAsDirty();
        this.citaForm.markAsTouched();
      }
      Swal.fire('Error de Validación', 'Por favor, completa la fecha y selecciona al menos un servicio.', 'error');
      return;
    }

    const formValues = this.citaForm.getRawValue();
    const serviceCodesToSend = this.selectedServices.map(s => s.codigo);

    // Los datos a enviar para createClientCita son simplificados
    const clientCitaData: ClientCitaInput = {
      fechaCita: formValues.fechaCita,
      servicio_codigos: serviceCodesToSend
    };

    let request$: Observable<any>;
    if (this.citaToEdit) {
      // Si estamos editando, se sigue necesitando el código de la cita original
      // y los campos que el backend necesita para update
      // Asumo que el cliente solo editará fecha y servicios para su cita
      const updateData: Partial<Cita> = { // Usamos Partial para los campos que vamos a enviar
          codigo: this.citaToEdit.codigo,
          idCliente: this.citaToEdit.idCliente, // Mantener el ID del cliente original
          idRecepcionista: this.citaToEdit.idRecepcionista, // Mantener el recepcionista original (podría ser null)
          fechaCita: formValues.fechaCita,
          estado: this.citaToEdit.estado, // Estado no editable por el cliente aquí
          costoTotal: this.totalCostoServicios, // Recalcular el costo total
          servicios: this.selectedServices // Esto se manejará en el backend con sync
      };
      // El método updateCita del servicio espera el Omit version de Cita
      // Convertimos el objeto Partial<Cita> a la estructura esperada por updateCita
      const fullUpdateData: CitaUpdateInput = {
          codigo: updateData.codigo!, // Asegurarse que no sea undefined
          idCliente: updateData.idCliente!,
          idRecepcionista: updateData.idRecepcionista === undefined ? null : updateData.idRecepcionista, // Puede ser null
          fechaCita: updateData.fechaCita!,
          estado: updateData.estado! as 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada',
          costoTotal: updateData.costoTotal!,
          servicio_codigos: serviceCodesToSend // Este es el array que el backend espera para sync
      };
      request$ = this.citaService.updateCita(fullUpdateData);

    } else {
      // Para crear, usamos el método simplificado para el cliente
      request$ = this.citaService.createClientCita(clientCitaData);
    }

    request$.subscribe({
      next: (response) => {
        Swal.fire('Éxito', response.message, 'success');
        this.formSubmitted.emit();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al guardar cita:', error);
        let errorMessage = 'Ocurrió un error al guardar la cita.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  onCancel(): void {
    this.formCancelled.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.citaForm.reset();
    this.selectedServices = []; 
    this.totalCostoServicios = 0;
    // Volver a pre-llenar la fecha actual y deshabilitar idCliente si aplica
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    this.citaForm.patchValue({
      fechaCita: minDateTime,
      estado: 'Pendiente' // Aseguramos que el estado por defecto se restablezca
    });

    // Restaurar el estado del cliente autenticado después de reset
    this.authService.currentUser$.subscribe((user: UserData | null) => { 
        this.authService.userRole$.subscribe(role => {
            if (user && role === 'cliente') {
                this.authenticatedClientCedula = user.cedula;
                this.authenticatedClientName = user.nombre;
                // No necesitamos setear idCliente en el form, lo gestiona el backend
                // No habilitamos/deshabilitamos idCliente aquí porque ya no es un campo directo
            }
        });
    });
  }

  formatCost(cost: number): string {
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
