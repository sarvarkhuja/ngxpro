import { Pipe, PipeTransform, inject } from '@angular/core';
import { FormatService } from '../services/format.service';

/**
 * Pipe to format a number in compact notation.
 *
 * @example
 * {{ 1200 | nxpCompact }} => "1.2K"
 * {{ 3400000 | nxpCompact }} => "3.4M"
 */
@Pipe({ name: 'nxpCompact' })
export class FormatCompactPipe implements PipeTransform {
  private readonly format = inject(FormatService);

  transform(value: number | null | undefined): string {
    if (value == null) return '';
    return this.format.formatCompact(value);
  }
}
