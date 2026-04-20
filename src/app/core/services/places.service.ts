import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

// interfaz que refleja la estructura devuelta por GET /places
export interface Place {
  id: number;
  name: string;
  description: string;
  location: string;
  categoryId: number;
  image: string;
  average_rating: number | null;
  Category?: { name: string };
}

export interface Comment {
  id: number;
  comment_text: string;
  datetimecomment: string;
  User?: { nickname: string };
}

export interface Recommendation {
  id: number;
  points: number;
  description: string;
  User?: { nickname: string };
}

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private readonly API = 'http://localhost:3000';

  constructor(private http: HttpClient, private auth: AuthService) {}

  // encabezado con el token JWT para rutas protegidas
  private get headers() {
    const token = this.auth.getToken();
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  getAll()        { return this.http.get<Place[]>(`${this.API}/places`); }
  getById(id: number) { return this.http.get<Place>(`${this.API}/places/${id}`); }

  getComments(id: number)        { return this.http.get<Comment[]>(`${this.API}/comments/${id}`); }
  getRecommendations(id: number) { return this.http.get<Recommendation[]>(`${this.API}/recommendations/${id}`); }

  addComment(idPlaceProduct: number, comment_text: string) {
    return this.http.post(`${this.API}/comments`, { idPlaceProduct, comment_text }, this.headers);
  }

  addRecommendation(idPlaceProduct: number, points: number, description: string) {
    return this.http.post(`${this.API}/recommendations`, { idPlaceProduct, points, description }, this.headers);
  }

  toggleLike(id: number, liked: boolean) {
    const url = `${this.API}/likes/${id}`;
    return liked
      ? this.http.delete(url, this.headers)
      : this.http.post(url, {}, this.headers);
  }

  getMyLikes() { return this.http.get<any[]>(`${this.API}/likes`, this.headers); }
}
