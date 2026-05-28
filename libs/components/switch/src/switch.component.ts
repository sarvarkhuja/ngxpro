import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cx, NXP_SPRING_MODERATE, NXP_SPRING_FAST } from '@ngxpro/cdk';
import { ThemeService } from '@ngxpro/core';
import {
  NXP_SWITCH_OPTIONS,
  type NxpSwitchColor,
  type NxpSwitchSize,
} from './switch.options';

// ── Dimension constants per size ──

interface SizeDimensions {
  readonly trackW: number;
  readonly trackH: number;
  readonly thumb: number;
  readonly offset: number;
  readonly travel: number;
}

const SIZES: Record<NxpSwitchSize, SizeDimensions> = {
  s: { trackW: 28, trackH: 16, thumb: 12, offset: 2, travel: 12 },
  m: { trackW: 34, trackH: 20, thumb: 16, offset: 2, travel: 14 },
  l: { trackW: 44, trackH: 24, thumb: 20, offset: 2, travel: 18 },
};

const PILL_EXTEND = 2;
const PRESS_EXTEND = 4;
const PRESS_SHRINK = 4;
const DRAG_DEAD_ZONE = 2;

// ── Color maps (driven by design tokens; auto-flip in dark mode) ──

interface ColorSpec {
  /** ON state: foreground color from a design token. Hover darkens 8% via color-mix. */
  readonly token: string;
  /** OFF state: neutral track. */
  readonly off: string;
  /** Hover variants — small opacity-based shift on top of token. */
  readonly focusRing: string;
}

const COLORS: Record<NxpSwitchColor, ColorSpec> = {
  primary: {
    token: 'var(--nxp-primary)',
    off: 'var(--nxp-bg-neutral-2)',
    focusRing: 'color-mix(in srgb, var(--nxp-border-focus) 35%, transparent)',
  },
  secondary: {
    token: 'var(--nxp-text-secondary)',
    off: 'var(--nxp-bg-neutral-2)',
    focusRing: 'color-mix(in srgb, var(--nxp-text-secondary) 35%, transparent)',
  },
  danger: {
    token: 'var(--nxp-status-negative)',
    off: 'var(--nxp-bg-neutral-2)',
    focusRing:
      'color-mix(in srgb, var(--nxp-status-negative) 35%, transparent)',
  },
};

// ── Spring CSS transition strings ──

const MODERATE = `${NXP_SPRING_MODERATE.duration}ms ${NXP_SPRING_MODERATE.easing}`;
const FAST = `${NXP_SPRING_FAST.duration}ms ${NXP_SPRING_FAST.easing}`;
const THUMB_TRANSITION = `transform ${MODERATE}, width ${MODERATE}, height ${MODERATE}, top ${MODERATE}`;
const TRACK_BG_TRANSITION = `background-color ${FAST}`;

