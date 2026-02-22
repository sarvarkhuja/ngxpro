import { InjectionToken } from '@angular/core';
import type { NgxproColorScheme } from '../services/color-scheme.service';

export interface NgxproFormatOptions {
  readonly locale: string;
  readonly currency: string;
  readonly dateFormat: Intl.DateTimeFormatOptions;
}

const DEFAULT_FORMAT_OPTIONS: NgxproFormatOptions = {
  locale: 'en-US',
  currency: 'USD',
  dateFormat: { year: 'numeric', month: 'short', day: 'numeric' },
};

/**
 * Token for configuring the FormatService.
 * Override via providers: [{ provide: NXP_FORMAT_OPTIONS, useValue: {...} }]
 */
export const NXP_FORMAT_OPTIONS = new InjectionToken<NgxproFormatOptions>(
  'NXP_FORMAT_OPTIONS',
  { factory: () => DEFAULT_FORMAT_OPTIONS },
);

/**
 * Token for the animation speed (ms). Used by components with transitions.
 */
export const NXP_ANIMATION_SPEED = new InjectionToken<number>(
  'NXP_ANIMATION_SPEED',
  { factory: () => 200 },
);

/**
 * Token to override the default color scheme.
 * Provide in app root to set the initial scheme before ColorSchemeService reads localStorage.
 *
 * @example
 * providers: [{ provide: NXP_COLOR_SCHEME, useValue: 'emerald' }]
 */
export const NXP_COLOR_SCHEME = new InjectionToken<NgxproColorScheme>(
  'NXP_COLOR_SCHEME',
  { factory: () => 'blue' as NgxproColorScheme },
);

// Amount pipe tokens and types
export { NXP_AMOUNT_OPTIONS } from './amount-options.token';
export type { NgxproAmountOptions } from './amount-options.token';
export type { AmountAlign, AmountSign, AmountSignSymbol } from './amount.types';
