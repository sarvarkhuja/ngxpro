import { InjectionToken, type Provider } from '@angular/core';

/**
 * Property names to omit from the auto-generated API table (e.g. inherited
 * properties not relevant to this component). Mirrors
 * `TUI_DOC_EXCLUDED_PROPERTIES`.
 */
export const NXP_DOC_EXCLUDED_PROPERTIES = new InjectionToken<Set<string>>(
  'NXP_DOC_EXCLUDED_PROPERTIES',
  { factory: () => new Set() },
);

export function nxpDocExcludeProperties(
  properties: readonly string[],
): Provider {
  return {
    provide: NXP_DOC_EXCLUDED_PROPERTIES,
    useValue: new Set(properties),
  };
}
