/**
 * A named preset date-range period, shown in the CalendarRange sidebar.
 * Create instances with `new DateRangePeriod([from, to], 'Label')`.
 */
export class DateRangePeriod {
  constructor(
    public readonly range: [Date, Date],
    public readonly label: string,
  ) {}

  toString(): string {
    return this.label;
  }
}

/** Convenience factory for common preset periods. */
export function createDefaultDateRangePeriods(): DateRangePeriod[] {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterday = new Date(startOfToday);
  yesterday.setDate(yesterday.getDate() - 1);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - ((startOfToday.getDay() + 6) % 7)); // Monday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  return [
    new DateRangePeriod([new Date(0), startOfToday], 'All time'),
    new DateRangePeriod([startOfToday, startOfToday], 'Today'),
    new DateRangePeriod([yesterday, yesterday], 'Yesterday'),
    new DateRangePeriod([startOfWeek, endOfWeek], 'This week'),
    new DateRangePeriod([startOfMonth, endOfMonth], 'This month'),
    new DateRangePeriod([startOfLastMonth, endOfLastMonth], 'Last month'),
  ];
}
