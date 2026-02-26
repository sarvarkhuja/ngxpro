/**
 * Type guard that checks if a value is a string.
 */
export function nxpIsString(value: unknown): value is string {
  return typeof value === 'string';
}
