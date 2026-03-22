import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  type DoCheck,
  inject,
  signal,
} from '@angular/core';
import { ExpandComponent } from '@nxp/cdk';
import { NXP_TREE_CONTROLLER, NXP_TREE_LEVEL, NXP_TREE_NODE } from './tree.tokens';

/**
 * Node wrapper for a single tree item. Handles expandability detection and
 * tracks expanded state through the injected NxpTreeController.
 *
 * Uses ngDoCheck (like Taiga) to bridge non-reactive controller state
 * (WeakMap/Map) into Angular signals on every change detection cycle.
 *
 * Queries contentChildren(NXP_TREE_NODE) — the token provided by NxpTreeComponent —
 * because child <nxp-tree> elements are content-projected into this component,
 * while their inner <nxp-tree-item> instances are view children of <nxp-tree>.
 */
@Component({
  selector: 'nxp-tree-item',
  imports: [ExpandComponent],
  template: `
    <ng-content select="nxp-tree-item-content" />
    <nxp-expand [expanded]="expandable() ? expanded() : true">
      <div class="overflow-hidden">
        <ng-content />
      </div>
    </nxp-expand>
  `,
  host: {
    class: 'block',
    role: 'treeitem',
    '[attr.aria-expanded]': 'expandable() ? expanded() : null',
    '[attr.data-level]': 'level',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpTreeItemComponent implements DoCheck {
  private readonly controller = inject(NXP_TREE_CONTROLLER);

  /** Nesting depth provided by the parent tree component. */
  readonly level = inject(NXP_TREE_LEVEL);

  /**
   * Child NxpTreeComponent instances detected via the NXP_TREE_NODE token.
   * Child <nxp-tree> elements ARE content children (projected via ng-content),
   * and each provides NXP_TREE_NODE — so this query finds them correctly.
   */
  private readonly childNodes = contentChildren(NXP_TREE_NODE);

  /** Whether this node has children and can be expanded/collapsed. */
  readonly expandable = computed(() => this.childNodes().length > 0);

  /** Whether this item is currently expanded. Updated via ngDoCheck. */
  readonly expanded = signal(false);

  /**
   * Bridge non-reactive controller state into the expanded signal.
   * The controller uses WeakMap/Map internally — not signals — so we
   * re-read on every CD cycle (same pattern as Taiga's TuiTreeItem).
   */
  ngDoCheck(): void {
    this.expanded.set(this.controller.isExpanded(this));
  }

  /** Toggle expand/collapse via the injected controller. */
  toggle(): void {
    if (this.expandable()) {
      this.controller.toggle(this);
    }
  }
}
