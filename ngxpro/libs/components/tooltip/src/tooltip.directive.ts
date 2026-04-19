import {
  ChangeDetectorRef,
  type ComponentRef,
  Directive,
  inject,
  INJECTOR,
  Injector,
  input,
  OnDestroy,
} from '@angular/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { NxpPortalService, nxpInjectElement, NxpRectAccessor } from '@nxp/cdk';
import type { NxpContext } from '@nxp/cdk';
import { NXP_TOOLTIP_OPTIONS } from './tooltip.options';
import type { NxpTooltipOptions } from './tooltip.options';
import { NxpTooltipComponent, NXP_TOOLTIP_HOST } from './tooltip.component';
import type { NxpTooltipHost } from './tooltip.component';
import type { NxpTooltipSize } from './tooltip.types';

/** Slide offset per direction for exit animation (mirrors component enter offsets). */
const SLIDE_OFFSET = {
  top: { x: 0, y: 4 },
  bottom: { x: 0, y: -4 },
  left: { x: 4, y: 0 },
  right: { x: -4, y: 0 },
} as const;

/** Exit animation duration — fast linear fade matching framer-motion `{ duration: 0.1 }`. */
const EXIT_DURATION_MS = 100;

/**
 * Main tooltip directive. Attach to any element to give it a tooltip.
 *
 * @example
 * <button [nxpTooltip]="'Save changes'">Save</button>
 *
 * @example
 * <!-- With template content -->
 * <span [nxpTooltip]="tpl">Hover me</span>
 * <ng-template #tpl>Rich content</ng-template>
 *
 * @example
 * <!-- Customise direction and appearance -->
 * <span [nxpTooltip]="'Info'" nxpTooltipDirection="right" nxpTooltipAppearance="light">?</span>
 */
@Directive({
  // `nxp-tooltip-icon` already applies this directive through `hostDirectives`.
  // Excluding that host prevents Angular from matching the same directive twice.
  selector: '[nxpTooltip]:not(nxp-tooltip-icon)',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(touchstart)': 'onTouchStart()',
    '(touchend)': 'onTouchEnd()',
    '[attr.aria-describedby]': 'nxpTooltipDescribe()',
  },
})
export class NxpTooltipDirective implements OnDestroy, NxpRectAccessor {
  readonly el: HTMLElement = nxpInjectElement();
  private readonly options = inject(NXP_TOOLTIP_OPTIONS);
  private readonly portalService = inject(NxpPortalService);
  private readonly injector = inject(INJECTOR);
  private readonly cdr = inject(ChangeDetectorRef);
  private componentRef: ComponentRef<NxpTooltipComponent> | null = null;
  /** Ref being animated out — kept so we can destroy it if show() interrupts the exit. */
  private exitingRef: ComponentRef<NxpTooltipComponent> | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private exitTimer: ReturnType<typeof setTimeout> | null = null;

  /** The tooltip content — string, TemplateRef, or PolymorpheusComponent. */
  readonly nxpTooltip = input<PolymorpheusContent<NxpContext<void>>>('');

  /** Preferred opening direction. Falls back to options default. */
  readonly nxpTooltipDirection = input<
    'top' | 'bottom' | 'left' | 'right' | null
  >(null);

  /** Alignment along the cross-axis. Falls back to options default. */
  readonly nxpTooltipAlign = input<'start' | 'center' | 'end' | null>(null);

  /** Visual appearance. Falls back to options default. */
  readonly nxpTooltipAppearance = input<string>('');

  /** Show delay in ms. Falls back to options default. */
  readonly nxpTooltipShowDelay = input<number | null>(null);

  /** Hide delay in ms. Falls back to options default. */
  readonly nxpTooltipHideDelay = input<number | null>(null);

  /** Panel size. */
  readonly nxpTooltipSize = input<NxpTooltipSize>('md');

  /** When true, the tooltip will not show. */
  readonly nxpTooltipDisabled = input<boolean>(false);

