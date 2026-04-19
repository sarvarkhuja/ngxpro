import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cx } from '../../../utils';
import { NXP_SPRING_FAST, NXP_SPRING_FAST_EXIT } from '../../../constants';
import { NXP_CHECKBOX_OPTIONS } from './checkbox.options';

export type NxpCheckboxSize = 's' | 'm' | 'l';
export type NxpCheckboxColor = 'primary' | 'secondary' | 'danger';

// Checkmark path "M6 12L10 16L18 8" total stroke length (measured)
const CHECK_PATH_LENGTH = 24.8;

// Indeterminate dash path "M6 12H18" length
const DASH_PATH_LENGTH = 12;

// CSS transition strings
const FAST_IN = `${NXP_SPRING_FAST.duration}ms ${NXP_SPRING_FAST.easing}`;
const FAST_OUT = `${NXP_SPRING_FAST_EXIT.duration}ms ${NXP_SPRING_FAST_EXIT.easing}`;

// Size → pixel dimension mapping
const SIZE_PX: Record<NxpCheckboxSize, number> = { s: 16, m: 18, l: 22 };
const SIZE_RADIUS: Record<NxpCheckboxSize, string> = {
  s: '4px',
  m: '5px',
  l: '6px',
};

/**
 * Checkbox component with animated SVG checkmark.
 *
 * Uses a hidden native `<input>` for a11y + form submission, and renders a
 * visual box with stroke-dashoffset animation for check-in (80ms) / check-out (40ms).
 *
 * @example
 * <!-- Basic -->
 * <nxp-checkbox [(checked)]="agreed" />
 *
 * @example
 * <!-- With reactive forms -->
 * <nxp-checkbox [formControl]="agreedCtrl" />
 *
 * @example
 * <!-- Size and color -->
 * <nxp-checkbox size="l" color="danger" [(checked)]="flag" />
 *
 * @example
 * <!-- Indeterminate -->
 * <nxp-checkbox [indeterminate]="true" />
 */
