import {
  afterNextRender,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import {
  NXP_SPRING_FAST,
  NXP_SPRING_MODERATE,
  nxpBuildTransition,
} from '../constants/motion';
import {
  nxpFindProximityIndex,
  nxpMeasureItems,
  type NxpItemRect,
} from '../utils/proximity-hover';

/** Pre-built transition string for moderate-spring indicators (active segment). */
const SEGMENT_TRANSITION = nxpBuildTransition(NXP_SPRING_MODERATE);

/** Pre-built transition string for fast-spring indicators (hover / focus). */
const HOVER_TRANSITION = nxpBuildTransition(NXP_SPRING_FAST);

/**
 * Framework-agnostic base class for components that render animated
 * indicator layers (selected / hover / focus) over a list of items and track
 * the hovered item by pointer proximity.
 *
 * Subclasses only need to declare their axis and provide the list of item
 * elements to measure. All measurement, proximity detection, rAF throttling,
 * ResizeObserver wiring and signal state is handled here.
 *
 * Consumers: `NxpTabsAnimatedBase` (tabs), `NxpMenuComponent` (menu),
 * `DataListComponent` (data-list).
 */
@Directive()
export abstract class NxpAnimatedProximityBase {
  protected readonly hostEl = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  /** Axis along which proximity is measured. */
  protected abstract readonly axis: 'x' | 'y';

  /** Subclass hook — current list of item elements to measure. */
  protected abstract getItems(): readonly HTMLElement[];

  // ─── signals ──────────────────────────────────────────────────────────

  /** Current measured rects for all items. */
  protected readonly itemRects = signal<readonly NxpItemRect[]>([]);

  /** Index of the item currently being hovered (mouse or focus-tracked). */
  protected readonly hoveredIndex = signal<number | null>(null);

  /** Index of the item with visible keyboard focus. */
  protected readonly focusedIndex = signal<number | null>(null);

  /**
   * Optimistic active index — set synchronously on activation so the active
   * pill starts moving in the same frame, before any model update. Cleared
   * on next measurement.
   */
  protected readonly optimisticActive = signal<number | null>(null);

  // ─── computed state ───────────────────────────────────────────────────

  /**
   * Subclass hook — resolve the committed active index (non-optimistic).
   * Override to back the active state with an external model.
   * Must be a reactive read (signal access) for `activeIdx` to recompute.
   */
  protected resolveActiveIndex(): number | null {
    return null;
  }

  /** The effective active index (optimistic wins, else the subclass hook). */
  protected readonly activeIdx = computed<number | null>(
    () => this.optimisticActive() ?? this.resolveActiveIndex(),
  );

  /** Rect of the active item, or null. */
  protected readonly activeRect = computed<NxpItemRect | null>(() => {
    const idx = this.activeIdx();
    return idx === null ? null : this.itemRects()[idx] ?? null;
  });

  /** Rect of the hovered item, or null. */
  protected readonly hoverRect = computed<NxpItemRect | null>(() => {
    const idx = this.hoveredIndex();
    return idx === null ? null : this.itemRects()[idx] ?? null;
  });

  /** Rect of the focused item, or null. */
  protected readonly focusRect = computed<NxpItemRect | null>(() => {
    const idx = this.focusedIndex();
    return idx === null ? null : this.itemRects()[idx] ?? null;
  });

  /** True when hovering an item that is not the active one. */
  protected readonly isHoveringOther = computed(() => {
    const h = this.hoveredIndex();
    return h !== null && h !== this.activeIdx();
  });

  // ─── transition strings (module-level constants) ──────────────────────

  /** Spring-ish transition for the active segment pill (moderate). */
  protected readonly segmentTransition = SEGMENT_TRANSITION;

  /** Fast transition for hover + focus indicators. */
  protected readonly hoverTransition = HOVER_TRANSITION;

  // ─── lifecycle ────────────────────────────────────────────────────────

  private rafId: number | null = null;
  private lastItemCount = -1;
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    afterNextRender(
      () => {
        this.remeasure();

        if (typeof ResizeObserver !== 'undefined') {
          this.resizeObserver = new ResizeObserver(() => this.remeasure());
          this.resizeObserver.observe(this.hostEl);
        }
      },
      { injector: this.injector },
    );

    this.destroyRef.onDestroy(() => {
      if (this.rafId !== null) cancelAnimationFrame(this.rafId);
      this.resizeObserver?.disconnect();
    });
  }

  /** Re-measure if the item count has changed since last sync. */
  protected syncIfItemCountChanged(): void {
    const count = this.getItems().length;
    if (count !== this.lastItemCount) {
      this.lastItemCount = count;
      this.remeasure();
    }
  }

  /** Rebuild the measured rects from the current DOM. */
  protected remeasure(): void {
    const items = this.getItems();
    this.lastItemCount = items.length;
    this.itemRects.set(nxpMeasureItems(this.hostEl, items));
    this.optimisticActive.set(null);
  }

  // ─── host handlers ────────────────────────────────────────────────────

  protected onMouseMove(event: MouseEvent): void {
    const { clientX, clientY } = event;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.hoveredIndex.set(
        nxpFindProximityIndex(this.hostEl, this.itemRects(), clientX, clientY, this.axis),
      );
    });
  }

  protected onMouseLeave(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.hoveredIndex.set(null);
  }

  protected onFocusIn(event: FocusEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const idx = this.getItems().indexOf(target);
    if (idx === -1) return;

    this.hoveredIndex.set(idx);
    if (target.matches(':focus-visible')) {
      this.focusedIndex.set(idx);
    }
  }

  protected onFocusOut(): void {
    this.focusedIndex.set(null);
    if (!this.hostEl.matches(':hover')) {
      this.hoveredIndex.set(null);
    }
  }
}
