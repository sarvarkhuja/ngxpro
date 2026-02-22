/**
 * Calendar view mode: month grid or year picker.
 */
export type CalendarView = 'month' | 'year';

/**
 * Day range state for range-selection highlighting.
 * - 'active'  — single selected day (no range)
 * - 'start'   — first day of a range
 * - 'middle'  — day between start and end of a range
 * - 'end'     — last day of a range
 * - null      — not selected
 */
export type DayRange = 'active' | 'start' | 'middle' | 'end' | null;

/**
 * Returns dot-marker colors for a given date.
 * - []                    — no markers
 * - [color]               — one dot
 * - [color1, color2]      — two dots
 */
export type MarkerHandler = (date: Date) => [] | [string] | [string, string];

/**
 * Returns true when a given date should be disabled.
 */
export type DisabledHandler = (date: Date) => boolean;

/**
 * Day of the week to start the calendar grid on.
 * 0 = Sunday, 1 = Monday (default), …, 6 = Saturday.
 */
export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;
