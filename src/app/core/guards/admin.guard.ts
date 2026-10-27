import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// protege las rutas de administrador (el backend también lo valida en cada endpoint)
export const adminGuard: CanActivateFn = () => {
  if (inject(AuthService).isAdmin()) return true;
  return inject(Router).createUrlTree(['/']);
};
