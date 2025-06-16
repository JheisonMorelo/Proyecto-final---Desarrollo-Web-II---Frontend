import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, combineLatest } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { apiURL } from '../../variables/apiURL';
import Swal from 'sweetalert2'; // Para notificaciones

// Interfaz para los datos del usuario logueado que vienen del backend
// (Puede ser Cliente, Recepcionista, AsistenteVentas, Especialista)
// Definimos las propiedades comunes y permitimos propiedades adicionales.
export interface UserData {
  cedula: string; // Todos tus tipos de usuarios tienen 'cedula'
  nombre: string; // Todos tus tipos de usuarios tienen 'nombre'
  email: string;  // Todos tus tipos de usuarios tienen 'email'
  // Puedes añadir aquí otras propiedades comunes a todos los usuarios (ej. edad, sexo, urlImage)
  edad?: number;
  sexo?: string;
  urlImage?: string | null;
  full_image_url?: string; // Si tienes un accessor en el backend

  // Permite propiedades adicionales sin errores de tipado,
  // como 'salario' para personal o 'telefono'/'direccion' para clientes.
  [key: string]: any;
}

// Interfaz que encapsula los datos de autenticación completos que devuelve el backend
// Esta interfaz se usará para tipar la respuesta del login.
export interface UserAuthData {
  user: UserData; // El objeto de datos del usuario
  token: string;   // El token de autenticación
  role: string;    // El rol del usuario (ej: 'cliente', 'recepcionista')
  permissions: string[]; // Array de permisos asignados al usuario/rol
  message?: string; // Mensaje opcional de la respuesta (ej. "Login exitoso")
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = apiURL.apiUrl;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // currentUserSubject contendrá la UserData (el objeto de usuario), no UserAuthData completa
  private currentUserSubject = new BehaviorSubject<UserData | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable(); // <-- Usaremos este para el usuario

  private userRoleSubject = new BehaviorSubject<string | null>(this.getStoredRole());
  public userRole$ = this.userRoleSubject.asObservable(); // <-- Usaremos este para el rol

  private userPermissionsSubject = new BehaviorSubject<string[]>(this.getStoredPermissions());
  public userPermissions$ = this.userPermissionsSubject.asObservable(); // <-- Usaremos este para los permisos

  constructor(private http: HttpClient, private router: Router) {
    this.loadInitialAuthData();
  }

  // --- Métodos de almacenamiento local ---
  // saveAuthData ahora espera la UserAuthData completa del backend
  private saveAuthData(authResponse: UserAuthData): void { // CAMBIO: Tipo de parámetro
    localStorage.setItem('authToken', authResponse.token);
    localStorage.setItem('authUser', JSON.stringify(authResponse.user)); // Guarda solo el objeto de usuario
    localStorage.setItem('userRole', authResponse.role);
    localStorage.setItem('userPermissions', JSON.stringify(authResponse.permissions));

    this.isLoggedInSubject.next(true);
    this.currentUserSubject.next(authResponse.user); // Emite el objeto de usuario
    this.userRoleSubject.next(authResponse.role);
    this.userPermissionsSubject.next(authResponse.permissions);
  }

