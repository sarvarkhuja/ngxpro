import { InjectionToken, type Provider, type Type } from '@angular/core';

/**
 * Interface implemented by components that act as a host for a selectable
 * data-list (e.g. nxp-textfield, nxp-select).
 * Options inject this token and call `handleOption` when clicked — no direct
 * accessor/control DI needed, so it works reliably through portal boundaries.
 */
export interface NxpDataListHost<T = unknown> {
  handleOption(option: T): void;
}

/**
 * Token identifying the host component that owns a data-list.
 * Injected by option components to communicate selection back to the host.
 */
export const NXP_DATA_LIST_HOST = new InjectionToken<NxpDataListHost<unknown>>(
  'NXP_DATA_LIST_HOST',
);

/**
 * Provider helper — registers a component as the data-list host.
 *
 * @example
 * providers: [nxpAsDataListHost(NxpTextfieldComponent)]
 */
export function nxpAsDataListHost<T>(
  component: Type<NxpDataListHost<T>>,
): Provider {
  return {
    provide: NXP_DATA_LIST_HOST,
    useExisting: component,
  };
}
