import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

// interfaz que representa al usuario logueado guardado en el token
export interface AuthUser {
  id: number;
  nickname: string;
  email: string;
  isAdmin: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000/auth';
  private readonly TOKEN_KEY = 'discoverit_token';
  private readonly USER_KEY  = 'discoverit_user';

  // BehaviorSubject permite que cualquier componente se suscriba y reaccione al estado de login
  currentUser$ = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  // --- login: envía credenciales y guarda el token en localStorage ---
  login(email: string, password: string) {
    return this.http.post<{ token: string; user: AuthUser }>(`${this.API}/login`, { email, password })
      .pipe(
        tap(res => this.guardarSesion(res.token, res.user))
      );
  }

  // --- register: crea cuenta y guarda el token igual que en login ---
  register(nickname: string, email: string, password: string, seller = false) {
    return this.http.post<{ token: string; user: AuthUser }>(`${this.API}/register`, { nickname, email, password, seller })
      .pipe(
        tap(res => this.guardarSesion(res.token, res.user))
      );
  }

  // --- cierra la sesión y redirige al login ---
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  // --- devuelve el token para usarlo en el header Authorization ---
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  estaLogueado(): boolean {
    return !!this.getToken();
  }

  private guardarSesion(token: string, user: AuthUser) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser$.next(user);
  }

  private getUserFromStorage(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
