import { Pipe, PipeTransform, inject } from '@angular/core';
import { FormatService } from '../services/format.service';

/**
 * Pipe to format a number in compact notation.
 *
 * @example
 * {{ 1200 | ngxproCompact }} => "1.2K"
 * {{ 3400000 | ngxproCompact }} => "3.4M"
 */
@Pipe({ name: 'ngxproCompact' })
export class FormatCompactPipe implements PipeTransform {
  private readonly format = inject(FormatService);

  transform(value: number | null | undefined): string {
    if (value == null) return '';
    return this.format.formatCompact(value);
  }
}
