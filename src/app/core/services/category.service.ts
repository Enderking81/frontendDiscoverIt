import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryInput } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/categories`;

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  create(data: CategoryInput): Observable<Category> {
    return this.http.post<Category>(this.url, data);
  }

  update(id: number, data: CategoryInput): Observable<Category> {
    return this.http.put<Category>(`${this.url}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
