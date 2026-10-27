import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Place } from '../models';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/favorites`;

  list(): Observable<Place[]> {
    return this.http.get<Place[]>(this.url);
  }

  // agrega o quita según el estado actual
  toggle(placeId: number, isFavorite: boolean): Observable<unknown> {
    return isFavorite
      ? this.http.delete(`${this.url}/${placeId}`)
      : this.http.post(`${this.url}/${placeId}`, {});
  }
}
