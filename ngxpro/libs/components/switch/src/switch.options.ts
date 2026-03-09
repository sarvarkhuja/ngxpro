import { InjectionToken, type Provider } from '@angular/core';

export type NxpSwitchSize = 's' | 'm' | 'l';
export type NxpSwitchColor = 'primary' | 'secondary' | 'danger';

export interface NxpSwitchOptions {
  readonly size: NxpSwitchSize;
  readonly color: NxpSwitchColor;
  readonly showIcons: boolean;
}

export const NXP_SWITCH_DEFAULT_OPTIONS: NxpSwitchOptions = {
  size: 'm',
  color: 'primary',
  showIcons: false,
};

export const NXP_SWITCH_OPTIONS = new InjectionToken<NxpSwitchOptions>(
  'NXP_SWITCH_OPTIONS',
  { factory: () => NXP_SWITCH_DEFAULT_OPTIONS },
);

export function nxpSwitchOptionsProvider(
  options: Partial<NxpSwitchOptions>,
): Provider {
  return {
    provide: NXP_SWITCH_OPTIONS,
    useValue: { ...NXP_SWITCH_DEFAULT_OPTIONS, ...options },
  };
}
