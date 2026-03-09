import { InjectionToken, type Provider } from '@angular/core';

export type NxpTabsSize = 'sm' | 'md' | 'lg';

export interface NxpTabsOptions {
  readonly size: NxpTabsSize;
  readonly underline: boolean;
}

export const NXP_TABS_DEFAULT_OPTIONS: NxpTabsOptions = {
  size: 'md',
  underline: true,
};

export const NXP_TABS_OPTIONS = new InjectionToken<NxpTabsOptions>(
  'NXP_TABS_OPTIONS',
  { factory: () => NXP_TABS_DEFAULT_OPTIONS },
);

export function nxpTabsOptionsProvider(
  options: Partial<NxpTabsOptions>,
): Provider {
  return {
    provide: NXP_TABS_OPTIONS,
    useValue: { ...NXP_TABS_DEFAULT_OPTIONS, ...options },
  };
}
