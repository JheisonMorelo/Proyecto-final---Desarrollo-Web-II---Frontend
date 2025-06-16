// src/environments/environment.prod.ts
// Este archivo se usa cuando construyes tu aplicación para producción (ng build --configuration=production).

export const environment = {
  production: true,
  // ¡¡AÑADE AQUÍ LA URL REAL DE TU BACKEND LARAVEL EN PRODUCCIÓN!!
  // Ejemplo: 'https://api.tu-dominio-backend.com/api'
  // O si tu API está bajo un subpath del mismo dominio: 'https://tu-dominio-frontend.com/api'
  apiUrl: 'https://api.tudominioapi.com/api' // <--- ¡CAMBIA ESTO POR TU URL REAL!
};