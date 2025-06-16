import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiURL } from '../../variables/apiURL';

// Interfaz para los datos de un Especialista
export interface Especialista {
  cedula: string;
  nombre: string;
  email: string;
  edad: number;
  sexo: string;
  rol: string;
  salario: number;
  urlImage: string | null;
  full_image_url?: string; // Atributo accesorio del modelo Laravel
  // Otros atributos si los devuelves
}

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {
  private apiUrl = apiURL.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los especialistas desde el backend.
   * Asume que tu endpoint es GET /api/especialista/all
   */
  getAllEspecialistas(): Observable<{ message: string, data: Especialista[]}> {
    return this.http.get<{ message: string, data: Especialista[] }>(`${this.apiUrl}/especialista/all`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Si necesitas obtener un especialista por cédula o email, podrías añadir métodos aquí.
  // Por ahora, solo necesitamos getAll para la sección del equipo.

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