import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiURL } from '../../variables/apiURL';

// Interfaz para el modelo Servicio. La definimos aquí y la exportamos.
// Otros servicios o componentes que necesiten la interfaz Servicio la importarán desde aquí.
export interface Servicio {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  urlImage?: string | null;
  full_image_url?: string;
}

// Interfaz para el modelo Cliente. (Asegúrate que coincida con tu Cliente.php si lo tienes)
export interface Cliente {
  cedula: string;
  nombre: string;
  email: string;
  password?: string | null; // Solo si se necesita para enviar en ciertos casos (ej. update con password)
  edad?: number | null; // Puede ser null
  sexo?: string | null; // Puede ser null
  urlImage?: string | null; // Ruta relativa que Laravel guarda
  full_image_url?: string | null; // Atributo accesorio que generará el modelo Laravel, también puede ser null
  created_at?: string;
  updated_at?: string;
}

// Interfaz para el modelo Recepcionista. (Asegúrate que coincida con tu Recepcionista.php)
export interface Recepcionista {
  cedula: string;
  nombre: string;
  email: string;
  password?: string;
  edad?: number | null;
  sexo?: string | null;
  salario?: number | null;
  urlImage?: string | null;
  full_image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// NUEVO: Interfaz para el modelo Producto
export interface Producto {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  urlImage?: string | null;
  full_image_url?: string;
}

// Interfaz para los datos que el RECEPCIONISTA enviará al crear una cita
// Sin código de cita ni idRecepcionista (el backend los genera/asocia)
export interface RecepcionistaCitaInput { // <-- NUEVA INTERFAZ
  codigo: string;
  idCliente: string;
  fechaCita: string;
  estado: string;
  costoTotal: number;
  servicio_codigos: string[];
}

// NUEVO: Interfaz para el modelo AsistenteVentas
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

// Interfaz para el modelo Cita.
export interface Cita {
  codigo: string;
  idCliente: string; 
  idRecepcionista: string | null; 
  fechaCita: string; 
  estado: string;
  costoTotal: number;
  cliente?: Cliente; // Usar la interfaz Cliente definida aquí
  recepcionista?: Recepcionista; // Usar la interfaz Recepcionista definida aquí
  servicios?: Servicio[]; // Usar la interfaz Servicio definida aquí
  created_at?: string;
  updated_at?: string;
}

// Interfaz para el payload de actualización de cita
export interface CitaUpdateInput {
  codigo: string; // Identificador único de la cita, REQUERIDO para la actualización
  idCliente?: string; // Opcional, para cambiar el cliente asociado
  idRecepcionista?: string | null; // Opcional, para cambiar el recepcionista (si el recepcionista edita)
  fechaCita?: string; // Opcional, para cambiar la fecha/hora
  estado?: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada'; // Opcional, para cambiar el estado
  costoTotal?: number; // Opcional, el frontend lo calcula
  servicio_codigos?: string[]; // Opcional, para cambiar los servicios
}

// Interfaz para los datos que el cliente enviará al crear una cita
export interface ClientCitaInput {
    fechaCita: string;
    servicio_codigos: string[];
}

// -------------------------------------------------------------
// NUEVAS INTERFACES PARA PEDIDOS
// -------------------------------------------------------------

// Define la estructura para un producto dentro de un pedido (pivot data)
export interface PedidoProducto {
  producto_codigo: string; // El código del producto
  cantidad: number;        // La cantidad de este producto en el pedido
  producto?: Producto;     // Opcional: Detalles completos del producto si se cargan con el pedido
}

// Interfaz para el modelo Pedido
export interface Pedido {
  codigo: string;
  idCliente: string;
  idAsistente: string; // Cédula del asistente de ventas que generó el pedido
  fechaPedido: string;
  estado: 'Pendiente' | 'Completado' | 'Cancelado' | 'En Proceso' | 'Enviado'; // Estados posibles
  costoTotal: number;
  direccion: string;
  fechaRegistro: string;
  // Relaciones (opcionales, se cargan si el backend las incluye)
  cliente?: Cliente;
  asistente?: AsistenteVentas;
  productos?: PedidoProducto[]; // Lista de productos en el pedido, con cantidad
  created_at?: string;
  updated_at?: string;
}

// Interfaz para el payload de creación de pedido por el Asistente de Ventas
export interface PedidoInput {
  codigo: string; // Generado por el frontend (UUID)
  idCliente: string;
  // idAsistente no se envía desde el frontend si el backend lo obtiene del token
  fechaPedido: string;
  estado: 'Pendiente' | 'Completado' | 'Cancelado' | 'En Proceso' | 'Enviado';
  productos: { producto_codigo: string; cantidad: number }[]; // Array de productos con sus cantidades
}

// Interfaz para el payload de actualización de pedido
export interface PedidoUpdateInput {
  codigo: string; // Requerido para identificar el pedido a actualizar
  idCliente?: string;
  idAsistente?: string; // Podría cambiarse o no, depende de la lógica
  fechaPedido?: string;
  costoTotal?: number;
  estado?: 'Pendiente' | 'Completado' | 'Cancelado' | 'En Proceso' | 'Enviado';
  productos?: { producto_codigo: string; cantidad: number }[];
}

// Interfaz para la respuesta estándar de la API de Laravel
// Ahora exportada para que todos los servicios la puedan usar.
export interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CitaService {
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

  // Métodos del CitaService (todos devuelven ApiResponse<T>)
  getAllCitas(): Observable<ApiResponse<Cita[]>> {
    return this.http.get<ApiResponse<Cita[]>>(`${this.apiUrl}/cita/all`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getCitaByCodigo(codigo: string): Observable<ApiResponse<Cita>> {
    return this.http.post<ApiResponse<Cita>>(`${this.apiUrl}/cita/get`, { codigo }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createCita(citaData: RecepcionistaCitaInput): Observable<ApiResponse<Cita>> {
    return this.http.post<ApiResponse<Cita>>(`${this.apiUrl}/cita/create`, citaData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

    // NUEVO: Método para que el CLIENTE cree una cita simplificada
  createClientCita(citaData: ClientCitaInput): Observable<ApiResponse<Cita>> {
    return this.http.post<ApiResponse<Cita>>(`${this.apiUrl}/cita/registrar-propia`, citaData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }


  updateCita(citaData: CitaUpdateInput): Observable<ApiResponse<Cita>> {
    return this.http.put<ApiResponse<Cita>>(`${this.apiUrl}/cita/update`, citaData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteCita(codigo: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/cita/delete`, { body: { codigo }, headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getClientCitas(): Observable<ApiResponse<Cita[]>> {
    return this.http.get<ApiResponse<Cita[]>>(`${this.apiUrl}/cita/mis-citas`, { headers: this.getHeaders() })
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
