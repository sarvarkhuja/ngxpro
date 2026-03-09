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
import { cx, fromResizeObserver, nxpInjectElement, nxpZonefree } from '@nxp/cdk';
import { NxpSegmentedDirective } from './segmented.directive';
import {
  NXP_SEGMENTED_OPTIONS,
  type NxpSegmentedSize,
} from './segmented.options';

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
  standalone: true,
  template: `
    <ng-content />
    <!-- Animated sliding indicator — sits behind children via z-index -->
    <span
      class="absolute transition-all duration-200 ease-in-out rounded-[inherit] bg-bg-base shadow-sm pointer-events-none z-0 ring-1 ring-border-normal"
      [style.top.px]="indicatorTop()"
      [style.left.px]="indicatorLeft()"
      [style.width.px]="indicatorWidth()"
      [style.height.px]="indicatorHeight()"
    ></span>
  `,
  styles: [`
    /* Item base — button / a / label direct children */
    nxp-segmented > :is(button, a, label) {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      cursor: pointer;
      border-radius: inherit;
      border: none;
      background: transparent;
      font: inherit;
      font-weight: 500;
      z-index: 1;
      padding-inline: 0.75rem;
      transition: color 150ms ease, opacity 150ms ease;
      color: inherit;
      text-decoration: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Hover on inactive items */
    nxp-segmented > :is(button, a, label):not([data-active]):hover {
      color: var(--nxp-text-primary);
    }

    /* Active item — high-contrast text */
    nxp-segmented > :is(button, a, label)[data-active] {
      color: var(--nxp-text-primary);
    }

    /* Focus-visible ring */
    nxp-segmented > :is(button, a, label):focus-visible {
      outline: 2px solid var(--color-border-focus, #3b82f6);
      outline-offset: -2px;
    }

    /* Size-driven heights — align with button component (sm=h-8, md=h-10, lg=h-12) */
    /* sm:  container p-0.5 (2px) × 2 + item 28px = 32px = h-8  */
    /* md:  container p-1   (4px) × 2 + item 32px = 40px = h-10 */
    /* lg:  container p-1   (4px) × 2 + item 40px = 48px = h-12 */
    nxp-segmented[data-size="sm"] > :is(button, a, label) {
      height: 1.75rem;   /* 28px */
      padding-inline: 0.625rem;
      font-size: 0.75rem;
      line-height: 1rem;
    }
    nxp-segmented[data-size="md"] > :is(button, a, label) {
      height: 2rem;      /* 32px */
      padding-inline: 0.875rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    nxp-segmented[data-size="lg"] > :is(button, a, label) {
      height: 2.5rem;    /* 40px */
      padding-inline: 1.125rem;
      font-size: 1rem;
      line-height: 1.5rem;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NxpSegmentedDirective],
  host: {
    '[class]': 'hostClass()',
    '[attr.data-size]': 'size()',
  },
})
export class NxpSegmentedComponent implements AfterViewInit, OnChanges {
  private readonly el = nxpInjectElement<HTMLElement>();
  private readonly segmentedDirective = inject(NxpSegmentedDirective);
  private readonly options = inject(NXP_SEGMENTED_OPTIONS);

  /** Size variant — sm (h-8), md (h-10), lg (h-12). Matches button sizes. */
  readonly size = input<NxpSegmentedSize>(this.options.size);

  /** Index of the currently active segment. Supports two-way binding. */
  readonly activeItemIndex = model(0);

  // Indicator position signals — updated by refresh()
  protected readonly indicatorTop = signal(0);
  protected readonly indicatorLeft = signal(0);
  protected readonly indicatorWidth = signal(0);
  protected readonly indicatorHeight = signal(0);

  protected readonly hostClass = computed(() => {
    // Border-radius per size — smaller container radius uses smaller child radius via inherit
    const radiusBySize: Record<NxpSegmentedSize, string> = {
      sm: 'rounded-lg',   // 8px container → ~6px items (rounded-md feel)
      md: 'rounded-xl',   // 12px container → ~10px items
      lg: 'rounded-2xl',  // 16px container → ~14px items
    };
    // Padding per size (leaves room for indicator inset)
    const paddingBySize: Record<NxpSegmentedSize, string> = {
      sm: 'p-0.5', // 2px — total height: 28 + 4 = 32px (h-8)
      md: 'p-1',   // 4px — total height: 32 + 8 = 40px (h-10)
      lg: 'p-1',   // 4px — total height: 40 + 8 = 48px (h-12)
    };
    return cx(
      // Layout
      'relative inline-flex flex-shrink-0 overflow-hidden',
      // Background — subtle tray
      'bg-bg-neutral-1',
      // Default text — muted, inactive color
      'text-text-secondary',
      // Font
      'font-medium',
      // Size-specific
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

    // Update data-active attribute for CSS-driven text color
    children.forEach((child) => child.removeAttribute('data-active'));
    active.setAttribute('data-active', '');

    // Update indicator signals
    this.indicatorTop.set(active.offsetTop);
    this.indicatorLeft.set(active.offsetLeft);
    this.indicatorWidth.set(active.offsetWidth);
    this.indicatorHeight.set(active.offsetHeight);
  }
}
