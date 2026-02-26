import type { DisabledHandler } from 'libs/cdk/src/lib/components/calendar/src';

/** Start of day (strip time). */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Returns a merged disabled handler that enforces `minLength` constraints
 * while a range is being picked (anchor date selected, second end pending).
 *
 * When `pickedStart` is set and `minLength > 0`, days within
 * `[pickedStart - (minLength-1), pickedStart + (minLength-1)]` (exclusive of anchor)
 * are disabled so the user cannot create a range shorter than minLength days.
 */
export function calculateDisabledHandler(
  base: DisabledHandler | null,
  pickedStart: Date | null,
  minLength: number | null,
): DisabledHandler {
  return (day: Date): boolean => {
    if (base?.(day)) return true;
    if (!pickedStart || !minLength || minLength <= 1) return false;

    const d = startOfDay(day).getTime();
    const anchor = startOfDay(pickedStart).getTime();
    const msPerDay = 86_400_000;
    const delta = Math.abs(d - anchor) / msPerDay;

    // Disable days that are too close (would make range < minLength days)
    // delta === 0 is the anchor itself — keep it enabled (allows 1-day range)
    return delta > 0 && delta < minLength;
  };
}
