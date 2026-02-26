import { InjectionToken, type Type } from '@angular/core';
import { type NxpDropdownComponent } from './dropdown.component';

/**
 * Token providing the component class used to render dropdowns.
 * Override to use a custom dropdown component.
 */
export const NXP_DROPDOWN_COMPONENT = new InjectionToken<Type<NxpDropdownComponent>>(
  ngDevMode ? 'NXP_DROPDOWN_COMPONENT' : '',
);

/**
 * Token providing additional context data for the dropdown component.
 */
export const NXP_DROPDOWN_CONTEXT = new InjectionToken<Record<string, unknown>>(
  ngDevMode ? 'NXP_DROPDOWN_CONTEXT' : '',
);