@Component({
  selector: 'nxp-checkbox',
  standalone: true,
  template: `
    <!-- Hidden native input for a11y + form participation -->
    <input
      type="checkbox"
      class="sr-only"
      [checked]="checked()"
      [disabled]="disabled()"
      [indeterminate]="indeterminate()"
      (change)="onNativeChange($event)"
      (focus)="focused.set(true)"
      (blur)="focused.set(false); onTouched()"
    />

    <!-- Visual checkbox box -->
    <div
      [class]="boxClasses()"
      [style.width.px]="sizePx()"
      [style.height.px]="sizePx()"
      [style.border-radius]="borderRadius()"
      (click)="toggle($event)"
      (keydown.space)="toggle($event)"
      (keydown.enter)="toggle($event)"
      (mouseenter)="hovered.set(true)"
      (mouseleave)="hovered.set(false)"
    >
      <!-- Checkmark SVG -->
      <svg
        class="absolute inset-0"
        [attr.width]="sizePx()"
        [attr.height]="sizePx()"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        @if (!indeterminate()) {
          <path
            d="M6 12L10 16L18 8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            [style.stroke-dasharray]="CHECK_PATH_LENGTH"
            [style.stroke-dashoffset]="checkOffset()"
            [style.transition]="pathTransition()"
          />
        }
        @if (indeterminate()) {
          <path
            d="M6 12H18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            [style.stroke-dasharray]="DASH_PATH_LENGTH"
            [style.stroke-dashoffset]="dashOffset()"
            [style.transition]="pathTransition()"
          />
        }
      </svg>
    </div>

    <!-- Projected label content -->
    <ng-content />
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-disabled]': 'disabled() || null',
    role: 'presentation',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxpCheckboxComponent),
      multi: true,
    },
  ],
})
export class NxpCheckboxComponent implements ControlValueAccessor {
  private readonly options = inject(NXP_CHECKBOX_OPTIONS);

  // ── Public inputs ──
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly disabledInput = input(false, { alias: 'disabled' });
  readonly size = input<NxpCheckboxSize>(this.options.size as NxpCheckboxSize);
  readonly color = input<NxpCheckboxColor>('primary');
  readonly class = input<string>('');

  // CVA disabled state
  private readonly cvaDisabled = signal(false);
  readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());

  // ── Internal state ──
  readonly hovered = signal(false);
  readonly focused = signal(false);

  // Track whether we've had at least one user interaction (skip animation on initial render)
  private hasInteracted = false;

  // ── Constants exposed to template ──
  protected readonly CHECK_PATH_LENGTH = CHECK_PATH_LENGTH;
  protected readonly DASH_PATH_LENGTH = DASH_PATH_LENGTH;

  // ── CVA callbacks ──
  private onChange: (value: boolean) => void = () => {
    /* noop */
  };
  onTouched: () => void = () => {
    /* noop */
  };

  // ── Computed values ──

  readonly sizePx = computed(() => SIZE_PX[this.size()]);
  readonly borderRadius = computed(() => SIZE_RADIUS[this.size()]);

  /** stroke-dashoffset for the checkmark: 0 = fully drawn, CHECK_PATH_LENGTH = hidden */
  readonly checkOffset = computed(() =>
    this.checked() && !this.indeterminate() ? 0 : CHECK_PATH_LENGTH,
  );

  /** stroke-dashoffset for the indeterminate dash */
  readonly dashOffset = computed(() => (this.indeterminate() ? 0 : DASH_PATH_LENGTH));

  /** CSS transition for stroke-dashoffset — asymmetric in/out */
  readonly pathTransition = computed(() => {
    if (!this.hasInteracted) return 'none';
    const timing = this.checked() || this.indeterminate() ? FAST_IN : FAST_OUT;
    return `stroke-dashoffset ${timing}`;
  });

  readonly boxClasses = computed(() => {
    const color = this.color();
    const isChecked = this.checked();
    const isIndeterminate = this.indeterminate();
    const isFilled = isChecked || isIndeterminate;

    return cx(
      // Layout
      'relative shrink-0 cursor-pointer',
      // Border
      'border-[1.5px] border-solid',
      'transition-all duration-[80ms]',

      // Disabled
      this.disabled() && 'opacity-50 cursor-not-allowed',

      // Focus ring
      this.focused() && 'ring-2 ring-offset-2',
      this.focused() && color === 'primary' && 'ring-blue-500',
      this.focused() && color === 'secondary' && 'ring-gray-500',
      this.focused() && color === 'danger' && 'ring-red-500',

      // ── Color: unchecked ──
      !isFilled && 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
      !isFilled && this.hovered() && 'border-neutral-400 dark:border-neutral-500',

      // ── Color: filled (checked or indeterminate) ──
      // Primary
      isFilled && color === 'primary' && [
        'border-blue-600 bg-blue-600 text-white',
        'dark:border-blue-400 dark:bg-blue-400 dark:text-gray-900',
      ],
      // Secondary
      isFilled && color === 'secondary' && [
        'border-gray-600 bg-gray-600 text-white',
        'dark:border-gray-400 dark:bg-gray-400 dark:text-gray-900',
      ],
      // Danger
      isFilled && color === 'danger' && [
        'border-red-600 bg-red-600 text-white',
        'dark:border-red-400 dark:bg-red-400 dark:text-gray-900',
      ],

      // Unchecked text color (invisible checkmark, but needs a value)
      !isFilled && 'text-transparent',
    );
  });

  readonly hostClasses = computed(() =>
    cx(
      'inline-flex items-center gap-2 select-none',
      this.disabled() ? 'cursor-not-allowed' : 'cursor-pointer',
      this.class(),
    ),
  );

  // ── Event handlers ──

  onNativeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.hasInteracted = true;
    this.indeterminate.set(false);
    this.checked.set(target.checked);
    this.onChange(target.checked);
  }

  toggle(event: Event): void {
    event.preventDefault();
    if (this.disabled()) return;
    this.hasInteracted = true;
    this.indeterminate.set(false);
    const newValue = !this.checked();
    this.checked.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

  // ── ControlValueAccessor ──

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
