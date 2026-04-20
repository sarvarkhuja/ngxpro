import { InjectionToken, type Provider, type Type } from '@angular/core';

/**
 * Token for providing a custom option content component inside a data-list.
 * Allows combo-box or select components to override how each option is rendered.
 *
 * @example
 * providers: [nxpAsOptionContent(NxpComboboxOptionComponent)]
 */
export const NXP_OPTION_CONTENT = new InjectionToken<Type<unknown>>(
  'NXP_OPTION_CONTENT',
);

/**
 * Provider helper — registers a component as the option content renderer.
 *
 * @example
 * providers: [nxpAsOptionContent(NxpComboboxOptionComponent)]
 */
export function nxpAsOptionContent(component: Type<unknown>): Provider {
  return {
    provide: NXP_OPTION_CONTENT,
    useValue: component,
  };
}
