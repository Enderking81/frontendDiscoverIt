import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  { path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  { path: 'register',
    loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent)
  },
  { path: 'places/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/place-detail/place-detail.component').then(m => m.PlaceDetailComponent)
  },
  { path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  { path: 'my-likes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/my-likes/my-likes.component').then(m => m.MyLikesComponent)
  },
  { path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  { path: '**', redirectTo: '' }
];
