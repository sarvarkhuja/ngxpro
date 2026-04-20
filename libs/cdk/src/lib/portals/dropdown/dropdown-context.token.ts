import { InjectionToken } from '@angular/core';

/**
 * Token providing additional context data for the dropdown component.
 */
export const NXP_DROPDOWN_CONTEXT = new InjectionToken<Record<string, unknown>>(
  ngDevMode ? 'NXP_DROPDOWN_CONTEXT' : '',
);
