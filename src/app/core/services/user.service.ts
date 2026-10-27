import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MyProfile, ProfileInput, User } from '../models';
import { AuthService } from './auth.service';

// cuenta y perfil del usuario logueado
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly url = `${environment.apiUrl}/users/me`;

  getMe(): Observable<MyProfile> {
    return this.http.get<MyProfile>(this.url);
  }

  updateMe(data: ProfileInput): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(this.url, data)
      .pipe(tap(({ user }) => this.auth.updateStoredUser(user)));
  }

  deleteMe(): Observable<void> {
    return this.http.delete<void>(this.url);
  }
}
