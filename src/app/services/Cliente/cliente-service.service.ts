import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiURL } from '../../variables/apiURL';
import { ApiResponse, Cliente } from '../Cita/cita-service.service'; // <-- Importar ApiResponse y Cliente

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = apiURL.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  /**
   * Obtiene todos los clientes del backend (para personal admin/recepcionista).
   */
  getAllClientes(): Observable<ApiResponse<Cliente[]>> {
    return this.http.get<ApiResponse<Cliente[]>>(`${this.apiUrl}/cliente/all`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene el perfil del cliente autenticado.
   */
  getAuthenticatedClientProfile(): Observable<ApiResponse<Cliente>> {
    return this.http.get<ApiResponse<Cliente>>(`${this.apiUrl}/cliente/perfil`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }


  /**
   * Actualiza el perfil del cliente autenticado.
   * @param profileData Los datos del perfil a actualizar.
   */
  updateAuthenticatedClientProfile(formData: FormData, headers: HttpHeaders): Observable<ApiResponse<Cliente>> {
    return this.http.post<ApiResponse<Cliente>>(`${this.apiUrl}/cliente/update-perfil`, formData, { headers: headers })
      .pipe(catchError(this.handleError));
  }

/**
 * Elimina la cuenta del cliente autenticado.
 */
deleteAuthenticatedClientAccount(): Observable < ApiResponse < any >> {
  return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/cliente/eliminar-cuenta`, { headers: this.getHeaders() })
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
