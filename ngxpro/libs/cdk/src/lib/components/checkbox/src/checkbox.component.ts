import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { cx } from '@nxp/cdk';
import { NXP_RADIO_OPTIONS } from '@nxp/cdk/components/radio';
import { NXP_CHECKBOX_OPTIONS } from './checkbox.options';

export type NxpCheckboxSize = 's' | 'm' | 'l';
export type NxpCheckboxColor = 'primary' | 'secondary' | 'danger';

// SVG checkmark — white check path on transparent background
const CHECK_SVG = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M3 8l3.5 3.5L13 4' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

// SVG dash — white horizontal line for indeterminate
const DASH_SVG = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 8h8' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`;

/**
 * Checkbox input directive — applies to native `<input type="checkbox">` elements.
 *
 * Extends the radio visual/size/color pattern with checkbox-specific styling:
 * rounded corners instead of round, checkmark via CSS background-image, and
 * indeterminate state support.
 *
 * Integrates with Angular Reactive Forms via the built-in CheckboxControlValueAccessor.
 * Use with `formControl`, `formControlName`, or `[(ngModel)]`.
 *
 * @example
 * <!-- Basic checkbox -->
 * <input type="checkbox" nxpCheckbox />
 *
 * @example
 * <!-- With reactive forms -->
 * <input type="checkbox" nxpCheckbox [formControl]="agreedCtrl" />
 *
 * @example
 * <!-- Size and color variants -->
 * <input type="checkbox" nxpCheckbox size="l" color="danger" />
 *
 * @example
 * <!-- Indeterminate state (set via template ref) -->
 * <input type="checkbox" nxpCheckbox #cbx (change)="..." />
 * <!-- ngAfterViewInit: cbx.nativeElement.indeterminate = true -->
 */
@Component({
  selector: 'input[type="checkbox"][nxpCheckbox]',
  standalone: true,
  template: '',
  providers: [
    // Override NXP_RADIO_OPTIONS so any options-aware base logic reads
    // the checkbox-specific defaults (size, appearance, icons).
    {
      provide: NXP_RADIO_OPTIONS,
      useExisting: NXP_CHECKBOX_OPTIONS,
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[style.background-image]': 'backgroundImage()',
    '[style.background-size]': 'hasIcon() ? "100% 100%" : null',
    '[style.background-position]': 'hasIcon() ? "center" : null',
    '[style.background-repeat]': 'hasIcon() ? "no-repeat" : null',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[class.nxp-checkbox]': 'true',
    '[class.nxp-checkbox--indeterminate]': 'isIndeterminate()',
    '[disabled]': 'isDisabled()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpCheckboxComponent implements OnInit, DoCheck {
  private readonly options = inject(NXP_CHECKBOX_OPTIONS);
  private readonly control = inject(NgControl, {
    self: true,
    optional: true,
  });
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  /** Size of the checkbox. Defaults to option value ('m'). */
  readonly size = input<NxpCheckboxSize>(this.options.size as NxpCheckboxSize);

  /** Color variant. Controls border and checked fill color. */
  readonly color = input<NxpCheckboxColor>('primary');

  /** Additional CSS classes. */
  readonly class = input<string>('');

  /** Tracks disabled state derived from NgControl or the native disabled attribute. */
  readonly isDisabled = signal(false);

  /** Tracks indeterminate state from the native element. */
  readonly isIndeterminate = signal(false);

  /** Tracks checked state from the native element (needed for background-image). */
  readonly isChecked = signal(false);

  ngOnInit(): void {
    this.isDisabled.set(this.control?.disabled ?? false);
  }

  ngDoCheck(): void {
    this.isDisabled.set(this.control?.disabled ?? false);
    this.isIndeterminate.set(this.el.nativeElement.indeterminate);
    this.isChecked.set(this.el.nativeElement.checked);
  }

  /** Whether to show a background icon (checked or indeterminate). */
  readonly hasIcon = computed(() => this.isChecked() || this.isIndeterminate());

  /**
   * CSS background-image value for the checkmark or indeterminate dash.
   * Returns null when unchecked so the browser default (none) applies.
   */
  readonly backgroundImage = computed(() => {
    if (this.isIndeterminate()) {
      return DASH_SVG;
    }
    if (this.isChecked()) {
      return CHECK_SVG;
    }
    return null;
  });

  readonly hostClasses = computed(() => {
    const size = this.size();
    const color = this.color();
    const indeterminate = this.isIndeterminate();

    return cx(
      // Reset browser appearance
      'appearance-none cursor-pointer',
      // Shape — square with rounded corners (key difference from radio's rounded-full)
      'rounded border-2',
      // Transition
      'transition-all duration-150',
      // Focus
      'outline-none',
      'focus-visible:ring-2 focus-visible:ring-offset-2',
      // Disabled
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'dark:disabled:opacity-40',

      // Size variants
      size === 's' && 'size-4',
      size === 'm' && 'size-5',
      size === 'l' && 'size-6',

      // Primary color
      color === 'primary' && [
        // Unchecked + non-indeterminate state
        !indeterminate && [
          'border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800',
          'checked:border-blue-600 dark:checked:border-blue-400',
          'checked:bg-blue-600 dark:checked:bg-blue-400',
        ],
        // Indeterminate overrides to filled state
        indeterminate && [
          'border-blue-600 dark:border-blue-400',
          'bg-blue-600 dark:bg-blue-400',
        ],
        'focus-visible:ring-blue-500',
      ],

      // Secondary color
      color === 'secondary' && [
        !indeterminate && [
          'border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800',
          'checked:border-gray-600 dark:checked:border-gray-400',
          'checked:bg-gray-600 dark:checked:bg-gray-400',
        ],
        indeterminate && [
          'border-gray-600 dark:border-gray-400',
          'bg-gray-600 dark:bg-gray-400',
        ],
        'focus-visible:ring-gray-500',
      ],

      // Danger color
      color === 'danger' && [
        !indeterminate && [
          'border-red-300 dark:border-red-600',
          'bg-white dark:bg-gray-800',
          'checked:border-red-600 dark:checked:border-red-400',
          'checked:bg-red-600 dark:checked:bg-red-400',
        ],
        indeterminate && [
          'border-red-600 dark:border-red-400',
          'bg-red-600 dark:bg-red-400',
        ],
        'focus-visible:ring-red-500',
      ],

      this.class(),
    );
  });
}
