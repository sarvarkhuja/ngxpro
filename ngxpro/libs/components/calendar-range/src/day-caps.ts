/** Start of day (strip time). */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Returns the effective min boundary, clamped by maxLength when picking.
 * When pickedStart is set and maxLength > 0:
 *   effectiveMin = max(globalMin, pickedStart - (maxLength - 1))
 */
export function computeEffectiveMin(
  globalMin: Date | null,
  pickedStart: Date | null,
  maxLength: number | null,
): Date | null {
  if (!pickedStart || !maxLength) return globalMin;
  const clamped = addDays(startOfDay(pickedStart), -(maxLength - 1));
  if (!globalMin) return clamped;
  return clamped > startOfDay(globalMin) ? clamped : globalMin;
}

/**
 * Returns the effective max boundary, clamped by maxLength when picking.
 * When pickedStart is set and maxLength > 0:
 *   effectiveMax = min(globalMax, pickedStart + (maxLength - 1))
 */
export function computeEffectiveMax(
  globalMax: Date | null,
  pickedStart: Date | null,
  maxLength: number | null,
): Date | null {
  if (!pickedStart || !maxLength) return globalMax;
  const clamped = addDays(startOfDay(pickedStart), maxLength - 1);
  if (!globalMax) return clamped;
  return clamped < startOfDay(globalMax) ? clamped : globalMax;
}
