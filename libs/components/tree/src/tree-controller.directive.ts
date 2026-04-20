import {
  Directive,
  output,
} from '@angular/core';
import { nxpProvide } from '@nxp/cdk';
import { NXP_TREE_CONTROLLER, NXP_TREE_ACCESSOR } from './tree.tokens';
import type { NxpTreeController, NxpTreeAccessor } from './tree.interfaces';
import { NxpTreeItemComponent } from './tree-item.component';

/**
 * Controller directive that uses a Map<T, boolean> to track expansion state
 * by data value. Apply when you have a nxpTreeNode-registered tree and want
 * to persist expanded state per value identity.
 *
 * Implements both NxpTreeController and NxpTreeAccessor<T> so it can answer
 * isExpanded queries by looking up the component's registered value.
 *
 * @example
 * <div nxpTreeController [map]="expansionMap" (toggled)="onToggle($event)">
 *   <nxp-tree [value]="root" [childrenHandler]="getChildren" />
 * </div>
 */
@Directive({
  selector: '[nxpTreeController][map]',
  providers: [
    nxpProvide(NXP_TREE_CONTROLLER, NxpTreeControllerDirective),
    nxpProvide(NXP_TREE_ACCESSOR, NxpTreeControllerDirective as never),
  ],
})
export class NxpTreeControllerDirective<T>
  implements NxpTreeController, NxpTreeAccessor<T>
{
  /** Emits the data value of the item that was toggled. */
  readonly toggled = output<T>();

  /** Internal map from component instance → data value. */
  private readonly valueMap = new Map<NxpTreeItemComponent, T>();

  /** Internal map from data value → expanded flag. */
  private readonly expansionMap = new Map<T, boolean>();

  isExpanded(item: NxpTreeItemComponent): boolean {
    const value = this.valueMap.get(item);
    if (value === undefined) return false;
    // Default to collapsed if not explicitly set.
    return this.expansionMap.get(value) ?? false;
  }

  toggle(item: NxpTreeItemComponent): void {
    const value = this.valueMap.get(item);
    if (value === undefined) return;
    const next = !this.expansionMap.get(value);
    this.expansionMap.set(value, next);
    this.toggled.emit(value);
  }

  register(item: NxpTreeItemComponent, value: T): void {
    this.valueMap.set(item, value);
  }

  unregister(item: NxpTreeItemComponent): void {
    const value = this.valueMap.get(item);
    if (value !== undefined) {
      this.valueMap.delete(item);
    }
  }
}
