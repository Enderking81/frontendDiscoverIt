import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatsService {
  private apiUrl = 'https://cataas.com/cat?type=';

  constructor(private http: HttpClient) {}

  getCatImage(type: string): Observable<any> {
    // para ver si es correcto el tipo de imagen o no 
    if (!['square', 'medium', 'small', 'xsmall'].includes(type)) {
      throw new Error(`Tipo de imagen de gato no válido: ${type}`);
    }
    return this.http.get(`${this.apiUrl}${type}`);
  }
}
