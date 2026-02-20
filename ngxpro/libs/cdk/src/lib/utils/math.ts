/**
 * Clamps a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to a given number of decimal places.
 */
export function round(value: number, decimals: number = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Normalizes a value within a range to 0-1.
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

/**
 * Converts a normalized value (0-1) to percentage string.
 */
export function toPercent(value: number): string {
  return `${round(value * 100, 2)}%`;
}
