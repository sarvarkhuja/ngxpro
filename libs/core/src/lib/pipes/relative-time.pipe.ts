import { Pipe, PipeTransform, inject } from '@angular/core';
import { FormatService } from '../services/format.service';
import { NowService } from '../services/now.service';

/**
 * Pipe to format a date as relative time. Re-renders once per minute via
 * `NowService` so output stays current.
 *
 * @example
 * {{ pastDate | nxpRelativeTime }} => "2 hours ago"
 */
@Pipe({ name: 'nxpRelativeTime', pure: false })
export class RelativeTimePipe implements PipeTransform {
  private readonly format = inject(FormatService);
  private readonly nowService = inject(NowService);

  transform(value: Date | string | number | null | undefined): string {
    if (value == null) return '';
    // Read the tick signal so the pipe re-runs when it advances.
    this.nowService.now();
    return this.format.formatRelativeTime(value);
  }
}
