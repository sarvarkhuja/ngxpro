import { Component, inject, computed } from '@angular/core';
import {
  ThemeService,
  type NgxproTheme,
  ColorSchemeService,
  NXP_COLOR_SCHEME_META,
  NXP_COLOR_SCHEMES,
  type NgxproColorScheme,
} from '@nxp/core';

/**
 * Combined theme + color-scheme switcher for the showcase app.
 * Shows light/dark/system toggle and a brand-color scheme picker.
 */
@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">

      <!-- Light / Dark / System toggle -->
      <div
        class="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1"
      >
        <button
          [class]="modeButtonClass('light')"
          (click)="setTheme('light')"
          aria-label="Switch to light theme"
          title="Light"
        >
          <i class="ri-sun-line" aria-hidden="true"></i>
        </button>

        <button
          [class]="modeButtonClass('dark')"
          (click)="setTheme('dark')"
          aria-label="Switch to dark theme"
          title="Dark"
        >
          <i class="ri-moon-line" aria-hidden="true"></i>
        </button>

        <button
          [class]="modeButtonClass('system')"
          (click)="setTheme('system')"
          aria-label="Use system theme"
          title="System"
        >
          <i class="ri-computer-line" aria-hidden="true"></i>
        </button>
      </div>

      <!-- Color scheme picker -->
      <div
        class="flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-2.5 py-2"
      >
        @for (s of schemes; track s) {
          <button
            [title]="meta[s].label"
            [attr.aria-label]="'Color scheme: ' + meta[s].label"
            [attr.aria-pressed]="scheme() === s"
            (click)="setScheme(s)"
            class="relative h-5 w-5 rounded-full transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            [style.background]="meta[s].swatch"
          >
            @if (scheme() === s) {
              <!-- Active indicator: white checkmark -->
              <span
                class="absolute inset-0 flex items-center justify-center text-white"
                aria-hidden="true"
              >
                <i class="ri-check-line text-[10px] font-bold"></i>
              </span>
            }
          </button>
        }
      </div>

      <!-- Active labels -->
      <div class="text-right">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ themeLabel() }} · {{ schemeLabel() }}
        </span>
      </div>

    </div>
  `,
  styles: [`
    :host { display: contents; }

    button i { display: block; font-size: 1rem; line-height: 1; }
  `],
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);
  private readonly colorSchemeService = inject(ColorSchemeService);

  readonly theme = this.themeService.theme;
  readonly scheme = this.colorSchemeService.scheme;

  readonly schemes = NXP_COLOR_SCHEMES;
  readonly meta = NXP_COLOR_SCHEME_META;

  readonly themeLabel = computed(() => {
    const map: Record<NgxproTheme, string> = { light: 'Light', dark: 'Dark', system: 'System' };
    return map[this.theme()];
  });

  readonly schemeLabel = computed(() => this.meta[this.scheme()].label);

  setTheme(theme: NgxproTheme): void {
    this.themeService.setTheme(theme);
  }

  setScheme(scheme: NgxproColorScheme): void {
    this.colorSchemeService.setScheme(scheme);
  }

  modeButtonClass(mode: NgxproTheme): string {
    const active = this.theme() === mode;
    return [
      'flex items-center justify-center w-8 h-8 rounded-md text-sm transition-colors',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500',
      active
        ? 'bg-brand-500 text-white shadow-sm'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
    ].join(' ');
  }
}
