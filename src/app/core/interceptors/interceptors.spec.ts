import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { errorInterceptor } from './error.interceptor';
import { ToastService } from '../services/toast.service';
import { environment } from '../../../environments/environment';
import { USER, storeSession } from '../testing/test-helpers';

describe('Interceptores HTTP', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let toast: ToastService;
  const api = `${environment.apiUrl}/places`;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    toast = TestBed.inject(ToastService);
    spyOn(toast, 'show');
  });

  afterEach(() => backend.verify());

  describe('authInterceptor', () => {
    it('agrega el token a las peticiones a nuestra API', () => {
      storeSession(USER, 'mi-token');
      http.get(api).subscribe();
      expect(backend.expectOne(api).request.headers.get('Authorization')).toBe('Bearer mi-token');
    });

    it('no manda el token a otros dominios', () => {
      storeSession(USER, 'mi-token');
      http.get('https://otro-sitio.com/data').subscribe();
      expect(backend.expectOne('https://otro-sitio.com/data').request.headers.has('Authorization')).toBeFalse();
    });

    it('sin sesión no agrega el header', () => {
      http.get(api).subscribe();
      expect(backend.expectOne(api).request.headers.has('Authorization')).toBeFalse();
    });
  });

  describe('errorInterceptor', () => {
    const fail = (status: number, body: object) => {
      http.get(api).subscribe({ error: () => undefined });
      backend.expectOne(api).flush(body, { status, statusText: 'Error' });
    };

    it('muestra el primer error de validación, que es el más claro', () => {
      fail(400, { error: 'Datos inválidos', details: [{ field: 'points', message: 'El puntaje debe ser entre 1 y 5' }] });
      expect(toast.show).toHaveBeenCalledWith('El puntaje debe ser entre 1 y 5', 'error');
    });

    it('muestra el mensaje del backend cuando no hay detalle', () => {
      fail(409, { error: 'Ya recomendaste este lugar' });
      expect(toast.show).toHaveBeenCalledWith('Ya recomendaste este lugar', 'error');
    });

    it('avisa cuando el servidor no responde', () => {
      http.get(api).subscribe({ error: () => undefined });
      backend.expectOne(api).error(new ProgressEvent('error'));
      expect(toast.show).toHaveBeenCalledWith('No se pudo conectar con el servidor', 'error');
    });

    it('con un 401 y sesión iniciada cierra la sesión', () => {
      storeSession(USER);
      fail(401, { error: 'Token inválido o vencido' });
      expect(localStorage.getItem('discoverit_token')).toBeNull();
      expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/login']);
    });

    it('un 401 de un login fallido (sin sesión) no muestra toast: lo maneja el formulario', () => {
      fail(401, { error: 'Credenciales inválidas' });
      expect(toast.show).not.toHaveBeenCalled();
    });
  });
});
