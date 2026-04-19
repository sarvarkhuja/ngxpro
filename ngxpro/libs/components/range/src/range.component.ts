import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  clamp,
  round,
  NxpSlider,
  NxpKeySteps,
  NXP_FLOATING_PRECISION,
  nxpKeyStepValueToPercentage,
  nxpPercentageToKeyStepValue,
} from '@nxp/cdk';
import { NXP_RANGE_OPTIONS, type NxpRangeSize } from './range.options';
import { NxpRangeChange } from './range-change.directive';

@Component({
  selector: 'nxp-range',
  standalone: true,
  imports: [...NxpSlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxpRangeComponent),
      multi: true,
    },
  ],
  hostDirectives: [
    {
      directive: NxpRangeChange,
      outputs: ['activeThumbChange'],
    },
  ],
  host: {
    '[style.--nxp-range-start.%]': 'thumbPercents()[0]',
    '[style.--nxp-range-end.%]': 'thumbPercents()[1]',
    '[attr.data-size]': 'size()',
    '[attr.data-segments]': 'segments()',
    '[class.nxp-range-disabled]': 'disabled()',
    '(keydown.arrowRight)': 'changeByStep(1, $any($event))',
    '(keydown.arrowUp)': 'changeByStep(1, $any($event))',
    '(keydown.arrowLeft)': 'changeByStep(-1, $any($event))',
    '(keydown.arrowDown)': 'changeByStep(-1, $any($event))',
  },
  template: `
    <div class="nxp-range-track">
      <input
        type="range"
        nxpSlider
        [readonly]="true"
        tabindex="0"
        [attr.min]="effectiveMin()"
        [attr.max]="effectiveMax()"
        [attr.step]="effectiveStep()"
        [attr.aria-label]="'Range start'"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        [attr.aria-valuenow]="value()[0]"
        [value]="nativeValues()[0]"
        [disabled]="disabled()"
      />
      <input
        type="range"
        nxpSlider
        [readonly]="true"
        tabindex="0"
        [attr.min]="effectiveMin()"
        [attr.max]="effectiveMax()"
        [attr.step]="effectiveStep()"
        [attr.aria-label]="'Range end'"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        [attr.aria-valuenow]="value()[1]"
        [value]="nativeValues()[1]"
        [disabled]="disabled()"
      />
    </div>
  `,
  styles: [
    `
      /* ── Host layout ── */
      nxp-range {
        display: block;
        position: relative;
        user-select: none;
        touch-action: none;
        outline: none;
      }

      nxp-range.nxp-range-disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      /* ── Track ── */
      .nxp-range-track {
        position: relative;
        width: 100%;
        border-radius: 9999px;
        background-color: rgb(229 231 235); /* gray-200 */
      }

      :is(.dark) .nxp-range-track {
        background-color: rgb(55 65 81); /* gray-700 */
      }

      /* ── Fill (between thumbs) ── */
      .nxp-range-track::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: var(--nxp-range-start);
        right: calc(100% - var(--nxp-range-end));
        border-radius: 9999px;
        background-color: rgb(37 99 235); /* blue-600 */
        pointer-events: none;
      }

      :is(.dark) .nxp-range-track::before {
        background-color: rgb(96 165 250); /* blue-400 */
      }

      /* ── Tick marks (segments > 1) ── */
      nxp-range[data-segments]:not([data-segments="1"]) .nxp-range-track::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 9999px;
        background: repeating-linear-gradient(
          to right,
          transparent,
          transparent calc(100% / var(--nxp-segments, 1) - 1px),
          rgb(255 255 255 / 0.4) calc(100% / var(--nxp-segments, 1) - 1px),
          rgb(255 255 255 / 0.4) calc(100% / var(--nxp-segments, 1))
        );
        pointer-events: none;
      }

      /* ── Hidden native inputs layered over track ── */
      .nxp-range-track input[type='range'] {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        margin: 0;
        padding: 0;
        transform: translateY(-50%);
        background: transparent;
        appearance: none;
        pointer-events: none;
        outline: none;
        z-index: 1;
      }

      .nxp-range-track input[type='range']::-webkit-slider-runnable-track {
        appearance: none;
        background: transparent;
        height: 0;
      }

      .nxp-range-track input[type='range']::-moz-range-track {
        appearance: none;
        background: transparent;
        height: 0;
      }

      /* ── Thumb (webkit) ── */
      .nxp-range-track input[type='range']::-webkit-slider-thumb {
        appearance: none;
        pointer-events: auto;
        cursor: pointer;
        border-radius: 50%;
        border: 2px solid rgb(37 99 235);
        background: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        transition: box-shadow 150ms ease, transform 150ms ease;
      }

      :is(.dark) .nxp-range-track input[type='range']::-webkit-slider-thumb {
        border-color: rgb(96 165 250);
        background: rgb(30 41 59); /* slate-800 */
      }

      .nxp-range-track input[type='range']:focus-visible::-webkit-slider-thumb {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
      }

      .nxp-range-track input[type='range']::-webkit-slider-thumb:hover {
        transform: scale(1.15);
      }

      /* ── Thumb (Firefox) ── */
      .nxp-range-track input[type='range']::-moz-range-thumb {
        appearance: none;
        pointer-events: auto;
        cursor: pointer;
        border-radius: 50%;
        border: 2px solid rgb(37 99 235);
        background: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        transition: box-shadow 150ms ease, transform 150ms ease;
      }

      :is(.dark) .nxp-range-track input[type='range']::-moz-range-thumb {
        border-color: rgb(96 165 250);
        background: rgb(30 41 59);
      }

      .nxp-range-track input[type='range']:focus-visible::-moz-range-thumb {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
      }

      /* ── Size: small ── */
      nxp-range[data-size='s'] .nxp-range-track {
        height: 4px;
      }
      nxp-range[data-size='s'] .nxp-range-track input[type='range'] {
        height: 4px;
      }
      nxp-range[data-size='s'] .nxp-range-track input[type='range']::-webkit-slider-thumb {
        width: 12px;
        height: 12px;
        margin-top: -4px;
      }
      nxp-range[data-size='s'] .nxp-range-track input[type='range']::-moz-range-thumb {
        width: 8px;
        height: 8px;
      }

      /* ── Size: medium ── */
      nxp-range[data-size='m'] .nxp-range-track {
        height: 6px;
      }
      nxp-range[data-size='m'] .nxp-range-track input[type='range'] {
        height: 6px;
      }
      nxp-range[data-size='m'] .nxp-range-track input[type='range']::-webkit-slider-thumb {
        width: 16px;
        height: 16px;
        margin-top: -5px;
      }
      nxp-range[data-size='m'] .nxp-range-track input[type='range']::-moz-range-thumb {
        width: 12px;
        height: 12px;
      }

      /* ── Size: large ── */
      nxp-range[data-size='l'] .nxp-range-track {
        height: 8px;
      }
      nxp-range[data-size='l'] .nxp-range-track input[type='range'] {
        height: 8px;
      }
      nxp-range[data-size='l'] .nxp-range-track input[type='range']::-webkit-slider-thumb {
        width: 20px;
        height: 20px;
        margin-top: -6px;
      }
      nxp-range[data-size='l'] .nxp-range-track input[type='range']::-moz-range-thumb {
        width: 16px;
        height: 16px;
      }

      /* ── Disabled thumbs ── */
      nxp-range.nxp-range-disabled .nxp-range-track input[type='range']::-webkit-slider-thumb {
        cursor: not-allowed;
      }
      nxp-range.nxp-range-disabled .nxp-range-track input[type='range']::-moz-range-thumb {
        cursor: not-allowed;
      }
    `,
  ],
})
export class NxpRangeComponent implements ControlValueAccessor {
  private readonly options = inject(NXP_RANGE_OPTIONS);

