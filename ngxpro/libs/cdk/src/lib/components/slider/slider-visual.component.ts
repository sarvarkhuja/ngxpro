import { NgTemplateOutlet } from '@angular/common';
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
import { noop } from 'rxjs';

// ---------------------------------------------------------------------------
// Constants (matching fluidfunctionalizm)
// ---------------------------------------------------------------------------

const THUMB_SIZE = 20;
const THUMB_SIZE_REST = 16;
const TRACK_BG_HEIGHT = 18;
const DOT_SIZE = 4;
const TRACK_INSET = (THUMB_SIZE - TRACK_BG_HEIGHT) / 2;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NxpSliderValuePosition = 'left' | 'right' | 'top' | 'bottom' | 'tooltip';

/**
 * A visually styled slider component matching the fluidfunctionalizm design
 * language. Renders a custom track, fill, thumb, step dots, value display,
 * and tooltip — all driven by CSS transitions that approximate spring physics.
 *
 * Uses a hidden native `<input type="range">` for keyboard navigation and ARIA.
 *
 * @example
 * ```html
 * <nxp-slider-visual [(value)]="volume" label="Volume"
 *   valuePosition="right" [formatValue]="v => v + '%'" />
 * ```
 *
 * @example
 * With step dots:
 * ```html
 * <nxp-slider-visual [(value)]="ratio" [step]="5" [showSteps]="true" />
 * ```
 */
