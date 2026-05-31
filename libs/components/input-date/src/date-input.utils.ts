// ---- Formatting ----

/** Format a Date as DD/MM/YYYY */
export function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${date.getFullYear()}`;
}

/** Format [Date, Date] range as "DD/MM/YYYY – DD/MM/YYYY" */
export function formatDateRange(range: [Date, Date]): string {
  return `${formatDate(range[0])} – ${formatDate(range[1])}`;
}

/** Format MonthCoord as "Month YYYY" */
export function formatMonth(coord: { year: number; month: number }): string {
  const names = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${names[coord.month]} ${coord.year}`;
}

// ---- Parsing ----

/**
 * Build a Date from 1-based parts, rejecting rolled-over values.
 *
 * `new Date(2026, 1, 31)` silently rolls to March 3, so a plain `isNaN` check
 * would treat "31/02/2026" as valid. We construct then verify each component
 * round-trips, returning `null` for impossible dates.
 */
function buildDate(year: number, month: number, day: number): Date | null {
  const d = new Date(year, month - 1, day);
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
}

/**
 * Parse a string into a Date. Accepts (day-first):
 *   DD/MM/YYYY  DD-MM-YYYY  YYYY-MM-DD (ISO)
 * Returns null if parsing fails or the date is impossible (e.g. 31/02/2026).
 */
export function parseDate(str: string): Date | null {
  str = str.trim();
  let m: RegExpMatchArray | null;

  // DD/MM/YYYY or DD-MM-YYYY (day-first)
  if ((m = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/))) {
    return buildDate(Number(m[3]), Number(m[2]), Number(m[1]));
  }
  // YYYY-MM-DD (ISO)
  if ((m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/))) {
    return buildDate(Number(m[1]), Number(m[2]), Number(m[3]));
  }
  return null;
}

/**
 * Parse "DD/MM/YYYY – DD/MM/YYYY" into a [Date, Date] range.
 * Returns null if parsing fails.
 */
export function parseDateRange(str: string): [Date, Date] | null {
  const parts = str.split(/\s*[–—]\s*/);
  if (parts.length !== 2) return null;
  const from = parseDate(parts[0]);
  const to = parseDate(parts[1]);
  if (!from || !to) return null;
  return from <= to ? [from, to] : [to, from];
}

// ---- Masking ----

function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

function clamp(n: number, min: number, max: number): number {
  return n < min ? min : n > max ? max : n;
}

/**
 * Mask a raw string of typed characters into a partial/complete `DD/MM/YYYY`.
 *
 * Digits-only (non-digits are stripped) with smart, segment-aware correction:
 *  - day:   first digit 4–9 auto-pads to `0d` (e.g. `5` → `05/`); otherwise the
 *           two-digit day is clamped to `01–31`.
 *  - month: first digit 2–9 auto-pads to `0m` (e.g. `9` → `…/09/`); otherwise the
 *           two-digit month is clamped to `01–12`.
 *  - year:  up to 4 digits, no clamp.
 * A `/` separator is appended eagerly once a segment completes so the next
 * segment is ready for input.
 */
export function maskDate(raw: string): string {
  const ds = raw.replace(/\D/g, '');
  let i = 0;
  let day = '';
  let month = '';
  let year = '';

  // Day
  if (i < ds.length) {
    const d1 = ds[i++];
    if (Number(d1) >= 4) {
      day = '0' + d1;
    } else {
      day = d1;
      if (i < ds.length) {
        const d2 = ds[i++];
        day = String(clamp(Number(d1 + d2), 1, 31)).padStart(2, '0');
      }
    }
  }

  // Month (only once the day is complete)
  if (day.length === 2 && i < ds.length) {
    const m1 = ds[i++];
    if (Number(m1) >= 2) {
      month = '0' + m1;
    } else {
      month = m1;
      if (i < ds.length) {
        const m2 = ds[i++];
        month = String(clamp(Number(m1 + m2), 1, 12)).padStart(2, '0');
      }
    }
  }

  // Year (only once the month is complete)
  if (month.length === 2 && i < ds.length) {
    year = ds.slice(i, i + 4);
  }

  let out = day;
  if (day.length === 2) out += '/' + month;
  if (month.length === 2) out += '/' + year;
  return out;
}

/**
 * Mask a raw string into a partial/complete `DD/MM/YYYY – DD/MM/YYYY` range.
 * First 8 digits drive the start date, the next 8 the end date; a ` – `
 * separator is appended eagerly once the start date is complete.
 */
export function maskDateRange(raw: string): string {
  const ds = raw.replace(/\D/g, '').slice(0, 16);
  if (ds.length < 8) return maskDate(ds);
  const start = maskDate(ds.slice(0, 8));
  if (ds.length === 8) return `${start} – `;
  return `${start} – ${maskDate(ds.slice(8))}`;
}

/** Count digit characters in the first `n` characters of `str` (for caret mapping). */
export function digitsBefore(str: string, n: number): number {
  let count = 0;
  const end = Math.min(n, str.length);
  for (let i = 0; i < end; i++) {
    if (isDigit(str[i])) count++;
  }
  return count;
}

/**
 * Index in `masked` just after its `digitCount`-th digit (for caret mapping).
 * Returns 0 for a non-positive count and `masked.length` if there aren't that
 * many digits.
 */
export function caretForDigitCount(masked: string, digitCount: number): number {
  if (digitCount <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < masked.length; i++) {
    if (isDigit(masked[i])) {
      seen++;
      if (seen === digitCount) return i + 1;
    }
  }
  return masked.length;
}
