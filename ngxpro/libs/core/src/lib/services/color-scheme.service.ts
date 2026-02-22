import { Injectable, signal, effect, inject } from '@angular/core';
import { NXP_DOCUMENT } from '@nxp/cdk';

export type NgxproColorScheme =
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'rose'
  | 'orange'
  | 'emerald'
  | 'teal';

export const NXP_COLOR_SCHEMES: NgxproColorScheme[] = [
  'blue',
  'indigo',
  'violet',
  'rose',
  'orange',
  'emerald',
  'teal',
];

/** Display metadata for each color scheme (for pickers). */
export const NXP_COLOR_SCHEME_META: Record<
  NgxproColorScheme,
  { label: string; swatch: string }
> = {
  blue: { label: 'Blue', swatch: '#3b82f6' },
  indigo: { label: 'Indigo', swatch: '#6366f1' },
  violet: { label: 'Violet', swatch: '#8b5cf6' },
  rose: { label: 'Rose', swatch: '#f43f5e' },
  orange: { label: 'Orange', swatch: '#f97316' },
  emerald: { label: 'Emerald', swatch: '#10b981' },
  teal: { label: 'Teal', swatch: '#14b8a6' },
};

const STORAGE_KEY = 'nxp-color-scheme';
const ATTR = 'data-scheme';

/**
 * Color scheme service for managing the active brand color palette.
 *
 * Sets `data-scheme="[name]"` on `<html>`, which CSS uses to swap
 * `--nxp-brand-*` custom properties to the chosen palette.
 *
 * Persists the selection to localStorage automatically.
 *
 * @example
 * // Inject and use
 * const cs = inject(ColorSchemeService);
 * cs.setScheme('rose');
 * cs.scheme(); // 'rose'
 *
 * @example
 * // Override default in app providers
 * { provide: NXP_COLOR_SCHEME, useValue: 'emerald' }
 */
@Injectable({ providedIn: 'root' })
export class ColorSchemeService {
  private readonly doc = inject(NXP_DOCUMENT);

  private readonly _scheme = signal<NgxproColorScheme>(this.getStoredScheme());

  /** Currently active color scheme (read-only signal). */
  readonly scheme = this._scheme.asReadonly();

  constructor() {
    // Apply data-scheme attribute to <html> whenever scheme changes
    effect(() => {
      this.doc.documentElement.setAttribute(ATTR, this._scheme());
    });
  }

  /** Set a new color scheme and persist it. */
  setScheme(scheme: NgxproColorScheme): void {
    this._scheme.set(scheme);
    try {
      localStorage.setItem(STORAGE_KEY, scheme);
    } catch {
      // localStorage not available (SSR / private browsing)
    }
  }

  /** Cycle to the next scheme in the list. */
  cycleNext(): void {
    const idx = NXP_COLOR_SCHEMES.indexOf(this._scheme());
    this.setScheme(NXP_COLOR_SCHEMES[(idx + 1) % NXP_COLOR_SCHEMES.length]);
  }

  private getStoredScheme(): NgxproColorScheme {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as NgxproColorScheme;
      if ((NXP_COLOR_SCHEMES as string[]).includes(stored)) return stored;
    } catch {
      // localStorage not available
    }
    return 'blue';
  }
}
