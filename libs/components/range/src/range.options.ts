import { nxpCreateOptions } from '@ngxpro/cdk';

export interface NxpRangeOptions {
  readonly color: string;
}

export const [NXP_RANGE_OPTIONS, nxpRangeOptionsProvider] =
  nxpCreateOptions<NxpRangeOptions>({ color: 'primary' });
