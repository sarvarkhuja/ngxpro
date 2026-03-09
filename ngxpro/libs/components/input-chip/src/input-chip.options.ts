import { InjectionToken, type Provider } from '@angular/core';

export interface NxpInputChipOptions {
  /** Separator used to split input text into multiple chips. */
  readonly separator: RegExp | string;
  /** Whether to deduplicate chip values. */
  readonly unique: boolean;
}

export const NXP_INPUT_CHIP_DEFAULT_OPTIONS: NxpInputChipOptions = {
  separator: ',',
  unique: true,
};

export const NXP_INPUT_CHIP_OPTIONS = new InjectionToken<NxpInputChipOptions>(
  'NXP_INPUT_CHIP_OPTIONS',
  { factory: () => NXP_INPUT_CHIP_DEFAULT_OPTIONS },
);

export function nxpInputChipOptionsProvider(
  options: Partial<NxpInputChipOptions>,
): Provider {
  return {
    provide: NXP_INPUT_CHIP_OPTIONS,
    useValue: { ...NXP_INPUT_CHIP_DEFAULT_OPTIONS, ...options },
  };
}
