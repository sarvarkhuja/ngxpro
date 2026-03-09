import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { NXP_TABS_OPTIONS } from './tabs.options';
import { NxpTabsDirective } from './tabs.directive';

/**
 * Horizontal tabs container.
 *
 * Renders a horizontal tab bar with an optional animated underline indicator.
 * Use `[activeItemIndex]` for two-way binding on the active tab.
 *
 * @example
 * <nxp-tabs [(activeItemIndex)]="activeTab">
 *   <button nxpTab>Overview</button>
 *   <button nxpTab>Analytics</button>
 *   <button nxpTab>Settings</button>
 * </nxp-tabs>
 *
 * @example
 * <!-- No underline indicator -->
 * <nxp-tabs [underline]="false" size="lg">
 *   <button nxpTab>Tab A</button>
 *   <button nxpTab>Tab B</button>
 * </nxp-tabs>
 *
 * @example
 * <!-- With tab panels -->
 * <nxp-tabs [(activeItemIndex)]="tab">
 *   <button nxpTab>Profile</button>
 *   <button nxpTab>Billing</button>
 * </nxp-tabs>
 * @if (tab === 0) { <div>Profile content</div> }
 * @if (tab === 1) { <div>Billing content</div> }
 */
@Component({
  selector: 'nxp-tabs:not([vertical])',
  standalone: true,
  template: `
    <ng-content />
    @if (underline()) {
      <div
        class="absolute bottom-0 h-0.5 bg-primary-hover transition-all duration-200 pointer-events-none"
        [style.left.px]="underlineLeft()"
        [style.width.px]="underlineWidth()"
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
    class: 'relative flex flex-row overflow-x-auto border-b border-gray-200 dark:border-gray-700',
    '(keydown.arrowRight.prevent)': 'onKeyDownArrow($event.target, 1)',
    '(keydown.arrowLeft.prevent)': 'onKeyDownArrow($event.target, -1)',
  },
})
export class NxpTabsHorizontal implements AfterViewChecked {
  private readonly tabs = inject(NxpTabsDirective);
  private readonly options = inject(NXP_TABS_OPTIONS);

  /** Show an animated underline indicator beneath the active tab. */
  readonly underline = input(this.options.underline);

  protected readonly underlineLeft = signal(0);
  protected readonly underlineWidth = signal(0);

  ngAfterViewChecked(): void {
    this.refresh();
  }

  protected onKeyDownArrow(current: EventTarget | null, step: number): void {
    if (current instanceof HTMLElement) {
      this.tabs.moveFocus(current, step);
    }
  }

  private refresh(): void {
    const { activeElement } = this.tabs;
    this.underlineLeft.set(activeElement?.offsetLeft ?? 0);
    this.underlineWidth.set(activeElement?.offsetWidth ?? 0);
  }
}
