/**
 * Motion language — CSS-transition approximations of framer-motion spring
 * tiers from `fluidfunctionalizm/registry/default/lib/springs.ts`.
 *
 * CSS transitions cannot produce true spring curves (that would need WAAPI),
 * so we use hand-tuned `cubic-bezier`s with a slight overshoot to match the
 * `fast`/`moderate` feel.
 */

export interface NxpSpringSpec {
  readonly duration: number;
  readonly easing: string;
}

/** Moderate spring — used for the active segment indicator in tabs. */
export const NXP_SPRING_MODERATE: NxpSpringSpec = {
  duration: 160,
  easing: 'cubic-bezier(0.22, 1.2, 0.36, 1)',
} as const;

/** Fast spring — used for hover and focus indicators in tabs. */
export const NXP_SPRING_FAST: NxpSpringSpec = {
  duration: 80,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
} as const;

/**
 * Fast exit spring — asymmetric exit for check/uncheck animations.
 * Uses Material's "acceleration" curve (same shape as ease-in but sharper) —
 * avoids ease-in which feels sluggish on UI entries and exits.
 */
export const NXP_SPRING_FAST_EXIT: NxpSpringSpec = {
  duration: 40,
  easing: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

/** Strong ease-out — punchy settle, recommended default for enters. */
export const NXP_EASE_OUT_STRONG = 'cubic-bezier(0.23, 1, 0.32, 1)';

/** Strong ease-in-out — used for bi-directional transitions (accordion, menu). */
export const NXP_EASE_IN_OUT_STRONG = 'cubic-bezier(0.77, 0, 0.175, 1)';

/** Drawer curve — iOS-style slide with gentle decel. */
export const NXP_EASE_DRAWER = 'cubic-bezier(0.32, 0.72, 0, 1)';

/** Fast opacity fade (e.g. active segment dimming when hovering another tab). */
export const NXP_OPACITY_FAST_MS = 80;

/**
 * Build a CSS transition string for position + size + opacity from a spring spec.
 * Used by animated indicator layers (active segment, hover, focus).
 */
export function nxpBuildTransition(spring: NxpSpringSpec): string {
  const s = `${spring.duration}ms ${spring.easing}`;
  return `left ${s}, top ${s}, width ${s}, height ${s}, opacity ${NXP_OPACITY_FAST_MS}ms linear`;
}

/** Toast enter — Sonner-style overshoot ease. */
export const NXP_TOAST_ENTER: NxpSpringSpec = {
  duration: 400,
  easing: 'cubic-bezier(0.21, 1.02, 0.73, 1)',
};

/** Toast exit — quick ease-out. */
export const NXP_TOAST_EXIT: NxpSpringSpec = {
  duration: 200,
  easing: 'ease-out',
};

/** Gap between stacked toasts (px). */
export const NXP_TOAST_GAP = 14;

/** Maximum number of visible toasts in a stack. */
export const NXP_VISIBLE_TOASTS = 3;

/** Minimum swipe distance (px) to trigger dismiss. */
export const NXP_SWIPE_THRESHOLD = 45;

/** Delay (ms) before unmounting after exit animation starts. */
export const NXP_TIME_BEFORE_UNMOUNT = 200;
