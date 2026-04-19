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
import { cx, NXP_SPRING_MODERATE, NXP_SPRING_FAST } from '@nxp/cdk';
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

// ── Color maps ──

interface ColorSpec {
  readonly on: string;
  readonly onHover: string;
  readonly off: string;
  readonly offHover: string;
  readonly focusRing: string;
  // Dark mode
  readonly darkOn: string;
  readonly darkOnHover: string;
  readonly darkOff: string;
  readonly darkOffHover: string;
}

const COLORS: Record<NxpSwitchColor, ColorSpec> = {
  primary: {
    on: 'rgb(37, 99, 235)',
    onHover: 'rgb(29, 78, 216)',
    off: 'rgb(209, 213, 219)',
    offHover: 'rgb(186, 191, 199)',
    focusRing: 'rgba(59, 130, 246, 0.45)',
    darkOn: 'rgb(96, 165, 250)',
    darkOnHover: 'rgb(110, 175, 255)',
    darkOff: 'rgb(75, 85, 99)',
    darkOffHover: 'rgb(90, 100, 114)',
  },
  secondary: {
    on: 'rgb(75, 85, 99)',
    onHover: 'rgb(55, 65, 81)',
    off: 'rgb(209, 213, 219)',
    offHover: 'rgb(186, 191, 199)',
    focusRing: 'rgba(107, 114, 128, 0.45)',
    darkOn: 'rgb(156, 163, 175)',
    darkOnHover: 'rgb(170, 177, 189)',
    darkOff: 'rgb(55, 65, 81)',
    darkOffHover: 'rgb(70, 80, 96)',
  },
  danger: {
    on: 'rgb(220, 38, 38)',
    onHover: 'rgb(185, 28, 28)',
    off: 'rgb(209, 213, 219)',
    offHover: 'rgb(186, 191, 199)',
    focusRing: 'rgba(239, 68, 68, 0.45)',
    darkOn: 'rgb(248, 113, 113)',
    darkOnHover: 'rgb(255, 130, 130)',
    darkOff: 'rgb(75, 85, 99)',
    darkOffHover: 'rgb(90, 100, 114)',
  },
};

// ── Spring CSS transition strings ──

const MODERATE = `${NXP_SPRING_MODERATE.duration}ms ${NXP_SPRING_MODERATE.easing}`;
const FAST = `${NXP_SPRING_FAST.duration}ms ${NXP_SPRING_FAST.easing}`;
const THUMB_TRANSITION = `transform ${MODERATE}, width ${MODERATE}, height ${MODERATE}, top ${MODERATE}`;
const TRACK_BG_TRANSITION = `background-color ${FAST}`;

@Component({
  selector: 'nxp-switch',
  standalone: true,
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
      [style.boxShadow]="focused() ? '0 0 0 3px ' + colorSpec().focusRing : 'none'"
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
        class="absolute left-0 block rounded-full bg-white shadow-sm"
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

  // ── Public inputs ──
  readonly checked = model(false);
  readonly disabledInput = input(false, { alias: 'disabled' });
  readonly size = input<NxpSwitchSize>(this.options.size);
  readonly color = input<NxpSwitchColor>(this.options.color);
  readonly class = input<string>('');

  // CVA disabled state (set programmatically by reactive forms)
  private readonly cvaDisabled = signal(false);
  readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());

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
  private onChange: (value: boolean) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  // ── Computed values ──

  readonly dims = computed(() => SIZES[this.size()]);
  readonly colorSpec = computed(() => {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    return { ...COLORS[this.color()], isDark };
  });

  readonly trackBg = computed(() => {
    const spec = COLORS[this.color()];
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const isOn = this.checked();
    const isHover = this.hovered();

    if (isDark) {
      return isOn
        ? (isHover ? spec.darkOnHover : spec.darkOn)
        : (isHover ? spec.darkOffHover : spec.darkOff);
    }
    return isOn
      ? (isHover ? spec.onHover : spec.on)
      : (isHover ? spec.offHover : spec.off);
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
    return this.checked()
      ? d.offset + d.travel - extraWidth
      : d.offset;
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
        const restX = this.checked()
          ? d.offset + d.travel
          : d.offset;
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
