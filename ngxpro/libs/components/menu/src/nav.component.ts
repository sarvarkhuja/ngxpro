import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
} from '@angular/core';
import { NxpAnimatedProximityBase, type NxpItemRect } from '@nxp/cdk';
import { NxpNavItemDirective } from './nav-item.directive';

/**
 * Router-aware sidebar navigation surface. A peer of `NxpMenuComponent`
 * sharing the same `NxpAnimatedProximityBase` machinery, but with its own
 * static host metadata and item query so the two coexist cleanly.
 *
 * Active state flows in from each `a[nxpNavItem]` (driven by
 * `Router.isActive()`), never out. There is no `checkedIndex` model.
 *
 * @example
 * <nxp-nav>
 *   <a nxpNavItem routerLink="/home">Home</a>
 *   <a nxpNavItem routerLink="/about">About</a>
 * </nxp-nav>
 */
@Component({
  selector: 'nxp-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />

    @if (checkedRect(); as r) {
      <div
        class="absolute pointer-events-none rounded-md bg-blue-500/15 dark:bg-blue-400/20"
        [style.left.px]="r.left"
        [style.top.px]="r.top"
        [style.width.px]="r.width"
        [style.height.px]="r.height"
        [style.opacity]="isHoveringOther() ? 0.8 : 1"
        [style.transition]="segmentTransition"
      ></div>
    }
    @if (isHoveringOther()) {
      @if (hoverRect(); as h) {
        <div
          class="absolute pointer-events-none rounded-md bg-gray-200/60 dark:bg-gray-700/40"
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
        class="absolute pointer-events-none z-20 rounded-md border border-[#6B97FF]"
        [style.left.px]="f.left - 2"
        [style.top.px]="f.top - 2"
        [style.width.px]="f.width + 4"
        [style.height.px]="f.height + 4"
        [style.transition]="hoverTransition"
      ></div>
    }
  `,
  host: {
    role: 'navigation',
    class: 'relative flex flex-col gap-0.5 w-full select-none',
    '(mousemove)': 'onMouseMove($event)',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'onFocusOut()',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class NxpNavComponent
  extends NxpAnimatedProximityBase
  implements AfterViewChecked
{
  protected readonly axis = 'y' as const;

  /** Nav items projected as content. */
  protected readonly items = contentChildren(NxpNavItemDirective);

  /** Active index derived from whichever item's router subscription flagged it. */
  protected readonly checkedIndex = computed<number | null>(() => {
    const idx = this.items().findIndex((i) => i.checked());
    return idx === -1 ? null : idx;
  });

  protected readonly checkedRect = computed<NxpItemRect | null>(() => {
    const idx = this.checkedIndex();
    return idx == null ? null : this.itemRects()[idx] ?? null;
  });

  constructor() {
    super();
    // Assign sequential indices for `[data-proximity-index]`.
    effect(() => {
      this.items().forEach((item, i) => item.index.set(i));
    });
  }

  protected override getItems(): readonly HTMLElement[] {
    return this.items().map((d) => d.element);
  }

  ngAfterViewChecked(): void {
    this.syncIfItemCountChanged();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const items = this.items();
    if (items.length === 0) return;

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const currentIdx = items.findIndex((d) => d.element === target);
    if (currentIdx === -1) return;

    const { key } = event;
    if (
      key === 'ArrowDown' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowLeft'
    ) {
      event.preventDefault();
      const forward = key === 'ArrowDown' || key === 'ArrowRight';
      const next = forward
        ? (currentIdx + 1) % items.length
        : (currentIdx - 1 + items.length) % items.length;
      items[next]?.element.focus();
    } else if (key === 'Home') {
      event.preventDefault();
      items[0]?.element.focus();
    } else if (key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.element.focus();
    }
  }
}
