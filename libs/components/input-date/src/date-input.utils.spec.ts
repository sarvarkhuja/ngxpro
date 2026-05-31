import {
  caretForDigitCount,
  digitsBefore,
  formatDate,
  formatDateRange,
  maskDate,
  maskDateRange,
  parseDate,
  parseDateRange,
} from './date-input.utils';

describe('date-input.utils', () => {
  describe('formatDate', () => {
    it('formats day-first as DD/MM/YYYY', () => {
      expect(formatDate(new Date(2026, 0, 5))).toBe('05/01/2026');
      expect(formatDate(new Date(2026, 11, 31))).toBe('31/12/2026');
    });
  });

  describe('formatDateRange', () => {
    it('joins two dates with an en-dash', () => {
      const range: [Date, Date] = [new Date(2026, 0, 1), new Date(2026, 0, 31)];
      expect(formatDateRange(range)).toBe('01/01/2026 – 31/01/2026');
    });
  });

  describe('maskDate', () => {
    it('returns empty for empty/non-digit input', () => {
      expect(maskDate('')).toBe('');
      expect(maskDate('abc')).toBe('');
    });

    it('keeps a single low day digit pending', () => {
      expect(maskDate('3')).toBe('3');
    });

    it('auto-pads and advances a high first day digit (4–9)', () => {
      expect(maskDate('5')).toBe('05/');
      expect(maskDate('9')).toBe('09/');
    });

    it('completes the day with an eager separator', () => {
      expect(maskDate('31')).toBe('31/');
      expect(maskDate('12')).toBe('12/');
    });

    it('clamps an impossible day to 01–31', () => {
      expect(maskDate('39')).toBe('31/');
      expect(maskDate('00')).toBe('01/');
    });

    it('auto-pads and advances a high first month digit (2–9)', () => {
      expect(maskDate('319')).toBe('31/09/');
    });

    it('clamps an impossible month to 01–12', () => {
      expect(maskDate('3119')).toBe('31/12/');
      expect(maskDate('3100')).toBe('31/01/');
    });

    it('builds a full DD/MM/YYYY from 8 digits', () => {
      expect(maskDate('31122026')).toBe('31/12/2026');
    });

    it('strips embedded non-digits', () => {
      expect(maskDate('3/1/1/2/2026')).toBe('31/12/2026');
      expect(maskDate('ab31cd12ef2026')).toBe('31/12/2026');
    });

    it('caps at 8 digits', () => {
      expect(maskDate('311220269999')).toBe('31/12/2026');
    });
  });

  describe('maskDateRange', () => {
    it('masks the first date below 8 digits', () => {
      expect(maskDateRange('31')).toBe('31/');
      expect(maskDateRange('311')).toBe('31/1');
    });

    it('appends an eager separator once the start date completes', () => {
      expect(maskDateRange('31122026')).toBe('31/12/2026 – ');
    });

    it('masks the end date after the separator', () => {
      expect(maskDateRange('3112202601')).toBe('31/12/2026 – 01/');
      expect(maskDateRange('3112202601012027')).toBe('31/12/2026 – 01/01/2027');
    });

    it('caps at 16 digits', () => {
      expect(maskDateRange('31122026010120279999')).toBe(
        '31/12/2026 – 01/01/2027',
      );
    });
  });

  describe('parseDate', () => {
    it('parses day-first DD/MM/YYYY', () => {
      const d = parseDate('31/12/2026');
      expect(d).not.toBeNull();
      expect(d?.getFullYear()).toBe(2026);
      expect(d?.getMonth()).toBe(11);
      expect(d?.getDate()).toBe(31);
    });

    it('parses 1–2 digit day/month', () => {
      const d = parseDate('1/2/2026');
      expect(d?.getDate()).toBe(1);
      expect(d?.getMonth()).toBe(1);
    });

    it('parses DD-MM-YYYY and ISO YYYY-MM-DD', () => {
      expect(parseDate('05-01-2026')?.getMonth()).toBe(0);
      expect(parseDate('2026-01-05')?.getDate()).toBe(5);
    });

    it('rejects impossible (rolled-over) dates', () => {
      expect(parseDate('31/02/2026')).toBeNull();
      expect(parseDate('29/02/2026')).toBeNull();
      expect(parseDate('13/13/2026')).toBeNull();
    });

    it('accepts a valid leap day', () => {
      expect(parseDate('29/02/2024')).not.toBeNull();
    });

    it('returns null for garbage', () => {
      expect(parseDate('garbage')).toBeNull();
      expect(parseDate('')).toBeNull();
    });
  });

  describe('parseDateRange', () => {
    it('parses a full range and sorts ascending', () => {
      const r = parseDateRange('31/12/2026 – 01/01/2027');
      expect(r).not.toBeNull();
      expect(r?.[0]?.getFullYear()).toBe(2026);
      expect(r?.[1]?.getFullYear()).toBe(2027);
    });

    it('returns null when either side is incomplete', () => {
      expect(parseDateRange('31/12/2026 – ')).toBeNull();
      expect(parseDateRange('31/12/2026')).toBeNull();
    });
  });

  describe('digitsBefore', () => {
    it('counts digits in the prefix', () => {
      expect(digitsBefore('31/12/2026', 5)).toBe(4);
      expect(digitsBefore('31/', 3)).toBe(2);
      expect(digitsBefore('', 5)).toBe(0);
    });
  });

  describe('caretForDigitCount', () => {
    it('maps a digit count to the index after that digit', () => {
      expect(caretForDigitCount('31/12/2026', 0)).toBe(0);
      expect(caretForDigitCount('31/12/2026', 2)).toBe(2);
      expect(caretForDigitCount('31/12/2026', 4)).toBe(5);
    });

    it('clamps to the string length when out of range', () => {
      expect(caretForDigitCount('31/12/2026', 100)).toBe(10);
    });
  });
});
