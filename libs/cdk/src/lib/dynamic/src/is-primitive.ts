export function nxpIsPrimitive(value: unknown): boolean {
  return Object(value) !== value;
}
