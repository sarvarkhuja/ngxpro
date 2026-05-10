import { InjectionToken } from '@angular/core';
import type { ActivatedRouteSnapshot } from '@angular/router';
import type { TemplateRef } from '@angular/core';

/**
 * Map of extra tab labels to their content (string or `TemplateRef`),
 * resolved per route. Defaults to no extra tabs.
 */
export const NXP_DOC_TABS = new InjectionToken<
  (
    snapshot: ActivatedRouteSnapshot,
  ) => Record<string, string | TemplateRef<unknown>>
>('NXP_DOC_TABS', { factory: () => () => ({}) });
