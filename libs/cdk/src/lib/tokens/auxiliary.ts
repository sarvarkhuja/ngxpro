import {
  computed,
  inject,
  InjectionToken,
  type Provider,
  type Signal,
  type Type,
} from '@angular/core';

/**
 * Multi-provider token for auxiliary components attached to a host (e.g. a textfield).
 * Each auxiliary registers itself via {@link nxpAsAuxiliary}.
 */
export const NXP_AUXILIARY = new InjectionToken<unknown[]>('NXP_AUXILIARY');

/**
 * Provider helper — registers a component as an auxiliary on the nearest host.
 *
 * @example
 * providers: [nxpAsAuxiliary(NxpClearComponent)]
 */
export function nxpAsAuxiliary(component: Type<unknown>): Provider {
  return {
    provide: NXP_AUXILIARY,
    useExisting: component,
    multi: true,
  };
}

/**
 * Injects all auxiliary components from the current injector tree and returns
 * a computed signal resolving to the first one satisfying the given predicate.
 *
 * @example
 * readonly clear = nxpInjectAuxiliary((x): x is NxpClearComponent => x instanceof NxpClearComponent);
 */
export function nxpInjectAuxiliary<T>(
  predicate: (x: unknown) => x is T,
): Signal<T | undefined>;
export function nxpInjectAuxiliary<T>(
  predicate: (x: unknown) => boolean,
): Signal<T | undefined>;
export function nxpInjectAuxiliary<T>(
  predicate: (x: unknown) => boolean,
): Signal<T | undefined> {
  const auxiliaries =
    (inject(NXP_AUXILIARY, { optional: true }) as unknown[] | null) ?? [];
  return computed(() => auxiliaries.find(predicate) as T | undefined);
}
