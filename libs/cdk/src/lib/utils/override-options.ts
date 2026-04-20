/**
 * Creates a factory function that overrides specific options keys.
 * Used with nxpDropdownOptionsProvider and similar patterns.
 */
export function nxpOverrideOptions<T>(
  override: Partial<T>,
  fallback: T,
): (directive: T | null, options: T | null) => T {
  return (directive, options) => {
    const result: T = directive || { ...(options || fallback) };
    Object.keys(override).forEach((key) => {
      (result as Record<string, unknown>)[key] = override[key as keyof T];
    });
    return result;
  };
}
