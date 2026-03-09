import { InjectionToken, type Provider } from '@angular/core';

export type NxpChipSize = 'xs' | 's' | 'm';
export type NxpChipAppearance =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface NxpChipOptions {
  readonly size: NxpChipSize;
  readonly appearance: NxpChipAppearance;
}

export const NXP_CHIP_DEFAULT_OPTIONS: NxpChipOptions = {
  size: 's',
  appearance: 'neutral',
};

export const NXP_CHIP_OPTIONS = new InjectionToken<NxpChipOptions>(
  'NXP_CHIP_OPTIONS',
  { factory: () => NXP_CHIP_DEFAULT_OPTIONS },
);

export function nxpChipOptionsProvider(
  options: Partial<NxpChipOptions>,
): Provider {
  return {
    provide: NXP_CHIP_OPTIONS,
    useValue: { ...NXP_CHIP_DEFAULT_OPTIONS, ...options },
  };
}
