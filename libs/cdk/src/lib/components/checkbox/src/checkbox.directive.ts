import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { NXP_CHECKBOX_OPTIONS } from './checkbox.options';
import { cx } from '../../../utils/cx';

export type NxpCheckboxDirectiveSize = 's' | 'm' | 'l';
export type NxpCheckboxDirectiveColor = 'primary' | 'secondary' | 'danger';

/**
 * Checkbox input directive — applies to native `<input type="checkbox">` elements.
 *
 * Styled purely via `:checked` / `:indeterminate` / `:disabled` pseudo-classes,
 * so native state drives the visuals with no Angular-side mirroring. Integrates
 * with Reactive Forms via Angular's built-in CheckboxControlValueAccessor — use
 * with `formControl`, `formControlName`, or `[(ngModel)]`.
 *
 * @example
 * <!-- Basic -->
 * <input type="checkbox" nxpCheckbox [formControl]="ctrl" />
 *
 * @example
 * <!-- Variants -->
 * <input type="checkbox" nxpCheckbox size="l" color="danger" />
 */
@Component({
  selector: 'input[type="checkbox"][nxpCheckbox]',
  standalone: true,
  template: '',
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[class.nxp-checkbox]': 'true',
  },
  styles: [
    `
      /* Checkmark on :checked — pure CSS, flips the instant the browser's
         native :checked pseudo-class matches. */
      :host(:checked) {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 12L10 16L18 8' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-size: 85% 85%;
        background-position: center;
        background-repeat: no-repeat;
      }
      /* Indeterminate bar */
      :host(:indeterminate) {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 12H18' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E");
        background-size: 85% 85%;
        background-position: center;
        background-repeat: no-repeat;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpCheckboxDirective {
  private readonly options = inject(NXP_CHECKBOX_OPTIONS);

  /** Size of the checkbox. Defaults to option value ('m'). */
  readonly size = input<NxpCheckboxDirectiveSize>(
    this.options.size as NxpCheckboxDirectiveSize,
  );

  /** Color variant. Controls border and checked fill color. */
  readonly color = input<NxpCheckboxDirectiveColor>('primary');

  /** Additional CSS classes. */
  readonly class = input<string>('');

  readonly hostClasses = computed(() => {
    const size = this.size();
    const color = this.color();

    return cx(
      // Reset browser appearance
      'appearance-none cursor-pointer shrink-0',
      // Shape
      'rounded-[5px] border-[1.5px]',
      // Colour-only transition — class list is stable across state flips.
      'transition-[background-color,border-color,box-shadow] duration-150 ease-out',
      // Focus
      'outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      // Disabled
      'disabled:opacity-50 disabled:cursor-not-allowed dark:disabled:opacity-40',

      // Size variants
      size === 's' && 'size-4 rounded-[4px]',
      size === 'm' && 'size-[18px] rounded-[5px]',
      size === 'l' && 'size-[22px] rounded-[6px]',

      // Colour variants — `checked:*` / `indeterminate:*` map to real pseudo-classes.
      color === 'primary' && [
        'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
        'checked:border-blue-600 checked:bg-blue-600',
        'indeterminate:border-blue-600 indeterminate:bg-blue-600',
        'dark:checked:border-blue-400 dark:checked:bg-blue-400',
        'dark:indeterminate:border-blue-400 dark:indeterminate:bg-blue-400',
        'hover:border-neutral-400 dark:hover:border-neutral-500',
        'focus-visible:ring-blue-500',
      ],
      color === 'secondary' && [
        'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
        'checked:border-gray-600 checked:bg-gray-600',
        'indeterminate:border-gray-600 indeterminate:bg-gray-600',
        'dark:checked:border-gray-400 dark:checked:bg-gray-400',
        'dark:indeterminate:border-gray-400 dark:indeterminate:bg-gray-400',
        'hover:border-neutral-400 dark:hover:border-neutral-500',
        'focus-visible:ring-gray-500',
      ],
      color === 'danger' && [
        'border-red-300 bg-white dark:border-red-600 dark:bg-gray-800',
        'checked:border-red-600 checked:bg-red-600',
        'indeterminate:border-red-600 indeterminate:bg-red-600',
        'dark:checked:border-red-400 dark:checked:bg-red-400',
        'dark:indeterminate:border-red-400 dark:indeterminate:bg-red-400',
        'hover:border-red-400 dark:hover:border-red-500',
        'focus-visible:ring-red-500',
      ],

      this.class(),
    );
  });
}
