/**
 * Reusable focus ring styles (Tremor pattern).
 * Uses semantic nxp-* design tokens that auto-switch in dark mode.
 * Use with cx() for consistent focus styling across components.
 */
export const focusRing = [
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  'outline-border-focus',
] as const;

/**
 * Focus styles for input elements (Tremor pattern).
 * Uses semantic nxp-* design tokens that auto-switch in dark mode.
 */
export const focusInput = [
  'focus:ring-2',
  'focus:ring-primary/30',
  'focus:border-primary',
] as const;

/**
 * Error input styles (Tremor pattern).
 */
export const hasErrorInput = [
  'ring-2',
  'border-red-500 dark:border-red-700',
  'ring-red-200 dark:ring-red-700/30',
] as const;
