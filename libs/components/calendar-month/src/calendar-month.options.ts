import { nxpCreateOptions } from '@ngxpro/cdk';

export interface CalendarMonthOptions {
  rangeMode: boolean;
}

export const [CALENDAR_MONTH_OPTIONS, provideCalendarMonthOptions] =
  nxpCreateOptions<CalendarMonthOptions>({ rangeMode: false });
