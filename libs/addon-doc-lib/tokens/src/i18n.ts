import { InjectionToken, signal, type Signal } from '@angular/core';

/**
 * Translation strings. Each token returns a `Signal<…>` so consumers can
 * swap in their own reactive i18n implementation. Defaults are English.
 */

export const NXP_DOC_DEMO_TEXTS = new InjectionToken<
  Signal<readonly [string, string, string]>
>('NXP_DOC_DEMO_TEXTS', {
  factory: () => signal(['Dark mode', 'Transparent background', 'Form data']),
});

export const NXP_DOC_PREVIEW_TEXT = new InjectionToken<Signal<string>>(
  'NXP_DOC_PREVIEW_TEXT',
  { factory: () => signal('Preview') },
);

export const NXP_DOC_MENU_TEXT = new InjectionToken<Signal<string>>(
  'NXP_DOC_MENU_TEXT',
  { factory: () => signal('Menu') },
);

export const NXP_DOC_SEARCH_TEXT = new InjectionToken<Signal<string>>(
  'NXP_DOC_SEARCH_TEXT',
  { factory: () => signal('Search...') },
);

export const NXP_DOC_SEE_ALSO_TEXT = new InjectionToken<Signal<string>>(
  'NXP_DOC_SEE_ALSO_TEXT',
  { factory: () => signal('See also') },
);

export const NXP_DOC_TOC_TEXT = new InjectionToken<Signal<string>>(
  'NXP_DOC_TOC_TEXT',
  { factory: () => signal('Table of contents') },
);

export const NXP_DOC_SOURCE_CODE_TEXT = new InjectionToken<Signal<string>>(
  'NXP_DOC_SOURCE_CODE_TEXT',
  { factory: () => signal('Source code') },
);

export const NXP_DOC_COPY_TEXTS = new InjectionToken<
  Signal<readonly [string, string]>
>('NXP_DOC_COPY_TEXTS', { factory: () => signal(['Copy', 'Copied']) });

export const NXP_DOC_SEARCH_ENABLED = new InjectionToken(
  'NXP_DOC_SEARCH_ENABLED',
  {
    factory: () => signal(true),
  },
);
