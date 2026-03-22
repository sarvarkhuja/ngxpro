import { Directive } from '@angular/core';
import { nxpProvide } from '@nxp/cdk';
import { NXP_TREE_CONTROLLER } from './tree.tokens';
import type { NxpTreeController } from './tree.interfaces';
import { NxpTreeItemComponent } from './tree-item.component';

/**
 * Simple fallback controller that tracks expansion state per component instance
 * using a WeakMap. Use this when you do not need to correlate expanded state
 * with external data values.
 *
 * Applied when nxpTreeController is present but no [map] binding is given.
 *
 * @example
 * <div nxpTreeController>
 *   <nxp-tree [value]="root" [childrenHandler]="getChildren" />
 * </div>
 */
@Directive({
  selector: '[nxpTreeController]:not([map])',
  providers: [nxpProvide(NXP_TREE_CONTROLLER, NxpTreeItemControllerDirective)],
})
export class NxpTreeItemControllerDirective implements NxpTreeController {
  private readonly stateMap = new WeakMap<NxpTreeItemComponent, boolean>();

  isExpanded(item: NxpTreeItemComponent): boolean {
    return this.stateMap.get(item) ?? false;
  }

  toggle(item: NxpTreeItemComponent): void {
    const next = !this.stateMap.get(item);
    this.stateMap.set(item, next);
  }
}
