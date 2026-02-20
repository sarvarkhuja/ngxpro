import { InjectionToken } from '@angular/core';

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
 * Override via providers: [{ provide: NGXPRO_FORMAT_OPTIONS, useValue: {...} }]
 */
export const NGXPRO_FORMAT_OPTIONS = new InjectionToken<NgxproFormatOptions>(
  'NGXPRO_FORMAT_OPTIONS',
  { factory: () => DEFAULT_FORMAT_OPTIONS },
);

/**
 * Token for the animation speed (ms). Used by components with transitions.
 */
export const NGXPRO_ANIMATION_SPEED = new InjectionToken<number>(
  'NGXPRO_ANIMATION_SPEED',
  { factory: () => 200 },
);

// Amount pipe tokens and types
export { NGXPRO_AMOUNT_OPTIONS } from './amount-options.token';
export type { NgxproAmountOptions } from './amount-options.token';
export type { AmountAlign, AmountSign, AmountSignSymbol } from './amount.types';
