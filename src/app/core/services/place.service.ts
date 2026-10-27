import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Place, PlaceDetail, PlaceFilters, PlaceInput } from '../models';

@Injectable({ providedIn: 'root' })
export class PlaceService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/places`;

  // el filtrado lo resuelve el backend (GET /places?categoryId=&search=)
  list(filters: PlaceFilters = {}): Observable<Place[]> {
    let params = new HttpParams();
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.search?.trim()) params = params.set('search', filters.search.trim());
    return this.http.get<Place[]>(this.url, { params });
  }

  getById(id: number): Observable<PlaceDetail> {
    return this.http.get<PlaceDetail>(`${this.url}/${id}`);
  }

  create(data: PlaceInput): Observable<Place> {
    return this.http.post<Place>(this.url, data);
  }

  update(id: number, data: PlaceInput): Observable<Place> {
    return this.http.put<Place>(`${this.url}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
