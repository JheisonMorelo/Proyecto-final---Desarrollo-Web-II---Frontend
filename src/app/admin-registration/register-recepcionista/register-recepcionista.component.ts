import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // Asegúrate de la ruta correcta
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-recepcionista',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-recepcionista.component.html',
  styleUrls: ['./register-recepcionista.component.css'] // Puedes crear un nuevo CSS o reutilizar
})
export class RegisterRecepcionistaComponent implements OnInit {
  registerRecepcionistaForm: FormGroup;
  errorMessage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerRecepcionistaForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(8)]],
      password_confirmation: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      sexo: ['', Validators.required], // M/F
      salario: ['', [Validators.required, Validators.min(0)]], // Salario específico de recepcionista
      urlImage: [null, Validators.required] // Imagen de perfil
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {

  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : { 'mismatch': true };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.registerRecepcionistaForm.patchValue({ urlImage: this.selectedFile });
      this.registerRecepcionistaForm.get('urlImage')?.updateValueAndValidity();
      this.registerRecepcionistaForm.get('urlImage')?.markAsTouched();
    } else {
      this.selectedFile = null;
      this.registerRecepcionistaForm.patchValue({ urlImage: null });
      this.registerRecepcionistaForm.get('urlImage')?.updateValueAndValidity();
      this.registerRecepcionistaForm.get('urlImage')?.markAsTouched();
    }
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.registerRecepcionistaForm.valid) {
      const formData = new FormData();
      formData.append('cedula', this.registerRecepcionistaForm.get('cedula')?.value);
      formData.append('nombre', this.registerRecepcionistaForm.get('nombre')?.value);
      formData.append('email', this.registerRecepcionistaForm.get('email')?.value);
      formData.append('password', this.registerRecepcionistaForm.get('password')?.value);
      formData.append('password_confirmation', this.registerRecepcionistaForm.get('password_confirmation')?.value);
      formData.append('edad', this.registerRecepcionistaForm.get('edad')?.value);
      formData.append('sexo', this.registerRecepcionistaForm.get('sexo')?.value);
      formData.append('salario', this.registerRecepcionistaForm.get('salario')?.value);

      if (this.selectedFile) {
        formData.append('urlImage', this.selectedFile, this.selectedFile.name);
      } else {
        this.errorMessage = 'Por favor, selecciona una imagen de perfil para el recepcionista.';
        return;
      }

      this.authService.registerRecepcionista(formData).subscribe({
        next: (response) => {
          console.log('Registro de Recepcionista exitoso:', response);
          Swal.fire({
            title: "Recepcionista Registrado",
            text: "La cuenta del recepcionista ha sido creada exitosamente.",
            icon: "success"
          });
          this.registerRecepcionistaForm.reset(); // Limpiar el formulario
          this.selectedFile = null; // Limpiar el archivo seleccionado
          this.registerRecepcionistaForm.get('sexo')?.patchValue(''); // Resetear el select a placeholder
        },
        error: (error) => {
          console.error('Error en el registro de recepcionista:', error);
          let userFriendlyMessage = 'Error al registrar al recepcionista. Por favor, verifica los datos.';
          if (error.errors) { // Si hay errores de validación de Laravel
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
      this.registerRecepcionistaForm.markAllAsTouched();
    }
  }
}