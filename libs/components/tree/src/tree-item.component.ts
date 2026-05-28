import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  type DoCheck,
  inject,
  signal,
} from '@angular/core';
import { ExpandComponent } from '@ngxpro/cdk';
import {
  NXP_TREE_CONTROLLER,
  NXP_TREE_LEVEL,
  NXP_TREE_NODE,
} from './tree.tokens';

/**
 * Node wrapper for a single tree item. Handles expandability detection and
 * tracks expanded state through the injected NxpTreeController.
 *
 * Uses ngDoCheck (like Taiga) to bridge non-reactive controller state
 * (WeakMap/Map) into Angular signals on every change detection cycle.
 *
 * Visual structure follows the Vercel/Geist language (see design-system.md):
 * - 1px hairline indent guidelines (`bg-border-normal`) connect a parent's
 *   chevron column through its expanded children — "shadow-as-border"
 *   applied as positive structure: lines exist where hierarchy exists.
 * - Guide left = `level * 16 + 14` (chevron icon center column).
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
      <div class="relative overflow-hidden">
        @if (showGuide()) {
          <span
            aria-hidden="true"
            class="pointer-events-none absolute top-0 bottom-0 w-px bg-border-normal"
            [style.left.px]="guidePx"
          ></span>
        }
        <ng-content />
      </div>
    </nxp-expand>
  `,
  host: {
    class: 'block',
    role: 'treeitem',
    '[attr.aria-expanded]': 'expandable() ? expanded() : null',
    '[attr.aria-level]': 'level + 1',
    '[attr.data-level]': 'level',
    '[attr.data-state]': 'stateAttr()',
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
   * Whether to paint the vertical indent guideline for this item's children.
   * Only expandable, in-tree items host a guide (root sentinel level=-1 is skipped).
   */
  readonly showGuide = computed(() => this.expandable() && this.level >= 0);

  /**
   * X-position (px) for the vertical guide line, aligned with the chevron
   * button's visual center.
   *
   * Row math (per tree-item-content):
   *   padding-left = level * 16 + 4
   *   chevron button = size-5 (20px) starting at padding-left
   *   chevron icon center = padding-left + 10 = level * 16 + 14
   */
  readonly guidePx = this.level * 16 + 14;

  /** State attribute exposed for consumer styling: `open`, `closed`, or null. */
  protected readonly stateAttr = computed<'open' | 'closed' | null>(() => {
    if (!this.expandable()) return null;
    return this.expanded() ? 'open' : 'closed';
  });

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
