import type { WeekStart } from './calendar.types';

export interface CalendarOptions {
  /** Day the week grid starts on. 0 = Sun, 1 = Mon (default). */
  weekStart: WeekStart;
  /** Whether Saturday and Sunday cells are rendered. */
  showWeekends: boolean;
}
