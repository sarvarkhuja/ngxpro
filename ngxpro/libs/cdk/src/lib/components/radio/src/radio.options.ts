import { InjectionToken, type Provider } from '@angular/core';

export interface NxpRadioOptions {
  readonly size: 's' | 'm' | 'l';
  readonly appearance: 'primary' | 'secondary';
}

export const NXP_RADIO_DEFAULT_OPTIONS: NxpRadioOptions = {
  size: 'm',
  appearance: 'primary',
};

export const NXP_RADIO_OPTIONS = new InjectionToken<NxpRadioOptions>(
  'NXP_RADIO_OPTIONS',
  { factory: () => NXP_RADIO_DEFAULT_OPTIONS },
);

export function nxpRadioOptionsProvider(
  options: Partial<NxpRadioOptions>,
): Provider {
  return {
    provide: NXP_RADIO_OPTIONS,
    useValue: { ...NXP_RADIO_DEFAULT_OPTIONS, ...options },
  };
}
