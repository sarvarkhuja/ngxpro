import { inject, InjectionToken } from '@angular/core';
import { NXP_ICON_REGISTRY } from './icon-registry.token';

export type NxpIconResolver = (name: string) => string | null;

export const NXP_ICON_RESOLVER = new InjectionToken<NxpIconResolver>(
  'NXP_ICON_RESOLVER',
  {
    factory: () => {
      const registry = inject(NXP_ICON_REGISTRY);
      return (name: string) => registry[name] ?? null;
    },
  },
);
