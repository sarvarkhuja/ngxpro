import { tv } from 'tailwind-variants';

/**
 * Input field chrome — Vercel/Geist aligned. Single source of truth for the
 * standalone input/textarea look (see design-system.md §4 "Inputs & Forms").
 *
 * - 6px radius (rounded-m) — buttons/functional elements scale
 * - Shadow-as-border (`shadow-border`) instead of CSS `border` so the border
 *   lives in the shadow layer (Vercel signature)
 * - 14px text / 1.43 line-height — design-system "Button / Link" size, the
 *   canonical UI text spec
 * - Hover deepens the shadow-border alpha (`shadow-input-hover`)
 * - Focus replaces the shadow-border with focus-blue + soft 20%-alpha halo
 *   (`shadow-input-focus`; auto-flips for dark mode)
 * - Disabled stays chrome-coloured (no `opacity-*`) — design-system §7
 *
 * No trailing `pr-*` here: consumers (e.g. date pickers) add `pr-10` when
 * they own a fixed trailing adornment; the input *directive* applies
 * `pr-9` dynamically when an icon is projected.
 */
export const inputVariants = tv({
  base: [
    'w-full rounded-m bg-bg-base',
    'shadow-border',
    'px-3 py-2',
    'text-[14px] leading-[1.43] text-text-primary placeholder:text-text-quaternary',
    'transition-[box-shadow,background-color,color] duration-normal',
    '[transition-timing-function:cubic-bezier(0.23,1,0.32,1)]',
    'outline-none ring-0 border-0',
    'hover:shadow-input-hover',
    'focus-visible:shadow-input-focus',
    'disabled:cursor-not-allowed disabled:bg-bg-neutral-1 disabled:text-text-quaternary',
  ],
});
