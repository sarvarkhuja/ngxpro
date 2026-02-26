import { type FactoryProvider, inject, type InjectionToken } from '@angular/core';

/**
 * Creates a factory provider that merges parent options with local overrides.
 * Pattern from Taiga UI's tuiProvideOptions.
 */
export function nxpProvideOptions<T>(
  provide: InjectionToken<T>,
  options: Partial<T> | (() => Partial<T>),
  fallback: T,
): FactoryProvider {
  return {
    provide,
    useFactory: (): T => ({
      ...(inject(provide, { optional: true, skipSelf: true }) || fallback),
      ...(inject(options as any, { optional: true }) ||
        (typeof options === 'function' ? options() : options)),
    }),
  };
}