@Component({
  selector: 'nxp-slider-visual',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxpSliderVisualComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[class.nxp-slider-disabled]': 'disabled()',
    '[class.nxp-slider-themed]': 'themeColor()',
  },
  template: `
    <!-- Value display: top or left -->
    @if (showValue() && (valuePosition() === 'top' || valuePosition() === 'left')) {
      <ng-container *ngTemplateOutlet="valueDisplayTpl" />
    }

    <!-- Track area -->
    <div
      class="nxp-sv-track-area"
      [style.height.px]="trackAreaHeight()"
      [style.padding-top.px]="valuePosition() === 'tooltip' ? 16 : 0"
      (pointerenter)="isHovered.set(true)"
      (pointerleave)="onPointerLeave()"
      (mousemove)="onTrackAreaMouseMove($event)"
    >
      <!-- Tooltip value -->
      @if (showValue() && valuePosition() === 'tooltip' && isInteracting()) {
        <div
          class="nxp-sv-tooltip"
          [style.left]="thumbCenterLeft()"
          [class.nxp-sv-tooltip-visible]="isInteracting()"
        >
          <span class="nxp-sv-tooltip-label">
            {{ formattedValue() }}
          </span>
        </div>
      }

      <!-- Hover tooltip (on cursor position, non-tooltip mode) -->
      @if (hoverPreview() && showHoverTooltip() && !isPressed() && valuePosition() !== 'tooltip') {
        <div
          class="nxp-sv-hover-tooltip"
          [style.left.px]="hoverPreview()!.cursorX"
        >
          <span class="nxp-sv-tooltip-label">
            {{ formattedHoverValue() }}
          </span>
        </div>
      }

      <!-- Track with pointer handlers -->
      <div
        #trackEl
        class="nxp-sv-track"
        [class.nxp-sv-dragging]="isPressed()"
        [style.height.px]="THUMB_SIZE + 16"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp()"
      >
        <!-- Track background (pill with border) -->
        <div
          class="nxp-sv-track-bg"
          [style.left.px]="TRACK_INSET"
          [style.right.px]="TRACK_INSET"
          [style.top.px]="8 + (THUMB_SIZE - TRACK_BG_HEIGHT) / 2"
          [style.height.px]="TRACK_BG_HEIGHT"
        >
          <!-- Fill -->
          <div
            class="nxp-sv-fill"
            [style.width]="fillWidth()"
          ></div>

          <!-- Hover preview bar -->
          @if (hoverPreview() && !isPressed()) {
            <div
              class="nxp-sv-hover-preview"
              [style.left.px]="hoverPreview()!.left - TRACK_INSET"
              [style.width.px]="hoverPreview()!.width"
              [style.border-radius]="hoverPreview()!.cursorX > hoverPreview()!.left
                ? '0 9999px 9999px 0'
                : '9999px 0 0 9999px'"
            ></div>
          }
        </div>

        <!-- Step dots -->
        @if (showSteps() && stepDots().length > 0) {
          <div
            class="nxp-sv-dots-container"
            [style.top.px]="8 + (THUMB_SIZE - TRACK_BG_HEIGHT) / 2"
            [style.height.px]="TRACK_BG_HEIGHT"
          >
            @for (dot of stepDots(); track dot.value) {
              <div
                class="nxp-sv-dot-wrapper"
                [style.left]="'calc(' + THUMB_SIZE / 2 + 'px + ' + dot.percent + ' * (100% - ' + THUMB_SIZE + 'px))'"
              >
                <div
                  class="nxp-sv-dot"
                  [class.nxp-sv-dot-hidden]="dot.percent <= ratio()"
                  [class.nxp-sv-dot-hovered]="isHovered()"
                ></div>
              </div>
            }
          </div>
        }

        <!-- Visual thumb -->
        <div
          class="nxp-sv-thumb-outer"
          [style.left]="thumbLeft()"
          [style.top.px]="8"
        >
          <span class="nxp-sv-thumb"></span>
          @if (isFocused()) {
            <span class="nxp-sv-focus-ring"></span>
          }
        </div>
      </div>

      <!-- Hidden native input for keyboard + ARIA -->
      <input
        #nativeInput
        type="range"
        class="nxp-sv-native-input"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        [disabled]="disabled()"
        [attr.aria-label]="label()"
        [attr.aria-valuenow]="value()"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        (input)="onNativeInput()"
        (focus)="isFocused.set(true)"
        (blur)="isFocused.set(false)"
      />
    </div>

    <!-- Value display: bottom or right -->
    @if (showValue() && (valuePosition() === 'bottom' || valuePosition() === 'right')) {
      <ng-container *ngTemplateOutlet="valueDisplayTpl" />
    }

    <!-- Value display template -->
    <ng-template #valueDisplayTpl>
      <span
        class="nxp-sv-value-display"
        [class.nxp-sv-value-active]="isInteracting()"
      >
        <!-- Ghost for width stability -->
        <span class="nxp-sv-value-ghost" aria-hidden="true">
          {{ label() ? label() + ': ' : '' }}{{ formatValueFn()(max()) }}
        </span>
        <span class="nxp-sv-value-content">
          @if (label()) {
            <span class="nxp-sv-value-label">{{ label() }}: </span>
          }
          <span class="nxp-sv-value-number">{{ formattedValue() }}</span>
        </span>
      </span>
    </ng-template>
  `,
  styles: `
    :host {
      display: flex;
      width: 100%;
      overflow: visible;
      user-select: none;
      touch-action: none;
    }

    :host.nxp-slider-disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    /* Layout modes */
    :host.nxp-sv-row {
      flex-direction: row;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    :host.nxp-sv-col {
      flex-direction: column;
    }

    .nxp-sv-track-area {
      position: relative;
      flex: 1;
      overflow: visible;
    }

    /* --- Tooltip --- */
    .nxp-sv-tooltip {
      position: absolute;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 20;
      top: -16px;
      opacity: 0;
      transition: opacity 100ms ease, transform 100ms ease;
    }
    .nxp-sv-tooltip-visible {
      opacity: 1;
    }
    .nxp-sv-tooltip-label {
      font-size: 12px;
      line-height: 1;
      white-space: nowrap;
      padding: 4px 8px;
      font-variant-numeric: tabular-nums;
      background: var(--nxp-fg, rgb(17 24 39));
      color: var(--nxp-bg, white);
      border-radius: 4px;
    }

    .nxp-sv-hover-tooltip {
      position: absolute;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 20;
      top: -20px;
      animation: nxp-sv-fade-in 100ms ease forwards;
    }
    @keyframes nxp-sv-fade-in {
      from { opacity: 0; transform: translateX(-50%) translateY(4px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    :host-context(.dark) .nxp-sv-tooltip-label {
      background: var(--nxp-fg, rgb(243 244 246));
      color: var(--nxp-bg, rgb(17 24 39));
    }

    /* --- Track --- */
    .nxp-sv-track {
      position: relative;
      width: 100%;
      cursor: ew-resize;
      padding: 8px 0;
    }

    .nxp-sv-track-bg {
      position: absolute;
      border: 1px solid var(--nxp-border, rgb(229 231 235));
      overflow: hidden;
      border-radius: 9999px;
      background: transparent;
    }
    :host-context(.dark) .nxp-sv-track-bg {
      border-color: var(--nxp-border, rgb(55 65 81));
    }

    /* --- Fill --- */
    .nxp-sv-fill {
      position: absolute;
      left: 0;
      height: 100%;
      background: color-mix(in srgb, var(--nxp-fg, rgb(17 24 39)) 12%, transparent);
      transition: width 160ms cubic-bezier(0.22, 1.2, 0.36, 1);
    }
    :host-context(.dark) .nxp-sv-fill {
      background: color-mix(in srgb, var(--nxp-fg, rgb(243 244 246)) 12%, transparent);
    }
    .nxp-sv-dragging .nxp-sv-fill {
      transition: none;
    }

    /* --- Hover preview --- */
    .nxp-sv-hover-preview {
      position: absolute;
      height: 100%;
      pointer-events: none;
      z-index: 2;
      background: color-mix(in srgb, var(--nxp-fg, rgb(17 24 39)) 4%, transparent);
      opacity: 1;
      transition: opacity 150ms linear;
    }
    :host-context(.dark) .nxp-sv-hover-preview {
      background: color-mix(in srgb, var(--nxp-fg, rgb(243 244 246)) 4%, transparent);
    }

    /* --- Step dots --- */
    .nxp-sv-dots-container {
      position: absolute;
      left: 0;
      right: 0;
      pointer-events: none;
    }
    .nxp-sv-dot-wrapper {
      position: absolute;
      top: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 0;
      height: 0;
    }
    .nxp-sv-dot {
      width: ${DOT_SIZE}px;
      height: ${DOT_SIZE}px;
      border-radius: 9999px;
      flex-shrink: 0;
      background: var(--nxp-muted-fg, rgb(156 163 175));
      opacity: 0.3;
      transition: width 160ms cubic-bezier(0.22, 1.2, 0.36, 1),
                  height 160ms cubic-bezier(0.22, 1.2, 0.36, 1),
                  opacity 80ms linear;
    }
    .nxp-sv-dot-hovered {
      width: ${DOT_SIZE * 1.25}px;
      height: ${DOT_SIZE * 1.25}px;
    }
    .nxp-sv-dot-hidden {
      opacity: 0;
    }

    /* --- Thumb --- */
    .nxp-sv-thumb-outer {
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
    .nxp-sv-dragging .nxp-sv-thumb-outer {
      transition: none;
    }
    .nxp-sv-thumb {
      display: block;
      width: ${THUMB_SIZE_REST}px;
      height: ${THUMB_SIZE_REST}px;
      border-radius: 9999px;
      background: white;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    .nxp-sv-focus-ring {
      position: absolute;
      width: ${THUMB_SIZE + 4}px;
      height: ${THUMB_SIZE + 4}px;
      border-radius: 9999px;
      border: 1px solid #6B97FF;
      pointer-events: none;
    }

    /* --- Native input (hidden but focusable) --- */
    .nxp-sv-native-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
      height: ${THUMB_SIZE}px;
    }

    /* --- Theme color mode --- */
    :host.nxp-slider-themed .nxp-sv-fill {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 25%, transparent);
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sv-fill,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sv-fill {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 30%, transparent);
    }
    :host.nxp-slider-themed .nxp-sv-thumb {
      background: var(--nxp-primary, #3b82f6);
      box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);
    }
    :host.nxp-slider-themed .nxp-sv-focus-ring {
      border-color: var(--nxp-primary, #3b82f6);
    }
    :host.nxp-slider-themed .nxp-sv-track-bg {
      border-color: color-mix(in srgb, var(--nxp-primary, #3b82f6) 30%, var(--nxp-border, rgb(229 231 235)));
    }
    :host.nxp-slider-themed .nxp-sv-hover-preview {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 8%, transparent);
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sv-hover-preview,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sv-hover-preview {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 10%, transparent);
    }
    :host.nxp-slider-themed .nxp-sv-tooltip-label {
      background: var(--nxp-primary, #3b82f6);
      color: var(--nxp-text-on-accent, white);
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sv-tooltip-label,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sv-tooltip-label {
      background: var(--nxp-primary, #3b82f6);
      color: var(--nxp-text-on-accent, white);
    }
    :host.nxp-slider-themed .nxp-sv-dot {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 40%, var(--nxp-muted-fg, rgb(156 163 175)));
    }

    /* --- Value display --- */
    .nxp-sv-value-display {
      display: inline-grid;
      flex-shrink: 0;
      font-size: 13px;
      line-height: 1;
      color: var(--nxp-muted-fg, rgb(107 114 128));
      font-variant-numeric: tabular-nums;
    }
    :host-context(.dark) .nxp-sv-value-display {
      color: var(--nxp-muted-fg, rgb(156 163 175));
    }
    .nxp-sv-value-ghost {
      grid-column: 1;
      grid-row: 1;
      visibility: hidden;
      white-space: nowrap;
    }
    .nxp-sv-value-content {
      grid-column: 1;
      grid-row: 1;
      white-space: nowrap;
    }
    .nxp-sv-value-label {
      color: var(--nxp-muted-fg, rgb(107 114 128));
    }
    :host-context(.dark) .nxp-sv-value-label {
      color: var(--nxp-muted-fg, rgb(156 163 175));
    }
  `,
})
export class NxpSliderVisualComponent implements ControlValueAccessor {
  // ---------------------------------------------------------------------------
  // Constants (exposed for template)
  // ---------------------------------------------------------------------------

