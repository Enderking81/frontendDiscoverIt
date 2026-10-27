import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterComponent } from './register.component';
import { AuthService } from '../core/services/auth.service';
import { USER } from '../core/testing/test-helpers';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let auth: jasmine.SpyObj<AuthService>;
  let element: HTMLElement;

  beforeEach(async () => {
    auth = jasmine.createSpyObj('AuthService', ['register', 'isLoggedIn']);
    auth.isLoggedIn.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  function fill(nickname: string, email: string, password: string) {
    fixture.componentInstance.form.setValue({ nickname, email, password });
  }

  function submit() {
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('con el formulario incompleto no llama al backend y marca los errores', () => {
    submit();
    expect(auth.register).not.toHaveBeenCalled();
    expect(element.querySelectorAll('.field-error').length).toBe(3);
  });

  it('valida el formato del email y el largo de la contraseña', () => {
    fill('mateo', 'no-es-un-email', '123');
    submit();
    expect(auth.register).not.toHaveBeenCalled();
    expect(element.textContent).toContain('Ingresá un email válido');
  });

  it('con datos válidos registra y navega al inicio', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    auth.register.and.returnValue(of({ token: 't', user: USER }));

    fill('mateo', 'mateo@test.com', 'secreta123');
    submit();

    expect(auth.register).toHaveBeenCalledWith('mateo', 'mateo@test.com', 'secreta123');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('muestra el error del backend y reactiva el botón', () => {
    auth.register.and.returnValue(throwError(() =>
      new HttpErrorResponse({ status: 409, error: { error: 'El email ya está registrado' } })));

    fill('mateo', 'mateo@test.com', 'secreta123');
    submit();

    expect(element.querySelector('.form-error')?.textContent).toContain('El email ya está registrado');
    expect((element.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBeFalse();
  });
});
