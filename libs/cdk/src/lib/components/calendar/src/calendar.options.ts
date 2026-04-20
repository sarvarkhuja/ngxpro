
import { nxpCreateOptions } from '../../../utils';
import type { CalendarOptions } from './calendar-options.interface';

export type { CalendarOptions };

export const [CALENDAR_OPTIONS, provideCalendarOptions] =
  nxpCreateOptions<CalendarOptions>({ weekStart: 1, showWeekends: true });
