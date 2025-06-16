// src/app/variables/apiURL.ts

// Importa el objeto 'environment' desde el archivo de entorno apropiado.
// Angular se encarga automáticamente de usar 'environment.ts' en desarrollo
// y 'environment.prod.ts' en producción durante el proceso de build.
import { environment } from '../enviroments/enviroment';

export const apiURL = {
  // Ahora, 'apiUrl' toma su valor del objeto 'environment'.
  // Por lo tanto, no necesitas cambiarlo manualmente cuando pasas a producción.
  apiUrl: environment.apiUrl
};