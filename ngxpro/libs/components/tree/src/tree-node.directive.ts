import {
  Directive,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NXP_TREE_ACCESSOR } from './tree.tokens';
import { NxpTreeItemComponent } from './tree-item.component';

/**
 * Attribute directive applied to nxp-tree-item elements inside a controller-driven tree.
 * Registers the host NxpTreeItemComponent with the NxpTreeAccessor so the controller
 * can map component instances to data values.
 *
 * @example
 * <nxp-tree-item [nxpTreeNode]="item">...</nxp-tree-item>
 */
@Directive({
  selector: 'nxp-tree-item[nxpTreeNode]',
})
export class NxpTreeNodeDirective<T> implements OnInit, OnDestroy {
  /** The data value associated with this tree item. */
  readonly nxpTreeNode = input.required<T>();

  private readonly accessor = inject(NXP_TREE_ACCESSOR, { optional: true }) as {
    register(item: NxpTreeItemComponent, value: T): void;
    unregister(item: NxpTreeItemComponent): void;
  } | null;

  private readonly item = inject(NxpTreeItemComponent);

  public ngOnInit(): void {
    this.accessor?.register(this.item, this.nxpTreeNode());
  }

  public ngOnDestroy(): void {
    this.accessor?.unregister(this.item);
  }
}
