import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // Asegúrate de la ruta correcta
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-especialista',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-especialista.component.html',
  styleUrls: ['./register-especialista.component.css']
})
export class RegisterEspecialistaComponent implements OnInit {
  registerEspecialistaForm: FormGroup;
  errorMessage: string | null = null;
  selectedFile: File | null = null;

  // Roles específicos para un Especialista si quieres que el "rol" sea un selector
  // Si el rol es fijo como 'especialista', podrías quitar este array y el campo del formulario.
  // Sin embargo, tu backend espera un campo 'rol' en la tabla especialista.
  especialistaRoles = [
    { value: 'Cosmetóloga', label: 'Cosmetóloga' },
    { value: 'Dermatóloga', label: 'Dermatóloga' },
    { value: 'Masajista', label: 'Masajista Terapéutica' },
    { value: 'Nutricionista', label: 'Nutricionista' }
    // Añade más roles si es necesario para tu clínica
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerEspecialistaForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(8)]],
      password_confirmation: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      sexo: ['', Validators.required], // M/F
      rol: ['', Validators.required], // Campo 'rol' para Especialista
      salario: ['', [Validators.required, Validators.min(0)]], 
      urlImage: [null, Validators.required] // Imagen de perfil
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Este componente está dentro del dashboard, no se redirige aquí al loguearse.
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : { 'mismatch': true };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.registerEspecialistaForm.patchValue({ urlImage: this.selectedFile });
      this.registerEspecialistaForm.get('urlImage')?.updateValueAndValidity();
      this.registerEspecialistaForm.get('urlImage')?.markAsTouched();
    } else {
      this.selectedFile = null;
      this.registerEspecialistaForm.patchValue({ urlImage: null });
      this.registerEspecialistaForm.get('urlImage')?.updateValueAndValidity();
      this.registerEspecialistaForm.get('urlImage')?.markAsTouched();
    }
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.registerEspecialistaForm.valid) {
      const formData = new FormData();
      formData.append('cedula', this.registerEspecialistaForm.get('cedula')?.value);
      formData.append('nombre', this.registerEspecialistaForm.get('nombre')?.value);
      formData.append('email', this.registerEspecialistaForm.get('email')?.value);
      formData.append('password', this.registerEspecialistaForm.get('password')?.value);
      formData.append('password_confirmation', this.registerEspecialistaForm.get('password_confirmation')?.value);
      formData.append('edad', this.registerEspecialistaForm.get('edad')?.value);
      formData.append('sexo', this.registerEspecialistaForm.get('sexo')?.value);
      formData.append('rol', this.registerEspecialistaForm.get('rol')?.value); // Campo 'rol'
      formData.append('salario', this.registerEspecialistaForm.get('salario')?.value);

      if (this.selectedFile) {
        formData.append('urlImage', this.selectedFile, this.selectedFile.name);
      } else {
        this.errorMessage = 'Por favor, selecciona una imagen de perfil para el especialista.';
        return;
      }

      this.authService.registerEspecialista(formData).subscribe({
        next: (response) => {
          console.log('Registro de Especialista exitoso:', response);
          Swal.fire({
            title: "Especialista Registrado",
            text: "La cuenta del especialista ha sido creada exitosamente.",
            icon: "success"
          });
          this.registerEspecialistaForm.reset(); 
          this.selectedFile = null; 
          this.registerEspecialistaForm.get('sexo')?.patchValue(''); 
          this.registerEspecialistaForm.get('rol')?.patchValue(''); // Resetear el select de rol
        },
        error: (error) => {
          console.error('Error en el registro de especialista:', error);
          let userFriendlyMessage = 'Error al registrar al especialista. Por favor, verifica los datos.';
          if (error.errors) { 
            const errorDetails = Object.values(error.errors).flat().join('\n');
            userFriendlyMessage += `\nDetalles: ${errorDetails}`;
          }
          this.errorMessage = userFriendlyMessage;
          Swal.fire({
            title: "Error de Registro",
            text: userFriendlyMessage,
            icon: "error"
          });
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente, incluyendo la imagen.';
      this.registerEspecialistaForm.markAllAsTouched();
    }
  }
}
