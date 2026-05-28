import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NXP_CHECKBOX_OPTIONS } from './checkbox.options';
import { cx } from '@ngxpro/cdk';

export type NxpCheckboxDirectiveSize = 's' | 'm' | 'l';
export type NxpCheckboxDirectiveColor = 'primary' | 'secondary' | 'danger';

/**
 * Tri-state value accepted by `nxpCheckbox` via `[(ngModel)]` or `[formControl]`:
 * `true` checked, `false` unchecked, `null` indeterminate. Use this type for
 * external state stores (e.g. tree checkbox maps) so the contract with the
 * directive stays explicit.
 */
export type NxpCheckboxValue = boolean | null;

/**
 * Checkbox input directive — applies to native `<input type="checkbox">` elements.
 *
 * Styled purely via `:checked` / `:indeterminate` / `:disabled` pseudo-classes,
 * so native state drives the visuals with no Angular-side mirroring. Provides
 * a tri-state `ControlValueAccessor`: `true` checks, `false` unchecks, `null`
 * sets indeterminate — making it usable with `[(ngModel)]` for parent rows of
 * a checkbox tree.
 *
 * @example
 * <!-- Boolean -->
 * <input type="checkbox" nxpCheckbox [formControl]="ctrl" />
 *
 * @example
 * <!-- Tri-state via ngModel; null = indeterminate -->
 * <input type="checkbox" nxpCheckbox
 *        [ngModel]="state" (ngModelChange)="onToggle($event)" />
 */
@Component({
  selector: 'input[type="checkbox"][nxpCheckbox]',
  template: '',
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[class.nxp-checkbox]': 'true',
    '(change)': 'onNativeChange()',
    '(blur)': 'onTouched()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxpCheckboxDirective),
      multi: true,
    },
  ],
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
export class NxpCheckboxDirective implements ControlValueAccessor {
  private readonly options = inject(NXP_CHECKBOX_OPTIONS);
  private readonly elRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  /** Size of the checkbox. Defaults to option value ('m'). */
  readonly size = input<NxpCheckboxDirectiveSize>(
    this.options.size as NxpCheckboxDirectiveSize,
  );

  /** Color variant. Controls border and checked fill color. */
  readonly color = input<NxpCheckboxDirectiveColor>('primary');

  /** Additional CSS classes. */
  readonly class = input<string>('');

  private onChange: (value: boolean) => void = () => {
    /* noop until form registers */
  };
  onTouched: () => void = () => {
    /* noop until form registers */
  };

  /** Mirror form state onto the native element. `null` flips indeterminate. */
  writeValue(value: NxpCheckboxValue): void {
    const el = this.elRef.nativeElement;
    el.checked = value === true;
    el.indeterminate = value === null;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elRef.nativeElement.disabled = isDisabled;
  }

  /**
   * The browser auto-clears `indeterminate` on user interaction, so we just
   * forward the resolved boolean. Consumers can re-set `null` from outside
   * if their domain logic needs to roll back to indeterminate.
   */
  onNativeChange(): void {
    const el = this.elRef.nativeElement;
    el.indeterminate = false;
    this.onChange(el.checked);
  }

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
