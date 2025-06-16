import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Cliente, ApiResponse } from '../../services/Cita/cita-service.service'; 
import { ClienteService } from '../../services/Cliente/cliente-service.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-client-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './client-profile-edit.component.html',
  styleUrls: ['./client-profile-edit.component.css']
})
export class ClientProfileEditComponent implements OnInit {
  @Input() clientProfile: Cliente | null = null; 
  @Output() profileUpdated = new EventEmitter<void>(); 
  @Output() editCancelled = new EventEmitter<void>(); 

  profileForm: FormGroup;
  selectedFile: File | null = null; 
  previewImageUrl: string | ArrayBuffer | null = null; 
  removeImageFlag: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    // Eliminamos la inyección de HttpClient directo, el servicio lo manejará
  ) {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      sexo: ['', Validators.required],
      password: ['', [Validators.minLength(8)]], 
      password_confirmation: [''],
    });

    this.profileForm.get('password')?.valueChanges.subscribe(() => {
      this.profileForm.get('password_confirmation')?.updateValueAndValidity();
    });
    this.profileForm.get('password_confirmation')?.setValidators([
      this.passwordMismatchValidator.bind(this.profileForm)
    ]);
  }

    // NUEVA FUNCIÓN: Validador personalizado para la confirmación de contraseña
  // Debe ser una función que reciba un AbstractControl (el control de password_confirmation)
  // y retorne un objeto de errores o null.
  passwordMismatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    // Acceder al FormGroup al que pertenece este control
    const formGroup = control.parent as FormGroup;
    // Si el FormGroup no está inicializado o no tiene el control 'password', no validar
    if (!formGroup || !formGroup.controls['password']) {
      return null;
    }

    const password = formGroup.controls['password'].value;
    const passwordConfirmation = control.value;

    // Solo validar si la contraseña no está vacía y las contraseñas no coinciden
    if (password && passwordConfirmation !== password) {
      return { mismatch: true }; // Retornar un objeto de error
    }
    return null; // Retornar null si la validación es exitosa
  }

  ngOnInit(): void {
    if (this.clientProfile) {
      this.profileForm.patchValue({
        nombre: this.clientProfile.nombre ?? '',
        email: this.clientProfile.email ?? '',
        // Manejar valores null de forma segura
        edad: this.clientProfile.edad ?? '', 
        sexo: this.clientProfile.sexo ?? '',
      });
      this.previewImageUrl = this.clientProfile.full_image_url || null;
      this.removeImageFlag = false; 
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.removeImageFlag = false; 

      const reader = new FileReader();
      reader.onload = e => this.previewImageUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      if (!this.removeImageFlag && this.clientProfile?.full_image_url) {
        this.previewImageUrl = this.clientProfile.full_image_url;
      } else {
        this.previewImageUrl = null;
      }
    }
  }

  onRemoveImageChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.removeImageFlag = checkbox.checked;
    if (this.removeImageFlag) {
      this.selectedFile = null; 
      this.previewImageUrl = null; 
    } else {
      if (this.clientProfile?.full_image_url && !this.selectedFile) {
        this.previewImageUrl = this.clientProfile.full_image_url;
      }
    }
  }

  get f() { return this.profileForm.controls; }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      Swal.fire('Error de Validación', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    const formData = new FormData();
    const formValues = this.profileForm.getRawValue();

    formData.append('nombre', formValues.nombre);
    formData.append('email', formValues.email);
    formData.append('edad', formValues.edad);
    formData.append('sexo', formValues.sexo);
    
    // Solo añadir la contraseña si se ha modificado y es válida
    if (formValues.password) {
      if (formValues.password !== formValues.password_confirmation) {
        Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
        return;
      }
      formData.append('password', formValues.password);
      formData.append('password_confirmation', formValues.password_confirmation);
    }

    // Manejar la imagen
    if (this.selectedFile) {
      formData.append('urlImage', this.selectedFile, this.selectedFile.name);
    } else if (this.removeImageFlag) {
      formData.append('removeImage', '1'); 
    }

    // Obtener el token de autorización
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
      // No Content-Type aquí; FormData lo maneja automáticamente como multipart/form-data
    });


    this.clienteService.updateAuthenticatedClientProfile(formData, headers).subscribe({
      next: (response) => {
        Swal.fire('Actualizado!', response.message, 'success');
        this.profileUpdated.emit(); 
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        let errorMessage = 'No se pudo actualizar el perfil. ';
        if (err.error && err.error.message) {
          errorMessage += err.error.message;
          if (err.error.errors) {
            errorMessage += '\nDetalles: ' + JSON.stringify(err.error.errors);
          }
        } else if (err.message) {
            errorMessage += err.message;
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  onCancel(): void {
    this.editCancelled.emit(); 
  }
}
