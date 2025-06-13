import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // <--- Ajusta la ruta a tu AuthService

@Component({
  selector: 'app-register', // O el selector de tu componente
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'] // O tus estilos
})
export class RegistroComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null; // Para mostrar mensajes de error

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Inyectar el AuthService
    private router: Router
  ) {
    // Inicializar el formulario reactivo con todos los campos de registro
    // Asegúrate de que los nombres de los campos coincidan EXACTAMENTE con los que Laravel espera
    this.registerForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      identificacion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(8)]],
      password_confirmation: ['', Validators.required], // Para el 'confirmed' de Laravel
      telefono: [''],
      direccion: [''],
      fecha_nacimiento: [''] // Puede requerir un validador de fecha si lo pides en el formulario
    }, {
      // Validador a nivel de formulario para la confirmación de contraseña
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Si el usuario ya está logueado, redirige al dashboard del cliente
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/dashboard-cliente']); // <--- Ruta de tu dashboard
      }
    });
  }

  // Validador personalizado para asegurar que password y password_confirmation coincidan
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : { 'mismatch': true }; // 'mismatch' será el error clave
  }

  onSubmit(): void {
    this.errorMessage = null; // Limpiar errores anteriores

    if (this.registerForm.valid) {
      // Llamar al método registerCliente del AuthService
      this.authService.registerCliente(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          // Navegar al dashboard del cliente después de un registro exitoso
          this.router.navigate(['/dashboard-cliente']); // <--- Ruta de tu dashboard
        },
        error: (error) => {
          console.error('Error en el registro:', error);
          // Mostrar mensaje de error al usuario (puedes parsear 'error.errors' para errores de validación específicos)
          this.errorMessage = error.message || 'Error al registrar. Por favor, intenta de nuevo.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.registerForm.markAllAsTouched(); // Para mostrar errores de validación
    }
  }
}