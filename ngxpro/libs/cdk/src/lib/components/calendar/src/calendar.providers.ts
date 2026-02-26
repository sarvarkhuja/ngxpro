import { InjectionToken, Provider } from '@angular/core';
import type { CalendarOptions } from './calendar-options.interface';

export type { CalendarOptions };

export const CALENDAR_OPTIONS = new InjectionToken<CalendarOptions>(
  'CalendarOptions',
  {
    providedIn: 'root',
    factory: (): CalendarOptions => ({
      weekStart: 1,
      showWeekends: true,
    }),
  },
);

/**
 * Provide custom defaults for all CalendarComponents in the given injector scope.
 *
 * @example
 * // In a route or component providers array:
 * provideCalendarOptions({ weekStart: 0, showWeekends: false })
 */
export function provideCalendarOptions(
  options: Partial<CalendarOptions>,
): Provider {
  return {
    provide: CALENDAR_OPTIONS,
    useValue: {
      weekStart: 1,
      showWeekends: true,
      ...options,
    } satisfies CalendarOptions,
  };
}
