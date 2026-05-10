import { inject, InjectionToken } from '@angular/core';
import type {
  NxpDocRoutePage,
  NxpDocRoutePages,
} from '@ngxpro/addon-doc-lib/types';
import { nxpToFlatMapPages } from '@ngxpro/addon-doc-lib/utils';

/**
 * Documentation pages declared by the host app. Mirrors `TUI_DOC_PAGES`.
 */
export const NXP_DOC_PAGES = new InjectionToken<NxpDocRoutePages>(
  'NXP_DOC_PAGES',
  { factory: () => [] },
);

/**
 * Map of page titles to icons (Remix class name or raw SVG). Used by the
 * sidebar to render an icon next to each entry.
 */
export const NXP_DOC_PAGES_ICONS = new InjectionToken<Record<string, string>>(
  'NXP_DOC_PAGES_ICONS',
  { factory: () => ({}) },
);

/**
 * Flattened lookup map (`title -> page`). Computed lazily from
 * `NXP_DOC_PAGES`.
 */
export const NXP_DOC_MAP_PAGES = new InjectionToken<
  Map<string, NxpDocRoutePage>
>('NXP_DOC_MAP_PAGES', {
  factory: () => nxpToFlatMapPages(inject(NXP_DOC_PAGES)),
});
