import { nxpCreateOptions } from '@nxp/cdk';

export type NxpSwitchSize = 's' | 'm' | 'l';
export type NxpSwitchColor = 'primary' | 'secondary' | 'danger';

export interface NxpSwitchOptions {
  readonly size: NxpSwitchSize;
  readonly color: NxpSwitchColor;
  readonly showIcons: boolean;
}

export const [NXP_SWITCH_OPTIONS, nxpSwitchOptionsProvider] =
  nxpCreateOptions<NxpSwitchOptions>({ size: 'm', color: 'primary', showIcons: false });
