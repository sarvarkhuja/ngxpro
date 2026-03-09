import { InjectionToken, type Provider } from '@angular/core';

export type NxpSegmentedSize = 'sm' | 'md' | 'lg';

export interface NxpSegmentedOptions {
  readonly size: NxpSegmentedSize;
}

export const NXP_SEGMENTED_DEFAULT_OPTIONS: NxpSegmentedOptions = {
  size: 'md',
};

export const NXP_SEGMENTED_OPTIONS = new InjectionToken<NxpSegmentedOptions>(
  'NXP_SEGMENTED_OPTIONS',
  { factory: () => NXP_SEGMENTED_DEFAULT_OPTIONS },
);

export function nxpSegmentedOptionsProvider(
  options: Partial<NxpSegmentedOptions>,
): Provider {
  return {
    provide: NXP_SEGMENTED_OPTIONS,
    useValue: { ...NXP_SEGMENTED_DEFAULT_OPTIONS, ...options },
  };
}
