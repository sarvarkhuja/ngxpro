import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { NGXPRO_DOCUMENT } from '@ngxpro/cdk';

export type NgxproTheme = 'light' | 'dark' | 'system';

/**
 * Theme service using Tailwind's class-based dark mode.
 * Manages light/dark theme switching via the `dark` class on `<html>`.
 *
 * Requires Tailwind v4 with class-based dark variant in your styles:
 *   @custom-variant dark (&:where(.dark, .dark *));
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(NGXPRO_DOCUMENT);
  private readonly _theme = signal<NgxproTheme>(this.getStoredTheme());

  /** System preference for dark mode (reactive to OS theme changes). */
  private readonly _prefersDark = signal(this.readPrefersDark());

  /** Current theme setting. */
  readonly theme = this._theme.asReadonly();

  /** Whether dark mode is currently active. */
  readonly isDark = computed(() => {
    const theme = this._theme();
    if (theme === 'system') {
      return this._prefersDark();
    }
    return theme === 'dark';
  });

  constructor() {
    this.setupPrefersDarkListener();
    effect(() => {
      const dark = this.isDark();
      const root = this.doc.documentElement;
      if (dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    });
  }

  /** Set the theme. */
  setTheme(theme: NgxproTheme): void {
    this._theme.set(theme);
    try {
      localStorage.setItem('ngxpro-theme', theme);
    } catch {
      // localStorage not available
    }
  }

  /** Toggle between light and dark. */
  toggle(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  private getStoredTheme(): NgxproTheme {
    try {
      const stored = localStorage.getItem('ngxpro-theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // localStorage not available
    }
    return 'system';
  }

  private readPrefersDark(): boolean {
    return this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;
  }

  private setupPrefersDarkListener(): void {
    const mql = this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)');
    if (!mql) return;
    mql.addEventListener('change', () => {
      this._prefersDark.set(this.readPrefersDark());
    });
  }
}
