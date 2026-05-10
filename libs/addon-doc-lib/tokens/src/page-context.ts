import { InjectionToken, type Signal } from '@angular/core';

/**
 * Lightweight page context exposed by `<nxp-doc-page>` so descendants like
 * `<nxp-doc-toc>` can read the current page header without importing the
 * `NxpDocPageComponent` class directly (which would create a hard cycle
 * between the `toc` and `page` entry points).
 *
 * The page component provides this token via DI; consumers `inject(NXP_DOC_PAGE_CONTEXT, { optional: true })`.
 */
export interface NxpDocPageContext {
  readonly header: Signal<string>;
}

export const NXP_DOC_PAGE_CONTEXT = new InjectionToken<NxpDocPageContext>(
  'NXP_DOC_PAGE_CONTEXT',
);
