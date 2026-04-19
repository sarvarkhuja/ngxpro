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
// Constants
// ---------------------------------------------------------------------------

const PIP_SIZE = 5;

export type NxpSliderComfortableVariant = 'pips' | 'scrubber';

/**
 * A "comfortable" slider rendered as a bordered container with either
 * discrete pip dots or a continuous scrubber bar. Matches the
 * `SliderComfortable` design from fluidfunctionalizm.
 *
 * @example
 * Pips variant (discrete steps):
 * ```html
 * <nxp-slider-comfortable variant="pips" label="Quality"
 *   [(value)]="quality" [min]="0" [max]="4"
 *   [formatValue]="qualityLabels" />
 * ```
 *
 * @example
 * Scrubber variant (continuous):
 * ```html
 * <nxp-slider-comfortable variant="scrubber" label="Volume"
 *   [(value)]="volume" [min]="0" [max]="100"
 *   [formatValue]="v => v + '%'" />
 * ```
 */
@Component({
  selector: 'nxp-slider-comfortable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxpSliderComfortableComponent),
      multi: true,
    },
  ],
  host: {
    class: 'nxp-sc-host',
    '[class.nxp-slider-themed]': 'themeColor()',
    '(pointerenter)': 'onPointerEnter()',
    '(pointerleave)': 'onPointerLeave()',
    '(mousemove)': 'onMouseMove($event)',
  },
  template: `
    <!-- Extended hit area -->
    <div
      class="nxp-sc-hit-area"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp()"
    ></div>

    <!-- Hover tooltip -->
    @if (hoverPreview() && showHoverTooltip() && !isPressed()) {
      <div
        class="nxp-sc-hover-tooltip"
        [style.left.px]="hoverPreview()!.cursorX"
      >
        <span class="nxp-sc-tooltip-label">
          {{ formattedHoverValue() }}
        </span>
      </div>
    }

    <!-- Main container -->
    <div
      #containerEl
      class="nxp-sc-container"
      [class.nxp-sc-scrubber]="variant() === 'scrubber'"
      [class.nxp-sc-focused]="isFocused()"
      [class.nxp-sc-disabled]="disabled()"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp()"
    >
      <!-- Hidden native input for keyboard + ARIA -->
      <input
        #nativeInput
        type="range"
        class="nxp-sc-native-input"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        [disabled]="disabled()"
        [attr.aria-label]="label()"
        (input)="onNativeInput()"
        (focus)="isFocused.set(true)"
        (blur)="isFocused.set(false)"
      />

      <!-- Hover preview -->
      @if (hoverPreview() && !isPressed()) {
        <div
          class="nxp-sc-hover-preview"
          [style.left.px]="hoverPreview()!.left"
          [style.width.px]="hoverPreview()!.width"
        ></div>
      }

      <!-- === PIPS VARIANT === -->
      @if (variant() === 'pips') {
        <!-- Dots layer (z-1) — masked to hide behind fill -->
        <div class="nxp-sc-pips-dots">
          @for (pipValue of pipSteps(); track pipValue) {
            <div class="nxp-sc-pip-dot-wrapper">
              <div
                class="nxp-sc-pip-dot"
                [class.nxp-sc-pip-dot-active]="pipValue === value()"
                [class.nxp-sc-pip-dot-filled]="pipValue <= value()"
              ></div>
            </div>
          }
        </div>

        <!-- Label/value BG occluder (z-2) -->
        <div class="nxp-sc-pips-label-bg" aria-hidden="true">
          @if (label()) {
            <span class="nxp-sc-pips-bg-text">{{ label() }}</span>
          }
          <span
            class="nxp-sc-pips-bg-text nxp-sc-pips-bg-value"
            [style.min-width]="maxValueWidth()"
          >
            {{ formattedValue() }}
          </span>
        </div>

        <!-- Fill (z-3) -->
        <div
          class="nxp-sc-pips-fill"
          [style.width]="pipsFillWidth()"
        ></div>

        <!-- Handle line (z-3) -->
        <div
          class="nxp-sc-handle-line"
          [class.nxp-sc-handle-active]="isActive()"
          [class.nxp-sc-handle-focused]="isFocused()"
          [class.nxp-sc-handle-hovered]="isHovered()"
          [style.left]="pipsHandleLineLeft()"
        ></div>

        <!-- Label + value text layer (z-4) -->
        <div class="nxp-sc-pips-text">
          @if (label()) {
            <span
              class="nxp-sc-pips-label"
              [class.nxp-sc-text-active]="isActive()"
            >
              {{ label() }}
            </span>
          }
          <span
            class="nxp-sc-pips-value"
            [class.nxp-sc-text-active]="isActive()"
            [style.min-width]="maxValueWidth()"
          >
            {{ formattedValue() }}
          </span>
        </div>
      }

      <!-- === SCRUBBER VARIANT === -->
      @if (variant() === 'scrubber') {
        <!-- Fill -->
        <div
          class="nxp-sc-scrubber-fill"
          [style.width]="fillPercentStyle()"
        ></div>

        <!-- Handle line -->
        <div
          class="nxp-sc-handle-line nxp-sc-handle-line-scrubber"
          [class.nxp-sc-handle-active]="isActive()"
          [class.nxp-sc-handle-focused]="isFocused()"
          [class.nxp-sc-handle-hovered]="isHovered()"
          [style.left]="scrubberHandleLineLeft()"
        ></div>

        <!-- Label -->
        @if (label()) {
          <span
            class="nxp-sc-scrubber-label"
            [class.nxp-sc-text-active]="isActive()"
          >
            {{ label() }}
          </span>
        }

        <!-- Spacer -->
        <span class="nxp-sc-scrubber-spacer"></span>

        <!-- Value -->
        <span
          class="nxp-sc-scrubber-value"
          [class.nxp-sc-text-active]="isActive()"
          [style.min-width]="maxValueWidth()"
        >
          {{ formattedValue() }}
        </span>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      width: 100%;
      touch-action: none;
    }

    /* --- Hit area (extends 8px beyond edges) --- */
    .nxp-sc-hit-area {
      position: absolute;
      left: -8px;
      right: -8px;
      top: 0;
      bottom: 0;
      cursor: ew-resize;
    }

    /* --- Hover tooltip --- */
    .nxp-sc-hover-tooltip {
      position: absolute;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 20;
      top: -30px;
      animation: nxp-sc-fade-in 100ms ease forwards;
    }
    @keyframes nxp-sc-fade-in {
      from { opacity: 0; transform: translateX(-50%) translateY(4px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    .nxp-sc-tooltip-label {
      font-size: 12px;
      line-height: 1;
      white-space: nowrap;
      padding: 4px 8px;
      font-variant-numeric: tabular-nums;
      background: var(--nxp-fg, rgb(17 24 39));
      color: var(--nxp-bg, white);
      border-radius: 4px;
    }
    :host-context(.dark) .nxp-sc-tooltip-label {
      background: var(--nxp-fg, rgb(243 244 246));
      color: var(--nxp-bg, rgb(17 24 39));
    }

    /* --- Hover preview --- */
    .nxp-sc-hover-preview {
      position: absolute;
      top: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 3;
      background: color-mix(in srgb, var(--nxp-fg, rgb(17 24 39)) 8%, transparent);
      transition: opacity 150ms linear;
    }
    :host-context(.dark) .nxp-sc-hover-preview {
      background: color-mix(in srgb, var(--nxp-fg, rgb(243 244 246)) 8%, transparent);
    }

    /* --- Container --- */
    .nxp-sc-container {
      position: relative;
      width: 100%;
      height: 32px;
      user-select: none;
      touch-action: none;
      border: 1px solid var(--nxp-border, rgb(229 231 235));
      overflow: hidden;
      border-radius: 8px;
      cursor: ew-resize;
      outline: 1px solid transparent;
      outline-offset: 2px;
      transition: outline-color 80ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    :host-context(.dark) .nxp-sc-container {
      border-color: var(--nxp-border, rgb(55 65 81));
    }
    .nxp-sc-container.nxp-sc-scrubber {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 16px;
    }
    .nxp-sc-container.nxp-sc-focused {
      outline-color: #6B97FF;
    }
    .nxp-sc-container.nxp-sc-disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    /* --- Native input --- */
    .nxp-sc-native-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
    }
    .nxp-sc-native-input * {
      pointer-events: none;
    }

    /* --- Handle line (shared) --- */
    .nxp-sc-handle-line {
      position: absolute;
      width: 2px;
      border-radius: 9999px;
      pointer-events: none;
      z-index: 3;
      top: 8px;
      bottom: 8px;
      background: color-mix(in srgb, var(--nxp-fg, rgb(17 24 39)) 25%, transparent);
      transition: top 80ms cubic-bezier(0.22, 1, 0.36, 1),
                  bottom 80ms cubic-bezier(0.22, 1, 0.36, 1),
                  background-color 80ms cubic-bezier(0.22, 1, 0.36, 1),
                  left 80ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    :host-context(.dark) .nxp-sc-handle-line {
      background: color-mix(in srgb, var(--nxp-fg, rgb(243 244 246)) 25%, transparent);
    }
    .nxp-sc-handle-active {
      top: 7px;
      bottom: 7px;
    }
    .nxp-sc-handle-hovered {
      background: color-mix(in srgb, var(--nxp-fg, rgb(17 24 39)) 50%, transparent);
    }
    :host-context(.dark) .nxp-sc-handle-hovered {
      background: color-mix(in srgb, var(--nxp-fg, rgb(243 244 246)) 50%, transparent);
    }
    .nxp-sc-handle-focused {
      background: var(--nxp-fg, rgb(17 24 39)) !important;
    }
    :host-context(.dark) .nxp-sc-handle-focused {
      background: var(--nxp-fg, rgb(243 244 246)) !important;
    }
    .nxp-sc-handle-line-scrubber {
      z-index: 10;
    }

    /* --- PIPS: dots --- */
    .nxp-sc-pips-dots {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      pointer-events: none;
      z-index: 1;
    }
    .nxp-sc-pip-dot-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${PIP_SIZE}px;
      height: ${PIP_SIZE}px;
    }
    .nxp-sc-pip-dot {
      width: ${PIP_SIZE}px;
      height: ${PIP_SIZE}px;
      border-radius: 9999px;
      background: var(--nxp-muted-fg, rgb(156 163 175));
      opacity: 0.3;
      transition: background-color 80ms ease, opacity 80ms ease;
    }
    .nxp-sc-pip-dot-active {
      background: var(--nxp-fg, rgb(17 24 39));
      opacity: 1;
    }
    :host-context(.dark) .nxp-sc-pip-dot-active {
      background: var(--nxp-fg, rgb(243 244 246));
    }
    .nxp-sc-pip-dot-filled {
      opacity: 0;
    }

    /* --- PIPS: label bg occluder --- */
    .nxp-sc-pips-label-bg {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      padding: 0 8px;
      z-index: 2;
      pointer-events: none;
    }
    .nxp-sc-pips-bg-text {
      font-size: 13px;
      padding: 0 8px;
      background: var(--nxp-bg, white);
      color: transparent;
      user-select: none;
    }
    :host-context(.dark) .nxp-sc-pips-bg-text {
      background: var(--nxp-bg, rgb(17 24 39));
    }
    .nxp-sc-pips-bg-value {
      margin-left: auto;
      font-variant-numeric: tabular-nums;
    }

    /* --- PIPS: fill --- */
    .nxp-sc-pips-fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 3;
      background: color-mix(in srgb, var(--nxp-fg, rgb(17 24 39)) 8%, transparent);
      transition: width 80ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    :host-context(.dark) .nxp-sc-pips-fill {
      background: color-mix(in srgb, var(--nxp-fg, rgb(243 244 246)) 8%, transparent);
    }

    /* --- PIPS: text layer --- */
    .nxp-sc-pips-text {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      padding: 0 8px;
      z-index: 4;
      pointer-events: none;
    }
    .nxp-sc-pips-label {
      font-size: 13px;
      padding: 0 8px;
      color: var(--nxp-muted-fg, rgb(107 114 128));
      transition: color 80ms ease;
    }
    :host-context(.dark) .nxp-sc-pips-label {
      color: var(--nxp-muted-fg, rgb(156 163 175));
    }
    .nxp-sc-pips-value {
      font-size: 13px;
      font-variant-numeric: tabular-nums;
      margin-left: auto;
      padding: 0 8px;
      text-align: right;
      color: var(--nxp-muted-fg, rgb(107 114 128));
      transition: color 80ms ease;
    }
    :host-context(.dark) .nxp-sc-pips-value {
      color: var(--nxp-muted-fg, rgb(156 163 175));
    }

    /* --- SCRUBBER: fill --- */
    .nxp-sc-scrubber-fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      background: color-mix(in srgb, var(--nxp-fg, rgb(17 24 39)) 8%, transparent);
      transition: width 80ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    :host-context(.dark) .nxp-sc-scrubber-fill {
      background: color-mix(in srgb, var(--nxp-fg, rgb(243 244 246)) 8%, transparent);
    }

    /* --- SCRUBBER: label + value --- */
    .nxp-sc-scrubber-label {
      font-size: 13px;
      flex-shrink: 0;
      z-index: 10;
      color: var(--nxp-muted-fg, rgb(107 114 128));
      transition: color 80ms ease;
    }
    :host-context(.dark) .nxp-sc-scrubber-label {
      color: var(--nxp-muted-fg, rgb(156 163 175));
    }
    .nxp-sc-scrubber-spacer {
      flex: 1;
    }
    .nxp-sc-scrubber-value {
      font-size: 13px;
      flex-shrink: 0;
      font-variant-numeric: tabular-nums;
      text-align: right;
      z-index: 10;
      color: var(--nxp-muted-fg, rgb(107 114 128));
      transition: color 80ms ease;
    }
    :host-context(.dark) .nxp-sc-scrubber-value {
      color: var(--nxp-muted-fg, rgb(156 163 175));
    }

    /* --- Active text color --- */
    .nxp-sc-text-active {
      color: var(--nxp-fg, rgb(17 24 39)) !important;
    }
    :host-context(.dark) .nxp-sc-text-active {
      color: var(--nxp-fg, rgb(243 244 246)) !important;
    }

    /* --- Theme color mode --- */
    :host.nxp-slider-themed .nxp-sc-pips-fill {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 15%, transparent);
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sc-pips-fill,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sc-pips-fill {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 20%, transparent);
    }
    :host.nxp-slider-themed .nxp-sc-scrubber-fill {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 15%, transparent);
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sc-scrubber-fill,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sc-scrubber-fill {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 20%, transparent);
    }
    :host.nxp-slider-themed .nxp-sc-handle-line {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 40%, transparent);
    }
    :host.nxp-slider-themed .nxp-sc-handle-hovered {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 60%, transparent);
    }
    :host.nxp-slider-themed .nxp-sc-handle-focused {
      background: var(--nxp-primary, #3b82f6) !important;
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sc-handle-line,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sc-handle-line {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 40%, transparent);
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sc-handle-hovered,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sc-handle-hovered {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 60%, transparent);
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sc-handle-focused,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sc-handle-focused {
      background: var(--nxp-primary, #3b82f6) !important;
    }
    :host.nxp-slider-themed .nxp-sc-pip-dot-active {
      background: var(--nxp-primary, #3b82f6);
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sc-pip-dot-active,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sc-pip-dot-active {
      background: var(--nxp-primary, #3b82f6);
    }
    :host.nxp-slider-themed .nxp-sc-container {
      border-color: color-mix(in srgb, var(--nxp-primary, #3b82f6) 30%, var(--nxp-border, rgb(229 231 235)));
    }
    :host.nxp-slider-themed .nxp-sc-container.nxp-sc-focused {
      outline-color: var(--nxp-primary, #3b82f6);
    }
    :host.nxp-slider-themed .nxp-sc-hover-preview {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 10%, transparent);
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sc-hover-preview,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sc-hover-preview {
      background: color-mix(in srgb, var(--nxp-primary, #3b82f6) 12%, transparent);
    }
    :host.nxp-slider-themed .nxp-sc-tooltip-label {
      background: var(--nxp-primary, #3b82f6);
      color: var(--nxp-text-on-accent, white);
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sc-tooltip-label,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sc-tooltip-label {
      background: var(--nxp-primary, #3b82f6);
      color: var(--nxp-text-on-accent, white);
    }
    :host.nxp-slider-themed .nxp-sc-text-active {
      color: var(--nxp-primary, #3b82f6) !important;
    }
    :host-context(.dark):host.nxp-slider-themed .nxp-sc-text-active,
    :host.nxp-slider-themed:host-context(.dark) .nxp-sc-text-active {
      color: var(--nxp-primary, #3b82f6) !important;
    }
  `,
})
export class NxpSliderComfortableComponent implements ControlValueAccessor {
  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------

  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly variant = input<NxpSliderComfortableVariant>('pips');
  readonly label = input<string | undefined>(undefined);
  readonly formatValueFn = input<(v: number) => string>((v: number) => String(v), { alias: 'formatValue' });
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

