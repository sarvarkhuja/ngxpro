import { nxpCreateOptions } from '@nxp/cdk';

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

export const [NXP_CHIP_OPTIONS, nxpChipOptionsProvider] =
  nxpCreateOptions<NxpChipOptions>({ size: 's', appearance: 'neutral' });
