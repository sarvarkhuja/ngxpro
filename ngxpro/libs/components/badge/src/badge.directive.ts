import {
  Directive,
  computed,
  inject,
  input,
} from '@angular/core';
import { cx } from '@nxp/cdk';
import {
  NXP_BADGE_OPTIONS,
  type NxpBadgeAppearance,
  type NxpBadgeSize,
} from './badge.options';

const SIZE_CLASSES: Record<NxpBadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-xs gap-1',
  s:  'px-2 py-0.5 text-xs gap-1',
  m:  'px-2.5 py-1 text-sm gap-1.5',
  l:  'px-3 py-1 text-sm gap-1.5',
  xl: 'px-3.5 py-1.5 text-base gap-2',
};

const APPEARANCE_CLASSES: Record<NxpBadgeAppearance, string> = {
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  primary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  danger:  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  info:    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

/**
 * Badge directive — apply to any inline element to style it as a badge.
 *
 * Defaults are driven by `NXP_BADGE_OPTIONS` and can be overridden at the
 * component / module level via `nxpBadgeOptionsProvider()`.
 *
 * @example
 * <!-- Basic badge -->
 * <span nxpBadge>New</span>
 *
 * @example
 * <!-- Success badge, large -->
 * <span nxpBadge appearance="success" size="l">Live</span>
 *
 * @example
 * <!-- Override defaults for a subtree -->
 * providers: [nxpBadgeOptionsProvider({ appearance: 'primary', size: 's' })]
 */
@Directive({
  selector: '[nxpBadge]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class NxpBadgeDirective {
  private readonly options = inject(NXP_BADGE_OPTIONS);

  /** Size variant. */
  readonly size = input<NxpBadgeSize>(this.options.size);

  /** Color / semantic appearance. */
  readonly appearance = input<NxpBadgeAppearance>(this.options.appearance);

  /** Additional CSS classes merged via cx(). */
  readonly class = input<string>('');

  readonly hostClasses = computed(() =>
    cx(
      'inline-flex items-center justify-center font-medium rounded-full select-none whitespace-nowrap',
      SIZE_CLASSES[this.size()],
      APPEARANCE_CLASSES[this.appearance()],
      this.class(),
    ),
  );
}
