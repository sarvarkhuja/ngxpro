import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChildren,
  effect,
  input,
  signal,
} from '@angular/core';
import {
  ExpandComponent,
  NxpAnimatedProximityBase,
  type NxpItemRect,
} from '@nxp/cdk';
import { AccordionDirective } from './accordion.directive';
import { AccordionItemComponent } from './accordion-item.component';

interface NxpAccordionOpenEntry {
  readonly index: number;
  readonly rect: NxpItemRect;
}

/**
 * Accordion component (Taiga architecture + fluidfunctionalizm motion).
 *
 * Directive-based: alternating `nxp-accordion-trigger[nxpAccordion]` (or
 * `button[nxpAccordion]`) and `nxp-expand` children. Paints three animated
 * layers over the children via proximity hover tracking:
 *
 * - **Open item backgrounds** — persistent rounded tint spanning the trigger
 *   + its expanded content; dims to 0.7 opacity when the pointer is hovering
 *   a different closed trigger.
 * - **Hover background** — fast-springing pill only visible while hovering a
 *   closed (collapsed) trigger.
 * - **Focus ring** — keyboard-focus outline that glides between triggers.
 *
 * @example
 * <nxp-accordion type="single">
 *   <nxp-accordion-trigger nxpAccordion>Section 1</nxp-accordion-trigger>
 *   <nxp-expand>Content here</nxp-expand>
 * </nxp-accordion>
 */
@Component({
  selector: 'nxp-accordion',
  template: `
    @for (entry of openRectEntries(); track entry.index) {
      <div
        class="absolute pointer-events-none rounded-lg bg-gray-200/40 dark:bg-gray-700/30"
        [style.left.px]="entry.rect.left"
        [style.top.px]="entry.rect.top"
        [style.width.px]="entry.rect.width"
        [style.height.px]="entry.rect.height"
        [style.opacity]="isHoveringClosed() ? 0.7 : 1"
        [style.transition]="segmentTransition"
      ></div>
    }
    @if (isHoveringClosed()) {
      @if (hoverRect(); as h) {
        <div
          class="absolute pointer-events-none rounded-lg bg-gray-200/60 dark:bg-gray-700/40"
          [style.left.px]="h.left"
          [style.top.px]="h.top"
          [style.width.px]="h.width"
          [style.height.px]="h.height"
          [style.transition]="hoverTransition"
        ></div>
      }
    }
    @if (focusRect(); as f) {
      <div
        class="absolute pointer-events-none z-20 rounded-lg border border-blue-500"
        [style.left.px]="f.left - 2"
        [style.top.px]="f.top - 2"
        [style.width.px]="f.width + 4"
        [style.height.px]="f.height + 4"
        [style.transition]="hoverTransition"
      ></div>
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative flex flex-col gap-0.5 w-72 max-w-full select-none',
    '(mousemove)': 'onMouseMove($event)',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'onFocusOut()',
    '(transitionend)': 'onExpandTransitionEnd($event)',
  },
})
export class AccordionComponent extends NxpAnimatedProximityBase {
  /** Whether only one item can be open at a time. */
  readonly closeOthers = input(false);

  /** Accordion type: 'single' or 'multiple'. */
  readonly type = input<'single' | 'multiple'>('multiple');

  readonly items = contentChildren(AccordionItemComponent);
  readonly directives = contentChildren(AccordionDirective);
  readonly expands = contentChildren(ExpandComponent);
  readonly expandElements = contentChildren(ExpandComponent, {
    read: ElementRef,
  });

  protected readonly axis = 'y' as const;

  /** Rects of currently-open items (union of trigger + paired expand). */
  protected readonly openRectEntries = signal<readonly NxpAccordionOpenEntry[]>(
    [],
  );

  /** True when the pointer is hovering a closed (non-open) trigger. */
  protected readonly isHoveringClosed = computed(() => {
    const h = this.hoveredIndex();
    if (h === null) return false;
    return !this.directives()[h]?.open();
  });

  constructor() {
    super();

    // Re-measure whenever any directive's open state changes.
    effect(() => {
      // Track reactivity on all open signals.
      this.directives().forEach((d) => d.open());
      queueMicrotask(() => this.remeasure());
    });
  }

  protected getItems(): readonly HTMLElement[] {
    return this.directives().map((d) => d.hostEl);
  }

  protected override remeasure(): void {
    super.remeasure();
    this.measureOpenRects();
  }

  private measureOpenRects(): void {
    const dirs = this.directives();
    const expandEls = this.expandElements();
    const entries: NxpAccordionOpenEntry[] = [];
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      if (!dir.open()) continue;
      const trigger = dir.hostEl;
      const expandEl = expandEls[i]?.nativeElement as HTMLElement | undefined;
      if (!trigger) continue;
      const top = trigger.offsetTop;
      const left = trigger.offsetLeft;
      const width = trigger.offsetWidth;
      const bottom = expandEl
        ? expandEl.offsetTop + expandEl.offsetHeight
        : trigger.offsetTop + trigger.offsetHeight;
      entries.push({
        index: i,
        rect: { top, left, width, height: bottom - top },
      });
    }
    this.openRectEntries.set(entries);
  }

  protected onExpandTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName !== 'grid-template-rows') return;
    this.measureOpenRects();
  }

  /** Close all accordion-item children except the specified one. */
  closeAllExcept(item: AccordionItemComponent): void {
    if (this.closeOthers() || this.type() === 'single') {
      for (const child of this.items()) {
        if (child !== item) child.close();
      }
    }
  }

  /** Toggle directive and sync expand. */
  toggleDirective(directive: AccordionDirective): void {
    const dirs = this.directives();
    const exps = this.expands();
    const idx = dirs.indexOf(directive);

    if (idx < 0 || idx >= exps.length) return;

    if (this.closeOthers() || this.type() === 'single') {
      if (directive.open()) {
        exps.forEach((exp) => exp.expanded.set(false));
        dirs.forEach((d) => {
          if (d !== directive) d.open.set(false);
        });
      }
    }

    exps[idx].expanded.set(!!directive.open());
  }
}