  private readonly containerElRef = viewChild<ElementRef<HTMLDivElement>>('containerEl');
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
  private dragging = false;

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  readonly isActive = computed(() => this.isHovered() || this.isFocused());

  readonly fillPercent = computed(() => {
    const range = this.max() - this.min();
    if (range === 0) return 0;
    return Math.max(0, Math.min(1, (this.value() - this.min()) / range));
  });

  readonly fillPercentStyle = computed(() => `${this.fillPercent() * 100}%`);

  readonly formattedValue = computed(() => this.formatValueFn()(this.value()));

  readonly formattedHoverValue = computed(() => {
    const preview = this.hoverPreview();
    if (!preview) return '';
    return this.formatValueFn()(preview.snappedValue);
  });

  readonly maxValueWidth = computed(() => {
    const formatted = this.formatValueFn()(this.max());
    return `${formatted.length}ch`;
  });

  readonly pipSteps = computed(() => {
    const mn = this.min();
    const mx = this.max();
    const s = this.step();
    const count = Math.round((mx - mn) / s) + 1;
    return Array.from({ length: count }, (_, i) => mn + i * s);
  });

  /**
   * Fill width for pips variant. Accounts for the internal padding (12px)
   * so the fill edge aligns with the active pip center.
   */
  readonly pipsFillWidth = computed(() => {
    const p = this.fillPercent();
    // Mirror fluidfunctionalizm: width = p * 100% + (20 - 20p)px
    // This adjusts for the px-3 (12px) padding in the dots container
    const offset = 20 - 20 * p;
    return `calc(${p * 100}% + ${offset}px)`;
  });

