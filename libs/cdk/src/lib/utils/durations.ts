/**
 * Symbolic duration utilities — match the `--nxp-duration-*` token scale
 * exposed via Tailwind utilities `duration-fast | -normal | -slow`.
 *
 * Use these constants in `cx()` arrays to keep transition timings on-token.
 */
export const DURATION_FAST = 'duration-fast' as const;
export const DURATION_NORMAL = 'duration-normal' as const;
export const DURATION_SLOW = 'duration-slow' as const;

/** Strong ease-out curve (used by calendar/inputs); arbitrary-value Tailwind class. */
export const EASE_OUT_STRONG =
  '[transition-timing-function:cubic-bezier(0.23,1,0.32,1)]' as const;
