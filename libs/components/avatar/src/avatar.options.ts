import { nxpCreateOptions } from '@nxp/cdk';
import type { AvatarAppearance, AvatarSize } from './avatar.component';

export interface NxpAvatarOptions {
  size: AvatarSize;
  round: boolean;
  appearance: AvatarAppearance;
}

export const [NXP_AVATAR_OPTIONS, nxpAvatarOptionsProvider] =
  nxpCreateOptions<NxpAvatarOptions>({ size: 'm', round: true, appearance: 'primary' });
