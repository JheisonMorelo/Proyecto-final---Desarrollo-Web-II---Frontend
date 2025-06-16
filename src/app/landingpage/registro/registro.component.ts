import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // <--- Ajusta la ruta a tu AuthService
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  selectedFile: File | null = null; // Para almacenar el archivo de imagen seleccionado

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // Campos de Laravel Cliente:
      nombre: ['', Validators.required], // Corresponde a 'nombre' en Laravel (antes 'nombre_completo')
      cedula: ['', [Validators.required, Validators.maxLength(20)]], // Corresponde a 'cedula' en Laravel (antes 'identificacion')
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(8)]],
      password_confirmation: ['', Validators.required], // Para el 'confirmed' de Laravel
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]], // Añadido
      sexo: ['', Validators.required], // Añadido (M/F)
      urlImage: [null, Validators.required] // Campo para el archivo, requerido por el backend
    }, { validator: this.passwordMatchValidator }); // Aplica el validador a todo el FormGroup
  }

  ngOnInit(): void {
    
  }

  // Validador personalizado para asegurar que password y password_confirmation coincidan
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : { 'mismatch': true };
  }

  // Manejador de eventos para cuando se selecciona un archivo de imagen
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Actualiza el valor del FormControl 'urlImage' con el archivo
      this.registerForm.patchValue({ urlImage: this.selectedFile });
      // Marca el FormControl como 'touched' para que se muestren las validaciones si aplica
      this.registerForm.get('urlImage')?.updateValueAndValidity();
      this.registerForm.get('urlImage')?.markAsTouched();
    } else {
      this.selectedFile = null;
      this.registerForm.patchValue({ urlImage: null });
      this.registerForm.get('urlImage')?.updateValueAndValidity();
      this.registerForm.get('urlImage')?.markAsTouched();
    }
  }


  onSubmit(): void {
    this.errorMessage = null; // Limpiar errores anteriores

    if (this.registerForm.valid) {
      // Crear un objeto FormData para enviar datos y el archivo
      const formData = new FormData();
      formData.append('nombre', this.registerForm.get('nombre')?.value);
      formData.append('cedula', this.registerForm.get('cedula')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('password_confirmation', this.registerForm.get('password_confirmation')?.value);
      formData.append('edad', this.registerForm.get('edad')?.value);
      formData.append('sexo', this.registerForm.get('sexo')?.value);

      // Adjuntar el archivo de imagen si existe
      if (this.selectedFile) {
        formData.append('urlImage', this.selectedFile, this.selectedFile.name);
      } else {
        // Manejar el caso donde la imagen es requerida pero no seleccionada
        // Esto ya lo maneja el validador de formulario, pero es un recordatorio.
        this.errorMessage = 'Por favor, selecciona una imagen de perfil.';
        return;
      }

      // Llamar al método registerCliente del AuthService con FormData
      this.authService.registerCliente(formData).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          Swal.fire({
            title: "Cliente registrado exitosamente",
            icon: "success"
          });
          this.router.navigate(['landingpage/login']);
        },
        error: (error) => {
          console.error('Error en el registro:', error);
          Swal.fire({
            icon: "error",
            title: "Error en el registro..."
          });
          // Mostrar mensaje de error al usuario
          this.errorMessage = error.message || 'Error al registrar. Por favor, intenta de nuevo.';
          // Si hay errores de validación de Laravel, los muestra
          if (error.errors) {
            for (const key in error.errors) {
              if (error.errors.hasOwnProperty(key)) {
                this.errorMessage += `\n${key}: ${error.errors[key].join(', ')}`;
              }
            }
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente, incluyendo la imagen.';
      this.registerForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar validaciones
    }
  }
}