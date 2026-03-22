import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NxpTreeItemComponent } from './tree-item.component';
import { NxpTreeItemContentComponent } from './tree-item-content.component';
import { NXP_TREE_LEVEL, NXP_TREE_NODE } from './tree.tokens';
import type { NxpTreeHandler, NxpTreeItemContext } from './tree.interfaces';

/** Default children extractor: returns the item if it is an array, otherwise empty. */
const DEFAULT_CHILDREN_HANDLER: NxpTreeHandler<unknown> = (item: unknown) =>
  Array.isArray(item) ? (item as unknown[]) : [];

/**
 * Recursive tree container. Renders a node for the given value and then
 * recursively renders child nxp-tree instances for each child returned by
 * the childrenHandler.
 *
 * NXP_TREE_LEVEL is incremented at each nxp-tree level so that child
 * NxpTreeItemComponent instances receive the correct depth.
 *
 * @example
 * <nxp-tree [value]="rootNode" [childrenHandler]="getChildren" [content]="nodeTemplate" />
 * <ng-template #nodeTemplate let-item>
 *   <nxp-tree-item-content>{{ item.name }}</nxp-tree-item-content>
 * </ng-template>
 */
@Component({
  selector: 'nxp-tree',
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  imports: [NgTemplateOutlet, NxpTreeItemComponent, NxpTreeItemContentComponent, forwardRef(() => NxpTreeComponent)],
  template: `
    @if (value() !== undefined) {
      <nxp-tree-item>
        @if (content()) {
          <nxp-tree-item-content>
            <ng-container
              [ngTemplateOutlet]="content()!"
              [ngTemplateOutletContext]="itemContext()"
            />
          </nxp-tree-item-content>
        } @else {
          <nxp-tree-item-content>{{ value() }}</nxp-tree-item-content>
        }

        @for (child of children(); track $index) {
          <nxp-tree
            [value]="child"
            [childrenHandler]="childrenHandler()"
            [content]="content()"
          />
        }
      </nxp-tree-item>
    }
  `,
  host: {
    role: 'tree',
  },
  providers: [
    {
      provide: NXP_TREE_NODE,
      useExisting: NxpTreeComponent,
    },
    {
      provide: NXP_TREE_LEVEL,
      useFactory: () => {
        const parentLevel = inject(NXP_TREE_LEVEL, { skipSelf: true, optional: true });
        return (parentLevel ?? -1) + 1;
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpTreeComponent<T = unknown> {
  /** The data item this tree node represents. */
  readonly value = input<T>();

  /**
   * Function that returns the children of a given data item.
   * Defaults to treating arrays as children lists.
   */
  readonly childrenHandler = input<NxpTreeHandler<T>>(
    DEFAULT_CHILDREN_HANDLER as NxpTreeHandler<T>,
  );

  /**
   * Optional TemplateRef for rendering each node's content.
   * The template context is NxpTreeItemContext<T> ($implicit = value, node = NxpTreeItemComponent).
   * If omitted, the value is rendered as text.
   */
  readonly content = input<TemplateRef<NxpTreeItemContext<T>> | null>(null);

  /** Resolved children for the current value. */
  readonly children = computed(() => {
    const v = this.value();
    if (v === undefined) return [];
    return this.childrenHandler()(v);
  });

  /** Template context passed to the content template. */
  readonly itemContext = computed(
    (): NxpTreeItemContext<T> => ({
      $implicit: this.value() as T,
      // The NxpTreeItemComponent instance is not directly accessible here;
      // consumers needing it should use contentChild inside a custom template component.
      node: null as unknown as NxpTreeItemComponent,
    }),
  );
}