  protected readonly THUMB_SIZE = THUMB_SIZE;
  protected readonly TRACK_BG_HEIGHT = TRACK_BG_HEIGHT;
  protected readonly TRACK_INSET = TRACK_INSET;

  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------

  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly showSteps = input(false);
  readonly showValue = input(true);
  readonly valuePosition = input<NxpSliderValuePosition>('left');
  readonly formatValueFn = input<(v: number) => string>((v: number) => String(v), { alias: 'formatValue' });
  readonly label = input<string | undefined>(undefined);
  readonly disabled = input(false);
  /** When true, use the theme primary color (`--nxp-primary`) instead of neutral gray. */
  readonly themeColor = input(false);

  // ---------------------------------------------------------------------------
  // Model
  // ---------------------------------------------------------------------------

  readonly value = model(0);

  // ---------------------------------------------------------------------------
  // View children
  // ---------------------------------------------------------------------------

  private readonly trackElRef = viewChild<ElementRef<HTMLDivElement>>('trackEl');
  private readonly nativeInputRef = viewChild<ElementRef<HTMLInputElement>>('nativeInput');

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  readonly isHovered = signal(false);
  readonly isPressed = signal(false);
  readonly isFocused = signal(false);
  readonly hoverPreview = signal<{
    left: number;
    width: number;
    snappedValue: number;
    cursorX: number;
  } | null>(null);
  readonly showHoverTooltip = signal(false);

