import { InjectionToken, type Provider } from '@angular/core';
import type { NxpRadioOptions } from '@nxp/cdk/components/radio';

export type NxpCheckboxSize = 's' | 'm' | 'l';

export interface NxpCheckboxOptions extends NxpRadioOptions {
  readonly icons: {
    /**
     * Icon name (or SVG string) shown when the checkbox is checked.
     * Receives the current size and returns the icon identifier.
     */
    readonly checked: (size: NxpCheckboxSize) => string;
    /**
     * Icon name (or SVG string) shown when the checkbox is indeterminate.
     * Receives the current size and returns the icon identifier.
     */
    readonly indeterminate: (size: NxpCheckboxSize) => string;
  };
}

export const NXP_CHECKBOX_DEFAULT_OPTIONS: NxpCheckboxOptions = {
  size: 'm',
  appearance: 'primary',
  icons: {
    checked: () => 'ri-check-line',
    indeterminate: () => 'ri-subtract-line',
  },
};

export const NXP_CHECKBOX_OPTIONS = new InjectionToken<NxpCheckboxOptions>(
  'NXP_CHECKBOX_OPTIONS',
  { factory: () => NXP_CHECKBOX_DEFAULT_OPTIONS },
);

export function nxpCheckboxOptionsProvider(
  options: Partial<NxpCheckboxOptions>,
): Provider {
  return {
    provide: NXP_CHECKBOX_OPTIONS,
    useValue: {
      ...NXP_CHECKBOX_DEFAULT_OPTIONS,
      ...options,
      icons: {
        ...NXP_CHECKBOX_DEFAULT_OPTIONS.icons,
        ...(options.icons ?? {}),
      },
    },
  };
}
