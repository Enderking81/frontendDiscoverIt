import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// configuración global de la aplicación Angular (reemplaza AppModule)
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),      // habilita el sistema de rutas
    provideHttpClient()         // habilita HttpClient para llamadas a la API
  ]
};
