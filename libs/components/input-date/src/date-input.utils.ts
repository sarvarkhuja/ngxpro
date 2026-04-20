// ---- Formatting ----

/** Format a Date as MM/DD/YYYY */
export function formatDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}/${d}/${date.getFullYear()}`;
}

/** Format [Date, Date] range as "MM/DD/YYYY – MM/DD/YYYY" */
export function formatDateRange(range: [Date, Date]): string {
  return `${formatDate(range[0])} – ${formatDate(range[1])}`;
}

/** Format MonthCoord as "Month YYYY" */
export function formatMonth(coord: { year: number; month: number }): string {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${names[coord.month]} ${coord.year}`;
}

// ---- Parsing ----

/**
 * Parse a string into a Date. Accepts:
 *   MM/DD/YYYY  MM-DD-YYYY  YYYY-MM-DD
 * Returns null if parsing fails.
 */
export function parseDate(str: string): Date | null {
  str = str.trim();
  let m: RegExpMatchArray | null;

  // MM/DD/YYYY or MM-DD-YYYY
  if ((m = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/))) {
    const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
    return isNaN(d.getTime()) ? null : d;
  }
  // YYYY-MM-DD
  if ((m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/))) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Parse "MM/DD/YYYY – MM/DD/YYYY" into a [Date, Date] range.
 * Returns null if parsing fails.
 */
export function parseDateRange(str: string): [Date, Date] | null {
  const parts = str.split(/\s*[–—-]\s*/);
  if (parts.length !== 2) return null;
  const from = parseDate(parts[0]);
  const to = parseDate(parts[1]);
  if (!from || !to) return null;
  return from <= to ? [from, to] : [to, from];
}
