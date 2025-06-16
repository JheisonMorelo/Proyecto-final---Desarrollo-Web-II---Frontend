import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid'; // Importar uuidv4 para generar códigos únicos

// Importar interfaces desde cita-service.service.ts
import { 
  Cita, 
  CitaService, 
  ClientCitaInput, 
  RecepcionistaCitaInput, 
  CitaUpdateInput,
  Cliente, // <-- Usar Cliente de cita-service
  Servicio // <-- Usar Servicio de cita-service
} from '../../services/Cita/cita-service.service';

// Importar interfaces y servicios relacionados
import { ClienteService } from '../../services/Cliente/cliente-service.service';
import { RecepcionistaService } from '../../services/Recepcionista/recepcionista-service.service';
import { ServicioService } from '../../services/Servicio/servicio-service.service';

// Importar UserData y el AuthService de tu auth.service.ts
import { AuthService, UserData } from '../../services/auth/auth.service';


@Component({
  selector: 'app-gestionar-citas-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule // Necesario para [(ngModel)] en el select de añadir servicios
  ],
  templateUrl: './gestionar-citas-form.component.html',
  styleUrls: ['./gestionar-citas-form.component.css']
})
export class GestionarCitasFormComponent implements OnInit, OnChanges {
  @Input() citaToEdit: Cita | null = null;
  @Input() userRole: string | null = null;
  @Output() formSubmitted = new EventEmitter<void>();
  @Output() formCancelled = new EventEmitter<void>();

  citaForm: FormGroup;
  clientes: Cliente[] = [];
  serviciosDisponibles: Servicio[] = [];
  
  selectedServiceCodeToAdd: string | null = null;
  selectedCitaServices: Servicio[] = [];

  totalCostoServicios: number = 0;
  
