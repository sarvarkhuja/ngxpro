import { InjectionToken, signal, type Signal } from '@angular/core';

export interface NxpMultiSelectTexts {
  readonly all: string;
  readonly none: string;
}

/**
 * Token providing i18n strings for multi-select group header buttons.
 * - `all`: label for "Select All" button
 * - `none`: label for "Deselect All" button
 *
 * Override globally via `providers` on the root component or at the
 * component level to support different locales.
 *
 * @example
 * providers: [{ provide: NXP_MULTI_SELECT_TEXTS, useValue: signal({ all: 'Tous', none: 'Aucun' }) }]
 */
export const NXP_MULTI_SELECT_TEXTS = new InjectionToken<Signal<NxpMultiSelectTexts>>(
  'NXP_MULTI_SELECT_TEXTS',
  {
    factory: () => signal({ all: 'All', none: 'None' }),
  },
);
