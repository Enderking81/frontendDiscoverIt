import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink]
})
export class LoginComponent {
  form: FormGroup;
  errorMsg = '';
  cargando = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    // si ya está logueado, redirige directo al home
    if (this.auth.estaLogueado()) this.router.navigate(['/']);

    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.cargando = true;
    this.errorMsg = '';

    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMsg = err.error?.error || 'Error al iniciar sesión';
        this.cargando = false;
      }
    });
  }
}
