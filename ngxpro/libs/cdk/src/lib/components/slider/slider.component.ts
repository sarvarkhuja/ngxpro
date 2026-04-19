import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { nxpInjectElement } from '../../utils/inject-element';
import { clamp, round } from '../../utils/math';
import {
  NXP_FLOATING_PRECISION,
  NxpKeySteps,
  nxpKeyStepValueToPercentage,
  nxpPercentageToKeyStepValue,
} from './helpers/key-steps';
import { noop } from 'rxjs';

/**
 * Low-level CDK slider component applied as an attribute directive on a native
 * `<input type="range">` element.
 *
 * Handles value binding, fill-ratio calculation, and optional key-step mapping.
 * Styling is left entirely to the consumer via Tailwind classes.
 *
 * Implements `ControlValueAccessor` so it can be used with `[(ngModel)]`,
 * `[formControl]`, or `formControlName`.
 *
 * @example
 * Basic usage with model binding:
 * ```html
 * <input type="range" nxpSlider [(nxpValue)]="myValue" [min]="0" [max]="100" />
 * ```
 *
 * @example
 * With Angular Forms:
 * ```html
 * <input type="range" nxpSlider [formControl]="ctrl" [min]="0" [max]="100" [step]="5" />
 * ```
 *
 * @example
 * With key steps for non-linear ranges:
 * ```html
 * <input type="range" nxpSlider [formControl]="ctrl" [keySteps]="steps" />
 * ```
 */
@Component({
  selector: 'input[type=range][nxpSlider]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxpSliderComponent),
      multi: true,
    },
  ],
  host: {
    // Trigger change detection when the user drags the thumb.
    '(input)': '_onNativeInput()',
    // Notify the forms API of touched state on blur.
    '(blur)': '_onTouched()',
    '[style.--nxp-slider-fill-ratio]': 'valueRatio',
    '[attr.min]': 'effectiveMin()',
    '[attr.max]': 'effectiveMax()',
    '[attr.step]': 'effectiveStep()',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'value',
    '[attr.disabled]': 'disabled() ? true : null',
  },
})
export class NxpSliderComponent implements ControlValueAccessor, OnInit {
  private readonly el = nxpInjectElement<HTMLInputElement>();

  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------

  /** Minimum value of the slider. */
  public readonly min = input(0);

  /** Maximum value of the slider. */
  public readonly max = input(100);

  /** Step increment. Use `0` for continuous ("any") movement. */
  public readonly step = input(1);

  /**
   * Optional key steps for non-linear value mapping.
   * When provided the underlying `<input>` operates on a 0–100 integer range
   * and values are translated to/from the real domain automatically.
   */
  public readonly keySteps = input<NxpKeySteps | undefined>(undefined);

  /** Whether the slider is disabled. */
  public readonly disabled = model(false);

  /**
   * Two-way bound model value (real domain).
   * Prefer `[(ngModel)]` / `[formControl]` for reactive forms; this model()
   * binding is available for simple template-only usage.
   */
  public readonly nxpValue = model<number>(0);

  // ---------------------------------------------------------------------------
  // Computed — effective attributes applied to the native input
  // ---------------------------------------------------------------------------

  /**
   * When key steps are active the native input always operates on 0–totalSteps.
   * Otherwise it mirrors the declared min/max.
   */
  protected readonly effectiveMin = computed(() => (this.keySteps() ? 0 : this.min()));
  protected readonly effectiveMax = computed(() =>
    this.keySteps() ? this._totalSteps() : this.max(),
  );
  protected readonly effectiveStep = computed(() =>
    this.keySteps() ? 1 : this.step() === 0 ? 'any' : this.step(),
  );

  /**
   * Total discrete steps when key steps are active.
   * Always an integer (non-integer step counts are invalid for native range inputs).
   */
  private readonly _totalSteps = computed(() => Math.round(100 / (this.step() || 1)));

  // ---------------------------------------------------------------------------
  // ControlValueAccessor plumbing
  // ---------------------------------------------------------------------------

  /** @internal */
  _onChange: (value: number) => void = noop;

  /** @internal */
  _onTouched: () => void = noop;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public ngOnInit(): void {
    // Sync model value → native element on first render.
    this._writeNativeValue(this.nxpValue());
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * The current real-domain value of the slider.
   * When key steps are active this translates from the native 0–totalSteps value.
   */
  public get value(): number {
    const native = Number(this.el.value) || 0;
    const steps = this.keySteps();

    if (steps) {
      const percentage = (native / this._totalSteps()) * 100;
      return nxpPercentageToKeyStepValue(percentage, steps);
    }

    const s = this.step();
    if (s > 0) {
      return round(Math.round(native / s) * s, NXP_FLOATING_PRECISION);
    }

    return native;
  }

  public set value(v: number) {
    this._writeNativeValue(v);
  }

  /**
   * Ratio of the current value within the [min, max] range (0–1).
   * Used to drive CSS custom property `--nxp-slider-fill-ratio` for track fill.
   */
  public get valueRatio(): number {
    return (this.value - this.min()) / (this.max() - this.min()) || 0;
  }

  // ---------------------------------------------------------------------------
  // ControlValueAccessor implementation
  // ---------------------------------------------------------------------------

  public writeValue(externalValue: number | null): void {
    const v = externalValue ?? 0;
    this._writeNativeValue(v);
    this.nxpValue.set(v);
  }

  public registerOnChange(fn: (value: number) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /** @internal — called by host `(input)` binding */
  _onNativeInput(): void {
    const v = this.value;
    this.nxpValue.set(v);
    this._onChange(v);
  }

  private _writeNativeValue(realValue: number): void {
    const steps = this.keySteps();

    if (steps) {
      const percentage = nxpKeyStepValueToPercentage(realValue, steps);
      this.el.value = String(round((percentage / 100) * this._totalSteps(), 0));
    } else {
      const clamped = clamp(realValue, this.min(), this.max());
      this.el.value = String(clamped);
    }
  }
}
