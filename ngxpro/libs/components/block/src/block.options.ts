import { InjectionToken, type Provider } from '@angular/core';

export type NxpBlockSize = 's' | 'm' | 'l';
export type NxpBlockAppearance =
  | 'outline'
  | 'filled'
  | 'primary'
  | 'success'
  | 'danger';

export interface NxpBlockOptions {
  readonly size: NxpBlockSize;
  readonly appearance: NxpBlockAppearance;
}

export const NXP_BLOCK_DEFAULT_OPTIONS: NxpBlockOptions = {
  size: 'l',
  appearance: 'outline',
};

export const NXP_BLOCK_OPTIONS = new InjectionToken<NxpBlockOptions>(
  'NXP_BLOCK_OPTIONS',
  { factory: () => NXP_BLOCK_DEFAULT_OPTIONS },
);

export function nxpBlockOptionsProvider(
  options: Partial<NxpBlockOptions>,
): Provider {
  return {
    provide: NXP_BLOCK_OPTIONS,
    useValue: { ...NXP_BLOCK_DEFAULT_OPTIONS, ...options },
  };
}

/** Presence token provided by `NxpBlockGroupComponent`. */
export const NXP_BLOCK_GROUP = new InjectionToken<unknown>('NXP_BLOCK_GROUP');
