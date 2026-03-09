import { Component, inject, computed, signal, DOCUMENT } from '@angular/core';
import { ThemeService, type NgxproTheme } from '@nxp/core';

interface ColorPreset {
  label: string;
  primary: string;
}

const PRESETS: ColorPreset[] = [
  { label: 'Blue',    primary: '#3b82f6' },
  { label: 'Violet',  primary: '#8b5cf6' },
  { label: 'Rose',    primary: '#f43f5e' },
  { label: 'Orange',  primary: '#f97316' },
  { label: 'Emerald', primary: '#10b981' },
  { label: 'Cyan',    primary: '#06b6d4' },
];

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">

      <!-- Toggle button -->
      <button
        (click)="open.set(!open())"
        [attr.aria-expanded]="open()"
        aria-label="Open theme configurator"
        class="flex items-center justify-center w-9 h-9 rounded-lg
               bg-bg-base border border-border-normal shadow-lg
               text-text-secondary hover:text-text-primary hover:bg-bg-neutral-1
               transition-colors focus-visible:outline focus-visible:outline-2
               focus-visible:outline-border-focus"
      >
        <i class="ri-palette-line text-base" aria-hidden="true"></i>
      </button>

      <!-- Config panel -->
      @if (open()) {
        <div
          class="bg-bg-base border border-border-normal rounded-xl shadow-xl p-4
                 flex flex-col gap-4 min-w-48"
          role="dialog"
          aria-label="Theme configurator"
        >

          <!-- Mode -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-medium text-text-secondary uppercase tracking-wide">Mode</span>
            <div class="flex items-center gap-1 bg-bg-neutral-1 rounded-lg p-1">
              @for (mode of modes; track mode.value) {
                <button
                  [class]="modeClass(mode.value)"
                  (click)="setTheme(mode.value)"
                  [attr.aria-label]="'Switch to ' + mode.label + ' theme'"
                  [attr.aria-pressed]="theme() === mode.value"
                >
                  <i [class]="mode.icon" aria-hidden="true"></i>
                  <span class="text-xs">{{ mode.label }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Primary color -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-medium text-text-secondary uppercase tracking-wide">Primary</span>
            <div class="flex items-center gap-1.5 flex-wrap">
              @for (preset of presets; track preset.primary) {
                <button
                  (click)="setPrimary(preset.primary)"
                  [attr.aria-label]="preset.label"
                  [attr.aria-pressed]="primary() === preset.primary"
                  class="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110
                         focus-visible:outline focus-visible:outline-2
                         focus-visible:outline-border-focus"
                  [style.background]="preset.primary"
                  [class.border-text-primary]="primary() === preset.primary"
                  [class.border-transparent]="primary() !== preset.primary"
                ></button>
              }

              <!-- Custom color picker -->
              <label
                class="relative w-6 h-6 rounded-full border-2 border-border-normal
                       overflow-hidden cursor-pointer hover:scale-110 transition-transform
                       focus-within:outline focus-within:outline-2
                       focus-within:outline-border-focus"
                aria-label="Custom primary color"
                title="Custom color"
              >
                <i class="ri-add-line absolute inset-0 flex items-center justify-center
                           text-xs text-text-secondary pointer-events-none leading-6
                           text-center w-full"></i>
                <input
                  type="color"
                  [value]="primary()"
                  (input)="onColorInput($event)"
                  class="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
                  aria-label="Pick custom color"
                />
              </label>
            </div>

            <!-- Current value -->
            <span class="text-xs text-text-tertiary font-mono">{{ primary() }}</span>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);
  private readonly doc = inject(DOCUMENT);

  readonly theme = this.themeService.theme;
  readonly open  = signal(false);
  readonly primary = signal('#3b82f6');

  readonly presets = PRESETS;

  readonly modes = [
    { value: 'light'  as NgxproTheme, label: 'Light',  icon: 'ri-sun-line'      },
    { value: 'dark'   as NgxproTheme, label: 'Dark',   icon: 'ri-moon-line'     },
    { value: 'system' as NgxproTheme, label: 'System', icon: 'ri-computer-line' },
  ];

  setTheme(theme: NgxproTheme): void {
    this.themeService.setTheme(theme);
  }

  setPrimary(color: string): void {
    this.primary.set(color);
    this.doc.documentElement.style.setProperty('--nxp-primary', color);
  }

  onColorInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setPrimary(input.value);
  }

  modeClass(mode: NgxproTheme): string {
    const active = this.theme() === mode;
    return [
      'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md',
      'text-sm transition-colors focus-visible:outline focus-visible:outline-2',
      'focus-visible:outline-border-focus',
      active
        ? 'bg-bg-base text-text-primary shadow-sm'
        : 'text-text-secondary hover:text-text-primary',
    ].join(' ');
  }
}
