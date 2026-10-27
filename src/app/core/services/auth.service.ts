import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Session, User } from '../models';

const TOKEN_KEY = 'discoverit_token';
const USER_KEY = 'discoverit_user';

// maneja la sesión: login, registro, logout y el usuario actual
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = `${environment.apiUrl}/auth`;

  // cualquier componente puede suscribirse para reaccionar a los cambios de sesión
  readonly currentUser$ = new BehaviorSubject<User | null>(this.readStoredUser());

  login(email: string, password: string): Observable<Session> {
    return this.http.post<Session>(`${this.url}/login`, { email, password })
      .pipe(tap((session) => this.saveSession(session)));
  }

  register(nickname: string, email: string, password: string): Observable<Session> {
    return this.http.post<Session>(`${this.url}/register`, { nickname, email, password })
      .pipe(tap((session) => this.saveSession(session)));
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // la sesión es válida si hay token y todavía no venció
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    if (this.isExpired(token)) {
      this.clearSession();
      return false;
    }
    return true;
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && !!this.currentUser$.value?.isAdmin;
  }

  // se usa cuando el usuario edita su nickname desde el perfil
  updateStoredUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser$.next(user);
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser$.next(null);
  }

  private saveSession({ token, user }: Session): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.updateStoredUser(user);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  // lee el campo exp del payload del JWT (no verifica la firma, eso lo hace el backend)
  private isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
