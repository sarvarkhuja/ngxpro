import { Pipe, PipeTransform } from '@angular/core';
import type { WeekStart } from './calendar.types';

/**
 * Pure, memoized pipe that builds a 6×7 calendar grid for a given year/month.
 *
 * Always produces exactly 6 rows × 7 columns. Cells that belong to the
 * previous or next month are filled with those adjacent dates so the grid is
 * always rectangular.
 *
 * @example
 * // In a template:
 * @for (week of (year | calendarSheet:month:weekStart); track $index) { … }
 */
@Pipe({
  name: 'calendarSheet',
  pure: true,
  standalone: true,
})
export class CalendarSheetPipe implements PipeTransform {
  transform(year: number, month: number, weekStart: WeekStart): Date[][] {
    // First day of the requested month
    const firstOfMonth = new Date(year, month, 1);
    // Day-of-week index of that first day (0=Sun…6=Sat)
    const rawOffset = firstOfMonth.getDay();
    // How many days from the previous month we need to prepend
    const offset = (rawOffset - weekStart + 7) % 7;

    // Start date of the grid (may be in the previous month)
    const gridStart = new Date(year, month, 1 - offset);

    const rows: Date[][] = [];
    for (let row = 0; row < 6; row++) {
      const week: Date[] = [];
      for (let col = 0; col < 7; col++) {
        const dayIndex = row * 7 + col;
        week.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + dayIndex));
      }
      rows.push(week);
    }

    return rows;
  }
}
