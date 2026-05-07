import { Injectable, inject } from '@angular/core';
import { NXP_FORMAT_OPTIONS } from '../tokens';

/**
 * Format service for numbers, currency, and dates.
 * Configurable via NXP_FORMAT_OPTIONS token. Formatters are cached per
 * locale + options key; Intl formatter construction is ~100x slower than
 * `.format()`, so this matters for pipes called every CD cycle.
 */
@Injectable({ providedIn: 'root' })
export class FormatService {
  private readonly options = inject(NXP_FORMAT_OPTIONS);
  private readonly numberFormatters = new Map<string, Intl.NumberFormat>();
  private readonly dateFormatters = new Map<string, Intl.DateTimeFormat>();
  private readonly relativeFormatters = new Map<
    string,
    Intl.RelativeTimeFormat
  >();

  /** Format a number with locale-specific separators. */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return this.getNumberFormatter(options).format(value);
  }

  /** Format a number as currency. */
  formatCurrency(value: number, currency?: string): string {
    const code = (currency ?? this.options.currency)?.toUpperCase();
    try {
      return this.getNumberFormatter({
        style: 'currency',
        currency: code,
      }).format(value);
    } catch {
      // Invalid currency code — fall back to plain number formatting
      return this.formatNumber(value);
    }
  }

  /** Format a number as a compact string (e.g., 1.2K, 3.4M). */
  formatCompact(value: number): string {
    return this.getNumberFormatter({
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  /** Format a number as a percentage. */
  formatPercent(value: number, decimals = 1): string {
    return this.getNumberFormatter({
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  /** Format a date. */
  formatDate(
    value: Date | string | number,
    options?: Intl.DateTimeFormatOptions,
  ): string {
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime())) return '';
    return this.getDateFormatter(options ?? this.options.dateFormat).format(
      date,
    );
  }

  /** Format relative time (e.g., "2 hours ago"). */
  formatRelativeTime(date: Date | string | number): string {
    const target = date instanceof Date ? date : new Date(date);
    if (!Number.isFinite(target.getTime())) return '';
    const diffMs = target.getTime() - Date.now();
    const absDiff = Math.abs(diffMs);

    const rtf = this.getRelativeFormatter();

    if (absDiff < 60_000)
      return rtf.format(Math.round(diffMs / 1000), 'second');
    if (absDiff < 3_600_000)
      return rtf.format(Math.round(diffMs / 60_000), 'minute');
    if (absDiff < 86_400_000)
      return rtf.format(Math.round(diffMs / 3_600_000), 'hour');
    if (absDiff < 2_592_000_000)
      return rtf.format(Math.round(diffMs / 86_400_000), 'day');
    if (absDiff < 31_536_000_000)
      return rtf.format(Math.round(diffMs / 2_592_000_000), 'month');
    return rtf.format(Math.round(diffMs / 31_536_000_000), 'year');
  }

  private getNumberFormatter(
    options?: Intl.NumberFormatOptions,
  ): Intl.NumberFormat {
    const key = options ? JSON.stringify(options) : '';
    let f = this.numberFormatters.get(key);
    if (!f) {
      f = new Intl.NumberFormat(this.options.locale, options);
      this.numberFormatters.set(key, f);
    }
    return f;
  }

  private getDateFormatter(
    options?: Intl.DateTimeFormatOptions,
  ): Intl.DateTimeFormat {
    const key = options ? JSON.stringify(options) : '';
    let f = this.dateFormatters.get(key);
    if (!f) {
      f = new Intl.DateTimeFormat(this.options.locale, options);
      this.dateFormatters.set(key, f);
    }
    return f;
  }

  private getRelativeFormatter(): Intl.RelativeTimeFormat {
    const key = 'auto';
    let f = this.relativeFormatters.get(key);
    if (!f) {
      f = new Intl.RelativeTimeFormat(this.options.locale, { numeric: 'auto' });
      this.relativeFormatters.set(key, f);
    }
    return f;
  }
}
