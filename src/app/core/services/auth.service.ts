import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

export interface AuthUser {
  id: number;
  nickname: string;
  email: string;
  isAdmin: boolean;
}

export interface FullProfile {
  id: number;
  nickname: string;
  email: string;
  isAdmin: boolean;
  seller: boolean;
  Profile: { bio: string | null; avatar: string | null; location: string | null; birthdate: string | null } | null;
  Comments: Array<{ id: number; comment_text: string; datetimecomment: string; Place_Product: { id: number; name: string } }>;
  Recommendations: Array<{ id: number; points: number; description: string; Place_Product: { id: number; name: string } }>;
  stats: { comentarios: number; recomendaciones: number; likes: number };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API      = 'http://localhost:3000/auth';
  private readonly TOKEN_KEY = 'discoverit_token';
  private readonly USER_KEY  = 'discoverit_user';

  // BehaviorSubject: cualquier componente puede reaccionar al cambio de sesión
  currentUser$ = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: AuthUser }>(`${this.API}/login`, { email, password })
      .pipe(tap(res => this.guardarSesion(res.token, res.user)));
  }

  register(nickname: string, email: string, password: string, seller = false) {
    return this.http.post<{ token: string; user: AuthUser }>(`${this.API}/register`, { nickname, email, password, seller })
      .pipe(tap(res => this.guardarSesion(res.token, res.user)));
  }

  // devuelve el perfil completo con stats, comentarios y recomendaciones
  getFullProfile() {
    return this.http.get<FullProfile>(`${this.API}/profile`, this.authHeaders());
  }

  // actualiza nickname y/o bio — también refresca el token con el nuevo nickname
  updateProfile(data: { nickname?: string; bio?: string }) {
    return this.http.put<{ token: string; user: AuthUser; bio: string | null }>(
      `${this.API}/profile`, data, this.authHeaders()
    ).pipe(
      tap(res => this.guardarSesion(res.token, res.user))
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  estaLogueado(): boolean   { return !!this.getToken(); }

  private guardarSesion(token: string, user: AuthUser) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser$.next(user);
  }

  private getUserFromStorage(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private authHeaders() {
    const token = this.getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }
}
