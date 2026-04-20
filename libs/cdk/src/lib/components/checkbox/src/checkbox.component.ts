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
import { NXP_CHECKBOX_OPTIONS } from './checkbox.options';

export type NxpCheckboxSize = 's' | 'm' | 'l';
export type NxpCheckboxColor = 'primary' | 'secondary' | 'danger';

const SIZE_PX: Record<NxpCheckboxSize, number> = { s: 16, m: 18, l: 22 };
const SIZE_RADIUS: Record<NxpCheckboxSize, string> = {
  s: '4px',
  m: '5px',
  l: '6px',
};

@Component({
  selector: 'nxp-checkbox',
  standalone: true,
  template: `
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
  readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());

  readonly hovered = signal(false);
  readonly focused = signal(false);

  private onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  readonly sizePx = computed(() => SIZE_PX[this.size()]);
  readonly borderRadius = computed(() => SIZE_RADIUS[this.size()]);

  readonly boxClasses = computed(() => {
    const color = this.color();
    const isChecked = this.checked();
    const isIndeterminate = this.indeterminate();
    const isFilled = isChecked || isIndeterminate;

    return cx(
      'relative shrink-0 cursor-pointer',
      'border-[1.5px] border-solid',
      'transition-colors duration-[80ms]',

      this.disabled() && 'opacity-50 cursor-not-allowed',

      this.focused() && 'ring-2 ring-offset-2',
      this.focused() && color === 'primary' && 'ring-blue-500',
      this.focused() && color === 'secondary' && 'ring-gray-500',
      this.focused() && color === 'danger' && 'ring-red-500',

      !isFilled && 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
      !isFilled && this.hovered() && 'border-neutral-400 dark:border-neutral-500',

      isFilled && color === 'primary' && [
        'border-blue-600 bg-blue-600 text-white',
        'dark:border-blue-400 dark:bg-blue-400 dark:text-gray-900',
      ],
      isFilled && color === 'secondary' && [
        'border-gray-600 bg-gray-600 text-white',
        'dark:border-gray-400 dark:bg-gray-400 dark:text-gray-900',
      ],
      isFilled && color === 'danger' && [
        'border-red-600 bg-red-600 text-white',
        'dark:border-red-400 dark:bg-red-400 dark:text-gray-900',
      ],

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
