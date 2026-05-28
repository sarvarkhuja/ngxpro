import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  OnChanges,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  cx,
  fromResizeObserver,
  nxpInjectElement,
  nxpZonefree,
} from '@ngxpro/cdk';
import { NxpSegmentedDirective } from './segmented.directive';
import {
  NXP_SEGMENTED_OPTIONS,
  type NxpSegmentedOrientation,
  type NxpSegmentedSize,
} from './segmented.options';

// Two RAFs: first lets Angular flush DOM, second lets the browser paint at the
// correct position. Only then is the transition class added — without this,
// the indicator animates from (0,0,0,0) to its real position on mount.
function afterFirstPaint(cb: () => void): void {
  requestAnimationFrame(() => requestAnimationFrame(cb));
}

/**
 * Segmented control component — a pill-shaped container for mutually
 * exclusive options with an animated sliding indicator.
 *
 * Place `button`, `a`, or `label` elements directly inside `nxp-segmented`.
 * The active item is tracked by index and animated with a sliding background.
 *
 * Sizes align with the button component (sm=h-8, md=h-10, lg=h-12).
 *
 * @example
 * <!-- Basic -->
 * <nxp-segmented>
 *   <button>Day</button>
 *   <button>Week</button>
 *   <button>Month</button>
 * </nxp-segmented>
 *
 * @example
 * <!-- Two-way binding -->
 * <nxp-segmented [(activeItemIndex)]="period">
 *   <button>Day</button>
 *   <button>Week</button>
 *   <button>Month</button>
 * </nxp-segmented>
 *
 * @example
 * <!-- Size variants -->
 * <nxp-segmented size="sm">...</nxp-segmented>
 * <nxp-segmented size="lg">...</nxp-segmented>
 */
