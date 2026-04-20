import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink]
})
export class RegisterComponent {
  form: FormGroup;
  errorMsg = '';
  cargando = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    if (this.auth.estaLogueado()) this.router.navigate(['/']);

    this.form = this.fb.group({
      nickname: ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      seller:   [false]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.cargando = true;
    this.errorMsg = '';

    const { nickname, email, password, seller } = this.form.value;
    this.auth.register(nickname, email, password, seller).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMsg = err.error?.error || 'Error al registrarse';
        this.cargando = false;
      }
    });
  }
}
