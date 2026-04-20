import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ruta raíz: home pública
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  // login y registro: accesibles sin token
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent)
  },
  // rutas protegidas (requieren estar logueado)
  {
    path: 'places/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/place-detail/place-detail.component').then(m => m.PlaceDetailComponent)
  },
  // redirige cualquier ruta desconocida al home
  { path: '**', redirectTo: '' }
];
