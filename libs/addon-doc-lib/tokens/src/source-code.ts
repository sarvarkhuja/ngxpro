import { InjectionToken, type TemplateRef } from '@angular/core';
import type { NxpDocSourceCodePathOptions } from '@ngxpro/addon-doc-lib/types';

/**
 * Source-code link target. Either a `TemplateRef` whose context is
 * `NxpDocSourceCodePathOptions`, or a literal URL string. `null` hides the
 * "Source code" button.
 */
export const NXP_DOC_SOURCE_CODE = new InjectionToken<
  TemplateRef<NxpDocSourceCodePathOptions> | string | null
>('NXP_DOC_SOURCE_CODE', { factory: () => null });
