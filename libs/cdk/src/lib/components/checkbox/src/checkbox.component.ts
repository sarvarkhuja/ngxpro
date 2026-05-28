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

import { NXP_CHECKBOX_OPTIONS } from './checkbox.options';
import { cx } from '@ngxpro/cdk';

export type NxpCheckboxSize = 's' | 'm' | 'l';
export type NxpCheckboxColor = 'primary' | 'secondary' | 'danger';

const SIZE_PX: Record<NxpCheckboxSize, number> = { s: 16, m: 18, l: 22 };
const SIZE_RADIUS: Record<NxpCheckboxSize, string> = {
  s: 'var(--nxp-radius-sm)',
  m: 'var(--nxp-radius-sm)',
  l: 'var(--nxp-radius-sm)',
};

/**
 * Checkbox component — styled wrapper over a native `<input type="checkbox">`.
 *
 * The real input is rendered as a `peer sr-only` sibling of the styled box,
 * so Tailwind's `peer-checked:*`, `peer-indeterminate:*`, `peer-hover:*`,
 * `peer-focus-visible:*` and `peer-disabled:*` variants read the browser's
 * native state. No signal mirrors `checked` / `indeterminate` / hover /
 * focus to drive classes — that was the source of the "fade on route change"
 * bug (CVA `writeValue` fires one CD tick after first paint; the signal
 * flipping triggered `transition-colors` to animate the mismatch).
 */
@Component({
  selector: 'nxp-checkbox',
  template: `
    <input
      type="checkbox"
      class="peer sr-only"
      [checked]="checked()"
      [disabled]="disabled()"
      [indeterminate]="indeterminate()"
      (change)="onNativeChange($event)"
      (blur)="onTouched()"
    />

    <div
      [class]="boxClasses()"
      [style.width.px]="sizePx()"
      [style.height.px]="sizePx()"
      [style.border-radius]="borderRadius()"
      aria-hidden="true"
    >
      <svg
        class="absolute inset-0 w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        @if (checked() && !indeterminate()) {
          <path
            d="M6 12L10 16L18 8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        }
        @if (indeterminate()) {
          <path
            d="M6 12H18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        }
      </svg>
    </div>

    <ng-content />
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-disabled]': 'disabled() || null',
    role: 'presentation',
    '(click)': 'toggle($event)',
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

  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly disabledInput = input(false, { alias: 'disabled' });
  readonly size = input<NxpCheckboxSize>(this.options.size as NxpCheckboxSize);
  readonly color = input<NxpCheckboxColor>('primary');
  readonly class = input<string>('');

  private readonly cvaDisabled = signal(false);
  readonly disabled = computed(
    () => this.disabledInput() || this.cvaDisabled(),
  );

  private onChange: (value: boolean) => void = () => {
    /* noop */
  };
  onTouched: () => void = () => {
    /* noop */
  };

  readonly sizePx = computed(() => SIZE_PX[this.size()]);
  readonly borderRadius = computed(() => SIZE_RADIUS[this.size()]);

  /**
   * Classes depend only on the `color` input, never on state — `peer-*`
   * variants read state off the sibling input. That means the class string
   * is stable across check/uncheck/hover/focus, so `transition-colors` only
   * fires in response to the real pseudo-class flip, never to an Angular
   * re-render racing with it.
   */
  readonly boxClasses = computed(() => {
    const color = this.color();

    return cx(
      'relative shrink-0 cursor-pointer',
      'border-[1.5px] border-solid',
      // Match sister form controls (radio.component, checkbox.directive)
      // which both use duration-normal for color/border state transitions.
      'transition-colors duration-normal ease-out',

      'border-border-normal bg-bg-base',
      'text-transparent',
      'peer-hover:border-border-hover',
      'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',

      'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-border-focus',

      color === 'primary' && [
        'peer-checked:border-primary peer-checked:bg-primary peer-checked:text-text-on-accent',
        'peer-indeterminate:border-primary peer-indeterminate:bg-primary peer-indeterminate:text-text-on-accent',
      ],
      color === 'secondary' && [
        'peer-checked:border-bg-neutral-2 peer-checked:bg-bg-neutral-2 peer-checked:text-text-primary',
        'peer-indeterminate:border-bg-neutral-2 peer-indeterminate:bg-bg-neutral-2 peer-indeterminate:text-text-primary',
      ],
      color === 'danger' && [
        'peer-checked:border-status-negative peer-checked:bg-status-negative peer-checked:text-text-on-accent',
        'peer-indeterminate:border-status-negative peer-indeterminate:bg-status-negative peer-indeterminate:text-text-on-accent',
      ],
    );
  });

  readonly hostClasses = computed(() =>
    cx(
      'inline-flex items-center gap-2 select-none',
      this.disabled() ? 'cursor-not-allowed' : 'cursor-pointer',
      this.class(),
    ),
  );

  onNativeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.indeterminate.set(false);
    this.checked.set(target.checked);
    this.onChange(target.checked);
  }

  toggle(event: Event): void {
    event.preventDefault();
    if (this.disabled()) return;
    this.indeterminate.set(false);
    const newValue = !this.checked();
    this.checked.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

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
