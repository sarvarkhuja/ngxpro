import { InjectionToken } from '@angular/core';
import { AmountAlign, AmountSign } from './amount.types';

/**
 * Configuration options for the AmountPipe.
 */
export interface NgxproAmountOptions {
  /**
   * Default currency code (e.g., 'USD', 'EUR', 'GBP').
   * Empty string means no currency symbol.
   */
  readonly currency: string;

  /**
   * Default alignment of the currency symbol.
   * @default 'start'
   */
  readonly currencyAlign: AmountAlign;

  /**
   * Default sign display strategy.
   * @default 'negative-only'
   */
  readonly sign: AmountSign;

  /**
   * Default decimal precision.
   * @default 2
   */
  readonly precision: number;

  /**
   * Default locale for number formatting.
   * @default 'en-US'
   */
  readonly locale: string;
}

/**
 * Default options for amount formatting.
 */
const DEFAULT_AMOUNT_OPTIONS: NgxproAmountOptions = {
  currency: '',
  currencyAlign: 'start',
  sign: 'negative-only',
  precision: 2,
  locale: 'en-US',
};

/**
 * Injection token for configuring the AmountPipe globally.
 *
 * @example
 * ```typescript
 * providers: [
 *   {
 *     provide: NGXPRO_AMOUNT_OPTIONS,
 *     useValue: {
 *       currency: 'USD',
 *       currencyAlign: 'start',
 *       sign: 'always',
 *       precision: 2,
 *       locale: 'en-US',
 *     }
 *   }
 * ]
 * ```
 */
export const NGXPRO_AMOUNT_OPTIONS = new InjectionToken<NgxproAmountOptions>(
  'NGXPRO_AMOUNT_OPTIONS',
  { factory: () => DEFAULT_AMOUNT_OPTIONS },
);
