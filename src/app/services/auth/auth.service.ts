import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { apiURL } from '../../variables/apiURL'; // Importa tus variables de entorno

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = apiURL.apiUrl; // URL base de tu backend Laravel
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Observable para el estado de login

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken'); // Verifica si hay un token guardado
  }

  // --- Métodos de autenticación para Cliente ---

  registerCliente(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/cliente/register`, userData)
      .pipe(
        tap(response => {
          this.saveAuthData(response.token, response.user);
          this.isLoggedInSubject.next(true); // Actualiza el estado de login
        }),
        catchError(this.handleError)
      );
  }

loginCliente(credentials: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/auth/cliente/login`, credentials)
    .pipe(
      tap(response => {
        this.saveAuthData(response.token, response.user);
        this.isLoggedInSubject.next(true);
      }),
      catchError(this.handleError)
    );
}


  logoutCliente(): Observable<any> {
    // Realiza la petición de logout al backend
    return this.http.post(`${this.apiUrl}/auth/cliente/logout`, {})
      .pipe(
        tap(() => {
          this.clearAuthData(); // Limpia datos de auth local
          this.isLoggedInSubject.next(false); // Actualiza el estado de login
          this.router.navigate(['/login']); // Redirige al login
        }),
        catchError(this.handleError) // Maneja errores del logout
      );
  }

  getAuthCliente(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/cliente/user`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // --- Métodos auxiliares para almacenamiento local ---

  private saveAuthData(token: string, user: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getLoggedInUser(): any | null {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  }

  // Manejo de errores HTTP para el servicio
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente o de la red
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Errores del lado del backend
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.error.message || error.statusText}`;
      if (error.error.errors) {
        // Errores de validación de Laravel
        errorMessage += '\nErrores de validación: ' + JSON.stringify(error.error.errors, null, 2);
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage)); // Devolver un Observable de error
  }
}