  private clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPermissions');
    sessionStorage.removeItem('adminRegistrationAccess'); // Añadido para limpiar acceso admin temporal

    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
    this.userRoleSubject.next(null);
    this.userPermissionsSubject.next([]);
  }

  private getStoredUser(): UserData | null { // CAMBIO: Tipo de retorno
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  }

  private getStoredRole(): string | null {
    return localStorage.getItem('userRole');
  }

  private getStoredPermissions(): string[] {
    const permissions = localStorage.getItem('userPermissions');
    return permissions ? JSON.parse(permissions) : [];
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private loadInitialAuthData(): void {
    if (this.hasToken()) {
      const storedUser = this.getStoredUser();
      const storedRole = this.getStoredRole();
      const storedPermissions = this.getStoredPermissions();

      // Solo actualiza los Subjects si todos los datos necesarios están presentes
      if (storedUser && storedRole && storedPermissions.length >= 0) { // permissions can be empty array
        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(storedUser);
        this.userRoleSubject.next(storedRole);
        this.userPermissionsSubject.next(storedPermissions);

      } else {
        // Si falta algún dato, consideramos la sesión inválida y la limpiamos
        this.clearAuthData();
        console.warn('Incomplete auth data in localStorage. Cleared session.');
      }
    }
  }

  // --- Métodos de autenticación y autorización ---
  getCsrfToken(): Observable<any> {
    return this.http.get(`${this.apiUrl.replace('/api', '')}/sanctum/csrf-cookie`, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  private genericLogin(endpoint: string, credentials: any): Observable<UserAuthData> { // CAMBIO: Tipo de retorno
    return this.getCsrfToken().pipe(
      switchMap(() => {
        return this.http.post<UserAuthData>(`${this.apiUrl}${endpoint}`, credentials, { withCredentials: true }) // CAMBIO: Tipo de post
          .pipe(
            tap(response => {
              if (response.token && response.user && response.role && response.permissions) {
                this.saveAuthData(response); // Ahora saveAuthData espera UserAuthData
                Swal.fire('Login Exitoso', response.message || 'Bienvenido', 'success'); // Añadido Swal
                // Navegación se manejará en el componente de login, no aquí, para mayor flexibilidad.
              } else {
                console.warn('Login exitoso pero faltan datos de rol/permisos/usuario en la respuesta. Forzando logout.');
                console.log('Respuesta completa:', response);
                this.clearAuthData();
                throw new Error('Respuesta de login incompleta. Faltan datos de usuario/rol/permisos.');
              }
            }),
            catchError(this.handleError)
          );
      })
    );
  }

  // Métodos de login específicos para cada rol
  loginCliente(credentials: any): Observable<UserAuthData> {
    return this.genericLogin('/cliente/login', credentials);
  }

  loginRecepcionista(credentials: any): Observable<UserAuthData> {
    return this.genericLogin('/recepcionista/login', credentials);
  }

  loginEspecialista(credentials: any): Observable<UserAuthData> {
    return this.genericLogin('/especialista/login', credentials);
  }

  loginAsistenteVentas(credentials: any): Observable<UserAuthData> {
    return this.genericLogin('/asistente/login', credentials);
  }

  // --- Método genérico para REGISTRO ---
  // No hay cambio significativo aquí, ya que el registro no necesariamente inicia sesión automática
  private genericRegister(endpoint: string, userData: FormData): Observable<any> {
    return this.getCsrfToken().pipe(
      switchMap(() => {
        return this.http.post<any>(`${this.apiUrl}${endpoint}`, userData, { withCredentials: true })
          .pipe(
            tap(response => {
              // Para registro de personal, generalmente NO logueamos automáticamente.
              // El backend puede devolver el usuario creado, pero no un token para iniciar sesión.
              // Si el registro de personal *sí* debe loguear automáticamente (como el cliente),
              // entonces descomenta la lógica de saveAuthData aquí.
              if (response.token && response.user && response.role && response.permissions) {
                // Si el registro debería iniciar sesión automáticamente:
                // this.saveAuthData(response);
                console.log('Registro exitoso y sesión iniciada automáticamente (si el backend lo devuelve).');
              } else {
                console.log('Registro exitoso. No se inició sesión automáticamente (sin token/rol/permisos en respuesta).');
              }
            }),
            catchError(this.handleError)
          );
      })
    );
  }

  // Métodos de registro específicos para cada rol
  registerCliente(userData: FormData): Observable<any> {
    return this.genericRegister('/cliente/register', userData);
  }

  registerRecepcionista(userData: FormData): Observable<any> {
    return this.genericRegister('/recepcionista/register', userData);
  }

  registerEspecialista(userData: FormData): Observable<any> {
    return this.genericRegister('/especialista/register', userData);
  }

  registerAsistenteVentas(userData: FormData): Observable<any> {
    return this.genericRegister('/asistente/register', userData);
  }

  // --- Método de logout dinámico ---
  logout(): Observable<any> {
    const userRole = this.getStoredRole();
    let logoutEndpoint = '';

    if (!userRole) { // Si no hay rol, limpiamos y redirigimos
      console.warn('No hay rol almacenado para logout. Forzando limpieza de sesión.');
      this.clearAuthData();
      this.router.navigate(['/']);
      return throwError(() => new Error('No hay usuario autenticado.'));
    }

    switch (userRole) {
      case 'cliente':
        logoutEndpoint = '/cliente/logout';
        break;
      case 'recepcionista':
        logoutEndpoint = '/recepcionista/logout';
        break;
      case 'especialista':
        logoutEndpoint = '/especialista/logout';
        break;
      case 'asistente_ventas':
        logoutEndpoint = '/asistente/logout';
        break;
      default:
        console.error('Rol desconocido para cerrar sesión:', userRole);
        this.clearAuthData();
        this.router.navigate(['/']);
        return throwError(() => new Error('Rol de usuario no reconocido para cerrar sesión.'));
    }

    return this.http.get(`${this.apiUrl}${logoutEndpoint}`, { withCredentials: true })
      .pipe(
        tap(() => {
          this.clearAuthData();
          Swal.fire('Sesión Cerrada', 'Has cerrado tu sesión correctamente.', 'success');
          this.router.navigate(['/']);
        }),
        catchError(err => {
          console.error('Error al cerrar sesión:', err);
          Swal.fire('Error', 'No se pudo cerrar la sesión. Inténtalo de nuevo.', 'error');
          // Incluso si hay un error en el backend, forzamos el cierre de sesión en el frontend
          this.clearAuthData();
          this.router.navigate(['/']);
          return throwError(() => err);
        })
      );
  }

  // --- Método userAuth genérico y dinámico ---
  // Este método asume que el backend devuelve { user: UserData, role: string, permissions: string[] }
  userAuth(): Observable<UserAuthData> { // CAMBIO: Tipo de retorno
    const storedRole = this.getStoredRole();
    const storedToken = this.getToken(); // Necesitamos el token para la revalidación

    if (!storedRole || !storedToken) {
      this.clearAuthData();
      return throwError(() => new Error('No hay sesión activa o token para revalidar.'));
    }

    let authEndpoint = '';
    switch (storedRole) {
      case 'cliente':
        authEndpoint = '/cliente/autenticado';
        break;
      case 'recepcionista':
        authEndpoint = '/recepcionista/autenticado';
        break;
      case 'especialista':
        authEndpoint = '/especialista/autenticado';
        break;
      case 'asistente_ventas':
        authEndpoint = '/asistente/autenticado';
        break;
      default:
        this.clearAuthData();
        return throwError(() => new Error('Rol desconocido para revalidar autenticación.'));
    }

    return this.http.get<UserAuthData>(`${this.apiUrl}${authEndpoint}`, { withCredentials: true }) // CAMBIO: Tipo de get
      .pipe(
        tap(response => {
          // El backend debería devolver { user: UserData, role: string, permissions: string[] }
          // Reutilizamos el token almacenado ya que 'autenticado' no siempre lo devuelve.
          if (response && response.user && response.role && response.permissions) {
            this.saveAuthData({
              user: response.user,
              token: storedToken, // Reutilizar el token que ya tenemos
              role: response.role,
              permissions: response.permissions
            });
            console.log('Sesión revalidada con éxito.');
          } else {
            console.warn('Verificación de autenticación fallida o respuesta incompleta. Limpiando datos.');
            this.clearAuthData();
            throw new Error('Respuesta de autenticación incompleta.');
          }
        }),
        catchError(err => {
          console.error('Error al verificar autenticación:', err);
          this.clearAuthData();
          return throwError(() => err);
        })
      );
  }

  // --- Métodos de ayuda para permisos (Sin cambios) ---
  hasRole(roleName: string): Observable<boolean> {
    return this.userRole$.pipe(
      map(role => role === roleName)
    );
  }

  can(permissionName: string): Observable<boolean> {
    return this.userPermissions$.pipe(
      map(permissions => permissions.includes(permissionName))
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // handleError ya estaba presente y está bien
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.error.message || error.statusText}`;
      if (error.error.errors) {
        try {
          const laravelErrors = error.error.errors;
          for (const key in laravelErrors) {
            if (laravelErrors.hasOwnProperty(key)) {
              errorMessage += `\n${key}: ${laravelErrors[key].join(', ')}`;
            }
          }
        } catch (e) {
          console.warn('No se pudieron analizar los errores de validación de Laravel:', e);
        }
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
