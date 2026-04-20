import { InjectionToken, type Type } from '@angular/core';

export { NXP_DROPDOWN_CONTEXT } from './dropdown-context.token';

/**
 * Token providing the component class used to render dropdowns.
 * Provided by NxpRootComponent. Override to use a custom dropdown.
 */
export const NXP_DROPDOWN_COMPONENT = new InjectionToken<Type<unknown>>(
  ngDevMode ? 'NXP_DROPDOWN_COMPONENT' : '',
);
