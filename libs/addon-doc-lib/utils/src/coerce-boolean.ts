/**
 * Returns `true` only when `value` stringifies to the literal `'true'`.
 * Mirrors Taiga's `tuiCoerceValueIsTrue` for query-param parsing.
 */
export function nxpCoerceValueIsTrue(value?: boolean | string): boolean {
  return value?.toString() === 'true';
}