  /** Sets aria-describedby on the host element. Null = no attribute. */
  readonly nxpTooltipDescribe = input<string | null>(null);

  /** Resolved content (re-exposed so NxpTooltipComponent can read it). */
  tooltipContent(): PolymorpheusContent<NxpContext<void>> {
    return this.nxpTooltip();
  }

  public readonly type = 'tooltip';

  public getClientRect(): DOMRect {
    return this.el.getBoundingClientRect();
  }

  onMouseEnter(): void {
    this.clearTimers();
    if (this.nxpTooltipDisabled()) return;
    const delay = this.nxpTooltipShowDelay() ?? this.options.showDelay;
    this.showTimer = setTimeout(() => this.show(), delay);
  }

  onMouseLeave(): void {
    this.clearTimers();
    const delay = this.nxpTooltipHideDelay() ?? this.options.hideDelay;
    this.hideTimer = setTimeout(() => this.hide(), delay);
  }

  onTouchStart(): void {
    if (this.nxpTooltipDisabled()) return;
    this.show();
  }

  onTouchEnd(): void {
    const delay = this.nxpTooltipHideDelay() ?? this.options.hideDelay;
    this.hideTimer = setTimeout(() => this.hide(), delay);
  }

  show(): void {
    // Cancel any in-progress exit animation and destroy the orphaned ref
    if (this.exitTimer !== null) {
      clearTimeout(this.exitTimer);
      this.exitTimer = null;
      this.exitingRef?.destroy();
      this.exitingRef = null;
    }
    if (this.componentRef || !this.nxpTooltip()) return;

    // Merge per-instance direction/align into the options so NxpTooltipPosition reads them
    const mergedOptions: NxpTooltipOptions = {
      ...this.options,
      direction: this.nxpTooltipDirection() ?? this.options.direction,
      align: this.nxpTooltipAlign() ?? this.options.align,
    };

    const childInjector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: NXP_TOOLTIP_HOST,
          useValue: this as unknown as NxpTooltipHost,
        },
        {
          provide: NxpRectAccessor,
          useValue: this,
        },
        {
          provide: NXP_TOOLTIP_OPTIONS,
          useValue: mergedOptions,
        },
      ],
    });

    const component = new PolymorpheusComponent(
      NxpTooltipComponent,
      childInjector,
    );
    this.componentRef = this.portalService.add(component);
    this.cdr.markForCheck();
  }

  hide(): void {
    this.hideAnimated();
  }

  ngOnDestroy(): void {
    this.clearTimers();
    // On directive teardown, destroy immediately — no exit animation
    this.destroyTooltip();
  }

  private hideAnimated(): void {
    if (!this.componentRef) return;
    const ref = this.componentRef;
    this.componentRef = null;
    this.exitingRef = ref;

    // Asymmetric exit: quick 100ms linear fade-out before destroying
    const el = ref.location.nativeElement as HTMLElement;
    const direction = ref.instance.resolvedDirection ?? this.nxpTooltipDirection() ?? 'top';
    const slideOffset = SLIDE_OFFSET[direction as keyof typeof SLIDE_OFFSET] ?? SLIDE_OFFSET.top;

    el.style.transition = `opacity ${EXIT_DURATION_MS}ms linear, transform ${EXIT_DURATION_MS}ms linear`;
    el.style.opacity = '0';
    el.style.transform = `translate(${slideOffset.x}px, ${slideOffset.y}px)`;

    this.exitTimer = setTimeout(() => {
      this.exitTimer = null;
      this.exitingRef = null;
      ref.destroy();
      this.cdr.markForCheck();
    }, EXIT_DURATION_MS);
  }

  private destroyTooltip(): void {
    if (this.exitTimer !== null) {
      clearTimeout(this.exitTimer);
      this.exitTimer = null;
    }
    this.exitingRef?.destroy();
    this.exitingRef = null;
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private clearTimers(): void {
    if (this.showTimer !== null) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }
}