@Component({
  selector: 'nxp-segmented',
  template: `
    <ng-content />
    <!-- Sliding indicator — Vercel shadow-as-border + soft lift.
         Transition is only attached after the first paint to prevent the
         indicator animating from (0,0,0,0) into place on mount. -->
    <span
      [class]="indicatorClass()"
      [style.top.px]="indicatorTop()"
      [style.left.px]="indicatorLeft()"
      [style.width.px]="indicatorWidth()"
      [style.height.px]="indicatorHeight()"
    ></span>
  `,
  styles: [
    `
      /* Item base — button / a / label / nxp-segment direct children */
      nxp-segmented > :is(button, a, label, nxp-segment) {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        white-space: nowrap;
        cursor: pointer;
        border-radius: inherit;
        border: none;
        background: transparent;
        font: inherit;
        font-weight: 500;
        z-index: 1;
        padding-inline: 0.75rem;
        color: inherit;
        text-decoration: none;
        -webkit-user-select: none;
        user-select: none;
      }

      /* Transitions only after the indicator has been measured/placed —
         otherwise the initial active item flashes from secondary to primary
         color over 150ms on mount. */
      nxp-segmented[data-ready] > :is(button, a, label, nxp-segment) {
        transition:
          color var(--nxp-duration-normal) ease,
          opacity var(--nxp-duration-normal) ease;
      }

      /* Hover on inactive items */
      nxp-segmented
        > :is(button, a, label, nxp-segment):not([data-active]):not(
          [disabled]
        ):hover {
        color: var(--nxp-text-primary);
      }

      /* Active item — high-contrast text */
      nxp-segmented > :is(button, a, label, nxp-segment)[data-active] {
        color: var(--nxp-text-primary);
      }

      /* Disabled item — muted, not interactive. Native <button disabled> already
         blocks clicks; <a>/<label>/<nxp-segment> rely on the parent directive's
         closest('[disabled]') guard. */
      nxp-segmented > :is(button, a, label, nxp-segment)[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Focus-visible ring — Geist focus blue (design-system §6) */
      nxp-segmented > :is(button, a, label, nxp-segment):focus-visible {
        outline: 2px solid var(--color-border-focus, hsla(212, 100%, 48%, 1));
        outline-offset: -2px;
      }

      /* Size-driven heights — align with button component (sm=h-8, md=h-10, lg=h-12) */
      /* sm:  container p-0.5 (2px) × 2 + item 28px = 32px = h-8  */
      /* md:  container p-1   (4px) × 2 + item 32px = 40px = h-10 */
      /* lg:  container p-1   (4px) × 2 + item 40px = 48px = h-12 */
      nxp-segmented[data-size='sm'] > :is(button, a, label, nxp-segment) {
        height: 1.75rem; /* 28px */
        padding-inline: 0.625rem;
        font-size: 0.75rem;
        line-height: 1rem;
      }
      nxp-segmented[data-size='md'] > :is(button, a, label, nxp-segment) {
        height: 2rem; /* 32px */
        padding-inline: 0.875rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
      nxp-segmented[data-size='lg'] > :is(button, a, label, nxp-segment) {
        height: 2.5rem; /* 40px */
        padding-inline: 1.125rem;
        font-size: 1rem;
        line-height: 1.5rem;
      }

      /* Icon sizing inside segment items, scaled to parent data-size */
      nxp-segmented[data-size='sm']
        > :is(button, a, label, nxp-segment)
        > span {
        width: 0.875rem;
        height: 0.875rem;
      }
      nxp-segmented[data-size='md']
        > :is(button, a, label, nxp-segment)
        > span {
        width: 1rem;
        height: 1rem;
      }
      nxp-segmented[data-size='lg']
        > :is(button, a, label, nxp-segment)
        > span {
        width: 1.125rem;
        height: 1.125rem;
      }

      /* Vertical orientation — items fill container width and left-align content */
      nxp-segmented[data-orientation='vertical']
        > :is(button, a, label, nxp-segment) {
        width: 100%;
        justify-content: flex-start;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NxpSegmentedDirective],
  host: {
    '[class]': 'hostClass()',
    '[attr.data-size]': 'size()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-ready]': 'indicatorReady() ? "" : null',
  },
})
export class NxpSegmentedComponent implements AfterViewInit, OnChanges {
  private readonly el = nxpInjectElement<HTMLElement>();
  private readonly segmentedDirective = inject(NxpSegmentedDirective);
  private readonly options = inject(NXP_SEGMENTED_OPTIONS);

  /** Size variant — sm (h-8), md (h-10), lg (h-12). Matches button sizes. */
  readonly size = input<NxpSegmentedSize>(this.options.size);

  /** Layout direction — `horizontal` (default) or `vertical` (stacked, full-width items). */
  readonly orientation = input<NxpSegmentedOrientation>(
    this.options.orientation,
  );

  /** Index of the currently active segment. Supports two-way binding. */
  readonly activeItemIndex = model(0);

  // Indicator position signals — updated by refresh()
  protected readonly indicatorTop = signal(0);
  protected readonly indicatorLeft = signal(0);
  protected readonly indicatorWidth = signal(0);
  protected readonly indicatorHeight = signal(0);

  // False until the indicator has been measured and painted at its real
  // position. Gates the slide / color transitions to avoid the mount-time
  // animation from (0,0,0,0).
  protected readonly indicatorReady = signal(false);

  protected readonly indicatorClass = computed(() =>
    cx(
      'absolute rounded-[inherit] bg-bg-base pointer-events-none z-0 shadow-lift',
      this.indicatorReady() &&
        'transition-[top,left,width,height] duration-slow ease-in-out',
    ),
  );

  protected readonly hostClass = computed(() => {
    const radiusBySize: Record<NxpSegmentedSize, string> = {
      sm: 'rounded-m',
      md: 'rounded-lg',
      lg: 'rounded-xl',
    };
    const paddingBySize: Record<NxpSegmentedSize, string> = {
      sm: 'p-0.5',
      md: 'p-1',
      lg: 'p-1',
    };
    return cx(
      'relative inline-flex flex-shrink-0 overflow-hidden',
      this.orientation() === 'vertical' && 'flex-col',
      'bg-bg-neutral-1',
      'text-text-secondary',
      'font-medium',
      radiusBySize[this.size()],
      paddingBySize[this.size()],
    );
  });

  constructor() {
    this.segmentedDirective.setComponent(this);

    fromResizeObserver(this.el)
      .pipe(nxpZonefree(), takeUntilDestroyed())
      .subscribe(() => this.refresh());
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.refresh());
  }

  ngOnChanges(): void {
    this.refresh();
  }

  /**
   * Update the active segment index and refresh the indicator position.
   * Called by NxpSegmentedDirective on click / route change / form value change.
   */
  update(index: number): void {
    if (index === this.activeItemIndex() || index < 0) return;
    this.activeItemIndex.set(index);
    this.refresh();
  }

  /**
   * Recalculate the indicator's position and size to sit behind the active child.
   * The last child is the indicator <span> itself — excluded via slice(0, -1).
   * Also marks the active child with [data-active] for CSS text-color targeting.
   */
  private refresh(): void {
    const children = Array.from(this.el.children).slice(0, -1) as HTMLElement[];
    const active = children[this.activeItemIndex()];
    if (!(active instanceof HTMLElement)) return;

    children.forEach((child) => child.removeAttribute('data-active'));
    active.setAttribute('data-active', '');

    this.indicatorTop.set(active.offsetTop);
    this.indicatorLeft.set(active.offsetLeft);
    this.indicatorWidth.set(active.offsetWidth);
    this.indicatorHeight.set(active.offsetHeight);

    if (!this.indicatorReady()) {
      afterFirstPaint(() => this.indicatorReady.set(true));
    }
  }
}
