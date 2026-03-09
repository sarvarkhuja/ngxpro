import { NxpTabDirective } from './tab.directive';
import { NxpTabsDirective } from './tabs.directive';
import { NxpTabsHorizontal } from './tabs-horizontal.component';
import { NxpTabsVertical } from './tabs-vertical.directive';

/**
 * Convenience re-export array for importing all tabs directives/components at once.
 *
 * @example
 * // In your component's imports array:
 * imports: [NxpTabs]
 *
 * @example
 * // Or import individually:
 * imports: [NxpTabsHorizontal, NxpTabDirective]
 */
export const NxpTabs = [
  NxpTabDirective,
  NxpTabsDirective,
  NxpTabsHorizontal,
  NxpTabsVertical,
] as const;