  authenticatedUserData: UserData | null = null;
  private authServiceUserRole: string | null = null;

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private clienteService: ClienteService,
    private recepcionistaService: RecepcionistaService,
    private servicioService: ServicioService,
    private authService: AuthService
  ) {
    this.citaForm = this.fb.group({
      codigo: [{ value: '', disabled: true }],
      idCliente: ['', Validators.required],
      fechaCita: ['', Validators.required],
      estado: ['Pendiente', Validators.required],
      costoTotal: [{ value: 0, disabled: true }],
      servicio_codigos: [[] as string[], Validators.required] 
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.authService.currentUser$, 
      this.authService.userRole$     
    ]).pipe(
      filter(([userData, userRole]) => userData !== null && userRole !== null),
      take(1)
    ).subscribe(([userData, userRole]) => {
        this.authenticatedUserData = userData;
        this.authServiceUserRole = userRole;
        
        if (this.userRole === null || this.userRole === undefined) { 
             this.userRole = userRole; 
        }

        this.applyRoleBasedFormLogic();

        if (this.citaToEdit) {
          this.patchFormForEdit();
        }
    }, error => {
        console.error('Error inicial al obtener datos de autenticación en CitaFormComponent:', error);
        Swal.fire('Error de Inicialización', 'No se pudo cargar la información de usuario.', 'error');
        this.disableCriticalFields();
    });

    forkJoin({
      clientes: this.clienteService.getAllClientes().pipe(map(res => res.data || [])),
      servicios: this.servicioService.getAllServicios().pipe(map(res => res.data || []))
    }).subscribe({
      next: (data) => {
        this.clientes = data.clientes;
        this.serviciosDisponibles = data.servicios;

        if (this.citaToEdit) {
          this.patchFormForEdit();
        }
      },
      error: (err) => {
        console.error('Error al cargar datos de clientes y/o servicios en CitaFormComponent:', err);
        Swal.fire('Error', 'No se pudieron cargar los clientes y/o servicios necesarios.', 'error');
      }
    });

    this.citaForm.get('servicio_codigos')?.valueChanges.subscribe(() => {
      this.calculateTotalCost();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['citaToEdit']) {
      if (changes['citaToEdit'].currentValue) {
        this.citaToEdit = changes['citaToEdit'].currentValue;
        if (this.citaForm && this.serviciosDisponibles.length > 0 && this.clientes.length > 0) {
          this.patchFormForEdit();
          if (this.authenticatedUserData && this.userRole) {
            this.applyRoleBasedFormLogic();
          }
        }
      } else {
        if (this.citaForm) {
          this.resetForm();
        }
      }
    }
    if (changes['userRole'] && this.authenticatedUserData) {
        this.applyRoleBasedFormLogic();
    }
  }

  private applyRoleBasedFormLogic(): void {
    const roleToApply = this.userRole || this.authServiceUserRole;

    if (this.authenticatedUserData && roleToApply) {
      if (roleToApply === 'cliente') {
        this.citaForm.patchValue({ idCliente: this.authenticatedUserData.cedula });
        this.citaForm.get('idCliente')?.disable();
        this.citaForm.get('estado')?.disable();
        this.citaForm.get('fechaCita')?.enable();
        this.citaForm.get('servicio_codigos')?.enable();
      } else if (roleToApply === 'recepcionista') {
        this.citaForm.get('idCliente')?.enable();
        this.citaForm.get('estado')?.enable();
        this.citaForm.get('fechaCita')?.enable();
        this.citaForm.get('servicio_codigos')?.enable();
      }
      this.citaForm.get('codigo')?.disable();
    } else {
        console.warn('CitaFormComponent: No se pudo aplicar la lógica de formulario basada en el rol debido a la falta de información de autenticación.');
        this.disableCriticalFields();
    }
  }

  private disableCriticalFields(): void {
    this.citaForm.get('idCliente')?.disable();
    this.citaForm.get('fechaCita')?.disable();
    this.citaForm.get('estado')?.disable();
    this.citaForm.get('servicio_codigos')?.disable();
    this.selectedServiceCodeToAdd = null;
  }

  patchFormForEdit(): void {
    if (this.citaToEdit && this.citaForm) {
      const formattedDate = this.citaToEdit.fechaCita ? 
        new Date(this.citaToEdit.fechaCita).toISOString().slice(0, 16) : '';

      this.citaForm.patchValue({
        codigo: this.citaToEdit.codigo,
        idCliente: this.citaToEdit.idCliente,
        fechaCita: formattedDate,
        estado: this.citaToEdit.estado,
      });
      
      this.selectedCitaServices = this.citaToEdit.servicios || [];
      this.citaForm.get('servicio_codigos')?.setValue(this.selectedCitaServices.map(s => s.codigo));

      this.calculateTotalCost();
    }
  }

  addService(): void {
    if (this.selectedServiceCodeToAdd) {
      const serviceToAdd = this.serviciosDisponibles.find(s => s.codigo === this.selectedServiceCodeToAdd);
      if (serviceToAdd) {
        if (!this.selectedCitaServices.some(s => s.codigo === serviceToAdd.codigo)) {
          this.selectedCitaServices.push(serviceToAdd);
          this.updateServiciosFormControl();
          this.selectedServiceCodeToAdd = null;
          this.citaForm.get('servicio_codigos')?.markAsDirty();
          this.citaForm.get('servicio_codigos')?.markAsTouched();
        } else {
          Swal.fire('Atención', 'Este servicio ya ha sido añadido a la cita.', 'warning');
        }
      }
    } else {
      Swal.fire('Advertencia', 'Por favor, selecciona un servicio de la lista para añadir.', 'warning');
    }
  }

  removeService(serviceCode: string): void {
    this.selectedCitaServices = this.selectedCitaServices.filter(s => s.codigo !== serviceCode);
    this.updateServiciosFormControl();
    this.citaForm.get('servicio_codigos')?.markAsDirty();
    this.citaForm.get('servicio_codigos')?.markAsTouched();
  }

  private updateServiciosFormControl(): void {
    const codes = this.selectedCitaServices.map(s => s.codigo);
    this.citaForm.get('servicio_codigos')?.setValue(codes);
  }

  calculateTotalCost(): void {
    let totalCost = this.selectedCitaServices.reduce((sum, servicio) => sum + (servicio.precio || 0), 0);
    this.citaForm.get('costoTotal')?.setValue(totalCost);
    this.totalCostoServicios = totalCost; 
  }

  get f() { return this.citaForm.controls; }

  onSubmit(): void {
    this.citaForm.markAllAsTouched(); 

    if (this.citaForm.invalid) {
      Swal.fire('Error de Validación', 'Por favor, completa todos los campos requeridos.', 'error');
      return;
    }

    const formValues = this.citaForm.getRawValue(); 
    const fechaCitaFormatted = new Date(formValues.fechaCita).toISOString().slice(0, 19).replace('T', ' ');
    
    let request$: Observable<any>; 

    if (this.citaToEdit) { // Modo EDICIÓN
      const citaUpdatePayload: CitaUpdateInput = {
        codigo: formValues.codigo, 
        idCliente: formValues.idCliente,
        fechaCita: fechaCitaFormatted,
        estado: formValues.estado,
        costoTotal: formValues.costoTotal,
        servicio_codigos: formValues.servicio_codigos 
      };
      
      if (this.userRole === 'recepcionista' && this.authenticatedUserData) {
        citaUpdatePayload.idRecepcionista = this.authenticatedUserData.cedula;
      }

      request$ = this.citaService.updateCita(citaUpdatePayload);

    } else { // Modo CREACIÓN
      if (this.userRole === 'cliente' && this.authenticatedUserData) {
        const clienteCitaPayload: ClientCitaInput = { 
          fechaCita: fechaCitaFormatted,
          servicio_codigos: formValues.servicio_codigos 
        };
        request$ = this.citaService.createClientCita(clienteCitaPayload); 

      } else if (this.userRole === 'recepcionista' && this.authenticatedUserData) {
        // ¡GENERAMOS EL CÓDIGO AQUÍ PARA NUEVAS CITAS DE RECEPCIONISTA!
        const recepcionistaCitaPayload: RecepcionistaCitaInput = { 
          codigo: uuidv4(), // <-- ¡SOLUCIÓN AL ERROR 422!
          idCliente: formValues.idCliente, 
          fechaCita: fechaCitaFormatted,
          estado: formValues.estado,
          costoTotal: formValues.costoTotal,
          servicio_codigos: formValues.servicio_codigos 
        };
        request$ = this.citaService.createCita(recepcionistaCitaPayload); 

      } else {
        Swal.fire('Error', 'No se pudo determinar el tipo de usuario o la operación de creación. Por favor, recarga la página.', 'error');
        return;
      }
    }

    request$.subscribe({
      next: (response) => {
        Swal.fire('¡Éxito!', response.message, 'success');
        this.formSubmitted.emit(); 
        this.resetForm(); 
      },
      error: (error) => {
        console.error('Error al guardar cita:', error);
        let errorMessage = 'Ocurrió un error al guardar la cita.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
          if (error.error.errors) {
            for (const key in error.error.errors) {
              if (error.error.errors.hasOwnProperty(key) && Array.isArray(error.error.errors[key])) {
                errorMessage += `\n- ${key}: ${error.error.errors[key].join(', ')}`;
              }
            }
          }
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
    this.totalCostoServicios = 0;
    this.selectedCitaServices = []; 
    this.selectedServiceCodeToAdd = null; 
    this.citaForm.get('servicio_codigos')?.setValue([]); 
    this.citaForm.get('estado')?.patchValue('Pendiente'); 

    this.citaForm.get('codigo')?.disable(); 
    this.citaForm.get('idCliente')?.enable(); 
    this.citaForm.get('estado')?.enable(); 
    this.citaForm.get('fechaCita')?.enable();
    this.citaForm.get('servicio_codigos')?.enable();

    this.applyRoleBasedFormLogic();
  }

  isInvalid(controlName: string): boolean {
    const control = this.citaForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}