  /**
   * Handle line position for pips variant.
   */
  readonly pipsHandleLineLeft = computed(() => {
    const p = this.fillPercent();
    // Mirror fluidfunctionalizm: left = p * 100% + (11 - 24p)px
    const offset = 11 - 24 * p;
    return `calc(${p * 100}% + ${offset}px)`;
  });

  /**
   * Handle line position for scrubber variant.
   */
  readonly scrubberHandleLineLeft = computed(() => {
    const p = this.fillPercent();
    return `calc(${p * 100}% - 9px)`;
  });

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  constructor() {
    effect(() => {
      const hovered = this.isHovered();
      if (hovered) {
        this.hoverDelayTimer = setTimeout(() => this.showHoverTooltip.set(true), 100);
      } else {
        if (this.hoverDelayTimer) clearTimeout(this.hoverDelayTimer);
        this.showHoverTooltip.set(false);
      }
    });

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
    // disabled is an input
  }

  // ---------------------------------------------------------------------------
  // Pointer handlers
  // ---------------------------------------------------------------------------

  protected onPointerEnter(): void {
    if (!this.disabled()) this.isHovered.set(true);
  }

  protected onPointerLeave(): void {
    if (!this.disabled()) {
      this.isHovered.set(false);
      this.hoverPreview.set(null);
    }
  }

