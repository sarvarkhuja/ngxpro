import { nxpCreateOptions } from '@nxp/cdk';

export interface NxpInputChipOptions {
  /** Separator used to split input text into multiple chips. */
  readonly separator: RegExp | string;
  /** Whether to deduplicate chip values. */
  readonly unique: boolean;
}

export const [NXP_INPUT_CHIP_OPTIONS, nxpInputChipOptionsProvider] =
  nxpCreateOptions<NxpInputChipOptions>({ separator: ',', unique: true });
