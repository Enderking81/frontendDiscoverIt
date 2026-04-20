import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class PlaceDetailComponent implements OnInit {
  place: any = null;
  cargando = true;

  private readonly API = 'http://localhost:3000';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = this.auth.getToken();

    this.http.get(`${this.API}/places/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => { this.place = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }
}
