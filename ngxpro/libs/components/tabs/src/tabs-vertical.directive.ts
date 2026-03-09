import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NxpTabsDirective } from './tabs.directive';

/**
 * Vertical tabs container.
 *
 * Renders a vertical tab list with a right border separator.
 * Add the `vertical` attribute to `nxp-tabs` to activate this variant.
 * Use `[activeItemIndex]` for two-way binding on the active tab.
 *
 * @example
 * <div class="flex gap-4">
 *   <nxp-tabs vertical [(activeItemIndex)]="activeTab">
 *     <button nxpTab>Profile</button>
 *     <button nxpTab>Security</button>
 *     <button nxpTab>Notifications</button>
 *   </nxp-tabs>
 *   <div class="flex-1">
 *     @if (activeTab === 0) { <div>Profile panel</div> }
 *     @if (activeTab === 1) { <div>Security panel</div> }
 *     @if (activeTab === 2) { <div>Notifications panel</div> }
 *   </div>
 * </div>
 */
@Component({
  selector: 'nxp-tabs[vertical]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NxpTabsDirective,
      inputs: ['activeItemIndex', 'size'],
      outputs: ['activeItemIndexChange'],
    },
  ],
  host: {
    class: 'flex flex-col border-r border-gray-200 dark:border-gray-700',
    '(keydown.arrowDown.prevent)': 'onKeyDownArrow($event.target, 1)',
    '(keydown.arrowUp.prevent)': 'onKeyDownArrow($event.target, -1)',
  },
})
export class NxpTabsVertical {
  private readonly tabs = inject(NxpTabsDirective);

  protected onKeyDownArrow(current: EventTarget | null, step: number): void {
    if (current instanceof HTMLElement) {
      this.tabs.moveFocus(current, step);
    }
  }
  
}
