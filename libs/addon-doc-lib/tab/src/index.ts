export { NxpDocTabComponent } from './tab.component';

import { NxpDocTabComponent } from './tab.component';

/** Convenience tuple — `import { NxpDocTab } from '@ngxpro/addon-doc-lib/tab';`. */
export const NxpDocTab = [NxpDocTabComponent] as const;

/**
 * Re-export of the functional tab-list directive used by `<nxp-doc-page>` and
 * `<nxp-doc-example>` for their segmented tab strips.
 */
export { NxpTabDirective as NxpDocTabDirective } from '@ngxpro/components/tabs';
