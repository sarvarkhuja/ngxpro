import { InjectionToken, type Provider } from '@angular/core';
import type { AvatarAppearance, AvatarSize } from './avatar.component';

export interface NxpAvatarOptions {
  size: AvatarSize;
  round: boolean;
  appearance: AvatarAppearance;
}

const NXP_AVATAR_DEFAULT_OPTIONS: NxpAvatarOptions = {
  size: 'm',
  round: true,
  appearance: 'primary',
};

export const NXP_AVATAR_OPTIONS = new InjectionToken<NxpAvatarOptions>(
  'NXP_AVATAR_OPTIONS',
  { factory: () => NXP_AVATAR_DEFAULT_OPTIONS },
);

export function nxpAvatarOptionsProvider(
  options: Partial<NxpAvatarOptions>,
): Provider {
  return {
    provide: NXP_AVATAR_OPTIONS,
    useValue: { ...NXP_AVATAR_DEFAULT_OPTIONS, ...options },
  };
}
