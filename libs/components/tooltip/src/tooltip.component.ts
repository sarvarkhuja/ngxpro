import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  InjectionToken,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PolymorpheusOutlet } from '@taiga-ui/polymorpheus';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { map, takeWhile } from 'rxjs';
import {
  NxpPositionService,
  nxpPositionAccessorFor,
  nxpInjectElement,
  nxpPx,
  NxpRectAccessor,
} from '@nxp/cdk';
import { cx } from '@nxp/cdk';
import { NXP_SPRING_MODERATE } from '@nxp/cdk';
import type { NxpContext, NxpPoint } from '@nxp/cdk';
import { NXP_TOOLTIP_OPTIONS } from './tooltip.options';
import { NxpTooltipPosition } from './tooltip-position';
import type { NxpTooltipDirection } from './tooltip-position';
import type { NxpTooltipSize } from './tooltip.types';

const SIZE_CLASSES: Record<NxpTooltipSize, string> = {
  sm: 'text-xs py-1 px-2',
  md: 'text-sm py-1.5 px-3',
  lg: 'text-base py-2 px-4',
};

const APPEARANCE_CLASSES: Record<string, string> = {
  dark: 'bg-gray-900 text-white dark:bg-gray-950 dark:text-gray-100',
  light:
    'bg-white text-gray-900 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
};

/**
 * Slide offset (px) per direction — mirrors fluidfunctionalizm's `getSlideOffset`.
 * Tooltip slides FROM this offset TO 0 on enter.
 */
const SLIDE_OFFSET: Record<NxpTooltipDirection, { x: number; y: number }> = {
  top: { x: 0, y: 4 },
  bottom: { x: 0, y: -4 },
  left: { x: 4, y: 0 },
  right: { x: -4, y: 0 },
};

/**
 * Transform-origin per direction — the tooltip scales in from the edge
 * closest to the trigger, not from center.
 */
const TRANSFORM_ORIGIN: Record<NxpTooltipDirection, string> = {
  top: 'center bottom',
  bottom: 'center top',
  left: 'right center',
  right: 'left center',
};

/**
 * Interface provided by the tooltip directive so the component can read inputs
 * without creating a circular import.
 */
export interface NxpTooltipHost extends NxpRectAccessor {
  readonly el: HTMLElement;
  tooltipContent(): PolymorpheusContent<NxpContext<void>>;
  nxpTooltipAppearance(): string;
  nxpTooltipSize(): NxpTooltipSize;
  hide(): void;
  /** When true, skip the enter animation (used for skip-delay re-opens). */
  isInstant?(): boolean;
}

/**
 * Injection token by which NxpTooltipDirective passes itself to
 * NxpTooltipComponent without creating a circular dependency.
 */
export const NXP_TOOLTIP_HOST = new InjectionToken<NxpTooltipHost>(
  ngDevMode ? 'NXP_TOOLTIP_HOST' : '',
);
/**
 * The rendered tooltip popup panel. Created dynamically by NxpTooltipDirective
 * via the portal system. Positions itself relative to the host element using
 * NxpPositionService backed by NxpTooltipPosition.
 *
 * Spring-based enter/exit animation inspired by fluidfunctionalizm's tooltip:
 * - Enter: slide + fade using NXP_SPRING_MODERATE (160ms, spring-like cubic-bezier with overshoot)
 * - Exit: quick 100ms linear fade (asymmetric with enter)
 */
