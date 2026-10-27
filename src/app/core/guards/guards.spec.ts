import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { adminGuard } from './admin.guard';
import { ADMIN, USER, storeSession } from '../testing/test-helpers';

describe('Guards de rutas', () => {
  const state = (url: string) => ({ url }) as RouterStateSnapshot;
  const route = {} as ActivatedRouteSnapshot;
  const run = (guard: typeof authGuard, url = '/profile') =>
    TestBed.runInInjectionContext(() => guard(route, state(url)));
  const serialize = (result: unknown) => TestBed.inject(Router).serializeUrl(result as UrlTree);

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient()] });
  });

  describe('authGuard', () => {
    it('sin sesión redirige al login recordando a dónde quería ir', () => {
      expect(serialize(run(authGuard, '/favorites'))).toBe('/login?returnUrl=%2Ffavorites');
    });

    it('con sesión deja pasar', () => {
      storeSession(USER);
      expect(run(authGuard)).toBeTrue();
    });
  });

  describe('adminGuard', () => {
    it('a un usuario común lo manda al inicio', () => {
      storeSession(USER);
      expect(serialize(run(adminGuard, '/admin'))).toBe('/');
    });

    it('a un invitado lo manda al inicio', () => {
      expect(serialize(run(adminGuard, '/admin'))).toBe('/');
    });

    it('deja pasar al administrador', () => {
      storeSession(ADMIN);
      expect(run(adminGuard, '/admin')).toBeTrue();
    });
  });
});
