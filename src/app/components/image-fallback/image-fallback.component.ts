import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// colores de gradiente por índice — hacen el placeholder visualmente variado
const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
];

@Component({
  selector: 'app-image-fallback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="img-wrap" [style.background]="cargada ? 'none' : gradiente">
      <!-- gradiente elegante mientras carga -->
      <div class="shimmer" [class.oculto]="cargada || error"></div>

      <!-- imagen real -->
      <img
        [src]="src"
        [alt]="alt"
        [class.visible]="cargada"
        (load)="cargada = true"
        (error)="onError()"
        loading="lazy"
      />

      <!-- fallback con inicial si falla la imagen -->
      @if (error) {
        <div class="fallback-icon" [style.background]="gradiente">
          <span>{{ alt.charAt(0).toUpperCase() }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .img-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%);
      background-size: 200% 100%;
      animation: shimmer 1.6s ease-in-out infinite;
    }
    .shimmer.oculto { display: none; }

    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    img.visible { opacity: 1; }

    .fallback-icon {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fallback-icon span {
      font-size: 2.5rem;
      font-weight: 700;
      color: rgba(255,255,255,0.8);
    }
  `]
})
export class ImageFallbackComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() index = 0;

  cargada = false;
  error   = false;

  get gradiente() { return GRADIENTS[this.index % GRADIENTS.length]; }

  onError() { this.cargada = false; this.error = true; }
}
