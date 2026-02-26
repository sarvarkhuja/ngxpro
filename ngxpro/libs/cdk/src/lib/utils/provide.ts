import { type ExistingProvider, type ProviderToken } from '@angular/core';

/**
 * Creates an ExistingProvider that maps one token to another.
 * Useful for aliasing abstract classes to concrete implementations.
 */
export function nxpProvide<T>(
  provide: ProviderToken<T>,
  useExisting: ProviderToken<T>,
  multi = false,
): ExistingProvider {
  return { provide, useExisting, multi };
}
