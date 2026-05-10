import { InjectionToken, type TemplateRef } from '@angular/core';

/**
 * Header logo. Either a string (used as an `<img src>`) or a `TemplateRef`
 * for fully custom markup. Default is `''` (no logo).
 */
export const NXP_DOC_LOGO = new InjectionToken<string | TemplateRef<unknown>>(
  'NXP_DOC_LOGO',
  { factory: () => '' },
);
