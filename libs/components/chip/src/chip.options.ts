import { nxpCreateOptions } from '@ngxpro/cdk';

export type NxpChipSize = 'sm' | 'md' | 'lg';
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
  nxpCreateOptions<NxpChipOptions>({ size: 'md', appearance: 'neutral' });
