import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

// Importar interfaces y servicios necesarios
import { AuthService, UserData } from '../../services/auth/auth.service';
import { RecepcionistaService } from '../../services/Recepcionista/recepcionista-service.service';
import { Recepcionista, ApiResponse } from '../../services/Cita/cita-service.service'; // Importar Recepcionista y ApiResponse

@Component({
  selector: 'app-recepcionista-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './recepcionista-profile.component.html',
  styleUrls: ['./recepcionista-profile.component.css']
})
export class RecepcionistaProfileComponent implements OnInit {

  recepcionistaData: Recepcionista | null = null; // Datos del recepcionista actual
  profileForm: FormGroup; // Formulario reactivo para la edición del perfil
  isEditMode: boolean = false; // Bandera para controlar el modo de edición/visualización
  loading: boolean = true; // Indicador de carga
  error: string | null = null; // Mensaje de error

  selectedFile: File | null = null; // Archivo de imagen seleccionado para subir
  imagePreviewUrl: string | ArrayBuffer | null = null; // URL para la previsualización de la imagen
  
  // Datos del usuario autenticado que viene del AuthService
  authenticatedUserData: UserData | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private recepcionistaService: RecepcionistaService
  ) {
    // Inicialización del formulario de perfil
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.min(18), Validators.max(100)]], // Edad opcional, con rango
      sexo: [''], // Sexo opcional
      salario: ['', [Validators.min(0)]], // Salario opcional, con mínimo
      // Nota: la cédula no se edita y la imagen se maneja por separado (file input)
    });
  }

  ngOnInit(): void {
    // Nos suscribimos al currentUser$ del AuthService para obtener la cédula y otros datos
    this.authService.currentUser$.pipe(
      filter(userData => userData !== null), // Asegurarse de que el usuario no sea nulo
      take(1) // Tomar la primera emisión y desuscribirse
    ).subscribe(userData => {
      this.authenticatedUserData = userData;
      this.loadRecepcionistaProfile(); // Cargar el perfil una vez que tengamos la cédula del usuario autenticado
    }, error => {
      console.error('Error al obtener datos de autenticación del recepcionista:', error);
      this.error = 'No se pudo cargar la información de usuario autenticado.';
      this.loading = false;
    });
  }

  /**
   * Carga los datos del perfil del recepcionista desde el backend.
   */
  private loadRecepcionistaProfile(): void {
    if (!this.authenticatedUserData?.cedula) {
      this.error = 'Cédula del recepcionista no disponible. No se puede cargar el perfil.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;
    this.recepcionistaService.getAuthenticatedRecepcionistaProfile().subscribe({
      next: (response: ApiResponse<Recepcionista>) => {
        this.recepcionistaData = response.data;
        // Parchear el formulario con los datos obtenidos
        this.profileForm.patchValue({
          nombre: this.recepcionistaData.nombre,
          email: this.recepcionistaData.email,
          edad: this.recepcionistaData.edad,
          sexo: this.recepcionistaData.sexo,
          salario: this.recepcionistaData.salario
        });
        // Configurar la previsualización de la imagen si existe
        if (this.recepcionistaData.full_image_url) {
          this.imagePreviewUrl = this.recepcionistaData.full_image_url;
        } else {
          this.imagePreviewUrl = null;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el perfil del recepcionista:', err);
        this.error = 'No se pudo cargar el perfil del recepcionista. Intenta de nuevo más tarde.';
        this.loading = false;
        Swal.fire('Error de Carga', this.error, 'error');
      }
    });
  }

  /**
   * Alterna entre el modo de visualización y edición del perfil.
   */
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // Si salimos del modo edición, resetear el formulario a los valores originales
      // y limpiar cualquier selección de archivo pendiente
      if (this.recepcionistaData) {
        this.profileForm.patchValue({
          nombre: this.recepcionistaData.nombre,
          email: this.recepcionistaData.email,
          edad: this.recepcionistaData.edad,
          sexo: this.recepcionistaData.sexo,
          salario: this.recepcionistaData.salario
        });
        this.imagePreviewUrl = this.recepcionistaData.full_image_url || null;
      }
      this.selectedFile = null;
      this.profileForm.markAsPristine();
      this.profileForm.markAsUntouched();
    }
  }

  /**
   * Maneja la selección de un archivo de imagen para subir.
   * @param event El evento del input de tipo file.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      // Si no se selecciona un archivo y no había imagen previa, limpiar preview
      if (!this.recepcionistaData?.full_image_url) {
        this.imagePreviewUrl = null;
      }
    }
  }

  /**
   * Elimina la previsualización de la imagen y el archivo seleccionado.
   * Esto prepara la eliminación de la imagen existente en el backend si se guarda el perfil.
   */
  removeImagePreview(): void {
    this.imagePreviewUrl = null;
    this.selectedFile = null;
  }

  /**
   * Guarda los cambios del perfil del recepcionista.
   */
  onSubmit(): void {
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      Swal.fire('Error de Validación', 'Por favor, completa los campos requeridos y corrige los errores.', 'error');
      return;
    }

    if (!this.authenticatedUserData?.cedula) {
      Swal.fire('Error', 'No se pudo obtener la cédula del recepcionista para actualizar.', 'error');
      return;
    }

    const formData = new FormData();
    const formValues = this.profileForm.value;

    formData.append('cedula', this.authenticatedUserData.cedula); // La cédula es el identificador
    formData.append('nombre', formValues.nombre);
    formData.append('email', formValues.email);
    formData.append('edad', formValues.edad ? formValues.edad.toString() : '');
    formData.append('sexo', formValues.sexo || '');
    formData.append('salario', formValues.salario ? formValues.salario.toString() : '');

    // Manejo de la imagen
    if (this.selectedFile) {
      formData.append('urlImage', this.selectedFile, this.selectedFile.name);
    } else if (this.recepcionistaData?.full_image_url && !this.imagePreviewUrl) {
      // Si la imagen existía pero se quitó la previsualización y no se subió una nueva
      formData.append('urlImage', ''); // Indica al backend que elimine la imagen
    }
    // Si no había imagen y no se subió una nueva, o si la imagen existente se mantuvo, no se añade 'urlImage' al FormData

    // Laravel para PUT/PATCH con FormData a menudo requiere un campo _method=PUT
    formData.append('_method', 'PUT');

    // Headers específicos para FormData (no Content-Type)
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.recepcionistaService.updateAuthenticatedRecepcionistaProfile(formData, headers).subscribe({
      next: (response: ApiResponse<Recepcionista>) => {
        Swal.fire('¡Éxito!', response.message || 'Perfil actualizado correctamente.', 'success');
        this.isEditMode = false; // Salir del modo edición
        this.loadRecepcionistaProfile(); // Recargar el perfil para mostrar los cambios
        this.authService.userAuth().subscribe(); // Revalidar sesión para actualizar el estado global del usuario
      },
      error: (error) => {
        console.error('Error al actualizar perfil del recepcionista:', error);
        let errorMessage = 'Ocurrió un error al actualizar el perfil.';
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

  /**
   * Elimina la cuenta del recepcionista.
   */
  deleteAccount(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu cuenta de recepcionista permanentemente. ¡No se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar mi cuenta',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.recepcionistaService.deleteAuthenticatedRecepcionistaAccount().subscribe({
          next: (response: ApiResponse<any>) => {
            Swal.fire('Eliminada', response.message || 'Tu cuenta ha sido eliminada correctamente.', 'success');
            this.authService.clearAuthData(); // Limpiar datos de autenticación
            // Redirigir al login o a la página de inicio
            // Asegúrate de tener un servicio de router o navegar directamente si es un componente de ruta
            // Por ejemplo: this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Error al eliminar cuenta:', err);
            let errorMessage = 'No se pudo eliminar la cuenta.';
            if (err.error && err.error.message) errorMessage = err.error.message;
            Swal.fire('Error', errorMessage, 'error');
          }
        });
      }
    });
  }

  /**
   * Getter conveniente para acceder a los controles del formulario en el HTML.
   */
  get f() { return this.profileForm.controls; }

  /**
   * Helper para el placeholder de imagen
   */
  getPlaceholderImage(gender: string | null = null): string {
    const width = 150;
    const height = 150;
    let text = 'Recep.';
    let bgColor = 'E91E63'; // Color rosa por defecto
    
    if (gender) {
      if (gender.toLowerCase() === 'masculino') {
        text = 'Recep. H';
        bgColor = '3B82F6'; // Azul
      } else if (gender.toLowerCase() === 'femenino') {
        text = 'Recep. M';
        bgColor = 'F472B6'; // Rosa más suave
      }
    }
    return `https://placehold.co/${width}x${height}/${bgColor}/ffffff?text=${text}`;
  }
}