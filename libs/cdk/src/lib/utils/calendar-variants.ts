import { tv } from 'tailwind-variants';
import { cx } from './cx';

const EASE_OUT_STRONG = '[transition-timing-function:cubic-bezier(0.23,1,0.32,1)]';

const INTERACTIVE_BASE = [
  'transition-[background-color,color,transform,box-shadow,opacity] duration-150',
  EASE_OUT_STRONG,
  'outline-none',
  'focus-visible:ring-1 focus-visible:ring-border-focus focus-visible:ring-offset-0',
  'active:scale-[0.97]',
  'will-change-transform',
];

export const dayCellVariants = tv({
  base: [
    'relative h-9 w-9 rounded-lg',
    'text-sm font-medium text-center',
    ...INTERACTIVE_BASE,
  ],
  variants: {
    state: {
      default: 'text-text-primary hover:bg-bg-neutral-1 cursor-pointer',
      active:
        'bg-primary-hover text-text-on-accent shadow-sm shadow-primary/20 hover:bg-primary-pressed cursor-pointer',
      startEnd:
        'bg-primary-hover text-text-on-accent shadow-sm shadow-primary/20 hover:bg-primary-pressed cursor-pointer',
      middle:
        'bg-transparent text-text-action rounded-none hover:bg-primary/15 cursor-pointer active:scale-100',
      disabled:
        'opacity-30 cursor-not-allowed pointer-events-none text-text-tertiary',
      invisible: 'invisible pointer-events-none',
    },
    adjacent: { true: '', false: '' },
    today: { true: '', false: '' },
    weekend: { true: '', false: '' },
  },
  compoundVariants: [
    { adjacent: true, state: 'default', class: 'text-text-tertiary/70' },
    { today: true, state: 'default', class: 'font-semibold text-text-action' },
    { weekend: true, state: 'default', class: 'text-status-negative/90' },
    {
      today: true,
      weekend: true,
      state: 'default',
      class: 'text-status-negative font-semibold',
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
  base: [
    'rounded-lg text-sm font-medium text-center',
    ...INTERACTIVE_BASE,
  ],
  variants: {
    state: {
      default: 'text-text-secondary hover:bg-bg-neutral-1 cursor-pointer',
      selected:
        'bg-primary-hover text-text-on-accent shadow-sm shadow-primary/20 hover:bg-primary-pressed cursor-pointer',
      current: 'text-text-action font-semibold hover:bg-bg-neutral-1 cursor-pointer',
      disabled:
        'opacity-30 cursor-not-allowed pointer-events-none text-text-tertiary',
      rangeStart:
        'bg-primary-hover text-text-on-accent shadow-sm shadow-primary/20 hover:bg-primary-pressed cursor-pointer rounded-r-none',
      rangeEnd:
        'bg-primary-hover text-text-on-accent shadow-sm shadow-primary/20 hover:bg-primary-pressed cursor-pointer rounded-l-none',
      rangeMiddle:
        'bg-primary/15 text-text-action rounded-none cursor-pointer active:scale-100 hover:bg-primary/20',
    },
  },
  defaultVariants: { state: 'default' },
});

export const calendarContainerClass = cx(
  'inline-flex rounded-2xl border border-border-normal bg-bg-base',
  'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]',
  'dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-8px_rgba(0,0,0,0.5)]',
  'overflow-hidden',
);

export const navButtonClass = cx(
  'flex items-center justify-center',
  'h-8 w-8 rounded-lg',
  'text-text-secondary',
  'hover:bg-bg-neutral-1 hover:text-text-primary',
  'disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none',
  'transition-[background-color,color,transform] duration-150',
  '[transition-timing-function:cubic-bezier(0.23,1,0.32,1)]',
  'active:scale-[0.94]',
  'outline-none focus-visible:ring-1 focus-visible:ring-border-focus',
);
