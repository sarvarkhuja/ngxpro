import {
  DestroyRef,
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NXP_DOCUMENT, NXP_IS_BROWSER } from '@ngxpro/cdk';

export type NgxproTheme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'nxp-theme';

/**
 * Theme service using Tailwind's class-based dark mode.
 * Manages light/dark theme switching via the `dark` class on `<html>`.
 *
 * Requires Tailwind v4 with class-based dark variant in your styles:
 *   @custom-variant dark (&:where(.dark, .dark *));
 *
 * SSR-safe: storage and DOM mutations are gated on the browser platform, so
 * the server always renders with the default (`system` -> light) theme. Pair
 * with a small inline `<head>` script that sets the `.dark` class before
 * hydration to avoid a flash if you persist a user preference.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(NXP_DOCUMENT);
  private readonly isBrowser = inject(NXP_IS_BROWSER);
  private readonly destroyRef = inject(DestroyRef);
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
    if (!this.isBrowser) return;

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
    if (!this.isBrowser) return;
    try {
      this.doc.defaultView?.localStorage?.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage not available (e.g. SecurityError in privacy mode)
    }
  }

  /** Toggle between light and dark. */
  toggle(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  private getStoredTheme(): NgxproTheme {
    if (!this.isBrowser) return 'system';
    try {
      const stored = this.doc.defaultView?.localStorage?.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // localStorage not available
    }
    return 'system';
  }

  private readPrefersDark(): boolean {
    if (!this.isBrowser) return false;
    return (
      this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)')
        ?.matches ?? false
    );
  }

  private setupPrefersDarkListener(): void {
    const mql = this.doc.defaultView?.matchMedia(
      '(prefers-color-scheme: dark)',
    );
    if (!mql) return;
    const listener = (): void => {
      this._prefersDark.set(this.readPrefersDark());
    };
    mql.addEventListener('change', listener);
    this.destroyRef.onDestroy(() =>
      mql.removeEventListener('change', listener),
    );
  }
}
