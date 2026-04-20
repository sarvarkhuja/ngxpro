import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  model,
} from '@angular/core';
import { NxpAnimatedProximityBase } from '@nxp/cdk';
import { NxpBlockDirective } from './block.directive';
import { NXP_BLOCK_GROUP } from './block.options';

/**
 * Animated block group — renders animated indicator overlays (selected pill,
 * hover background, focus ring) over `[nxpBlock]` children using
 * proximity-hover tracking from `@nxp/cdk`'s `NxpAnimatedProximityBase`.
 *
 * Wraps radio-style block selection with smooth animated transitions.
 *
 * @example
 * <nxp-block-group [(checkedIndex)]="selectedPlan">
 *   <label nxpBlock size="m">
 *     <input type="radio" name="plan" value="free" nxpRadio />
 *     <span>Free</span>
 *   </label>
 *   <label nxpBlock size="m">
 *     <input type="radio" name="plan" value="pro" nxpRadio />
 *     <span>Pro</span>
 *   </label>
 * </nxp-block-group>
 */
@Component({
  selector: 'nxp-block-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NXP_BLOCK_GROUP, useExisting: NxpBlockGroupComponent }],
  template: `
    <ng-content />

    @if (activeRect(); as r) {
      <div
        class="absolute pointer-events-none rounded-lg bg-gray-200/40 dark:bg-gray-700/30"
        [style.left.px]="r.left"
        [style.top.px]="r.top"
        [style.width.px]="r.width"
        [style.height.px]="r.height"
        [style.opacity]="isHoveringOther() ? 0.7 : 1"
        [style.transition]="segmentTransition"
      ></div>
    }
    @if (isHoveringOther()) {
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
  `,
  host: {
    class: 'relative flex flex-col gap-3',
    '(mousemove)': 'onMouseMove($event)',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'onFocusOut()',
    '(click)': 'onClickDetectRadio()',
  },
})
export class NxpBlockGroupComponent
  extends NxpAnimatedProximityBase
  implements AfterViewChecked
{
  /** Two-way bound index of the currently checked block (radio-group style). */
  readonly checkedIndex = model<number | null>(null);

  protected readonly axis = 'y' as const;

  /** Block items projected as content. */
  protected readonly blocks = contentChildren(NxpBlockDirective);

  protected override getItems(): readonly HTMLElement[] {
    return this.blocks().map((d) => d.element);
  }

  protected override resolveActiveIndex(): number | null {
    return this.checkedIndex();
  }

  /**
   * Override focusIn — block children are `<label>` elements but focus lands
   * on `<input>` inside. Use `contains()` to match the parent block element.
   */
  protected override onFocusIn(event: FocusEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const items = this.getItems();
    const idx = items.findIndex((el) => el.contains(target));
    if (idx === -1) return;

    this.hoveredIndex.set(idx);
    if (target.matches(':focus-visible')) {
      this.focusedIndex.set(idx);
    }
  }

  /** Detect radio selection on click and update checkedIndex. */
  protected onClickDetectRadio(): void {
    const items = this.getItems();
    for (let i = 0; i < items.length; i++) {
      const radio = items[i].querySelector('input[type=radio]:checked') as HTMLInputElement | null;
      if (radio) {
        this.checkedIndex.set(i);
        this.optimisticActive.set(i);
        this.remeasure();
        return;
      }
    }
  }

  ngAfterViewChecked(): void {
    this.syncIfItemCountChanged();
  }
}