  // ── Inputs ──

  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly segments = input(1);
  readonly keySteps = input<NxpKeySteps | undefined>(undefined);
  readonly margin = input(0);
  readonly limit = input(Infinity);
  readonly size = input<NxpRangeSize>(this.options.size);
  readonly disabled = model(false);
  readonly value = model<[number, number]>([0, 0]);

  // ── Computed ──

  readonly computedKeySteps = computed<NxpKeySteps>(() => {
    return (
      this.keySteps() ?? [
        [0, this.min()],
        [100, this.max()],
      ] as NxpKeySteps
    );
  });

  readonly thumbPercents = computed(() => {
    const [start, end] = this.value();
    return [
      nxpKeyStepValueToPercentage(start, this.computedKeySteps()),
      nxpKeyStepValueToPercentage(end, this.computedKeySteps()),
    ] as [number, number];
  });

  readonly effectiveMin = computed(() => (this.keySteps() ? 0 : this.min()));
  readonly effectiveMax = computed(() =>
    this.keySteps() ? this.totalSteps() : this.max(),
  );
  readonly effectiveStep = computed(() =>
    this.keySteps() ? 1 : this.step() === 0 ? 'any' : this.step(),
  );

  readonly nativeValues = computed(() => {
    const [start, end] = this.value();
    const steps = this.keySteps();

    if (steps) {
      const total = this.totalSteps();
      return [
        round((nxpKeyStepValueToPercentage(start, this.computedKeySteps()) / 100) * total, 0),
        round((nxpKeyStepValueToPercentage(end, this.computedKeySteps()) / 100) * total, 0),
      ] as [number, number];
    }

    return [
      clamp(start, this.min(), this.max()),
      clamp(end, this.min(), this.max()),
    ] as [number, number];
  });

