import { InjectionToken } from '@angular/core';

/**
 * Default tab labels shown in `<nxp-doc-page>` when content children don't
 * specify their own. Mirrors `TUI_DOC_DEFAULT_TABS`.
 */
export const NXP_DOC_DEFAULT_TABS = new InjectionToken<readonly string[]>(
  'NXP_DOC_DEFAULT_TABS',
  { factory: () => [] },
);
