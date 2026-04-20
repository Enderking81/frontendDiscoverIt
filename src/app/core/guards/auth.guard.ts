import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// guard funcional (Angular 17): protege rutas que requieren estar logueado
export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.estaLogueado()) return true;

  // si no hay token redirige al login
  return router.createUrlTree(['/login']);
};
