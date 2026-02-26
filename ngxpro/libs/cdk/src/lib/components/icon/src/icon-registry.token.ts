import { InjectionToken, Provider } from '@angular/core';
import { NXP_ICON_RESOLVER } from './icon-resolver.token';

/** Maps icon name → raw SVG string */
export const NXP_ICON_REGISTRY = new InjectionToken<Record<string, string>>(
  'NXP_ICON_REGISTRY',
  { factory: () => ({}) },
);

/**
 * Register icons: { 'ri-search-line': '<svg>...</svg>' }
 *
 * Also provides NXP_ICON_RESOLVER locally so the resolver reads from the
 * component-level registry rather than the root injector's empty default.
 */
export function nxpIconsProvider(icons: Record<string, string>): Provider[] {
  return [
    { provide: NXP_ICON_REGISTRY, useValue: icons },
    {
      provide: NXP_ICON_RESOLVER,
      useFactory: (reg: Record<string, string>) => (name: string) =>
        reg[name] ?? null,
      deps: [NXP_ICON_REGISTRY],
    },
  ];
}
