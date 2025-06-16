import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'; // Importar HttpHeaders
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiURL } from '../../variables/apiURL';
import { ApiResponse, Servicio } from '../Cita/cita-service.service';//<-- Importar ApiResponse y Servicio

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
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
   * Helper para obtener los headers de autenticación para carga de archivos (FormData).
   * NO establece Content-Type, permitiendo que el navegador lo haga automáticamente
   * como 'multipart/form-data' con el boundary correcto.
   */
  private getAuthHeadersForFileUpload(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Accept': 'application/json', // Aceptar JSON como respuesta
      ...(token && { 'Authorization': `Bearer ${token}` }) // Añadir token de autorización
    });
  }

  /**
   * Obtiene todos los servicios desde el backend.
   * Ahora devuelve Observable<ApiResponse<Servicio[]>>
   */
  getAllServicios(): Observable<ApiResponse<Servicio[]>> { // <-- CAMBIO CLAVE AQUÍ
    return this.http.get<ApiResponse<Servicio[]>>(`${this.apiUrl}/servicio/all`, { headers: this.getHeaders() }) // <-- Añadir headers
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un servicio específico por su código.
   * Asume que tu endpoint es POST /api/servicio/get
   */
  getServicioByCodigo(codigo: string): Observable<ApiResponse<Servicio>> { // <-- CAMBIO CLAVE AQUÍ
    return this.http.post<ApiResponse<Servicio>>(`${this.apiUrl}/servicio/get`, { codigo: codigo }, { headers: this.getHeaders() }) // <-- Añadir headers
      .pipe(
        catchError(this.handleError)
      );
  }
  
    /**
   * Crea un nuevo servicio.
   */
  createServicio(formData: FormData): Observable<ApiResponse<Servicio>> {
    // Para enviar imágenes, necesitarás usar FormData si tu backend espera multipart/form-data.
    // Si urlImage es solo una URL, entonces JSON está bien.
    // Asumo que por ahora, urlImage es una URL o no se envía con create. Si manejas upload de imagen, necesitaremos FormData.
    return this.http.post<ApiResponse<Servicio>>(`${this.apiUrl}/servicio/create`, formData, { headers: this.getAuthHeadersForFileUpload() })
      .pipe(
        catchError(this.handleError)
      );
  }

    /**
   * Actualiza un servicio existente.
   */
  updateServicio(formData: FormData): Observable<ApiResponse<Servicio>> {
    return this.http.post<ApiResponse<Servicio>>(`${this.apiUrl}/servicio/update`, formData, { headers: this.getAuthHeadersForFileUpload() })
      .pipe(
        catchError(this.handleError)
      );
  }

    /**
   * Elimina un servicio por su código.
   * Envía el código en el cuerpo de la solicitud DELETE.
   * @param codigo El código del servicio a eliminar.
   */
  deleteServicio(codigo: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/servicio/delete`, { 
        body: { codigo: codigo }, // El código se envía en el cuerpo
        headers: this.getHeaders() 
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Puedes añadir métodos para crear, actualizar y eliminar servicios aquí si los necesitas en el futuro

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
