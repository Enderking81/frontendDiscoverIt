import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Recommendation, RecommendationInput } from '../models';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl;

  listByPlace(placeId: number): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(`${this.url}/places/${placeId}/recommendations`);
  }

  create(placeId: number, data: RecommendationInput): Observable<Recommendation> {
    return this.http.post<Recommendation>(`${this.url}/places/${placeId}/recommendations`, data);
  }

  update(id: number, data: Partial<RecommendationInput>): Observable<Recommendation> {
    return this.http.put<Recommendation>(`${this.url}/recommendations/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/recommendations/${id}`);
  }
}
