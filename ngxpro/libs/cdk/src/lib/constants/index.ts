const emptyRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
} as const;

/**
 * An empty DOMRect with all values set to zero. Used as a safe fallback
 * when no element rect is available.
 */
export const EMPTY_CLIENT_RECT: DOMRect = {
  ...emptyRect,
  toJSON: () => emptyRect,
};

/** Unicode zero-width space character. */
export const CHAR_ZERO_WIDTH_SPACE = '\u200B';

/** Unicode non-breaking space character. */
export const CHAR_NO_BREAK_SPACE = '\u00A0';

/** A handler that always returns true. */
export const NXP_TRUE_HANDLER = (): true => true;

/** A handler that always returns false. */
export const NXP_FALSE_HANDLER = (): false => false;

export { NXP_STRICT_MATCHER, NXP_DEFAULT_MATCHER } from './matchers';
export type { NxpStringMatcher } from './matchers';
export {
  NXP_SPRING_MODERATE,
  NXP_SPRING_FAST,
  NXP_SPRING_FAST_EXIT,
  NXP_OPACITY_FAST_MS,
  nxpBuildTransition,
  NXP_TOAST_ENTER,
  NXP_TOAST_EXIT,
  NXP_TOAST_GAP,
  NXP_VISIBLE_TOASTS,
  NXP_SWIPE_THRESHOLD,
  NXP_TIME_BEFORE_UNMOUNT,
} from './motion';
export type { NxpSpringSpec } from './motion';
