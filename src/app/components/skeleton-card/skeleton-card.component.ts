import { Component } from '@angular/core';

// skeleton card: placeholder animado mientras cargan los datos reales
@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  template: `
    <div class="skeleton-wrap">
      <div class="skeleton img-skeleton"></div>
      <div class="skeleton-body">
        <div class="skeleton line-lg"></div>
        <div class="skeleton line-sm"></div>
        <div class="skeleton line-md"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-wrap {
      background: #fff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: var(--shadow-card);
    }
    .img-skeleton {
      width: 100%;
      height: 200px;
      border-radius: 0;
    }
    .skeleton-body {
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .line-lg { height: 20px; width: 70%; }
    .line-md { height: 14px; width: 90%; }
    .line-sm { height: 14px; width: 45%; }
  `]
})
export class SkeletonCardComponent {}
