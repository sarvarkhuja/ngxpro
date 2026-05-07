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
 * Error input styles — uses semantic status-negative token.
 */
export const hasErrorInput = [
  'ring-2',
  'border-status-negative',
  'ring-status-negative/30',
] as const;
