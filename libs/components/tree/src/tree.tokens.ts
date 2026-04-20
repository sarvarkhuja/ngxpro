import { InjectionToken } from '@angular/core';
import type { NxpTreeController, NxpTreeAccessor } from './tree.interfaces';
import type { NxpTreeComponent } from './tree.component';

/** Default controller: all items are expanded. */
const DEFAULT_CONTROLLER: NxpTreeController = {
  isExpanded: () => true,
  toggle: () => {},
};

/** Token providing the expand/collapse controller for tree items. */
export const NXP_TREE_CONTROLLER = new InjectionToken<NxpTreeController>(
  ngDevMode ? 'NXP_TREE_CONTROLLER' : '',
  { factory: () => DEFAULT_CONTROLLER },
);

/** Token providing the accessor that maps tree item components to data values. */
export const NXP_TREE_ACCESSOR = new InjectionToken<NxpTreeAccessor<unknown>>(
  ngDevMode ? 'NXP_TREE_ACCESSOR' : '',
);

/** Token referencing the nearest ancestor NxpTreeComponent (tree root node). */
export const NXP_TREE_NODE = new InjectionToken<NxpTreeComponent>(
  ngDevMode ? 'NXP_TREE_NODE' : '',
);

/** Token tracking the current nesting depth. Starts at -1 at the root so that top-level tree items are at level 0. */
export const NXP_TREE_LEVEL = new InjectionToken<number>(
  ngDevMode ? 'NXP_TREE_LEVEL' : '',
  { factory: () => -1 },
);
