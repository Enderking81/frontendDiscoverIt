import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { ApiError } from '../models';

// muestra los errores del backend como toast y cierra la sesión si el token venció
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const body = err.error as ApiError | null;

      if (err.status === 401 && auth.isLoggedIn()) {
        toast.show('Tu sesión venció, volvé a iniciar sesión', 'info');
        auth.logout();
      } else if (err.status === 0) {
        toast.show('No se pudo conectar con el servidor', 'error');
      } else if (err.status !== 401) {
        // si hay errores de validación mostramos el primero, que es el más claro para el usuario
        toast.show(body?.details?.[0]?.message ?? body?.error ?? 'Ocurrió un error inesperado', 'error');
      }
      return throwError(() => err);
    })
  );
};
