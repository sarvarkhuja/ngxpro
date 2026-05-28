import { tv } from 'tailwind-variants';
import { cx } from './cx';
import { focusRing } from './focus-styles';

const EASE_OUT_STRONG =
  '[transition-timing-function:cubic-bezier(0.23,1,0.32,1)]';

/**
 * Vercel/Geist-aligned interactive base for calendar cells and nav buttons.
 *
 * Focus uses the shared `focusRing` constant (2px outline at +2px offset) —
 * matching the `2px solid hsla(212, 100%, 48%, 1)` treatment defined in
 * design-system.md (Section 6, Focus level).
 *
 * No `will-change-transform` — design philosophy is to strip unnecessary
 * tokens; the brief hover/active transform doesn't justify a permanent
 * composite layer per cell.
 */
const INTERACTIVE_BASE = [
  'transition-[background-color,color,transform,box-shadow,opacity] duration-normal',
  EASE_OUT_STRONG,
  ...focusRing,
  'active:scale-[0.97]',
];

export const dayCellVariants = tv({
  base: [
    'relative h-9 w-9 rounded-m',
    'text-sm font-medium text-center',
    ...INTERACTIVE_BASE,
  ],
  variants: {
    state: {
      default: 'text-text-primary hover:bg-bg-neutral-1 cursor-pointer',
      active:
        'bg-primary text-text-on-accent hover:bg-primary-hover cursor-pointer',
      startEnd:
        'bg-primary text-text-on-accent hover:bg-primary-hover cursor-pointer',
      middle:
        'bg-transparent text-text-primary rounded-none hover:bg-primary/15 cursor-pointer active:scale-100',
      disabled:
        'opacity-50 cursor-not-allowed pointer-events-none text-text-tertiary',
      invisible: 'invisible pointer-events-none',
    },
    adjacent: { true: '', false: '' },
    today: { true: '', false: '' },
    weekend: { true: '', false: '' },
  },
  compoundVariants: [
    // Adjacent-month days use the Gray-400 (`--nxp-text-quaternary`) tier —
    // design-system.md §2 reserves this token for "placeholder text, disabled
    // states", which matches the muted-but-readable role of adjacent days.
    { adjacent: true, state: 'default', class: 'text-text-quaternary' },
    // Weekend: subtle gray muting only.
    // Design rule: "Don't apply workflow accent colors decoratively" —
    // Ship Red (#ff5b4f) is reserved for the ship-to-prod workflow context.
    { weekend: true, state: 'default', class: 'text-text-tertiary' },
    // Today: monochromatic emphasis via weight + faint inset ring
    // (no Link Blue — accent colors stay out of decorative use)
    {
      today: true,
      state: 'default',
      class:
        'font-semibold text-text-primary ring-1 ring-inset ring-text-primary/25',
    },
    // Today + weekend: today's emphasis wins, stays achromatic
    {
      today: true,
      weekend: true,
      state: 'default',
      class:
        'font-semibold text-text-primary ring-1 ring-inset ring-text-primary/25',
    },
  ],
  defaultVariants: {
    state: 'default',
    adjacent: false,
    today: false,
    weekend: false,
  },
});

export const calendarCellVariants = tv({
  base: ['rounded-m text-sm font-medium text-center', ...INTERACTIVE_BASE],
  variants: {
    state: {
      default: 'text-text-secondary hover:bg-bg-neutral-1 cursor-pointer',
      selected:
        'bg-primary text-text-on-accent hover:bg-primary-hover cursor-pointer',
      // "Current" (e.g., this year / this month): achromatic — weight + ring,
      // not Link Blue. Keeps the workflow-accent palette reserved for
      // pipeline contexts only.
      current:
        'font-semibold text-text-primary ring-1 ring-inset ring-text-primary/25 hover:bg-bg-neutral-1 cursor-pointer',
      disabled:
        'opacity-50 cursor-not-allowed pointer-events-none text-text-tertiary',
      rangeStart:
        'bg-primary text-text-on-accent hover:bg-primary-hover cursor-pointer rounded-r-none',
      rangeEnd:
        'bg-primary text-text-on-accent hover:bg-primary-hover cursor-pointer rounded-l-none',
      // Range middle uses the semantic Gray-50 neutral (`--nxp-bg-neutral-1`)
      // rather than a primary-tinted transparency. Both render ~Gray-100 in
      // light mode, but the semantic token is closer to design-system.md's
      // strict achromatic discipline and flips correctly in dark mode.
      rangeMiddle:
        'bg-bg-neutral-1 text-text-primary rounded-none cursor-pointer active:scale-100 hover:bg-bg-neutral-2',
    },
  },
  defaultVariants: { state: 'default' },
});

/**
 * Calendar surface — uses the Vercel signature `shadow-card` token
 * (multi-layer: 1px shadow-border + 2px ambient + inner #fafafa highlight).
 * 8px radius (rounded-lg) per the card scale in design-system.md §5.
 */
export const calendarContainerClass = cx(
  'inline-flex rounded-lg bg-bg-base shadow-card',
  'overflow-hidden',
);

export const navButtonClass = cx(
  'flex items-center justify-center',
  'h-8 w-8 rounded-m',
  'text-text-secondary',
  'hover:bg-bg-neutral-1 hover:text-text-primary',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  'transition-[background-color,color,transform] duration-normal',
  EASE_OUT_STRONG,
  // Match day-cell active-scale; consistent press feedback across calendar.
  'active:scale-[0.97]',
  ...focusRing,
);
