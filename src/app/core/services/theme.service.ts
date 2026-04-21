import { Injectable } from '@angular/core';

const STORAGE_KEY = 'discoverit_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private dark = false;

  // aplica el tema guardado al arrancar la app
  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.dark = saved ? saved === 'dark' : prefersDark;
    this.apply();
  }

  toggle() {
    this.dark = !this.dark;
    localStorage.setItem(STORAGE_KEY, this.dark ? 'dark' : 'light');
    this.apply();
  }

  get isDark() { return this.dark; }

  private apply() {
    document.documentElement.classList.toggle('dark', this.dark);
  }
}
