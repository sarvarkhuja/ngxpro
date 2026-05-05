import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { NXP_RADIO_OPTIONS } from './radio.options';
import { cx } from '../../../utils/cx';

export type NxpRadioSize = 's' | 'm' | 'l';
export type NxpRadioColor = 'primary' | 'secondary' | 'danger';

/**
 * Radio input directive — applies to native `<input type="radio">` elements.
 *
 * State is read by the browser via `:checked` / `:disabled` pseudo-classes.
 * No signal mirrors `nativeElement.checked` — that was the source of the
 * "fade on route change" bug (CVA writes land one CD tick after first paint,
 * signal flips, `transition-colors` animates the mismatch).
 *
 * Integrates with Angular Reactive Forms via the built-in RadioControlValueAccessor.
 * Use with `formControl`, `formControlName`, or `[(ngModel)]`.
 *
 * @example
 * <!-- Basic radio -->
 * <input type="radio" nxpRadio name="fruit" value="apple" />
 *
 * @example
 * <!-- With reactive forms -->
 * <input type="radio" nxpRadio [formControl]="fruitControl" value="apple" />
 *
 * @example
 * <!-- Size and color variants -->
 * <input type="radio" nxpRadio size="l" color="danger" name="opt" value="no" />
 */
@Component({
  selector: 'input[type="radio"][nxpRadio]',
  standalone: true,
  template: '',
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[class.nxp-radio]': 'true',
  },
  styles: [
    `
      /* White dot on checked — painted by the browser the instant
       the native checked pseudo-class matches, with no Angular involvement. */
      :host(:checked) {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='3.5' fill='white'/%3E%3C/svg%3E");
        background-size: 75% 75%;
        background-position: center;
        background-repeat: no-repeat;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpRadioComponent {
  private readonly options = inject(NXP_RADIO_OPTIONS);

  /** Size of the radio input. Defaults to option value ('m'). */
  readonly size = input<NxpRadioSize>(this.options.size);

  /** Color variant. Controls border and checked fill color. */
  readonly color = input<NxpRadioColor>('primary');

  /** Additional CSS classes. */
  readonly class = input<string>('');

  readonly hostClasses = computed(() => {
    const size = this.size();
    const color = this.color();

    return cx(
      // Reset browser appearance
      'appearance-none cursor-pointer shrink-0',
      // Shape
      'rounded-full border-2',
      // Colour-only transition — safe here because the class list is static
      // across state flips (only `:checked` pseudo-class toggles), so there
      // is no Angular-driven re-render to race with the CSS transition.
      'transition-[background-color,border-color,box-shadow] duration-150 ease-out',
      // Focus
      'outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      // Disabled
      'disabled:opacity-50 disabled:cursor-not-allowed dark:disabled:opacity-40',

      // Size variants
      size === 's' && 'size-4',
      size === 'm' && 'size-5',
      size === 'l' && 'size-6',

      // Colour variants — `checked:*` maps to the real `:checked` pseudo-class.
      color === 'primary' && [
        'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
        'checked:border-blue-600 checked:bg-blue-600',
        'dark:checked:border-blue-400 dark:checked:bg-blue-400',
        'focus-visible:ring-blue-500',
      ],
      color === 'secondary' && [
        'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
        'checked:border-gray-600 checked:bg-gray-600',
        'dark:checked:border-gray-400 dark:checked:bg-gray-400',
        'focus-visible:ring-gray-500',
      ],
      color === 'danger' && [
        'border-red-300 bg-white dark:border-red-600 dark:bg-gray-800',
        'checked:border-red-600 checked:bg-red-600',
        'dark:checked:border-red-400 dark:checked:bg-red-400',
        'focus-visible:ring-red-500',
      ],

      this.class(),
    );
  });
}
