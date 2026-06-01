import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  clamp,
  round,
  type NxpKeySteps,
  NXP_FLOATING_PRECISION,
  nxpKeyStepValueToPercentage,
  nxpPercentageToKeyStepValue,
} from '@ngxpro/cdk';

const THUMB_SIZE = 20;
const THUMB_SIZE_REST = 16;
const TRACK_BG_HEIGHT = 18;
const DOT_SIZE = 4;
const TRACK_INSET = (THUMB_SIZE - TRACK_BG_HEIGHT) / 2;

@Component({
  selector: 'nxp-range',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxpRangeComponent),
      multi: true,
    },
  ],
  host: {
    '[class.nxp-range-disabled]': 'disabled()',
    '[class.nxp-range-themed]': 'themeColor()',
  },
  template: `
    <div class="nxp-range-track-area">
      <div
        #trackEl
        class="nxp-range-track"
        [class.nxp-range-dragging]="isPressed()"
        [style.height.px]="THUMB_SIZE + 16"
        (pointerenter)="isHovered.set(true)"
        (pointerleave)="isHovered.set(false)"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
      >
        <div
          class="nxp-range-track-bg"
          [style.left.px]="TRACK_INSET"
          [style.right.px]="TRACK_INSET"
          [style.top.px]="8 + (THUMB_SIZE - TRACK_BG_HEIGHT) / 2"
          [style.height.px]="TRACK_BG_HEIGHT"
        >
          <div
            class="nxp-range-fill"
            [style.left]="fillLeft()"
            [style.width]="fillWidth()"
          ></div>
        </div>

        @if (showSteps() && stepDots().length > 0) {
          <div
            class="nxp-range-dots-container"
            [style.top.px]="8 + (THUMB_SIZE - TRACK_BG_HEIGHT) / 2"
            [style.height.px]="TRACK_BG_HEIGHT"
          >
            @for (dot of stepDots(); track dot.value) {
              <div
                class="nxp-range-dot-wrapper"
                [style.left]="
                  'calc(' +
                  THUMB_SIZE / 2 +
                  'px + ' +
                  dot.percent +
                  ' * (100% - ' +
                  THUMB_SIZE +
                  'px))'
                "
              >
                <div
                  class="nxp-range-dot"
                  [class.nxp-range-dot-hidden]="
                    dot.percent >= startRatio() && dot.percent <= endRatio()
                  "
                  [class.nxp-range-dot-hovered]="isHovered()"
                ></div>
              </div>
            }
          </div>
        }

        <div
          class="nxp-range-thumb-outer"
          [style.left]="thumbStartLeft()"
          [style.top.px]="8"
        >
          <span class="nxp-range-thumb"></span>
          @if (focusedThumb() === 0) {
            <span class="nxp-range-focus-ring"></span>
          }
        </div>
        <div
          class="nxp-range-thumb-outer"
          [style.left]="thumbEndLeft()"
          [style.top.px]="8"
        >
          <span class="nxp-range-thumb"></span>
          @if (focusedThumb() === 1) {
            <span class="nxp-range-focus-ring"></span>
          }
        </div>
      </div>

      <input
        #nativeStart
        type="range"
        class="nxp-range-native-input"
        [attr.min]="effectiveMin()"
        [attr.max]="effectiveMax()"
        [attr.step]="effectiveStep()"
        [value]="nativeValues()[0]"
        [disabled]="disabled()"
        [attr.aria-label]="(label() ?? 'Range') + ' start'"
        [attr.aria-valuenow]="value()[0]"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        (input)="onNativeInput(0, $event)"
        (focus)="focusedThumb.set(0)"
        (blur)="onNativeBlur($event)"
      />
      <input
        #nativeEnd
        type="range"
        class="nxp-range-native-input"
        [attr.min]="effectiveMin()"
        [attr.max]="effectiveMax()"
        [attr.step]="effectiveStep()"
        [value]="nativeValues()[1]"
        [disabled]="disabled()"
        [attr.aria-label]="(label() ?? 'Range') + ' end'"
        [attr.aria-valuenow]="value()[1]"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        (input)="onNativeInput(1, $event)"
        (focus)="focusedThumb.set(1)"
        (blur)="onNativeBlur($event)"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      overflow: visible;
      user-select: none;
      touch-action: none;
    }
    :host.nxp-range-disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .nxp-range-track-area {
      position: relative;
      width: 100%;
      overflow: visible;
    }

    .nxp-range-track {
      position: relative;
      width: 100%;
      cursor: ew-resize;
      padding: 8px 0;
    }

    .nxp-range-track-bg {
      position: absolute;
      /* Shadow-as-border so the track lives in the shadow layer */
      box-shadow: 0 0 0 1px var(--nxp-border-normal);
      overflow: hidden;
      border-radius: 9999px;
      background: transparent;
    }

    .nxp-range-fill {
      position: absolute;
      height: 100%;
      background: color-mix(in srgb, var(--nxp-text-primary) 12%, transparent);
      transition:
        left 160ms cubic-bezier(0.22, 1.2, 0.36, 1),
        width 160ms cubic-bezier(0.22, 1.2, 0.36, 1);
    }
    .nxp-range-dragging .nxp-range-fill {
      transition: none;
    }

    .nxp-range-dots-container {
      position: absolute;
      left: 0;
      right: 0;
      pointer-events: none;
    }
    .nxp-range-dot-wrapper {
      position: absolute;
      top: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 0;
      height: 0;
    }
    .nxp-range-dot {
      width: ${DOT_SIZE}px;
      height: ${DOT_SIZE}px;
      border-radius: 9999px;
      flex-shrink: 0;
      background: var(--nxp-text-tertiary);
      opacity: 0.4;
      transition:
        width 160ms cubic-bezier(0.22, 1.2, 0.36, 1),
        height 160ms cubic-bezier(0.22, 1.2, 0.36, 1),
        opacity 80ms linear;
    }
    .nxp-range-dot-hovered {
      width: ${DOT_SIZE * 1.25}px;
      height: ${DOT_SIZE * 1.25}px;
    }
    .nxp-range-dot-hidden {
      opacity: 0;
    }

    .nxp-range-thumb-outer {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${THUMB_SIZE}px;
      height: ${THUMB_SIZE}px;
      pointer-events: none;
      z-index: 10;
      transition: left 160ms cubic-bezier(0.22, 1.2, 0.36, 1);
    }
    .nxp-range-dragging .nxp-range-thumb-outer {
      transition: none;
    }
    .nxp-range-thumb {
      display: block;
      width: ${THUMB_SIZE_REST}px;
      height: ${THUMB_SIZE_REST}px;
      border-radius: 9999px;
      background: var(--nxp-bg-base);
      /* Vercel multi-layer lift — token auto-flips for dark mode */
      box-shadow: var(--nxp-shadow-lift);
    }
    .nxp-range-focus-ring {
      position: absolute;
      width: ${THUMB_SIZE + 6}px;
      height: ${THUMB_SIZE + 6}px;
      border-radius: 9999px;
      box-shadow: 0 0 0 2px var(--nxp-border-focus);
      pointer-events: none;
    }

    .nxp-range-native-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
      height: ${THUMB_SIZE}px;
    }

    /* --- Theme color mode --- */
    :host.nxp-range-themed .nxp-range-fill {
      background: color-mix(in srgb, var(--nxp-primary) 25%, transparent);
    }
    :host.nxp-range-themed .nxp-range-thumb {
      background: var(--nxp-primary);
      box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.08),
        0 1px 3px color-mix(in srgb, var(--nxp-primary) 30%, transparent);
    }
    :host.nxp-range-themed .nxp-range-focus-ring {
      box-shadow: 0 0 0 2px var(--nxp-primary);
    }
    :host.nxp-range-themed .nxp-range-track-bg {
      box-shadow: 0 0 0 1px
        color-mix(in srgb, var(--nxp-primary) 30%, var(--nxp-border-normal));
    }
    :host.nxp-range-themed .nxp-range-dot {
      background: color-mix(
        in srgb,
        var(--nxp-primary) 40%,
        var(--nxp-text-tertiary)
      );
    }
  `,
})
export class NxpRangeComponent implements ControlValueAccessor {
  protected readonly THUMB_SIZE = THUMB_SIZE;
  protected readonly TRACK_BG_HEIGHT = TRACK_BG_HEIGHT;
  protected readonly TRACK_INSET = TRACK_INSET;

  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly keySteps = input<NxpKeySteps | undefined>(undefined);
  readonly margin = input(0);
  readonly limit = input(Infinity);
  readonly showSteps = input(false);
  readonly themeColor = input(false);
  readonly label = input<string | undefined>(undefined);
  readonly disabled = model(false);
  readonly value = model<[number, number]>([0, 0]);

