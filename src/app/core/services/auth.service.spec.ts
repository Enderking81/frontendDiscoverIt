import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { ADMIN, USER, fakeToken, storeSession } from '../testing/test-helpers';

describe('AuthService', () => {
  let http: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  function createService() {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: (router = jasmine.createSpyObj('Router', ['navigate'])) }
      ]
    });
    http = TestBed.inject(HttpTestingController);
    return TestBed.inject(AuthService);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => http.verify());

  it('login guarda el token y publica el usuario actual', () => {
    const auth = createService();
    const token = fakeToken(3600);

    auth.login('mateo@test.com', 'secreta').subscribe();
    const req = http.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.body).toEqual({ email: 'mateo@test.com', password: 'secreta' });
    req.flush({ token, user: USER });

    expect(auth.getToken()).toBe(token);
    expect(auth.currentUser$.value).toEqual(USER);
    expect(auth.isLoggedIn()).toBeTrue();
  });

  it('recupera la sesión guardada al recargar la página', () => {
    storeSession(ADMIN);
    const auth = createService();
    expect(auth.currentUser$.value).toEqual(ADMIN);
    expect(auth.isAdmin()).toBeTrue();
  });

  it('un token vencido no cuenta como sesión y se limpia', () => {
    storeSession(USER, fakeToken(-60));
    const auth = createService();

    expect(auth.isLoggedIn()).toBeFalse();
    expect(auth.getToken()).toBeNull();
    expect(auth.currentUser$.value).toBeNull();
  });

  it('un token corrupto se trata como vencido', () => {
    storeSession(USER, 'esto-no-es-un-jwt');
    expect(createService().isLoggedIn()).toBeFalse();
  });

  it('un usuario común no es admin', () => {
    storeSession(USER);
    expect(createService().isAdmin()).toBeFalse();
  });

  it('logout borra la sesión y lleva al login', () => {
    storeSession(USER);
    const auth = createService();

    auth.logout();

    expect(localStorage.getItem('discoverit_token')).toBeNull();
    expect(auth.currentUser$.value).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
