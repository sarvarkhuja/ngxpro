import { tv } from 'tailwind-variants';

export const inputVariants = tv({
  base: [
    'w-full rounded-lg border border-border-normal bg-bg-base',
    'px-3.5 py-2.5 pr-10',
    'text-sm text-text-primary placeholder:text-text-tertiary',
    'shadow-sm transition-[border-color,box-shadow,background-color,color] duration-150',
    '[transition-timing-function:cubic-bezier(0.23,1,0.32,1)]',
    'outline-none ring-0',
    'hover:border-border-strong',
    'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
    'disabled:cursor-not-allowed disabled:bg-bg-neutral-1 disabled:text-text-tertiary',
    'disabled:hover:border-border-normal',
  ],
});
