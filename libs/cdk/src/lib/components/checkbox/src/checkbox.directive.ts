import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { NXP_CHECKBOX_OPTIONS } from './checkbox.options';
import { cx } from '../../../utils';

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
      'appearance-none cursor-pointer shrink-0',
      'rounded-s border-[1.5px]',
      'transition-[background-color,border-color,box-shadow] duration-normal ease-out',
      'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus',
      'disabled:opacity-50 disabled:cursor-not-allowed',

      size === 's' && 'size-4',
      size === 'm' && 'size-[18px]',
      size === 'l' && 'size-[22px]',

      color === 'primary' && [
        'border-border-normal bg-bg-base',
        'checked:border-primary checked:bg-primary',
        'indeterminate:border-primary indeterminate:bg-primary',
        'hover:border-border-hover',
      ],
      color === 'secondary' && [
        'border-border-normal bg-bg-base',
        'checked:border-bg-neutral-2 checked:bg-bg-neutral-2',
        'indeterminate:border-bg-neutral-2 indeterminate:bg-bg-neutral-2',
        'hover:border-border-hover',
      ],
      color === 'danger' && [
        'border-status-negative/40 bg-bg-base',
        'checked:border-status-negative checked:bg-status-negative',
        'indeterminate:border-status-negative indeterminate:bg-status-negative',
        'hover:border-status-negative/60',
      ],

      this.class(),
    );
  });
}
