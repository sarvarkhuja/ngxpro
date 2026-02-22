/**
 * Reusable focus ring styles (Tremor pattern).
 * Uses `brand-*` color tokens — responds to the active color scheme.
 * Use with cx() for consistent focus styling across components.
 */
export const focusRing = [
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  'outline-brand-500 dark:outline-brand-500',
] as const;

/**
 * Focus styles for input elements (Tremor pattern).
 * Uses `brand-*` color tokens — responds to the active color scheme.
 */
export const focusInput = [
  'focus:ring-2',
  'focus:ring-brand-200 dark:focus:ring-brand-700/30',
  'focus:border-brand-500 dark:focus:border-brand-700',
] as const;

/**
 * Error input styles (Tremor pattern).
 */
export const hasErrorInput = [
  'ring-2',
  'border-red-500 dark:border-red-700',
  'ring-red-200 dark:ring-red-700/30',
] as const;
