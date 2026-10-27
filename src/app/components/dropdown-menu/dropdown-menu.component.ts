import { Component, DestroyRef, ElementRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

// menú de cuenta del header: avatar con las opciones del usuario o botón para ingresar
@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class DropdownMenuComponent {
  private readonly auth = inject(AuthService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly isOpen = signal(false);
  user: User | null = null;

  constructor() {
    this.auth.currentUser$.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe((user) => (this.user = user));
  }

  get initial(): string {
    return this.user?.nickname.charAt(0).toUpperCase() ?? '?';
  }

  toggle() {
    this.isOpen.update((open) => !open);
  }

  close() {
    this.isOpen.set(false);
  }

  logout() {
    this.close();
    this.auth.logout();
  }

  // se cierra al hacer clic afuera o al presionar Escape
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
