import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
  ViewEncapsulation,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NXP_RADIO_OPTIONS } from './radio.options';
import { cx } from '@ngxpro/cdk';

export type NxpRadioSize = 's' | 'm' | 'l';
export type NxpRadioColor = 'primary' | 'secondary' | 'danger';

/** Equality used to match a form value against this radio's `value`. */
export type NxpRadioCompareWith = (a: unknown, b: unknown) => boolean;

/**
 * Radio component — styled wrapper over a native `<input type="radio">`.
 *
 * The real input is rendered inside a `<label>` so the projected content acts as
 * the clickable label and the browser handles name-group exclusivity and arrow-key
 * navigation. Styling is driven entirely by the input's `:checked` / `:disabled`
 * pseudo-classes — no signal mirrors `checked` to drive classes, which was the
 * source of the "fade on route change" bug (CVA `writeValue` lands one CD tick
 * after first paint, a mirrored signal flips, and `transition-colors` animates
 * the mismatch). The `checked` model never feeds a `[checked]` binding either;
 * it is pushed to the DOM imperatively so native group selection isn't fought.
 *
 * Integrates with Angular forms through its own `ControlValueAccessor`: bind the
 * same `[formControl]` / `[(ngModel)]` to several `<nxp-radio>` elements and they
 * stay mutually exclusive via the shared control. For object values, pass
 * `[compareWith]` to match by a stable property instead of reference equality.
 *
 * @example
 * <!-- Basic radio -->
 * <nxp-radio name="fruit" value="apple">Apple</nxp-radio>
 *
 * @example
 * <!-- Reactive forms -->
 * <nxp-radio [formControl]="fruitControl" value="apple">Apple</nxp-radio>
 *
 * @example
 * <!-- Object values: compare by id -->
 * <nxp-radio [compareWith]="byId" [formControl]="ctrl" [value]="fruit" name="fruit">
 *   {{ fruit.label }}
 * </nxp-radio>
 *
 * @example
 * <!-- Size and color variants -->
 * <nxp-radio size="l" color="danger" name="opt" value="no">No</nxp-radio>
 */
@Component({
  selector: 'nxp-radio',
  template: `
    <label [class]="hostClasses()">
      <input
        #input
        type="radio"
        [class]="inputClasses()"
        [attr.name]="name() || null"
        [attr.value]="value()"
        [disabled]="disabled()"
        [attr.data-size]="size()"
        [attr.data-color]="color()"
        (change)="onNativeChange($event)"
        (blur)="onTouched()"
      />
      <ng-content />
    </label>
  `,
  styles: [
    `
      /* Per-variant dot color — flips automatically with theme via the
         existing token system (no .dark override needed). Each variant
         picks the token whose contrast pair matches its checked background:
           primary  bg = --nxp-primary       → dot = --nxp-text-on-accent
           secondary bg = --nxp-bg-neutral-2 → dot = --nxp-text-primary
           danger   bg = --nxp-status-negative (red in both modes) → dot = white */
      .nxp-radio-input[data-color='primary'] {
        --nxp-radio-dot: var(--nxp-text-on-accent);
      }
      .nxp-radio-input[data-color='secondary'] {
        --nxp-radio-dot: var(--nxp-text-primary);
      }
      .nxp-radio-input[data-color='danger'] {
        --nxp-radio-dot: #ffffff;
      }

      /* Dot painted by a radial-gradient so the color is themable via CSS
         variable. Data-URI SVG fill can't read currentColor, hence the gradient.
         Geometry: r=3.5 in a 16-viewBox at 75% size → dot radius ≈ 32.8% of
         closest-side. 1.5% transition zone preserves the antialiased edge. */
      .nxp-radio-input:checked {
        background-image: radial-gradient(
          circle closest-side,
          var(--nxp-radio-dot, #ffffff) 31.5%,
          transparent 33%
        );
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxpRadioComponent),
      multi: true,
    },
  ],
})
export class NxpRadioComponent implements ControlValueAccessor, AfterViewInit {
  private readonly options = inject(NXP_RADIO_OPTIONS);
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('input');

  /** This radio's value — reported to the form when selected. */
  readonly value = input<unknown>(null);
  /** Native group name; siblings sharing a name are mutually exclusive. */
  readonly name = input<string>('');
  /** Whether this radio is selected. Two-way bindable as `[(checked)]`. */
  readonly checked = model(false);
  /** Size of the radio control. Defaults to the option value ('m'). */
  readonly size = input<NxpRadioSize>(this.options.size);
  /** Color variant. Controls border and checked fill color. */
  readonly color = input<NxpRadioColor>('primary');
  /** Additional CSS classes merged onto the inner input. */
  readonly class = input<string>('');
  /** Equality used to match the form value against `value`. */
  readonly compareWith = input<NxpRadioCompareWith>((a, b) => a === b);

  readonly disabledInput = input(false, { alias: 'disabled' });
  private readonly cvaDisabled = signal(false);
  readonly disabled = computed(
    () => this.disabledInput() || this.cvaDisabled(),
  );

  private onChange: (value: unknown) => void = () => {
    /* noop */
  };
  onTouched: () => void = () => {
    /* noop */
  };

  ngAfterViewInit(): void {
    // `writeValue` can fire before the view query resolves, so the initial
    // checked state (an explicit `[(checked)]` or a value already pushed by a
    // form's `writeValue`) is applied to the DOM here, once the input exists.
    this.syncDom();
  }

  readonly inputClasses = computed(() =>
    cx(
      // Marker class targeted by the dot CSS above. Must live inside the cx()
      // result: the whole-string `[class]` binding replaces any static `class`
      // attribute, so it cannot be set separately on the element.
      'nxp-radio-input',
      'appearance-none cursor-pointer shrink-0',
      'rounded-full border-2',
      'transition-[background-color,border-color,box-shadow] duration-normal ease-out',
      'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus',
      'disabled:opacity-50 disabled:cursor-not-allowed',

      this.size() === 's' && 'size-4',
      this.size() === 'm' && 'size-5',
      this.size() === 'l' && 'size-6',

      this.color() === 'primary' && [
        'border-border-normal bg-bg-base',
        'checked:border-primary checked:bg-primary',
      ],
      this.color() === 'secondary' && [
        'border-border-normal bg-bg-base',
        'checked:border-bg-neutral-2 checked:bg-bg-neutral-2',
      ],
      this.color() === 'danger' && [
        'border-status-negative/40 bg-bg-base',
        'checked:border-status-negative checked:bg-status-negative',
      ],

      this.class(),
    ),
  );

  readonly hostClasses = computed(() =>
    cx(
      'inline-flex items-center gap-2 select-none',
      this.disabled() ? 'cursor-not-allowed' : 'cursor-pointer',
    ),
  );

  /** Push the current `checked` model to the DOM input (no-op before view init). */
  private syncDom(): void {
    const ref = this.inputRef();
    if (ref) ref.nativeElement.checked = this.checked();
  }

  protected onNativeChange(event: Event): void {
    // Native radios fire `change` only on the element becoming checked; the
    // de-selected sibling is updated through the shared form control's fan-out.
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checked.set(isChecked);
    if (isChecked) this.onChange(this.value());
  }

  writeValue(value: unknown): void {
    this.checked.set(this.compareWith()(value, this.value()));
    this.syncDom();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
