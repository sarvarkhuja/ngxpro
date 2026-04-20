import { nxpCreateOptions } from '@nxp/cdk';

export type NxpTabsSize = 'sm' | 'md' | 'lg';

export interface NxpTabsOptions {
  readonly size: NxpTabsSize;
}

export const [NXP_TABS_OPTIONS, nxpTabsOptionsProvider] =
  nxpCreateOptions<NxpTabsOptions>({ size: 'md' });
