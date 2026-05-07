import { nxpCreateOptions } from '@ngxpro/cdk';

export type NxpSegmentedSize = 'sm' | 'md' | 'lg';

export interface NxpSegmentedOptions {
  readonly size: NxpSegmentedSize;
}

export const [NXP_SEGMENTED_OPTIONS, nxpSegmentedOptionsProvider] =
  nxpCreateOptions<NxpSegmentedOptions>({ size: 'md' });
