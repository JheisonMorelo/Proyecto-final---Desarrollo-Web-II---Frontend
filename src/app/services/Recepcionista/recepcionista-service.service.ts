import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'; // Importar HttpHeaders
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiURL } from '../../variables/apiURL';
import { ApiResponse, Recepcionista } from '../Cita/cita-service.service'; // <-- Importar ApiResponse y Recepcionista

@Injectable({
  providedIn: 'root'
})

export class RecepcionistaService {
  private apiUrl = apiURL.apiUrl;

  constructor(private http: HttpClient) { }

  // Helper para obtener los headers de autenticación (añadido para consistencia)
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Usar authToken según tu AuthService
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  /**
   * Obtiene todos los recepcionistas desde el backend.
   * Ahora devuelve Observable<ApiResponse<Recepcionista[]>>
   */
  getAllRecepcionistas(): Observable<ApiResponse<Recepcionista[]>> { // <-- CAMBIO CLAVE AQUÍ
    return this.http.get<ApiResponse<Recepcionista[]>>(`${this.apiUrl}/recepcionista/all`, { headers: this.getHeaders() }) // <-- Añadir headers
      .pipe(
        catchError(this.handleError)
      );
  }

    /**
   * Obtiene el perfil del recepcionista autenticado.
   */
  getAuthenticatedRecepcionistaProfile(): Observable<ApiResponse<Recepcionista>> {
    return this.http.get<ApiResponse<Recepcionista>>(`${this.apiUrl}/recepcionista/perfil`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

    /**
   * Actualiza el perfil del recepcionista autenticado.
   * Recibe FormData directamente para manejar la imagen.
   * @param formData Los datos del perfil en formato FormData.
   * @param headers Los HttpHeaders que incluyen el token de autorización.
   */
  updateAuthenticatedRecepcionistaProfile(formData: FormData, headers: HttpHeaders): Observable<ApiResponse<Recepcionista>> {
    return this.http.put<ApiResponse<Recepcionista>>(`${this.apiUrl}/recepcionista/update-perfil`, formData, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Elimina la cuenta del recepcionista autenticado.
   */
  deleteAuthenticatedRecepcionistaAccount(): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/recepcionista/eliminar-cuenta`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.error.message || error.statusText}`;
      if (error.error.errors) {
        errorMessage += '\nErrores de validación: ' + JSON.stringify(error.error.errors);
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
