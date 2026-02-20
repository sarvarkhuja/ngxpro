import { Pipe, PipeTransform, inject } from '@angular/core';
import { FormatService } from '../services/format.service';

/**
 * Pipe to format a date as relative time.
 *
 * @example
 * {{ pastDate | ngxproRelativeTime }} => "2 hours ago"
 */
@Pipe({ name: 'ngxproRelativeTime' })
export class RelativeTimePipe implements PipeTransform {
  private readonly format = inject(FormatService);

  transform(value: Date | string | number | null | undefined): string {
    if (value == null) return '';
    return this.format.formatRelativeTime(value);
  }
}
