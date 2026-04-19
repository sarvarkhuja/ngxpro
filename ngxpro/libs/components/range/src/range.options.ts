import { InjectionToken, type Provider } from '@angular/core';

export type NxpRangeSize = 's' | 'm' | 'l';

export interface NxpRangeOptions {
  readonly size: NxpRangeSize;
  readonly color: string;
}

export const NXP_RANGE_DEFAULT_OPTIONS: NxpRangeOptions = {
  size: 'm',
  color: 'primary',
};

export const NXP_RANGE_OPTIONS = new InjectionToken<NxpRangeOptions>(
  'NXP_RANGE_OPTIONS',
  { factory: () => NXP_RANGE_DEFAULT_OPTIONS },
);

export function nxpRangeOptionsProvider(
  options: Partial<NxpRangeOptions>,
): Provider {
  return {
    provide: NXP_RANGE_OPTIONS,
    useValue: { ...NXP_RANGE_DEFAULT_OPTIONS, ...options },
  };
}
