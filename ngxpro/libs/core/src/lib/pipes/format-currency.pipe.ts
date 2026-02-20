import { Pipe, PipeTransform, inject } from '@angular/core';
import { FormatService } from '../services/format.service';

/**
 * Pipe to format a value as currency.
 *
 * @example
 * {{ 1234.5 | ngxproCurrency }} => "$1,234.50"
 * {{ 1234.5 | ngxproCurrency:'EUR' }} => "€1,234.50"
 */
@Pipe({ name: 'ngxproCurrency' })
export class FormatCurrencyPipe implements PipeTransform {
  private readonly format = inject(FormatService);

  transform(value: number | null | undefined, currency?: string): string {
    if (value == null) return '';
    return this.format.formatCurrency(value, currency);
  }
}
