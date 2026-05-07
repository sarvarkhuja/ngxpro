import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PolymorpheusOutlet } from '@taiga-ui/polymorpheus';
import { map, takeWhile } from 'rxjs';
import { EMPTY_CLIENT_RECT } from '../../constants';
import { NxpAnimated } from '../../directives/animated.directive';
import { NxpActiveZone } from '../../directives/active-zone.directive';
import { nxpInjectElement } from '../../utils/inject-element';
import { clamp } from '../../utils/math';
import { nxpPx } from '../../utils/px';
import {
  nxpPositionAccessorFor,
  NxpRectAccessor,
  nxpRectAccessorFor,
} from '../../classes/accessors';
import { NxpPositionService } from '../../services/position.service';
import { NxpVisualViewportService } from '../../services/visual-viewport.service';
import { NXP_VIEWPORT } from '../../tokens';
import { NxpDropdownDirective } from './dropdown.directive';
import { NXP_DROPDOWN_CONTEXT } from './dropdown-context.token';
import { NXP_DROPDOWN_OPTIONS } from './dropdown-options.directive';
import { NxpDropdownPosition } from './dropdown-position.directive';

const MAX_WIDTH_GAP = 16;

/**
 * The rendered dropdown panel. Created dynamically by NxpDropdownDirective via the portal system.
 * Positions itself relative to the host element using NxpPositionService.
 */
@Component({
  selector: 'nxp-dropdown',
  imports: [PolymorpheusOutlet],
  template: `
    <div class="nxp-dropdown-scroll overflow-auto max-h-full">
      <div
        *polymorpheusOutlet="
          directive.content() as text;
          context: { $implicit: close }
        "
        class="nxp-dropdown-primitive"
      >
        {{ text }}
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        z-index: 1000;
        min-width: 10rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow:
          0 4px 6px -1px rgb(0 0 0 / 0.1),
          0 2px 4px -2px rgb(0 0 0 / 0.1);
        overflow: hidden;
        /* transform-origin is set per-open in getStyles() so the panel
           scales in from the edge nearest the trigger, not from center. */
      }
      :host-context(.dark) {
        background: #1f2937;
        color: white;
      }
      :host.nxp-enter {
        animation: nxp-dropdown-in 0.18s cubic-bezier(0.22, 1.2, 0.36, 1);
      }
      :host.nxp-leave {
        animation: nxp-dropdown-in 0.12s cubic-bezier(0.4, 0, 1, 1) reverse;
      }
      @keyframes nxp-dropdown-in {
        from {
          opacity: 0;
          transform: scale(0.96);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        :host.nxp-enter,
        :host.nxp-leave {
          animation: nxp-dropdown-fade 0.15s linear;
        }
        :host.nxp-leave {
          animation-direction: reverse;
        }
        @keyframes nxp-dropdown-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NxpPositionService,
    nxpPositionAccessorFor('dropdown', NxpDropdownPosition),
    nxpRectAccessorFor(
      'dropdown',
      forwardRef(() => NxpDropdownDirective),
    ),
  ],
  hostDirectives: [NxpActiveZone, NxpAnimated],
  host: {
    '[attr.data-appearance]': 'options.appearance',
  },
})
export class NxpDropdownComponent implements AfterViewInit {
  private readonly el = nxpInjectElement();
  private readonly accessor = inject(NxpRectAccessor);
  private readonly viewport = inject(NXP_VIEWPORT);
  private readonly vvs = inject(NxpVisualViewportService);

  private readonly styles$ = inject(NxpPositionService).pipe(
    takeWhile(
      () =>
        this.directive.el.isConnected &&
        !!this.directive.el.getBoundingClientRect().height,
    ),
    map((v) => (this.position === 'fixed' ? this.vvs.correct(v) : v)),
    map((point) => this.getStyles(...point)),
    takeUntilDestroyed(),
  );

  protected readonly options = inject(NXP_DROPDOWN_OPTIONS);
  protected readonly directive = inject(NxpDropdownDirective);
  protected readonly context = inject(NXP_DROPDOWN_CONTEXT, { optional: true });
  protected readonly position = this.directive.position;

  public ngAfterViewInit(): void {
    this.styles$.subscribe({
      next: (styles) => Object.assign(this.el.style, styles),
      complete: () => this.close(),
    });
  }

  protected readonly close = (): void => this.directive.toggle(false);

  private getStyles(x: number, y: number): Record<string, string> {
    const { maxHeight, minHeight, offset, limitWidth } = this.options;
    const parent =
      this.el.offsetParent?.getBoundingClientRect() || EMPTY_CLIENT_RECT;
    const { left = 0, top = 0 } = this.position === 'fixed' ? {} : parent;
    const rect = this.accessor.getClientRect();
    const viewport = this.viewport.getClientRect();
    const zoom =
      (this.directive.el as HTMLElement & { currentCSSZoom?: number })
        .currentCSSZoom ?? 1;
    const above = rect.top - viewport.top - 2 * offset;
    const below = viewport.top + viewport.height - y - offset;
    const available = y > rect.bottom ? below : above;
    const height =
      this.el.getBoundingClientRect().right <= rect.left || x >= rect.right
        ? maxHeight
        : clamp(available, minHeight, maxHeight);

    // Scale-from-trigger: pick the edge nearest the trigger as the origin.
    const panelWidth = this.el.getBoundingClientRect().width;
    const triggerCenter = rect.left + rect.width / 2;
    const panelStart = x;
    const panelEnd = x + panelWidth;
    const horizontal =
      triggerCenter < panelStart
        ? 'left'
        : triggerCenter > panelEnd
          ? 'right'
          : 'center';
    const vertical = y >= rect.bottom ? 'top' : 'bottom';

    return {
      position: this.position,
      top: nxpPx(Math.round(Math.max(y - top, offset - top) / zoom)),
      left: nxpPx(Math.round((x - left) / zoom)),
      maxHeight: nxpPx(Math.round(height / zoom)),
      width: limitWidth === 'fixed' ? nxpPx(Math.round(rect.width / zoom)) : '',
      minWidth:
        limitWidth === 'min' ? nxpPx(Math.round(rect.width / zoom)) : '',
      maxWidth: nxpPx(Math.round(viewport.width / zoom) - MAX_WIDTH_GAP),
      transformOrigin: `${horizontal} ${vertical}`,
    };
  }
}
