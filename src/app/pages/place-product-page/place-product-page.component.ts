import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-place-product-page',
  templateUrl: './place-product-page.component.html',
  styleUrls: ['./place-product-page.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class PlaceProductPageComponent {
  categories: string[] = ['Restaurante', 'Cafetería', 'Bar'];
  comments = [
    { name: 'Naruto Uzumaki', text: '¡Este lugar es tan épico como una batalla de ninjas! ¡Me sentí como un verdadero Hokage!' },
    { name: 'Goku', text: 'La comida es tan deliciosa como una bola de energía Kamehameha. ¡Definitivamente volveré!' },
    { name: 'Hermione Granger', text: 'Este lugar tiene la magia que me encanta. ¡Es tan encantador como un hechizo bien lanzado!' },
    { name: 'Sailor Moon', text: 'Un lugar lleno de brillo y sabor. ¡Es tan transformador como un ataque lunar!' },
    { name: 'Jack Sparrow', text: '¡Este sitio tiene la aventura y el sabor que todo pirata sueña encontrar! Arrr, ¡volveré seguro!' }
  ];

  newComment: string = '';
  userName: string = ''; 
  showRating: boolean = false;
  rating: number = 0;
  hoverRating: number = 0; 
 
  toggleRating() {
    this.showRating = !this.showRating;
  }

  setRating(star: number) {
    this.rating = star;
  }
 
  addComment() {
    if (this.newComment.trim()) {
      const nameToUse = this.userName.trim() ? this.userName : 'Usuario Anónimo';
      this.comments.push({ name: nameToUse, text: this.newComment });
      this.newComment = '';
      this.userName = ''; 
    }
  }
}
