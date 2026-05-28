import { nxpCreateOptions } from '@ngxpro/cdk';

export type NxpSegmentedSize = 'sm' | 'md' | 'lg';
export type NxpSegmentedOrientation = 'horizontal' | 'vertical';

export interface NxpSegmentedOptions {
  readonly size: NxpSegmentedSize;
  readonly orientation: NxpSegmentedOrientation;
}

export const [NXP_SEGMENTED_OPTIONS, nxpSegmentedOptionsProvider] =
  nxpCreateOptions<NxpSegmentedOptions>({
    size: 'md',
    orientation: 'horizontal',
  });
