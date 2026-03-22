export { NxpTreeComponent } from './tree.component';
export { NxpTreeItemComponent } from './tree-item.component';
export { NxpTreeItemContentComponent } from './tree-item-content.component';
export { NxpTreeNodeDirective } from './tree-node.directive';
export { NxpTreeControllerDirective } from './tree-controller.directive';
export { NxpTreeItemControllerDirective } from './tree-item-controller.directive';
export type {
  NxpTreeController,
  NxpTreeAccessor,
  NxpTreeItemContext,
  NxpTreeHandler,
} from './tree.interfaces';
export {
  NXP_TREE_CONTROLLER,
  NXP_TREE_ACCESSOR,
  NXP_TREE_NODE,
  NXP_TREE_LEVEL,
} from './tree.tokens';

import { NxpTreeComponent } from './tree.component';
import { NxpTreeItemComponent } from './tree-item.component';
import { NxpTreeItemContentComponent } from './tree-item-content.component';
import { NxpTreeNodeDirective } from './tree-node.directive';
import { NxpTreeControllerDirective } from './tree-controller.directive';
import { NxpTreeItemControllerDirective } from './tree-item-controller.directive';

/** Convenience array of all tree-related declarations for easy import into NgModule or component imports. */
export const NxpTree = [
  NxpTreeComponent,
  NxpTreeItemComponent,
  NxpTreeItemContentComponent,
  NxpTreeNodeDirective,
  NxpTreeControllerDirective,
  NxpTreeItemControllerDirective,
] as const;
