import { InjectionToken, type ValueProvider } from '@angular/core';

export const NXP_FALLBACK_VALUE = new InjectionToken<any>('NXP_FALLBACK_VALUE', {
  factory: () => null,
});

export function nxpFallbackValueProvider<T>(useValue: T): ValueProvider {
  return { provide: NXP_FALLBACK_VALUE, useValue };
}
