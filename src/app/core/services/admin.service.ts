import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Place } from './places.service';

export interface AdminStats {
  users: number;
  places: number;
  recommendations: number;
  comments: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API = 'http://localhost:3000';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get headers() {
    const token = this.auth.getToken();
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  getStats()  { return this.http.get<AdminStats>(`${this.API}/admin/stats`, this.headers); }
  getPlaces() { return this.http.get<Place[]>(`${this.API}/places`); }

  updatePlace(id: number, data: Partial<Place>) {
    return this.http.put<Place>(`${this.API}/places/${id}`, data, this.headers);
  }

  deletePlace(id: number) {
    return this.http.delete(`${this.API}/places/${id}`, this.headers);
  }
}
