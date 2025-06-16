import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // Asegúrate de la ruta correcta
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-personal-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './personal-login.component.html',
  styleUrls: ['./personal-login.component.css']
})
export class PersonalLoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  // Opciones para el tipo de rol de personal
  staffRoles = [
    { value: 'recepcionista', label: 'Recepcionista' },
    { value: 'asistente_ventas', label: 'Asistente de Ventas' },
    { value: 'especialista', label: 'Especialista' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roleType: ['', Validators.required] // Para seleccionar el tipo de personal
    });
  }

  ngOnInit(): void {
    // Si ya está logueado, redirige al dashboard general
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.valid) {
      const { email, password, roleType } = this.loginForm.value;

      let loginObservable: Observable<any>;

      switch (roleType) {
        case 'recepcionista':
          loginObservable = this.authService.loginRecepcionista({ email, password });
          break;
        case 'asistente_ventas':
          loginObservable = this.authService.loginAsistenteVentas({ email, password });
          break;
        case 'especialista':
          loginObservable = this.authService.loginEspecialista({ email, password });
          break;
        default:
          this.errorMessage = 'Tipo de rol no válido.';
          return;
      }

      loginObservable.subscribe({
        next: (response) => {
          console.log('Login de personal exitoso:', response);
          Swal.fire({
            title: "Login exitoso",
            icon: "success"
          });
          this.router.navigate(['/dashboard']); // Redirige al dashboard general
        },
        error: (error) => {
          console.error('Error en el login de personal:', error);
          Swal.fire({
            title: "Error al iniciar sesión",
            icon: "error"
          })
          this.errorMessage = error.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales y el tipo de usuario.';
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
      this.errorMessage = 'Por favor, introduce un email, contraseña y tipo de usuario válidos.';
      this.loginForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar validaciones
    }
  }
}