import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para el pipe async
import { AuthService } from '../../services/auth/auth.service'; // Asegúrate de la ruta correcta al AuthService
import { Subscription } from 'rxjs'; // Para manejar la suscripción
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-dashboard-header', // Selector más genérico
  standalone: true, // Asumimos standalone
  imports: [CommonModule], // Añadir CommonModule para ngIf y pipes
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})

export class DashboardHeaderComponent implements OnInit, OnDestroy {
  userName: string = 'Usuario'; // Nombre por defecto
  userRole: string = ''; // Rol del usuario
  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Suscribirse a los observables del AuthService para obtener la info del usuario
    this.authSubscription = combineLatest([
      this.authService.currentUser$,
      this.authService.userRole$
    ]).subscribe(([user, role]) => {
      this.userName = user?.nombre || 'Usuario'; // Asume que el usuario tiene una propiedad 'nombre'
      this.userRole = role || ''; // Asigna el rol
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Sesión cerrada exitosamente');
        // El AuthService ya maneja la redirección a /login
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        // Manejar el error, quizás mostrar un mensaje al usuario
      }
    });
  }
}