  private readonly totalSteps = computed(() => Math.round(100 / (this.step() || 1)));

  // ── CVA plumbing ──

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: [number, number]) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  writeValue(val: [number, number] | null): void {
    this.value.set(val ?? [0, 0]);
  }

  registerOnChange(fn: (value: [number, number]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // ── Public API (used by NxpRangeChange directive) ──

  /**
   * Converts a fraction (0–1) to a real domain value using key steps.
   */
  toValue(fraction: number): number {
    const percentage = clamp(fraction, 0, 1) * 100;
    return nxpPercentageToKeyStepValue(percentage, this.computedKeySteps());
  }

  /**
   * Applies constraint logic (margin, limit) and updates the value tuple.
   * @param newValue - The candidate real domain value
   * @param isEnd - Whether this targets the end (right) thumb
   */
  processValue(newValue: number, isEnd: boolean): void {
    const [start, end] = this.value();
    const marginVal = this.margin();
    const limitVal = this.limit();
    const minVal = this.min();
    const maxVal = this.max();

    let clamped = round(
      clamp(newValue, minVal, maxVal),
      NXP_FLOATING_PRECISION,
    );

    // Snap to step
    const s = this.step();
    if (s > 0 && !this.keySteps()) {
      clamped = round(Math.round((clamped - minVal) / s) * s + minVal, NXP_FLOATING_PRECISION);
      clamped = clamp(clamped, minVal, maxVal);
    }

    let newStart = start;
    let newEnd = end;

    if (isEnd) {
      newEnd = clamped;
      // Enforce margin
      if (newEnd - newStart < marginVal) {
        newEnd = newStart + marginVal;
      }
      // Enforce limit
      if (limitVal < Infinity && newEnd - newStart > limitVal) {
        newEnd = newStart + limitVal;
      }
      newEnd = clamp(newEnd, minVal, maxVal);
    } else {
      newStart = clamped;
      // Enforce margin
      if (newEnd - newStart < marginVal) {
        newStart = newEnd - marginVal;
      }
      // Enforce limit
      if (limitVal < Infinity && newEnd - newStart > limitVal) {
        newStart = newEnd - limitVal;
      }
      newStart = clamp(newStart, minVal, maxVal);
    }

    const updated: [number, number] = [newStart, newEnd];

    if (updated[0] !== start || updated[1] !== end) {
      this.value.set(updated);
      this.onChange(updated);
      this.onTouched();
    }
  }

  /**
   * Keyboard navigation — moves the focused thumb by one step.
   */
  changeByStep(coefficient: number, event: KeyboardEvent): void {
    if (this.disabled()) return;

    event.preventDefault();

    const target = event.target as HTMLElement;
    const inputs = (event.currentTarget as HTMLElement).querySelectorAll(
      'input[type="range"]',
    );
    const isEnd = target === inputs[1];

    const s = this.step();
    const [start, end] = this.value();
    const currentValue = isEnd ? end : start;
    const newValue = currentValue + s * coefficient;

    this.processValue(newValue, isEnd);
  }
}
