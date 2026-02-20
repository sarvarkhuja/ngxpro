import { Injectable, inject } from '@angular/core';
import { NGXPRO_FORMAT_OPTIONS, type NgxproFormatOptions } from '../tokens';

/**
 * Format service for numbers, currency, and dates.
 * Configurable via NGXPRO_FORMAT_OPTIONS token.
 */
@Injectable({ providedIn: 'root' })
export class FormatService {
  private readonly options = inject(NGXPRO_FORMAT_OPTIONS);

  /** Format a number with locale-specific separators. */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.options.locale, options).format(value);
  }

  /** Format a number as currency. */
  formatCurrency(value: number, currency?: string): string {
    return new Intl.NumberFormat(this.options.locale, {
      style: 'currency',
      currency: currency ?? this.options.currency,
    }).format(value);
  }

  /** Format a number as a compact string (e.g., 1.2K, 3.4M). */
  formatCompact(value: number): string {
    return new Intl.NumberFormat(this.options.locale, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  /** Format a number as a percentage. */
  formatPercent(value: number, decimals: number = 1): string {
    return new Intl.NumberFormat(this.options.locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  /** Format a date. */
  formatDate(value: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat(
      this.options.locale,
      options ?? this.options.dateFormat,
    ).format(date);
  }

  /** Format relative time (e.g., "2 hours ago"). */
  formatRelativeTime(date: Date | string | number): string {
    const target = date instanceof Date ? date : new Date(date);
    const now = Date.now();
    const diffMs = target.getTime() - now;
    const absDiff = Math.abs(diffMs);

    const rtf = new Intl.RelativeTimeFormat(this.options.locale, { numeric: 'auto' });

    if (absDiff < 60_000) return rtf.format(Math.round(diffMs / 1000), 'second');
    if (absDiff < 3_600_000) return rtf.format(Math.round(diffMs / 60_000), 'minute');
    if (absDiff < 86_400_000) return rtf.format(Math.round(diffMs / 3_600_000), 'hour');
    if (absDiff < 2_592_000_000) return rtf.format(Math.round(diffMs / 86_400_000), 'day');
    if (absDiff < 31_536_000_000) return rtf.format(Math.round(diffMs / 2_592_000_000), 'month');
    return rtf.format(Math.round(diffMs / 31_536_000_000), 'year');
  }
}
