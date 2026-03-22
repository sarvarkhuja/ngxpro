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
  NXP_VIEWPORT,
  NxpRectAccessor,
} from '@nxp/cdk';
import { cx } from '@nxp/cdk';
import type { NxpContext, NxpPoint } from '@nxp/cdk';
import { NXP_TOOLTIP_OPTIONS } from './tooltip.options';
import { NxpTooltipPosition } from './tooltip-position';
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
 * Interface provided by the tooltip directive so the component can read inputs
 * without creating a circular import.
 */
export interface NxpTooltipHost extends NxpRectAccessor {
  readonly el: HTMLElement;
  tooltipContent(): PolymorpheusContent<NxpContext<void>>;
  nxpTooltipAppearance(): string;
  nxpTooltipSize(): NxpTooltipSize;
  hide(): void;
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
    <div
      *polymorpheusOutlet="host.tooltipContent() as text"
    >
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
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    NxpPositionService,
    NxpTooltipPosition,
    nxpPositionAccessorFor('tooltip', NxpTooltipPosition),
  ],
})
export class NxpTooltipComponent implements AfterViewInit {
  private readonly el = nxpInjectElement();
  private readonly viewport = inject(NXP_VIEWPORT);
  private readonly positionService = inject(NxpPositionService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly position = inject(NxpTooltipPosition);
  protected readonly options = inject(NXP_TOOLTIP_OPTIONS);
  protected readonly host = inject(NXP_TOOLTIP_HOST);

  protected readonly arrowClasses = () => {
    const direction = this.position.resolvedDirection() ?? 'top';
    const appearance = this.host.nxpTooltipAppearance() || this.options.appearance;
    const base = 'absolute block w-2 h-2 rotate-45 z-0';
    const colorClass =
      appearance === 'light'
        ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
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
    // Apply appearance + size classes to host element
    this.applyHostClasses();

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
          // Re-apply appearance classes after positioning (they are reactive)
          this.applyHostClasses();
        },
        complete: () => this.host.hide(),
      });
  }

  private applyHostClasses(): void {
    const appearance = this.host.nxpTooltipAppearance() || this.options.appearance;
    const size = this.host.nxpTooltipSize();
    const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES['md'];
    const appearanceClass = APPEARANCE_CLASSES[appearance] ?? '';
    this.el.className = cx('relative overflow-visible', sizeClass, appearanceClass);
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
