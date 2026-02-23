import { InjectionToken, Provider } from '@angular/core';

export interface NxpIconOptions {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const NXP_ICON_OPTIONS_DEFAULT: NxpIconOptions = {
  size: 'md',
};

export const NXP_ICON_OPTIONS = new InjectionToken<NxpIconOptions>(
  'NXP_ICON_OPTIONS',
  { factory: () => NXP_ICON_OPTIONS_DEFAULT },
);

export function nxpIconOptionsProvider(
  options: Partial<NxpIconOptions>,
): Provider {
  return {
    provide: NXP_ICON_OPTIONS,
    useValue: { ...NXP_ICON_OPTIONS_DEFAULT, ...options },
  };
}
