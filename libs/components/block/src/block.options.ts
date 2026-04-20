import { InjectionToken } from '@angular/core';
import { nxpCreateOptions } from '@nxp/cdk';

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

export const [NXP_BLOCK_OPTIONS, nxpBlockOptionsProvider] =
  nxpCreateOptions<NxpBlockOptions>({ size: 'l', appearance: 'outline' });

/** Presence token provided by `NxpBlockGroupComponent`. */
export const NXP_BLOCK_GROUP = new InjectionToken<unknown>('NXP_BLOCK_GROUP');
