import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

// intercepta todos los errores HTTP y los muestra como toast
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 401 se maneja con redirección al login, no mostramos toast
      if (err.status !== 401) {
        const message = err.error?.error ?? 'Error de conexión con el servidor';
        toast.show(message, 'error');
      }
      return throwError(() => err);
    })
  );
};
