import { Component, inject, computed } from '@angular/core';
import { ThemeService, type NgxproTheme } from '@ngxpro/core';
import { ButtonComponent } from '@ngxpro/components/button';

/**
 * Theme switcher component for toggling between light, dark, and system themes.
 * Integrates with ThemeService from @ngxpro/core.
 */
@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="fixed top-4 right-4 z-50">
      <div class="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1">
        <!-- Light Theme Button -->
        <button
          ngxproButton
          [variant]="theme() === 'light' ? 'primary' : 'ghost'"
          size="sm"
          (click)="setTheme('light')"
          [class]="theme() === 'light' ? 'shadow-sm' : ''"
          aria-label="Switch to light theme"
          title="Light theme"
        >
          <svg
            class="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>

        <!-- Dark Theme Button -->
        <button
          ngxproButton
          [variant]="theme() === 'dark' ? 'primary' : 'ghost'"
          size="sm"
          (click)="setTheme('dark')"
          [class]="theme() === 'dark' ? 'shadow-sm' : ''"
          aria-label="Switch to dark theme"
          title="Dark theme"
        >
          <svg
            class="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>

        <!-- System Theme Button -->
        <button
          ngxproButton
          [variant]="theme() === 'system' ? 'primary' : 'ghost'"
          size="sm"
          (click)="setTheme('system')"
          [class]="theme() === 'system' ? 'shadow-sm' : ''"
          aria-label="Use system theme"
          title="System theme"
        >
          <svg
            class="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      <!-- Theme indicator text (optional, for clarity) -->
      <div class="text-center mt-2">
        <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">
          {{ themeLabel() }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `],
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;
  readonly isDark = this.themeService.isDark;

  // Computed signal that reactively updates the theme label
  readonly themeLabel = computed(() => {
    const themeMap: Record<NgxproTheme, string> = {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    };
    return themeMap[this.theme()];
  });

  setTheme(theme: NgxproTheme): void {
    this.themeService.setTheme(theme);
  }
}
