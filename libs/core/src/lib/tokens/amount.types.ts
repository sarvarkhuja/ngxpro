/**
 * Alignment of currency symbol relative to the numeric value.
 * - 'start': Currency symbol appears before the value (e.g., "$1,234.56")
 * - 'end': Currency symbol appears after the value (e.g., "1,234.56 €")
 */
export type AmountAlign = 'start' | 'end';

/**
 * Sign display strategy for amount values.
 * - 'always': Always show sign (+ or -)
 * - 'negative-only': Only show sign for negative values (-)
 * - 'never': Never show sign
 * - 'force-positive': Always show positive sign (+)
 * - 'force-negative': Always show negative sign (-)
 */
export type AmountSign =
  | 'always'
  | 'negative-only'
  | 'never'
  | 'force-positive'
  | 'force-negative';

/**
 * The actual sign symbol to display.
 * Note: Uses Unicode minus sign (U+2212) '−' instead of hyphen-minus '-'
 */
export type AmountSignSymbol = '+' | '−' | '';
