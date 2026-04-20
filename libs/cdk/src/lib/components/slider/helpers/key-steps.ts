import { round } from '../../../utils/math';

/**
 * Used as a limit for eliminating JS issues with floating point math.
 */
export const NXP_FLOATING_PRECISION = 7;

/**
 * Steps for splitting sliders into different linear dependencies.
 * Each element has the form [percent, value].
 *
 * Example: a range from 50,000 to 30,000,000 with three distinct step sizes can be
 * described by providing key points at each inflection in the progression.
 *
 * @example
 * const keySteps: NxpKeySteps = [
 *   [0, 50_000],
 *   [28.8, 200_000],
 *   [44.2, 1_000_000],
 *   [100, 30_000_000],
 * ];
 */
export type NxpKeySteps = [[0, number], ...Array<[number, number]>, [100, number]];

function findKeyStepBoundaries(
  keySteps: NxpKeySteps,
  fn: (step: [number, number]) => boolean,
): [[number, number], [number, number]] {
  const upperIndex = keySteps.findIndex((step, i) => i > 0 && fn(step));
  const lower = keySteps[upperIndex - 1] ?? keySteps[0];
  const upper = keySteps[upperIndex] ?? keySteps[keySteps.length - 1] ?? [0, 0];

  return [lower as [number, number], upper as [number, number]];
}

/**
 * Converts a percentage (0–100) to the real domain value using key steps.
 */
export function nxpPercentageToKeyStepValue(
  percentage: number,
  keySteps: NxpKeySteps,
): number {
  const [[lowerPercent, lowerValue], [upperPercent, upperValue]] =
    findKeyStepBoundaries(keySteps, ([p]) => percentage <= p);
  const ratio = (percentage - lowerPercent) / (upperPercent - lowerPercent);
  const value = (upperValue - lowerValue) * ratio + lowerValue;

  return round(value, NXP_FLOATING_PRECISION);
}

/**
 * Converts a real domain value to the percentage (0–100) using key steps.
 */
export function nxpKeyStepValueToPercentage(value: number, keySteps: NxpKeySteps): number {
  const [[lowerPercent, lowerValue], [upperPercent, upperValue]] =
    findKeyStepBoundaries(keySteps, ([, v]) => value <= v);
  const ratio = (value - lowerValue) / (upperValue - lowerValue) || 0;

  return (upperPercent - lowerPercent) * ratio + lowerPercent;
}