  private readonly trackElRef =
    viewChild<ElementRef<HTMLDivElement>>('trackEl');
  private readonly nativeStartRef =
    viewChild<ElementRef<HTMLInputElement>>('nativeStart');
  private readonly nativeEndRef =
    viewChild<ElementRef<HTMLInputElement>>('nativeEnd');

  readonly isHovered = signal(false);
  readonly isPressed = signal(false);
  readonly focusedThumb = signal<0 | 1 | null>(null);
  private activeThumb: 0 | 1 = 0;

  readonly computedKeySteps = computed<NxpKeySteps>(
    () =>
      this.keySteps() ??
      ([
        [0, this.min()],
        [100, this.max()],
      ] as NxpKeySteps),
  );

  readonly thumbPercents = computed(() => {
    const [start, end] = this.value();
    return [
      nxpKeyStepValueToPercentage(start, this.computedKeySteps()),
      nxpKeyStepValueToPercentage(end, this.computedKeySteps()),
    ] as [number, number];
  });

  readonly startRatio = computed(() =>
    Math.max(0, Math.min(1, this.thumbPercents()[0] / 100)),
  );
  readonly endRatio = computed(() =>
    Math.max(0, Math.min(1, this.thumbPercents()[1] / 100)),
  );

  readonly thumbStartLeft = computed(() => {
    const r = this.startRatio();
    return `calc(${r * 100}% - ${r * THUMB_SIZE}px)`;
  });
  readonly thumbEndLeft = computed(() => {
    const r = this.endRatio();
    return `calc(${r * 100}% - ${r * THUMB_SIZE}px)`;
  });

