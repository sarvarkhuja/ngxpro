import { InjectionToken } from '@angular/core';

/**
 * Groups of related page titles. Each group is a list of titles that should
 * cross-link in the "See also" section of `<nxp-doc-toc>`.
 */
export const NXP_DOC_SEE_ALSO = new InjectionToken<
  ReadonlyArray<readonly string[]>
>('NXP_DOC_SEE_ALSO', { factory: () => [] });
