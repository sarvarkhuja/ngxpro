import { InjectionToken } from '@angular/core';

/**
 * Document `<title>` prefix prepended to each page title.
 */
export const NXP_DOC_TITLE = new InjectionToken<string>('NXP_DOC_TITLE', {
  factory: () => '',
});
