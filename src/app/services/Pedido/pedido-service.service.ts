import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiURL } from '../../variables/apiURL';

// Interfaz para el modelo Producto.
export interface Producto {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  precio?: number; // Asegúrate de que el precio sea numérico
  stock?: number;
  urlImage?: string | null;
  full_image_url?: string;
}

// Interfaz para el modelo Cliente.
export interface Cliente {
  cedula: string;
  nombre: string;
  email: string;
  edad?: number;
  sexo?: string;
  telefono?: string;
  direccion?: string;
  urlImage?: string | null;
  full_image_url?: string;
}

// Interfaz para el modelo AsistenteVentas.
export interface AsistenteVentas {
  cedula: string;
  nombre: string;
  email: string;
  edad?: number;
  sexo?: string;
  salario?: number;
  urlImage?: string | null;
  full_image_url?: string;
}

// Interfaz para la tabla pivote contienePedido
export interface ContienePedido {
  codigoPedido: string;
  codigoProducto: string;
  numProductos: number;
}

// Interfaz para el modelo Pedido.
export interface Pedido {
  codigo: string;
  idCliente: string; 
  idAsistenteVentas: string | null; // <-- Ahora puede ser null
  direccion: string;
  fechaRegistro: string; 
  estado: string;
  costoTotal: number;
  cliente?: Cliente; 
  asistenteVentas?: AsistenteVentas | null; // <-- Ahora puede ser null
  productos?: (Producto & { pivot: { numProductos: number } })[]; // Incluye la cantidad del pivote
  created_at?: string;
  updated_at?: string;
}

// Interfaz para los datos que el cliente enviará al crear un pedido
export interface ClientPedidoInput {
    direccion: string;
    fechaRegistro: string;
    // Array de objetos con código de producto y cantidad
    productos_con_cantidades: { codigo: string; cantidad: number }[]; 
}

// Interfaz para los datos que se pueden enviar al actualizar un pedido (más flexible)
export interface PedidoUpdateInput {
  codigo: string;
  idCliente: string;
  idAsistenteVentas?: string | null; // Puede ser opcional y null
  direccion: string;
  fechaRegistro: string;
  estado: string;
  costoTotal: number;
  productos_con_cantidades?: { codigo: string; cantidad: number }[];
}

// Interfaz para la respuesta estándar de la API de Laravel
export interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
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

  getAllPedidos(): Observable<ApiResponse<Pedido[]>> {
    return this.http.get<ApiResponse<Pedido[]>>(`${this.apiUrl}/pedido/all`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getPedidoByCodigo(codigo: string): Observable<ApiResponse<Pedido>> {
    return this.http.post<ApiResponse<Pedido>>(`${this.apiUrl}/pedido/get`, { codigo }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // createPedido se mantiene para personal/admin (completa)
  createPedido(pedidoData: Omit<Pedido, 'cliente' | 'asistenteVentas' | 'productos' | 'created_at' | 'updated_at'>): Observable<ApiResponse<Pedido>> {
    return this.http.post<ApiResponse<Pedido>>(`${this.apiUrl}/pedido/create`, pedidoData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // NUEVO: Método para que el CLIENTE cree un pedido simplificado
  createClientPedido(pedidoData: ClientPedidoInput): Observable<ApiResponse<Pedido>> {
    return this.http.post<ApiResponse<Pedido>>(`${this.apiUrl}/pedido/registrar-propio`, pedidoData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // MODIFICADO: updatePedido ahora usa la interfaz PedidoUpdateInput
  updatePedido(pedidoData: PedidoUpdateInput): Observable<ApiResponse<Pedido>> {
    return this.http.put<ApiResponse<Pedido>>(`${this.apiUrl}/pedido/update`, pedidoData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deletePedido(codigo: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/pedido/delete`, { body: { codigo }, headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getClientPedidos(): Observable<ApiResponse<Pedido[]>> {
    return this.http.get<ApiResponse<Pedido[]>>(`${this.apiUrl}/pedido/mis-pedidos`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
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
