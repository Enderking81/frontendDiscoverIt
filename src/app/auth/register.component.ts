import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './auth-form.css',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink]
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // mismas reglas que valida el backend
  readonly form = inject(FormBuilder).nonNullable.group({
    nickname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  errorMsg = '';
  loading = false;

  constructor() {
    if (this.auth.isLoggedIn()) this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    const { nickname, email, password } = this.form.getRawValue();
    this.auth.register(nickname, email, password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err.error?.details?.[0]?.message ?? err.error?.error ?? 'Error al registrarse';
        this.loading = false;
      }
    });
  }
}
