// Importar la interfaz Servicio y ApiResponse desde cita-service.service.ts
import { Servicio, ApiResponse } from '../../services/Cita/cita-service.service';
// Importar ServicioService para interactuar con la API
import { ServicioService } from '../../services/Servicio/servicio-service.service';
// Importar FormGroup, FormBuilder, Validators para el formulario reactivo
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// Importar CommonModule y EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// Importar Swal para las notificaciones
import Swal from 'sweetalert2';
// Importar uuid para generar códigos únicos
import { v4 as uuidv4 } from 'uuid';
import { HttpHeaders } from '@angular/common/http'; // Para pasar headers específicos para FormData

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './servicio-form.component.html',
  styleUrls: ['./servicio-form.component.css']
})
export class ServicioFormComponent implements OnInit, OnChanges {
  // Input: Servicio a editar (si es modo edición)
  @Input() servicioToEdit: Servicio | null = null;
  // Output: Evento que se emite cuando el formulario se envía con éxito
  @Output() formSubmitted = new EventEmitter<void>();
  // Output: Evento que se emite cuando se cancela el formulario
  @Output() formCancelled = new EventEmitter<void>();

  // FormGroup para el formulario de servicio
  servicioForm: FormGroup;
  // Variable para almacenar el archivo de imagen seleccionado
  selectedFile: File | null = null;
  // URL de previsualización para la imagen (para mostrarla antes de subirla)
  imagePreviewUrl: string | ArrayBuffer | null = null;
  // Bandera para indicar si estamos en modo edición o creación
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder, // Inyectar FormBuilder para construir el formulario
    private servicioService: ServicioService // Inyectar ServicioService para las llamadas a la API
  ) {
    // Inicializar el formulario con sus controles y validaciones
    this.servicioForm = this.fb.group({
      nombre: ['', Validators.required], // Campo nombre, requerido
      descripcion: [''], // Campo descripción, opcional
      precio: ['', [Validators.required, Validators.min(0)]], // Campo precio, requerido y mínimo 0
      // Nota: 'codigo' no está aquí porque se genera automáticamente o viene en servicioToEdit
      // 'urlImage' no es un FormControl directo porque es un archivo, se maneja por separado
    });
  }

  ngOnInit(): void {
    // La lógica principal de inicialización y parcheo se manejará en ngOnChanges
    // para reaccionar a cambios en `servicioToEdit`.
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cambios en el input `servicioToEdit`
    if (changes['servicioToEdit']) {
      if (this.servicioToEdit) {
        // Modo edición: Parchear el formulario con los datos del servicio
        this.isEditMode = true;
        this.servicioForm.patchValue({
          nombre: this.servicioToEdit.nombre,
          descripcion: this.servicioToEdit.descripcion,
          precio: this.servicioToEdit.precio
        });
        // Si el servicio tiene una imagen, mostrarla como previsualización
        if (this.servicioToEdit.full_image_url) {
          this.imagePreviewUrl = this.servicioToEdit.full_image_url;
        } else {
          this.imagePreviewUrl = null; // Limpiar si no hay imagen
        }
      } else {
        // Modo creación o reset: Resetear el formulario
        this.isEditMode = false;
        this.resetForm();
      }
    }
  }

  /**
   * Maneja el evento de selección de archivo para la imagen.
   * @param event El evento de cambio del input de tipo file.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Almacenar el archivo seleccionado

      // Crear una URL de previsualización para mostrar la imagen seleccionada
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.imagePreviewUrl = null;
    }
  }

  /**
   * Resetea el formulario y las variables de imagen a su estado inicial.
   */
  private resetForm(): void {
    this.servicioForm.reset();
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.isEditMode = false;
  }

  /**
   * Getter conveniente para acceder a los controles del formulario en el HTML.
   */
  get f() { return this.servicioForm.controls; }

  /**
   * Maneja el envío del formulario, ya sea para crear o actualizar un servicio.
   */
  onSubmit(): void {
    this.servicioForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores

    if (this.servicioForm.invalid) {
      Swal.fire('Error de Validación', 'Por favor, completa todos los campos requeridos correctamente.', 'error');
      return;
    }

    // Crear un objeto FormData para enviar los datos, especialmente para la imagen.
    const formData = new FormData();
    const formValues = this.servicioForm.value;

    formData.append('nombre', formValues.nombre);
    formData.append('descripcion', formValues.descripcion || ''); // Asegurar que sea string
    formData.append('precio', formValues.precio.toString()); // Convertir precio a string para FormData

    if (this.isEditMode && this.servicioToEdit) {
      // Modo Edición
      formData.append('codigo', this.servicioToEdit.codigo); // El código es necesario para actualizar

      if (this.selectedFile) {
        // Si se seleccionó un nuevo archivo de imagen
        formData.append('urlImage', this.selectedFile, this.selectedFile.name);
      } else if (this.servicioToEdit.urlImage && !this.imagePreviewUrl) {
        // Si había una imagen pero se eliminó de la previsualización (e.g. se dejó en blanco),
        // y no se seleccionó un nuevo archivo, indicamos al backend que elimine la imagen.
        formData.append('urlImage', ''); // Enviar cadena vacía para indicar eliminación de imagen
      }

      this.servicioService.updateServicio(formData).subscribe({
        next: (response: ApiResponse<Servicio>) => {
          Swal.fire('¡Éxito!', response.message || 'Servicio actualizado correctamente.', 'success');
          this.formSubmitted.emit(); // Notificar al componente padre
          this.resetForm(); // Limpiar el formulario
        },
        error: (error) => {
          console.error('Error al actualizar servicio:', error);
          let errorMessage = 'Ocurrió un error al actualizar el servicio.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
            if (error.error.errors) {
                for (const key in error.error.errors) {
                    if (error.error.errors.hasOwnProperty(key) && Array.isArray(error.error.errors[key])) {
                        errorMessage += `\n- ${key}: ${error.error.errors[key].join(', ')}`;
                    }
                }
            }
          }
          Swal.fire('Error', errorMessage, 'error');
        }
      });

    } else {
      // Modo Creación
      formData.append('codigo', uuidv4()); // Generar UUID para el nuevo servicio

      if (this.selectedFile) {
        formData.append('urlImage', this.selectedFile, this.selectedFile.name);
      }
      
      this.servicioService.createServicio(formData).subscribe({
        next: (response: ApiResponse<Servicio>) => {
          Swal.fire('¡Éxito!', response.message || 'Servicio registrado correctamente.', 'success');
          this.formSubmitted.emit(); // Notificar al componente padre
          this.resetForm(); // Limpiar el formulario
        },
        error: (error) => {
          console.error('Error al registrar servicio:', error);
          let errorMessage = 'Ocurrió un error al registrar el servicio.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
            if (error.error.errors) {
                for (const key in error.error.errors) {
                    if (error.error.errors.hasOwnProperty(key) && Array.isArray(error.error.errors[key])) {
                        errorMessage += `\n- ${key}: ${error.error.errors[key].join(', ')}`;
                    }
                }
            }
          }
          Swal.fire('Error', errorMessage, 'error');
        }
      });
    }
  }

  /**
   * Cancela la operación y emite el evento de cancelación.
   */
  onCancel(): void {
    this.formCancelled.emit();
    this.resetForm();
  }

  /**
   * Verifica si un control del formulario es inválido y ha sido tocado/modificado.
   * Útil para mostrar mensajes de validación en el HTML.
   * @param controlName El nombre del control del formulario.
   * @returns `true` si el control es inválido y ha sido interactuado, `false` en caso contrario.
   */
  isInvalid(controlName: string): boolean {
    const control = this.servicioForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}