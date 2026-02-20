import { Pipe, PipeTransform, inject } from '@angular/core';
import { FormatService } from '../services/format.service';

/**
 * Pipe to format a number using the FormatService.
 *
 * @example
 * {{ 1234567 | ngxproNumber }} => "1,234,567"
 */
@Pipe({ name: 'ngxproNumber' })
export class FormatNumberPipe implements PipeTransform {
  private readonly format = inject(FormatService);

  transform(value: number | null | undefined, options?: Intl.NumberFormatOptions): string {
    if (value == null) return '';
    return this.format.formatNumber(value, options);
  }
}
