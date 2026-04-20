import { tv } from 'tailwind-variants';

/**
 * Shared input variants for date input components.
 *
 * Replaces the duplicated `INPUT_BASE` constant across
 * input-date, input-date-range, and input-month.
 */
export const inputVariants = tv({
  base: [
    'w-full rounded-md border border-border-normal bg-bg-base px-3 py-2 pr-10',
    'text-sm text-text-primary placeholder-text-tertiary',
    'shadow-sm transition-all duration-[80ms]',
    'outline-none ring-0',
    'focus-visible:ring-1 focus-visible:ring-[#6B97FF]',
    'disabled:cursor-not-allowed disabled:bg-bg-neutral-1 disabled:text-text-tertiary',
  ],
});