  private hoverDelayTimer: ReturnType<typeof setTimeout> | null = null;

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  readonly ratio = computed(() => {
    const range = this.max() - this.min();
    if (range === 0) return 0;
    return Math.max(0, Math.min(1, (this.value() - this.min()) / range));
  });

  readonly formattedValue = computed(() => this.formatValueFn()(this.value()));

  readonly formattedHoverValue = computed(() => {
    const preview = this.hoverPreview();
    if (!preview) return '';
    return this.formatValueFn()(preview.snappedValue);
  });

  readonly isInteracting = computed(() => this.isHovered() || this.isPressed());

  readonly hostClasses = computed(() => {
    const pos = this.valuePosition();
    if (pos === 'left' || pos === 'right') {
      return 'nxp-sv-row';
    }
    return 'nxp-sv-col';
  });

  readonly trackAreaHeight = computed(() => {
    const pos = this.valuePosition();
    if (pos === 'left' || pos === 'right') {
      return THUMB_SIZE + 16;
    }
    return THUMB_SIZE + (pos === 'tooltip' ? 16 : 0);
  });

  readonly fillWidth = computed(() => {
    const r = this.ratio();
    // Fill from left edge of track to thumb center
    // thumbCenterX relative to track-bg = r * (trackBgWidth - THUMB_SIZE) + THUMB_SIZE/2
    // As percentage of track-bg: we approximate with ratio
    return `calc(${r * 100}% + ${THUMB_SIZE / 2 - r * THUMB_SIZE}px)`;
  });

  readonly thumbLeft = computed(() => {
    const r = this.ratio();
    // Thumb left edge: r * (trackWidth - THUMB_SIZE)
    return `calc(${r * 100}% - ${r * THUMB_SIZE}px)`;
  });

  readonly thumbCenterLeft = computed(() => {
    const r = this.ratio();
    return `calc(${r * 100}% + ${THUMB_SIZE / 2 - r * THUMB_SIZE}px)`;
  });

