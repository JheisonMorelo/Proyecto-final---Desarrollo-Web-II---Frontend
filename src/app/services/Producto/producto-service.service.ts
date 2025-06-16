import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiURL } from '../../variables/apiURL'; // Asegúrate de que la ruta sea correcta
import { ApiResponse, Producto } from '../Cita/cita-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = apiURL.apiUrl; // URL base de tu API de Laravel

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los productos desde el backend.
   * Asume que tu endpoint es GET /api/producto/all
   */
  getAllProductos(): Observable<ApiResponse<Producto[]>> {
    return this.http.get<ApiResponse<Producto[]>>(`${this.apiUrl}/producto/all`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un producto específico por su código.
   * Asume que tu endpoint es POST /api/producto/get
   */
  getProductoByCodigo(codigo: string): Observable<Producto> {
    // Si tu backend espera un POST con el código en el body:
    return this.http.post<Producto>(`${this.apiUrl}/producto/get`, { codigo: codigo })
      .pipe(
        catchError(this.handleError)
      );
    // Si tu backend tuviera una ruta GET como /api/producto/{codigo}, sería:
    // return this.http.get<Producto>(`${this.apiUrl}/producto/${codigo}`).pipe(
    //   catchError(this.handleError)
    // );
  }

  // Puedes añadir métodos para crear, actualizar y eliminar productos aquí si los necesitas en el futuro

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente o de la red
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Errores del lado del backend
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.error.message || error.statusText}`;
      if (error.error.errors) {
        errorMessage += '\nErrores de validación: ' + JSON.stringify(error.error.errors);
      }
    }
    console.error(errorMessage); // Imprime el error en la consola para depuración
    return throwError(() => new Error(errorMessage));
  }
}