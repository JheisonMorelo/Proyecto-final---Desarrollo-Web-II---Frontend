import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiURL } from '../../variables/apiURL';
import { ApiResponse } from '../../services/Cita/cita-service.service';

// Interfaz para los datos de un Asistente de Ventas
export interface AsistenteVentas {
  cedula: string;
  nombre: string;
  email: string;
  edad: number;
  sexo: string;
  salario: number;
  urlImage: string | null;
  full_image_url?: string; // Atributo accesorio del modelo Laravel
  // Otros atributos si los devuelves
}

@Injectable({
  providedIn: 'root'
})
export class AsistenteService {
  private apiUrl = apiURL.apiUrl;

  constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Usar authToken según tu AuthService
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  /**
   * Obtiene todos los asistentes de ventas desde el backend.
   * Asume que tu endpoint es GET /api/asistenteVentas/all
   */
  getAllAsistentesVentas(): Observable<ApiResponse<AsistenteVentas[]>> {
    return this.http.get<ApiResponse<AsistenteVentas[]>>(`${this.apiUrl}/asistente/all`)
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