import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  model,
} from '@angular/core';
import { NxpAnimatedProximityBase, type NxpItemRect } from '@nxp/cdk';
import { NxpMenuItemDirective } from './menu-item.directive';

/**
 * Animated menu surface — port of
 * `fluidfunctionalizm/registry/default/dropdown.tsx`. Renders three animated
 * indicator layers (selected background, hover background, focus ring) over
 * `[nxpMenuItem]` children, using proximity-hover tracking from
 * `@nxp/cdk`'s `NxpAnimatedProximityBase`.
 *
 * Typically rendered as content inside an `NxpDropdown` portal panel, but
 * can be used standalone.
 *
 * @example
 * <nxp-menu [(checkedIndex)]="selected">
 *   <button nxpMenuItem>Profile</button>
 *   <button nxpMenuItem>Settings</button>
 *   <button nxpMenuItem>Sign out</button>
 * </nxp-menu>
 */
@Component({
  selector: 'nxp-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />

    @if (checkedRect(); as r) {
      <div
        class="absolute pointer-events-none rounded-md bg-gray-500/15 dark:bg-gray-400/20"
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
    role: 'menu',
    class:
      'relative flex flex-col gap-0.5 p-1 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-[0_4px_12px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] select-none',
    '(mousemove)': 'onMouseMove($event)',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'onFocusOut()',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class NxpMenuComponent
  extends NxpAnimatedProximityBase
  implements AfterViewChecked
{
  /** Two-way bound index of the currently selected menu item (radio-group style). */
  readonly checkedIndex = model<number | null>(null);

  protected readonly axis = 'y' as const;

  /** Menu items projected as content. */
  protected readonly items = contentChildren(NxpMenuItemDirective);

  /** Rect of the checked item (not the hovered "active" one). */
  protected readonly checkedRect = computed<NxpItemRect | null>(() => {
    const idx = this.checkedIndex();
    return idx == null ? null : this.itemRects()[idx] ?? null;
  });

  constructor() {
    super();

    // Assign sequential indices and sync each item's `checked` from the model.
    effect(() => {
      const items = this.items();
      const checked = this.checkedIndex();
      items.forEach((item, i) => {
        item.index.set(i);
        item.checked.set(i === checked);
      });
    });

    // Listen for selection clicks and update the model.
    effect((onCleanup) => {
      const items = this.items();
      const subs = items.map((item) =>
        item.nxpMenuItemSelect.subscribe((i: number) => this.checkedIndex.set(i)),
      );
      onCleanup(() => subs.forEach((s) => s.unsubscribe()));
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
