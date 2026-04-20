/**
 * Coerces a value to a boolean.
 */
export function coerceBooleanProperty(value: unknown): boolean {
  return value != null && `${value}` !== 'false';
}

/**
 * Coerces a value to a number, falling back to the provided default.
 */
export function coerceNumberProperty(value: unknown, fallback = 0): number {
  if (value == null) return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

/**
 * Coerces a value to a string array.
 */
export function coerceStringArray(
  value: string | readonly string[],
  separator: string | RegExp = /\s+/,
): string[] {
  if (Array.isArray(value)) return [...value];
  return typeof value === 'string' ? value.split(separator).filter(Boolean) : [];
}
