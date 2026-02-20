/**
 * Reusable focus ring styles (Tremor pattern).
 * Use with cx() for consistent focus styling across components.
 */
export const focusRing = [
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  'outline-blue-500 dark:outline-blue-500',
] as const;

/**
 * Focus styles for input elements (Tremor pattern).
 */
export const focusInput = [
  'focus:ring-2',
  'focus:ring-blue-200 dark:focus:ring-blue-700/30',
  'focus:border-blue-500 dark:focus:border-blue-700',
] as const;

/**
 * Error input styles (Tremor pattern).
 */
export const hasErrorInput = [
  'ring-2',
  'border-red-500 dark:border-red-700',
  'ring-red-200 dark:ring-red-700/30',
] as const;