@Component({
  selector: 'nxp-switch',
  template: `
    <button
      #track
      type="button"
      role="switch"
      [attr.aria-checked]="checked()"
      [attr.aria-disabled]="disabled() || null"
      [disabled]="disabled()"
      [class]="trackClasses()"
      [style.width.px]="dims().trackW"
      [style.height.px]="dims().trackH"
      [style.backgroundColor]="trackBg()"
      [style.transition]="TRACK_BG_TRANSITION"
      [style.boxShadow]="
        focused() ? '0 0 0 3px ' + colorSpec().focusRing : 'none'
      "
      (pointerenter)="onPointerEnter($event)"
      (pointerleave)="onPointerLeave()"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp()"
      (click)="onClick($event)"
      (keydown.space)="onKeyToggle($event)"
      (keydown.enter)="onKeyToggle($event)"
      (focus)="focused.set(true)"
      (blur)="focused.set(false)"
    >
      <span
        class="absolute left-0 block rounded-full bg-bg-base shadow-lift"
        [style.width.px]="thumbWidth()"
        [style.height.px]="thumbHeight()"
        [style.top.px]="thumbY()"
        [style.transform]="'translateX(' + thumbXAnimated() + 'px)'"
        [style.transition]="thumbTransition()"
      ></span>
    </button>
    <ng-content />
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-disabled]': 'disabled() || null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxpSwitchComponent),
      multi: true,
    },
  ],
})
export class NxpSwitchComponent implements ControlValueAccessor {
  private readonly options = inject(NXP_SWITCH_OPTIONS);
  private readonly theme = inject(ThemeService);

  // ── Public inputs ──
  readonly checked = model(false);
  readonly disabledInput = input(false, { alias: 'disabled' });
  readonly size = input<NxpSwitchSize>(this.options.size);
  readonly color = input<NxpSwitchColor>(this.options.color);
  readonly class = input<string>('');

  // CVA disabled state (set programmatically by reactive forms)
  private readonly cvaDisabled = signal(false);
  readonly disabled = computed(
    () => this.disabledInput() || this.cvaDisabled(),
  );

  // ── Internal state ──
  readonly hovered = signal(false);
  readonly pressed = signal(false);
  readonly focused = signal(false);

  // Drag state (plain object to avoid unnecessary signal updates during drag)
  private dragState = {
    active: false,
    didDrag: false,
    startClientX: 0,
    originX: 0,
  };

  // Animated X position — signal so template can bind.
  // During drag we set this directly; otherwise computed from checked state.
  readonly thumbXAnimated = signal(0);

  // Whether to suppress CSS transition (during drag)
  private suppressTransition = false;

  // ── Constants exposed to template ──
  protected readonly TRACK_BG_TRANSITION = TRACK_BG_TRANSITION;

  // ── CVA callbacks ──
  private onChange: (value: boolean) => void = () => {
    /* noop */
  };
  private onTouched: () => void = () => {
    /* noop */
  };

  // ── Computed values ──

  readonly dims = computed(() => SIZES[this.size()]);
  readonly colorSpec = computed(() => COLORS[this.color()]);

  /**
   * Track background — uses the design token directly so the switch
   * automatically inherits the active palette in light/dark mode.
   * Hover darkens by 8% (light) or lightens by 8% (dark) via color-mix.
   */
  readonly trackBg = computed(() => {
    const spec = COLORS[this.color()];
    const isDark = this.theme.isDark();
    const isOn = this.checked();
    const isHover = this.hovered();

    const base = isOn ? spec.token : spec.off;
    if (!isHover) return base;
    // Hover shift: darken 8% in light mode, lighten 8% in dark mode
    const shift = isDark ? 'white' : 'black';
    return `color-mix(in srgb, ${shift} 8%, ${base})`;
  });

  readonly thumbWidth = computed(() => {
    const base = this.dims().thumb;
    if (this.pressed()) return base + PRESS_EXTEND;
    if (this.hovered()) return base + PILL_EXTEND;
    return base;
  });

  readonly thumbHeight = computed(() => {
    const base = this.dims().thumb;
    return this.pressed() ? base - PRESS_SHRINK : base;
  });

  readonly thumbY = computed(() => {
    const offset = this.dims().offset;
    return this.pressed() ? offset + PRESS_SHRINK / 2 : offset;
  });

  readonly thumbX = computed(() => {
    const d = this.dims();
    const extraWidth = this.thumbWidth() - d.thumb;
    return this.checked() ? d.offset + d.travel - extraWidth : d.offset;
  });

  readonly thumbTransition = computed(() =>
    this.suppressTransition ? 'none' : THUMB_TRANSITION,
  );

  readonly trackClasses = computed(() =>
    cx(
      'relative shrink-0 rounded-full cursor-pointer outline-none touch-none',
      this.disabled() && 'opacity-50 pointer-events-none cursor-not-allowed',
    ),
  );

  readonly hostClasses = computed(() =>
    cx(
      'inline-flex items-center gap-2.5 select-none',
      this.disabled() ? 'cursor-not-allowed' : 'cursor-pointer',
      this.class(),
    ),
  );

  // Sync thumbXAnimated from computed thumbX when not dragging
  private readonly syncThumbX = effect(() => {
    const x = this.thumbX();
    if (!this.dragState.active) {
      this.suppressTransition = false;
      this.thumbXAnimated.set(x);
    }
  });

  // ── Pointer handlers ──

  onPointerEnter(e: PointerEvent): void {
    if (e.pointerType === 'mouse') this.hovered.set(true);
  }

  onPointerLeave(): void {
    this.hovered.set(false);
  }

  onPointerDown(e: PointerEvent): void {
    if (this.disabled()) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    this.pressed.set(true);
    this.dragState = {
      active: false,
      didDrag: false,
      startClientX: e.clientX,
      originX: this.thumbXAnimated(),
    };

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault(); // Prevent text selection during drag
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.pressed()) return;

    const delta = e.clientX - this.dragState.startClientX;

    if (!this.dragState.active) {
      if (Math.abs(delta) < DRAG_DEAD_ZONE) return;
      this.dragState.active = true;
      this.suppressTransition = true;
    }

    const d = this.dims();
    const pressedThumbWidth = d.thumb + PRESS_EXTEND;
    const dragMin = d.offset;
    const dragMax = d.trackW - d.offset - pressedThumbWidth;
    const rawX = this.dragState.originX + delta;
    this.thumbXAnimated.set(Math.max(dragMin, Math.min(dragMax, rawX)));
  }

  onPointerUp(): void {
    if (!this.pressed()) return;
    this.pressed.set(false);
    this.suppressTransition = false;

    if (this.dragState.active) {
      this.dragState.didDrag = true;
      this.dragState.active = false;

      const d = this.dims();
      const pressedThumbWidth = d.thumb + PRESS_EXTEND;
      const dragMin = d.offset;
      const dragMax = d.trackW - d.offset - pressedThumbWidth;
      const midpoint = (dragMin + dragMax) / 2;

      const currentX = this.thumbXAnimated();
      const shouldBeOn = currentX > midpoint;

      if (shouldBeOn !== this.checked()) {
        this.toggle();
      } else {
        // Snap back — re-enable transition and set resting X
        const restX = this.checked() ? d.offset + d.travel : d.offset;
        this.thumbXAnimated.set(restX);
      }

      // Clear didDrag after a frame
      requestAnimationFrame(() => {
        this.dragState.didDrag = false;
      });
    }
  }

  onClick(e: Event): void {
    e.preventDefault(); // Prevent native button behavior (we handle toggle ourselves)
    if (this.disabled() || this.dragState.didDrag) return;
    this.toggle();
  }

  onKeyToggle(e: Event): void {
    e.preventDefault();
    if (this.disabled()) return;
    this.toggle();
  }

  // ── Toggle logic ──

  private toggle(): void {
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
