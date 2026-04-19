import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { NxpTabsDirective } from './tabs.directive';
import { NxpTabsAnimatedBase } from './tabs-animated-base';

/**
 * Vertical tabs container with animated segment (pill) indicator.
 *
 * @example
 * <nxp-tabs vertical [(activeItemIndex)]="activeTab">
 *   <button nxpTab>Profile</button>
 *   <button nxpTab>Security</button>
 * </nxp-tabs>
 */
@Component({
  selector: 'nxp-tabs[vertical]',
  standalone: true,
  template: `
    <ng-content />

    @if (activeRect(); as r) {
      <div
        class="absolute pointer-events-none rounded-md bg-white dark:bg-gray-800 shadow-sm dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
        [style.left.px]="r.left"
        [style.top.px]="r.top"
        [style.width.px]="r.width"
        [style.height.px]="r.height"
        [style.opacity]="isHoveringOther() ? 0.85 : 1"
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
        class="absolute pointer-events-none z-20 rounded-md border border-blue-500"
        [style.left.px]="f.left - 2"
        [style.top.px]="f.top - 2"
        [style.width.px]="f.width + 4"
        [style.height.px]="f.height + 4"
        [style.transition]="hoverTransition"
      ></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NxpTabsDirective,
      inputs: ['activeItemIndex', 'size'],
      outputs: ['activeItemIndexChange'],
    },
  ],
  host: {
    class:
      'relative flex flex-col rounded-lg bg-gray-100 dark:bg-gray-800 p-1 gap-1',
    '(keydown.arrowDown.prevent)': 'onKeyDownArrow($event.target, 1)',
    '(keydown.arrowUp.prevent)': 'onKeyDownArrow($event.target, -1)',
    '(mousemove)': 'onMouseMove($event)',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'onFocusOut()',
    '(nxp-tab-activate)': 'onTabActivate($event)',
  },
})
export class NxpTabsVertical
  extends NxpTabsAnimatedBase
  implements AfterViewChecked
{
  protected readonly axis = 'y' as const;

  ngAfterViewChecked(): void {
    this.syncIfTabCountChanged();
  }

  protected onKeyDownArrow(current: EventTarget | null, step: number): void {
    if (current instanceof HTMLElement) {
      this.tabsDirective.moveFocus(current, step);
    }
  }
}
