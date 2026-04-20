import { nxpCreateOptions } from '@nxp/cdk';

export type NxpRangeSize = 's' | 'm' | 'l';

export interface NxpRangeOptions {
  readonly size: NxpRangeSize;
  readonly color: string;
}

export const [NXP_RANGE_OPTIONS, nxpRangeOptionsProvider] =
  nxpCreateOptions<NxpRangeOptions>({ size: 'm', color: 'primary' });
