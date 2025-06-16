import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // <--- Ajusta la ruta a tu AuthService
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login', // O el selector de tu componente
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // O tus estilos
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null; // Para mostrar mensajes de error al usuario

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Inyectar el AuthService
    private router: Router
  ) {
    // Inicializar el formulario reactivo con los campos de email y password
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Si el usuario ya está logueado, redirige al dashboard del cliente
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/dashboard']); // <--- Asegúrate de que esta sea la ruta de tu dashboard
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null; // Limpiar errores anteriores

    if (this.loginForm.valid) {
      // Llamar al método loginCliente del AuthService
      this.authService.loginCliente(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          
          // Navegar al dashboard del cliente después de un login exitoso
          this.router.navigate(['/dashboard']); // <--- Ruta de tu dashboard
        },
        error: (error) => {
          console.error('Error en el login:', error);
          // Mostrar mensaje de error al usuario
          this.errorMessage = error.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, introduce un email y contraseña válidos.';
      // Opcional: Marcar todos los campos como "tocados" para mostrar los errores de validación
      this.loginForm.markAllAsTouched();
    }
  }
}