@Component({
  selector: 'nxp-tooltip',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [PolymorpheusOutlet],
  template: `
    <!-- Arrow -->
    <span [class]="arrowClasses()" aria-hidden="true"></span>

    <!-- Content -->
    <div *polymorpheusOutlet="host.tooltipContent() as text">
      {{ text }}
    </div>
  `,
  styles: [
    `
      nxp-tooltip {
        position: absolute;
        z-index: 1100;
        pointer-events: none;
        border-radius: 0.375rem;
        box-shadow:
          0 4px 6px -1px rgb(0 0 0 / 0.1),
          0 2px 4px -2px rgb(0 0 0 / 0.1);
        overflow: visible;
        /* Start hidden — enter animation sets final values */
        opacity: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NxpPositionService,
    NxpTooltipPosition,
    nxpPositionAccessorFor('tooltip', NxpTooltipPosition),
  ],
})
export class NxpTooltipComponent implements AfterViewInit {
  private readonly el = nxpInjectElement();
  private readonly positionService = inject(NxpPositionService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly position = inject(NxpTooltipPosition);
  protected readonly options = inject(NXP_TOOLTIP_OPTIONS);
  protected readonly host = inject(NXP_TOOLTIP_HOST);

  /** The resolved tooltip direction after auto-flip (public for exit animation). */
  public get resolvedDirection(): NxpTooltipDirection | null {
    return this.position.resolvedDirection();
  }

  protected readonly arrowClasses = () => {
    const direction = this.position.resolvedDirection() ?? 'top';
    const appearance =
      this.host.nxpTooltipAppearance() || this.options.appearance;
    const base = 'absolute block w-2 h-2 rotate-45 z-0';
    // For the light appearance, only show the two border sides that face outward
    // (away from the tooltip body) so the inner edges don't create a visible line.
    const borderByDirection: Record<string, string> = {
      top: 'border-b border-r border-gray-200 dark:border-gray-700',
      bottom: 'border-t border-l border-gray-200 dark:border-gray-700',
      left: 'border-t border-r border-gray-200 dark:border-gray-700',
      right: 'border-b border-l border-gray-200 dark:border-gray-700',
    };
    const colorClass =
      appearance === 'light'
        ? `bg-white dark:bg-gray-800 ${borderByDirection[direction]}`
        : 'bg-gray-900 dark:bg-gray-950';

    const posClass = {
      top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
      bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
      left: 'right-[-4px] top-1/2 -translate-y-1/2',
      right: 'left-[-4px] top-1/2 -translate-y-1/2',
    }[direction];

    return cx(base, colorClass, posClass);
  };

  public ngAfterViewInit(): void {
    this.applyHostClasses();

    // Set initial slide offset before first position (prevents flash)
    const initialDirection = this.options.direction as NxpTooltipDirection;
    const offset = SLIDE_OFFSET[initialDirection] ?? SLIDE_OFFSET.top;
    this.el.style.transform = `translate(${offset.x}px, ${offset.y}px)`;

    this.positionService
      .pipe(
        takeWhile(
          () =>
            this.host.el.isConnected &&
            !!this.host.el.getBoundingClientRect().height,
        ),
        map((point) => this.getStyles(...(point as NxpPoint))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (styles) => {
          Object.assign(this.el.style, styles);
          this.applyHostClasses();
          this.animateEnter();
        },
        complete: () => this.host.hide(),
      });
  }

  /**
   * Spring-inspired enter animation: slide from directional offset to 0, fade in.
   * Uses NXP_SPRING_MODERATE cubic-bezier for the spring feel.
   *
   * Skip-delay: when `host.isInstant?.()` is true, jump straight to the final
   * state with no transition — the tooltip group has just been active and
   * further animation would feel choppy rather than considered.
   */
  private animateEnter(): void {
    const el = this.el;
    // Only animate on first position (avoid re-animating on reposition)
    if (el.dataset['entered']) return;
    el.dataset['entered'] = '1';

    if (this.host.isInstant?.()) {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'translate(0, 0)';
      return;
    }

    const direction = (this.position.resolvedDirection() ??
      this.options.direction) as NxpTooltipDirection;
    const offset = SLIDE_OFFSET[direction] ?? SLIDE_OFFSET.top;

    // Set initial state (slide offset + invisible) on the current frame…
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = `translate(${offset.x}px, ${offset.y}px)`;

    // …then flip to the final state on the next paint so the browser actually
    // transitions. Double rAF is the lowest-overhead replacement for a forced
    // reflow via `offsetHeight`.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `opacity ${NXP_SPRING_MODERATE.duration}ms ${NXP_SPRING_MODERATE.easing}, transform ${NXP_SPRING_MODERATE.duration}ms ${NXP_SPRING_MODERATE.easing}`;
        el.style.opacity = '1';
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  private applyHostClasses(): void {
    const appearance =
      this.host.nxpTooltipAppearance() || this.options.appearance;
    const size = this.host.nxpTooltipSize();
    const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES['md'];
    const appearanceClass = APPEARANCE_CLASSES[appearance] ?? '';
    this.el.className = cx(
      'relative overflow-visible',
      sizeClass,
      appearanceClass,
    );
    // Scale-from-trigger: origin is opposite the tooltip direction so the
    // panel grows out of the edge nearest the triggering element.
    const direction = (this.position.resolvedDirection() ??
      this.options.direction) as NxpTooltipDirection;
    this.el.style.transformOrigin =
      TRANSFORM_ORIGIN[direction] ?? TRANSFORM_ORIGIN.top;
  }

  private getStyles(x: number, y: number): Record<string, string> {
    const parent = this.el.offsetParent?.getBoundingClientRect();
    const left = parent?.left ?? 0;
    const top = parent?.top ?? 0;
    return {
      position: 'absolute',
      top: nxpPx(Math.round(y - top)),
      left: nxpPx(Math.round(x - left)),
    };
  }
}
