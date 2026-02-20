import { InjectionToken, Provider } from '@angular/core';
import {
  type NgxproTextMorphOptions,
  NGXPRO_TEXT_MORPH_DEFAULT_OPTIONS,
} from './text-morph.types';

export const NGXPRO_TEXT_MORPH_OPTIONS =
  new InjectionToken<NgxproTextMorphOptions>('NGXPRO_TEXT_MORPH_OPTIONS', {
    factory: () => NGXPRO_TEXT_MORPH_DEFAULT_OPTIONS,
  });

/**
 * Provides app-wide default options for ngxproTextMorph.
 *
 * @example
 * providers: [provideTextMorphOptions({ duration: 600, locale: 'ja' })]
 */
export function provideTextMorphOptions(
  options: Partial<NgxproTextMorphOptions>,
): Provider {
  return {
    provide: NGXPRO_TEXT_MORPH_OPTIONS,
    useValue: { ...NGXPRO_TEXT_MORPH_DEFAULT_OPTIONS, ...options },
  };
}
