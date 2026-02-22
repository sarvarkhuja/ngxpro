import { InjectionToken, Provider } from '@angular/core';

export interface CalendarMonthOptions {
  rangeMode: boolean;
}

const DEFAULTS: CalendarMonthOptions = { rangeMode: false };

export const CALENDAR_MONTH_OPTIONS = new InjectionToken<CalendarMonthOptions>(
  'CalendarMonthOptions',
  { providedIn: 'root', factory: () => DEFAULTS },
);

export function provideCalendarMonthOptions(
  opts: Partial<CalendarMonthOptions>,
): Provider {
  return {
    provide: CALENDAR_MONTH_OPTIONS,
    useValue: { ...DEFAULTS, ...opts } satisfies CalendarMonthOptions,
  };
}