  readonly stepDots = computed(() => {
    if (!this.showSteps()) return [];
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

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  constructor() {
    // Sync hover tooltip delay
    effect(() => {
      const hovered = this.isHovered();
      if (hovered) {
        this.hoverDelayTimer = setTimeout(() => this.showHoverTooltip.set(true), 100);
      } else {
        if (this.hoverDelayTimer) clearTimeout(this.hoverDelayTimer);
        this.showHoverTooltip.set(false);
      }
    });

    // Sync native input value when value changes (e.g. from form control)
    effect(() => {
      const v = this.value();
      const input = this.nativeInputRef()?.nativeElement;
      if (input) {
        input.value = String(v);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // ControlValueAccessor
  // ---------------------------------------------------------------------------

  private _onChange: (value: number) => void = noop;
  private _onTouched: () => void = noop;

  writeValue(v: number | null): void {
    this.value.set(v ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // disabled is an input, but forms may call this
  }

  // ---------------------------------------------------------------------------
  // Pointer handlers
  // ---------------------------------------------------------------------------

  protected onPointerDown(event: PointerEvent): void {
    if (this.disabled()) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();

    this.isPressed.set(true);
    const trackEl = this.trackElRef()?.nativeElement;
    if (!trackEl) return;

    const trackRect = trackEl.getBoundingClientRect();
    this.updateValueFromPointer(event.clientX, trackRect);
    trackEl.setPointerCapture(event.pointerId);

    // Focus native input for keyboard access
    this.nativeInputRef()?.nativeElement.focus();
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.isPressed()) return;
    event.stopPropagation();
    const trackEl = this.trackElRef()?.nativeElement;
    if (!trackEl) return;

    const trackRect = trackEl.getBoundingClientRect();
    this.updateValueFromPointer(event.clientX, trackRect);
  }

  protected onPointerUp(): void {
    if (!this.isPressed()) return;
    this.isPressed.set(false);
    this.hoverPreview.set(null);
    this._onTouched();
  }

  protected onPointerLeave(): void {
    this.isHovered.set(false);
    this.hoverPreview.set(null);
  }

  protected onTrackAreaMouseMove(event: MouseEvent): void {
    if (this.isPressed()) return;
    const trackEl = this.trackElRef()?.nativeElement;
    if (!trackEl) return;
    const trackRect = trackEl.getBoundingClientRect();
    const x = event.clientX - trackRect.left;
    const clamped = Math.max(0, Math.min(trackRect.width, x));
    this.computeHoverPreview(clamped, trackRect.width);
  }

  // ---------------------------------------------------------------------------
  // Native input handler (keyboard)
  // ---------------------------------------------------------------------------

  protected onNativeInput(): void {
    const input = this.nativeInputRef()?.nativeElement;
    if (!input) return;
    const v = Number(input.value);
    this.value.set(v);
    this._onChange(v);
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private updateValueFromPointer(clientX: number, trackRect: DOMRect): void {
    const localX = clientX - trackRect.left - THUMB_SIZE / 2;
    const usable = trackRect.width - THUMB_SIZE;
    if (usable <= 0) return;
    const clamped = Math.max(0, Math.min(usable, localX));
    const raw = (clamped / usable) * (this.max() - this.min()) + this.min();
    const s = this.step();
    const snapped = Math.round((raw - this.min()) / s) * s + this.min();
    const v = Math.max(this.min(), Math.min(this.max(), snapped));
    this.value.set(v);
    this._onChange(v);
  }

  private computeHoverPreview(cursorX: number, trackWidth: number): void {
    const mn = this.min();
    const mx = this.max();
    const s = this.step();

    // Snap to step grid
    const usable = trackWidth - THUMB_SIZE;
    const rawPx = cursorX - THUMB_SIZE / 2;
    const clampedPx = Math.max(0, Math.min(usable, rawPx));
    const rawVal = usable > 0 ? (clampedPx / usable) * (mx - mn) + mn : mn;
    const snappedVal = Math.max(mn, Math.min(mx, Math.round((rawVal - mn) / s) * s + mn));
    const snappedPercent = mx === mn ? 0 : (snappedVal - mn) / (mx - mn);
    const snappedX = THUMB_SIZE / 2 + snappedPercent * usable;

    // Current thumb center
    const r = this.ratio();
    const thumbCenterX = THUMB_SIZE / 2 + r * usable;

    // Extend to track edges at extremes
    const edgeX = snappedVal === mn ? 0 : snappedVal === mx ? trackWidth : snappedX;
    const left = Math.min(thumbCenterX, edgeX);
    const width = Math.abs(edgeX - thumbCenterX);

    this.hoverPreview.set({ left, width, snappedValue: snappedVal, cursorX: snappedX });
  }
}
