import {
  computed,
  inject,
  Pipe,
  PipeTransform,
  signal,
  untracked,
} from '@angular/core';
import {
  NXP_AMOUNT_OPTIONS,
  NgxproAmountOptions,
} from '../tokens/amount-options.token';
import {
  AmountAlign,
  AmountSign,
  AmountSignSymbol,
} from '../tokens/amount.types';

/**
 * Character constants for formatting.
 */
const CHAR_NO_BREAK_SPACE = '\u00A0';
const CHAR_MINUS = '−'; // Unicode minus sign (U+2212)
const CHAR_PLUS = '+';

/**
 * Currency symbol map for common currencies.
 * Supports USD, EUR, GBP, JPY, and other common currencies.
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  KRW: '₩',
  INR: '₹',
  RUB: '₽',
  BRL: 'R$',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  ILS: '₪',
  MXN: '$',
  ZAR: 'R',
  SGD: 'S$',
  HKD: 'HK$',
  NZD: 'NZ$',
  THB: '฿',
  TRY: '₺',
};

/**
 * Formats a currency code into a display symbol.
 * Returns the currency symbol or the currency code if no symbol is found.
 *
 * @param currency Currency code (e.g., 'USD', 'EUR')
 * @returns Currency symbol (e.g., '$', '€')
 */
function formatCurrency(currency: string): string {
  if (!currency) {
    return '';
  }

  return CURRENCY_SYMBOLS[currency.toUpperCase()] || currency;
}

/**
 * Determines the sign symbol based on value and sign strategy.
 *
 * @param value The numeric value
 * @param sign The sign display strategy
 * @returns The sign symbol to display
 */
function formatSignSymbol(value: number, sign: AmountSign): AmountSignSymbol {
  if (sign === 'never' || !value || (sign === 'negative-only' && value > 0)) {
    return '';
  }

  if (sign === 'force-negative' || (value < 0 && sign !== 'force-positive')) {
    return CHAR_MINUS;
  }

  return CHAR_PLUS;
}

/**
 * Pipe to format monetary amounts with currency symbols, proper sign handling,
 * and locale-aware number formatting.
 *
 * This pipe is impure (`pure: false`) to support Angular signals and reactive updates.
 * It uses signal-based internal state for optimal performance.
 *
 * @example
 * Basic usage with default options:
 * ```html
 * {{ 1234.56 | nxpAmount }}
 * // Output: "1,234.56" (no currency)
 * ```
 *
 * @example
 * With currency code:
 * ```html
 * {{ 1234.56 | nxpAmount:'USD' }}
 * // Output: "$1,234.56"
 *
 * {{ 1234.56 | nxpAmount:'EUR' }}
 * // Output: "€1,234.56"
 * ```
 *
 * @example
 * With currency alignment:
 * ```html
 * {{ 1234.56 | nxpAmount:'USD':'start' }}
 * // Output: "$1,234.56"
 *
 * {{ 1234.56 | nxpAmount:'EUR':'end' }}
 * // Output: "1,234.56 €"
 * ```
 *
 * @example
 * Negative values:
 * ```html
 * {{ -1234.56 | nxpAmount:'USD' }}
 * // Output: "−$1,234.56"
 * ```
 *
 * @example
 * Configure globally via injection token:
 * ```typescript
 * providers: [
 *   {
 *     provide: NXP_AMOUNT_OPTIONS,
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
@Pipe({
  name: 'nxpAmount',
  standalone: true,
  pure: false, // Required for signal reactivity
})
export class AmountPipe implements PipeTransform {
  private readonly options: NgxproAmountOptions = inject(NXP_AMOUNT_OPTIONS);

  // Signal-based state for reactive formatting
  private readonly value = signal<number>(0);
  private readonly currency = signal<string>(this.options.currency);
  private readonly currencyAlign = signal<AmountAlign>(
    this.options.currencyAlign,
  );

  /**
   * Computed signal that reactively formats the amount based on current state.
   */
  private readonly formatted = computed(() => {
    const value = this.value();
    const currencyCode = this.currency();
    const align = this.currencyAlign();

    // Format the absolute value using Intl.NumberFormat
    const formatter = new Intl.NumberFormat(this.options.locale, {
      minimumFractionDigits: this.options.precision,
      maximumFractionDigits: this.options.precision,
    });

    const formattedNumber = formatter.format(Math.abs(value));

    // Get currency symbol
    const currencySymbol = formatCurrency(currencyCode);

    // Determine sign symbol
    const sign =
      formattedNumber === '0' ? '' : formatSignSymbol(value, this.options.sign);

    // Determine spacing between currency and value
    const space =
      currencySymbol && (currencySymbol.length > 1 || align === 'end')
        ? CHAR_NO_BREAK_SPACE
        : '';

    // Build final string based on alignment
    return align === 'end'
      ? `${sign}${formattedNumber}${space}${currencySymbol}`
      : `${sign}${currencySymbol}${space}${formattedNumber}`;
  });

  /**
   * Transforms a numeric value into a formatted monetary amount string.
   *
   * @param value The numeric value to format
   * @param currency Optional currency code (e.g., 'USD', 'EUR'). Defaults to global options.
   * @param currencyAlign Optional alignment ('start' or 'end'). Defaults to global options.
   * @returns Formatted amount string with currency symbol and sign
   */
  transform(
    value: number,
    currency: string = this.options.currency,
    currencyAlign: AmountAlign = this.options.currencyAlign,
  ): string {
    // Update signals in untracked context to avoid unnecessary recomputations
    untracked(() => {
      this.value.set(value);
      this.currency.set(currency);
      this.currencyAlign.set(currencyAlign);
    });

    return this.formatted();
  }
}
