import { Directive, inject } from '@angular/core';
import { NxpAnimatedProximityBase } from '@nxp/cdk';
import { NxpTabsDirective } from './tabs.directive';

/**
 * Shared implementation for animated tab containers (`NxpTabsHorizontal` and
 * `NxpTabsVertical`). Thin subclass of `NxpAnimatedProximityBase` — the
 * reusable indicator engine in `@nxp/cdk` — adding only the tab-specific
 * glue: item source (`tabsDirective.tabs`) and activation handler.
 *
 * Subclasses only differ in the axis (`'x'` vs `'y'`) used for proximity
 * detection and their host classes / template.
 */
@Directive()
export abstract class NxpTabsAnimatedBase extends NxpAnimatedProximityBase {
  protected readonly tabsDirective = inject(NxpTabsDirective);

  protected override resolveActiveIndex(): number | null {
    return this.tabsDirective.activeItemIndex();
  }

  protected override getItems(): readonly HTMLElement[] {
    return this.tabsDirective.tabs;
  }

  /** Re-measure if the tab count changed — called from host AfterViewChecked. */
  protected syncIfTabCountChanged(): void {
    this.syncIfItemCountChanged();
  }

  protected onTabActivate(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const idx = this.tabsDirective.tabs.indexOf(target);
    if (idx !== -1) {
      this.optimisticActive.set(idx);
      // Ensure rects reflect any layout changes the activation may cause.
      queueMicrotask(() => this.remeasure());
    }
  }
}
