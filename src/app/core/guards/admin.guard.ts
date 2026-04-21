import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// guard funcional que protege rutas de administrador
export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser$.getValue();
  if (user?.isAdmin) return true;

  return router.createUrlTree(['/']);
};