  readonly fillLeft = computed(() => {
    const r = this.startRatio();
    return `calc(${r * 100}% + ${THUMB_SIZE / 2 - r * THUMB_SIZE}px)`;
  });
  readonly fillWidth = computed(() => {
    const s = this.startRatio();
    const e = this.endRatio();
    const span = Math.max(0, e - s);
    return `calc(${span * 100}% + ${-span * THUMB_SIZE}px)`;
  });

  readonly stepDots = computed(() => {
    if (!this.showSteps() || this.keySteps()) return [];
    const mn = this.min();
    const mx = this.max();
    const s = this.step();
    const range = mx - mn;
    if (range <= 0 || s <= 0) return [];
    const count = Math.round(range / s) + 1;
    return Array.from({ length: count }, (_, i) => {
      const v = mn + i * s;
      const percent = (v - mn) / range;
      return { value: v, percent };
    });
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
        round(
          (nxpKeyStepValueToPercentage(start, this.computedKeySteps()) / 100) *
            total,
          0,
        ),
        round(
          (nxpKeyStepValueToPercentage(end, this.computedKeySteps()) / 100) *
            total,
          0,
        ),
      ] as [number, number];
    }
    return [
      clamp(start, this.min(), this.max()),
      clamp(end, this.min(), this.max()),
    ] as [number, number];
  });

  private readonly totalSteps = computed(() =>
    Math.round(100 / (this.step() || 1)),
  );

  constructor() {
    effect(() => {
      const [s, e] = this.nativeValues();
      const startEl = this.nativeStartRef()?.nativeElement;
      const endEl = this.nativeEndRef()?.nativeElement;
      if (startEl) startEl.value = String(s);
      if (endEl) endEl.value = String(e);
    });
  }

  // ── ControlValueAccessor ──

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

  // ── Pointer handlers ──

  protected onPointerDown(event: PointerEvent): void {
    if (this.disabled()) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();

    const trackEl = this.trackElRef()?.nativeElement;
    if (!trackEl) return;

    const trackRect = trackEl.getBoundingClientRect();
    const fraction = this.fractionFromClientX(event.clientX, trackRect);
    const candidate = this.toValue(fraction);
    const isEnd = this.decideThumb(candidate);
    this.activeThumb = isEnd ? 1 : 0;
    this.isPressed.set(true);

    trackEl.setPointerCapture(event.pointerId);
    this.processValue(candidate, isEnd);

    const nativeRef = isEnd ? this.nativeEndRef() : this.nativeStartRef();
    nativeRef?.nativeElement.focus();
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.isPressed()) return;
    event.stopPropagation();
    const trackEl = this.trackElRef()?.nativeElement;
    if (!trackEl) return;
    const trackRect = trackEl.getBoundingClientRect();
    const fraction = this.fractionFromClientX(event.clientX, trackRect);
    this.processValue(this.toValue(fraction), this.activeThumb === 1);
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.isPressed()) return;
    this.isPressed.set(false);
    const trackEl = this.trackElRef()?.nativeElement;
    if (trackEl && trackEl.hasPointerCapture(event.pointerId)) {
      trackEl.releasePointerCapture(event.pointerId);
    }
    this.onTouched();
  }

  // ── Native input (keyboard) ──

  protected onNativeInput(thumbIndex: 0 | 1, event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = Number(input.value);
    const real = this.keySteps()
      ? nxpPercentageToKeyStepValue(
          (raw / this.totalSteps()) * 100,
          this.computedKeySteps(),
        )
      : raw;
    this.processValue(real, thumbIndex === 1);
  }

  protected onNativeBlur(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    const startEl = this.nativeStartRef()?.nativeElement;
    const endEl = this.nativeEndRef()?.nativeElement;
    if (next !== startEl && next !== endEl) {
      this.focusedThumb.set(null);
      this.onTouched();
    }
  }

  // ── Helpers ──

  private fractionFromClientX(clientX: number, trackRect: DOMRect): number {
    const localX = clientX - trackRect.left - THUMB_SIZE / 2;
    const usable = trackRect.width - THUMB_SIZE;
    if (usable <= 0) return 0;
    return Math.max(0, Math.min(1, localX / usable));
  }

  private decideThumb(candidateValue: number): boolean {
    const [start, end] = this.value();
    if (candidateValue > end) return true;
    if (candidateValue < start) return false;
    const dStart = Math.abs(candidateValue - start);
    const dEnd = Math.abs(candidateValue - end);
    return dEnd < dStart;
  }

  /**
   * Converts a fraction (0–1) to a real domain value using key steps.
   */
  toValue(fraction: number): number {
    const percentage = clamp(fraction, 0, 1) * 100;
    return nxpPercentageToKeyStepValue(percentage, this.computedKeySteps());
  }

  /**
   * Applies constraint logic (margin, limit) and updates the value tuple.
   */
  processValue(newValue: number, isEnd: boolean): void {
    const [start, end] = this.value();
    const marginVal = this.margin();
    const limitVal = this.limit();
    // With keySteps the value domain is defined by the steps (e.g. 50_000–
    // 30_000_000), not by min()/max() which stay 0–100. Clamp to the keystep
    // bounds so a dragged value maps back to a valid domain value instead of
    // collapsing to 0/100. Falls back to min()/max() when keySteps is absent.
    const steps = this.keySteps();
    const minVal = steps ? steps[0][1] : this.min();
    const maxVal = steps ? steps[steps.length - 1][1] : this.max();

    let clamped = round(
      clamp(newValue, minVal, maxVal),
      NXP_FLOATING_PRECISION,
    );

    const s = this.step();
    if (s > 0 && !this.keySteps()) {
      clamped = round(
        Math.round((clamped - minVal) / s) * s + minVal,
        NXP_FLOATING_PRECISION,
      );
      clamped = clamp(clamped, minVal, maxVal);
    }

    let newStart = start;
    let newEnd = end;

    if (isEnd) {
      newEnd = clamped;
      if (newEnd - newStart < marginVal) newEnd = newStart + marginVal;
      if (limitVal < Infinity && newEnd - newStart > limitVal) {
        newEnd = newStart + limitVal;
      }
      newEnd = clamp(newEnd, minVal, maxVal);
    } else {
      newStart = clamped;
      if (newEnd - newStart < marginVal) newStart = newEnd - marginVal;
      if (limitVal < Infinity && newEnd - newStart > limitVal) {
        newStart = newEnd - limitVal;
      }
      newStart = clamp(newStart, minVal, maxVal);
    }

    if (newStart !== start || newEnd !== end) {
      const updated: [number, number] = [newStart, newEnd];
      this.value.set(updated);
      this.onChange(updated);
    }
  }
}
