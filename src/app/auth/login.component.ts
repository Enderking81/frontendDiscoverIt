import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './auth-form.css',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink]
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  // si el guard mandó al login, después de ingresar se vuelve a la página que se quería ver
  private readonly returnUrl = inject(ActivatedRoute).snapshot.queryParamMap.get('returnUrl') ?? '/';

  readonly form = inject(FormBuilder).nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  errorMsg = '';
  loading = false;

  constructor() {
    if (this.auth.isLoggedIn()) this.router.navigateByUrl(this.returnUrl);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err.error?.error ?? 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }
}
