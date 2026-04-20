import { tv } from 'tailwind-variants';
import { cx } from './cx';

/**
 * Day-cell variants for the calendar sheet (7×6 day grid).
 *
 * Maps selection state, adjacent-month dimming, today highlight,
 * and weekend colouring into a single `tv()` call.
 */
export const dayCellVariants = tv({
  base: [
    'relative h-8 w-8 rounded-md',
    'text-sm font-medium text-center',
    'transition-all duration-[80ms]',
    'outline-none focus-visible:ring-1 focus-visible:ring-[#6B97FF]',
  ],
  variants: {
    state: {
      default: 'text-text-primary hover:bg-bg-neutral-1 cursor-pointer',
      active: 'bg-primary-hover text-text-on-accent hover:bg-primary-pressed cursor-pointer',
      startEnd: 'bg-primary-hover text-text-on-accent hover:bg-primary-pressed cursor-pointer',
      middle: 'bg-transparent text-text-action rounded-none cursor-pointer hover:bg-primary/20',
      disabled: 'opacity-40 cursor-not-allowed pointer-events-none text-text-tertiary',
      invisible: 'invisible pointer-events-none',
    },
    adjacent: {
      true: '',
      false: '',
    },
    today: {
      true: '',
      false: '',
    },
    weekend: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { adjacent: true, state: 'default', class: 'text-text-tertiary' },
    { today: true, state: 'default', class: 'font-bold text-text-action' },
    { weekend: true, state: 'default', class: 'text-status-negative' },
    { today: true, weekend: true, state: 'default', class: 'text-status-negative font-bold' },
  ],
  defaultVariants: {
    state: 'default',
    adjacent: false,
    today: false,
    weekend: false,
  },
});

/**
 * Cell variants for year buttons and month buttons in calendar pickers.
 */
export const calendarCellVariants = tv({
  base: [
    'rounded-md text-sm font-medium text-center',
    'transition-all duration-[80ms]',
    'outline-none focus-visible:ring-1 focus-visible:ring-[#6B97FF]',
  ],
  variants: {
    state: {
      default: 'text-text-secondary hover:bg-bg-neutral-1 cursor-pointer',
      selected: 'bg-primary-hover text-text-on-accent hover:bg-primary-pressed cursor-pointer',
      current: 'text-text-action font-bold hover:bg-bg-neutral-1 cursor-pointer',
      disabled: 'opacity-40 cursor-not-allowed pointer-events-none text-text-tertiary',
      rangeStart:
        'bg-primary-hover text-text-on-accent hover:bg-primary-pressed cursor-pointer rounded-r-none',
      rangeEnd:
        'bg-primary-hover text-text-on-accent hover:bg-primary-pressed cursor-pointer rounded-l-none',
      rangeMiddle: 'bg-primary/20 text-text-action rounded-none cursor-pointer',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

/** Shared class for calendar / calendar-month / calendar-range outer wrapper. */
export const calendarContainerClass = cx(
  'inline-flex rounded-xl border border-border-normal bg-bg-base shadow-sm overflow-hidden',
);

/** Shared class for prev/next navigation buttons in calendar headers. */
export const navButtonClass = cx(
  'flex items-center justify-center',
  'h-7 w-7 rounded-md',
  'text-text-secondary',
  'hover:bg-bg-neutral-1',
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
  'transition-all duration-[80ms]',
  'outline-none focus-visible:ring-1 focus-visible:ring-[#6B97FF]',
);
