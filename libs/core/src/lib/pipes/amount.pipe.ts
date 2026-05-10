import { Pipe, PipeTransform, inject } from '@angular/core';
import {
  NXP_AMOUNT_OPTIONS,
  NgxproAmountOptions,
} from '../tokens/amount-options.token';
import {
  AmountAlign,
  AmountSign,
  AmountSignSymbol,
} from '../tokens/amount.types';

const CHAR_NO_BREAK_SPACE = ' ';
const CHAR_MINUS = '−';
const CHAR_PLUS = '+';

function signSymbolFor(value: number, sign: AmountSign): AmountSignSymbol {
  if (sign === 'never') return '';
  if (value === 0 || Number.isNaN(value)) return '';
  if (sign === 'negative-only' && value > 0) return '';
  if (sign === 'force-negative' || (value < 0 && sign !== 'force-positive')) {
    return CHAR_MINUS;
  }
  return CHAR_PLUS;
}

/**
 * Formats monetary amounts. Delegates currency rendering to
 * `Intl.NumberFormat({style:'currency', currencyDisplay:'narrowSymbol'})`,
 * then strips the formatter's sign and replaces it with the configured
 * `AmountSign` strategy.
 *
 * @example
 * {{ 1234.56 | nxpAmount:'USD' }}        // "$1,234.56"
 * {{ 1234.56 | nxpAmount:'EUR':'end' }}  // "1,234.56 €"
 * {{ -1234.56 | nxpAmount:'USD' }}       // "−$1,234.56"
 */
@Pipe({ name: 'nxpAmount' })
export class AmountPipe implements PipeTransform {
  private readonly options: NgxproAmountOptions = inject(NXP_AMOUNT_OPTIONS);
  private readonly cache = new Map<string, Intl.NumberFormat>();

  transform(
    value: number | null | undefined,
    currency: string = this.options.currency,
    currencyAlign: AmountAlign = this.options.currencyAlign,
  ): string {
    if (value == null || Number.isNaN(value)) return '';

    const code = currency?.toUpperCase() ?? '';
    const formatter = this.getFormatter(code);
    const absValue = Math.abs(value);

    let body: string;
    let symbol = '';
    if (formatter) {
      const parts = formatter.formatToParts(absValue);
      symbol = parts
        .filter((p) => p.type === 'currency')
        .map((p) => p.value)
        .join('');
      body = parts
        .filter((p) => p.type !== 'currency' && p.type !== 'literal')
        .map((p) => p.value)
        .join('');
    } else {
      body = this.getNumberFormatter().format(absValue);
    }

    const sign = signSymbolFor(value, this.options.sign);
    const space =
      symbol && (symbol.length > 1 || currencyAlign === 'end')
        ? CHAR_NO_BREAK_SPACE
        : '';

    return currencyAlign === 'end'
      ? `${sign}${body}${space}${symbol}`
      : `${sign}${symbol}${space}${body}`;
  }

  private getFormatter(currency: string): Intl.NumberFormat | null {
    if (!currency) return null;
    const key = `cur:${currency}`;
    const cached = this.cache.get(key);
    if (cached) return cached;
    try {
      const formatter = new Intl.NumberFormat(this.options.locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: this.options.precision,
        maximumFractionDigits: this.options.precision,
      });
      this.cache.set(key, formatter);
      return formatter;
    } catch {
      return null;
    }
  }

  private getNumberFormatter(): Intl.NumberFormat {
    const key = 'plain';
    const cached = this.cache.get(key);
    if (cached) return cached;
    const formatter = new Intl.NumberFormat(this.options.locale, {
      minimumFractionDigits: this.options.precision,
      maximumFractionDigits: this.options.precision,
    });
    this.cache.set(key, formatter);
    return formatter;
  }
}
