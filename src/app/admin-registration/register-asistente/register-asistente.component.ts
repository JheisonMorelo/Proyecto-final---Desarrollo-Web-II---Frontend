import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // Asegúrate de la ruta correcta
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-asistente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-asistente.component.html',
  styleUrls: ['./register-asistente.component.css']
})
export class RegisterAsistenteComponent implements OnInit {
  registerAsistenteVentasForm: FormGroup;
  errorMessage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerAsistenteVentasForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(8)]],
      password_confirmation: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      sexo: ['', Validators.required], // M/F
      salario: ['', [Validators.required, Validators.min(0)]], // Salario específico de asistente de ventas
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
      this.registerAsistenteVentasForm.patchValue({ urlImage: this.selectedFile });
      this.registerAsistenteVentasForm.get('urlImage')?.updateValueAndValidity();
      this.registerAsistenteVentasForm.get('urlImage')?.markAsTouched();
    } else {
      this.selectedFile = null;
      this.registerAsistenteVentasForm.patchValue({ urlImage: null });
      this.registerAsistenteVentasForm.get('urlImage')?.updateValueAndValidity();
      this.registerAsistenteVentasForm.get('urlImage')?.markAsTouched();
    }
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.registerAsistenteVentasForm.valid) {
      const formData = new FormData();
      formData.append('cedula', this.registerAsistenteVentasForm.get('cedula')?.value);
      formData.append('nombre', this.registerAsistenteVentasForm.get('nombre')?.value);
      formData.append('email', this.registerAsistenteVentasForm.get('email')?.value);
      formData.append('password', this.registerAsistenteVentasForm.get('password')?.value);
      formData.append('password_confirmation', this.registerAsistenteVentasForm.get('password_confirmation')?.value);
      formData.append('edad', this.registerAsistenteVentasForm.get('edad')?.value);
      formData.append('sexo', this.registerAsistenteVentasForm.get('sexo')?.value);
      formData.append('salario', this.registerAsistenteVentasForm.get('salario')?.value);

      if (this.selectedFile) {
        formData.append('urlImage', this.selectedFile, this.selectedFile.name);
      } else {
        this.errorMessage = 'Por favor, selecciona una imagen de perfil para el asistente de ventas.';
        return;
      }

      this.authService.registerAsistenteVentas(formData).subscribe({
        next: (response) => {
          console.log('Registro de Asistente de Ventas exitoso:', response);
          Swal.fire({
            title: "Asistente de Ventas Registrado",
            text: "La cuenta del asistente de ventas ha sido creada exitosamente.",
            icon: "success"
          });
          this.registerAsistenteVentasForm.reset(); 
          this.selectedFile = null; 
          this.registerAsistenteVentasForm.get('sexo')?.patchValue(''); 
        },
        error: (error) => {
          console.error('Error en el registro de asistente de ventas:', error);
          let userFriendlyMessage = 'Error al registrar al asistente de ventas. Por favor, verifica los datos.';
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
      this.registerAsistenteVentasForm.markAllAsTouched();
    }
  }
}
