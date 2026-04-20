import { type FactoryProvider, InjectionToken } from '@angular/core';
import { nxpProvideOptions } from './provide-options';

/**
 * Creates an options token and a provider factory for component options.
 * Returns [token, providerFn] tuple. Pattern from Taiga UI's tuiCreateOptions.
 */
export function nxpCreateOptions<T>(defaults: T): [
  token: InjectionToken<T>,
  provider: (item: Partial<T> | (() => Partial<T>)) => FactoryProvider,
] {
  const token = new InjectionToken<T>(ngDevMode ? 'NXP Options token' : '', {
    factory: () => defaults,
  });
  return [token, (options) => nxpProvideOptions(token, options, defaults)];
}
