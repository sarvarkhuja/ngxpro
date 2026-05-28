/**
 * Reusable focus and elevation styles aligned with the Vercel/Geist design
 * system documented in design-system.md. Uses semantic nxp-* tokens that
 * auto-switch in dark mode.
 *
 * Use with cx() for consistent treatment across components.
 */

/**
 * Focus ring for outline-style focusable elements (buttons, links).
 * Renders a 2px outline-offset blue ring on keyboard focus only.
 */
export const focusRing = [
  'outline-none outline-offset-2',
  'focus-visible:outline-2 focus-visible:outline-border-focus',
] as const;

/**
 * Focus styles for input-style elements that already have a visible border.
 * Replaces the border with the focus blue and adds a soft halo ring.
 */
export const focusInput = [
  'focus-visible:outline-none',
  'focus-visible:border-border-focus',
  'focus-visible:ring-2 focus-visible:ring-border-focus/20',
] as const;

/**
 * Error state for input-style elements — uses semantic status-negative token.
 */
export const hasErrorInput = [
  'border-status-negative',
  'ring-2 ring-status-negative/20',
] as const;

/**
 * Vercel signature — replaces traditional CSS `border` with a zero-offset,
 * 1px-spread shadow. Allows borders to live in the shadow layer (smooth
 * transitions, no clipping at rounded corners, subtler visual weight).
 *
 * Use when the element has a rounded corner OR animates its border.
 */
export const shadowBorder = ['shadow-border'] as const;

/**
 * Lighter shadow-border for tabs, image containers, and secondary surfaces.
 */
export const shadowBorderLight = ['shadow-border-light'] as const;

/**
 * Vercel multi-layer card shadow — border + soft elevation + ambient depth +
 * inner #fafafa highlight. The inner ring is what gives Vercel cards their
 * subtle inner glow; do not omit.
 */
export const shadowCard = ['shadow-card'] as const;

/**
 * Featured/elevated card shadow — adds the wider 8px ambient layer for
 * highlighted panels.
 */
export const shadowCardLg = ['shadow-card-lg'] as const;