  protected onMouseMove(event: MouseEvent): void {
    if (this.disabled() || this.dragging) return;
    this.computeHoverPreview(event.clientX);
  }

  protected onPointerDown(event: PointerEvent): void {
    if (this.disabled()) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();

    this.dragging = true;
    this.isPressed.set(true);

    const newVal = this.getValueFromX(event.clientX);
    this.value.set(newVal);
    this._onChange(newVal);

    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

    // Focus native input
    this.nativeInputRef()?.nativeElement.focus();
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging) return;

    const newVal = this.getValueFromX(event.clientX);
    this.value.set(newVal);
    this._onChange(newVal);
  }

  protected onPointerUp(): void {
    this.dragging = false;
    this.isPressed.set(false);
    this.hoverPreview.set(null);
    this._onTouched();
  }

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

  private getValueFromX(clientX: number): number {
    const el = this.containerElRef()?.nativeElement;
    if (!el) return this.min();

    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));

    const mn = this.min();
    const mx = this.max();
    const s = this.step();

    if (this.variant() === 'pips') {
      const pipCount = this.pipSteps().length;
      if (pipCount <= 1) return mn;
      const index = Math.max(0, Math.min(pipCount - 1, Math.round((clamped / rect.width) * (pipCount - 1))));
      return this.pipSteps()[index];
    } else {
      const raw = mn + (clamped / rect.width) * (mx - mn);
      const snapped = Math.round((raw - mn) / s) * s + mn;
      return Math.max(mn, Math.min(mx, snapped));
    }
  }

  private computeHoverPreview(clientX: number): void {
    const el = this.containerElRef()?.nativeElement;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const w = el.clientWidth;
    const borderLeft = rect.width - w > 0 ? (rect.width - w) / 2 : 0;
    const x = clientX - rect.left - borderLeft;
    const clamped = Math.max(0, Math.min(w, x));

    const mn = this.min();
    const mx = this.max();
    const s = this.step();

    let snappedVal: number;
    if (this.variant() === 'pips') {
      const pipCount = this.pipSteps().length;
      if (pipCount <= 1) return;
      const index = Math.max(0, Math.min(pipCount - 1, Math.round((clamped / w) * (pipCount - 1))));
      snappedVal = this.pipSteps()[index];
    } else {
      const raw = mn + (clamped / w) * (mx - mn);
      snappedVal = Math.max(mn, Math.min(mx, Math.round((raw - mn) / s) * s + mn));
    }

    const snappedPercent = mx === mn ? 0 : (snappedVal - mn) / (mx - mn);
    const snappedX = snappedPercent * w;

    // Current handle position
    const currentPercent = this.fillPercent();
    let handleX: number;
    if (this.variant() === 'pips') {
      handleX = currentPercent * w + (20 - 20 * currentPercent);
    } else {
      handleX = currentPercent * w;
    }

    const edgeX = snappedVal === mn ? 0 : snappedVal === mx ? w : snappedX;
    const left = Math.min(handleX, edgeX);
    const width = Math.abs(edgeX - handleX);

    this.hoverPreview.set({ left, width, snappedValue: snappedVal, cursorX: snappedX });
  }
}
