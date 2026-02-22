import { InjectionToken, Provider } from '@angular/core';
import {
  type NgxproTextMorphOptions,
  NXP_TEXT_MORPH_DEFAULT_OPTIONS,
} from './text-morph.types';

export const NXP_TEXT_MORPH_OPTIONS =
  new InjectionToken<NgxproTextMorphOptions>('NXP_TEXT_MORPH_OPTIONS', {
    factory: () => NXP_TEXT_MORPH_DEFAULT_OPTIONS,
  });

/**
 * Provides app-wide default options for nxpTextMorph.
 *
 * @example
 * providers: [provideTextMorphOptions({ duration: 600, locale: 'ja' })]
 */
export function provideTextMorphOptions(
  options: Partial<NgxproTextMorphOptions>,
): Provider {
  return {
    provide: NXP_TEXT_MORPH_OPTIONS,
    useValue: { ...NXP_TEXT_MORPH_DEFAULT_OPTIONS, ...options },
  };
}
