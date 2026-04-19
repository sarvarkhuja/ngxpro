import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { cx } from '@nxp/cdk';
import {
  NXP_BADGE_COLORS,
  NXP_BADGE_OPTIONS,
  type NxpBadgeColor,
  type NxpBadgeSize,
  type NxpBadgeVariant,
} from './badge.options';

const SIZE_CLASSES: Record<NxpBadgeSize, string> = {
  sm: 'h-5 px-2 text-[11px] gap-1',
  md: 'h-6 px-2.5 text-[12px] gap-1.5',
  lg: 'h-7 px-3 text-[13px] gap-1.5',
};

const DOT_SIZE: Record<NxpBadgeSize, number> = {
  sm: 6,
  md: 7,
  lg: 8,
};

/**
 * Badge component — compact label for status, category, or metadata.
 *
 * Supports `solid` (tinted background) and `dot` (border + colored indicator)
 * variants with the full Tailwind color palette.
 *
 * @example
 * <nxp-badge color="violet">Fiction</nxp-badge>
 *
 * @example
 * <nxp-badge variant="dot" color="green">Active</nxp-badge>
 */
@Component({
  selector: 'nxp-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
  },
  template: `
    @if (variant() === 'dot') {
      <span
        class="shrink-0 rounded-full"
        [style.width.px]="dotSize()"
        [style.height.px]="dotSize()"
        [style.background-color]="dotColor()"
      ></span>
    }
    <ng-content />
  `,
})
export class NxpBadgeComponent {
  private readonly options = inject(NXP_BADGE_OPTIONS);

  /** Visual style: solid uses a tinted background; dot shows a colored indicator. */
  readonly variant = input<NxpBadgeVariant>(this.options.variant);

  /** Size of the badge. */
  readonly size = input<NxpBadgeSize>(this.options.size);

  /** Color from the Tailwind palette. */
  readonly color = input<NxpBadgeColor>(this.options.color);

  /** Additional CSS classes merged via cx(). */
  readonly class = input<string>('');

  readonly hostClasses = computed(() => {
    const isDot = this.variant() === 'dot';

    return cx(
      'inline-flex items-center font-medium rounded-md select-none whitespace-nowrap',
      SIZE_CLASSES[this.size()],
      isDot && 'border border-gray-200 text-gray-700 dark:border-gray-700/80 dark:text-gray-300',
      this.class(),
    );
  });

  readonly hostStyles = computed(() => {
    const colorKey = this.color();
    const colorValue = NXP_BADGE_COLORS[colorKey];
    const isSolid = this.variant() === 'solid';

    if (isSolid) {
      return colorKey === 'gray'
        ? 'background-color: var(--color-gray-100); color: var(--color-gray-700)'
        : `color: var(--color-gray-700); background-color: color-mix(in srgb, ${colorValue} 15%, var(--color-gray-50, #f9fafb))`;
    }

    return '';
  });

  readonly dotSize = computed(() => DOT_SIZE[this.size()]);

  readonly dotColor = computed(() => {
    const colorKey = this.color();
    return colorKey === 'gray'
      ? 'var(--color-gray-400)'
      : NXP_BADGE_COLORS[colorKey];
  });
}
