import { InjectionToken, type Provider } from '@angular/core';

export type NxpBadgeSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type NxpBadgeAppearance =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface NxpBadgeOptions {
  readonly size: NxpBadgeSize;
  readonly appearance: NxpBadgeAppearance;
}

export const NXP_BADGE_DEFAULT_OPTIONS: NxpBadgeOptions = {
  size: 'm',
  appearance: 'neutral',
};

export const NXP_BADGE_OPTIONS = new InjectionToken<NxpBadgeOptions>(
  'NXP_BADGE_OPTIONS',
  { factory: () => NXP_BADGE_DEFAULT_OPTIONS },
);

export function nxpBadgeOptionsProvider(
  options: Partial<NxpBadgeOptions>,
): Provider {
  return {
    provide: NXP_BADGE_OPTIONS,
    useValue: { ...NXP_BADGE_DEFAULT_OPTIONS, ...options },
  };
}
