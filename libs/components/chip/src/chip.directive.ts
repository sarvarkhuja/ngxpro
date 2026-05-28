import { Directive, computed, inject, input } from '@angular/core';
import { cx } from '@ngxpro/cdk';
import {
  NXP_CHIP_OPTIONS,
  type NxpChipAppearance,
  type NxpChipSize,
} from './chip.options';

export const CHIP_SIZE_CLASSES: Record<NxpChipSize, string> = {
  sm: 'h-5 px-2 text-[11px] gap-1',
  md: 'h-6 px-2.5 text-[12px] gap-1',
  lg: 'h-7 px-3 text-[13px] gap-1.5',
};

// Variants stay achromatic for `neutral`/`primary` (no decorative Link Blue)
// and saturated for the semantic status roles (`success`/`warning`/`danger`/
// `info`) — design-system §2/§7: workflow accents reserved for semantic context.
const APPEARANCE_CLASSES: Record<NxpChipAppearance, string> = {
  neutral: 'bg-bg-neutral-1 text-text-secondary',
  primary: 'bg-primary/10 text-text-primary',
  success: 'bg-status-positive-pale text-status-positive',
  warning: 'bg-status-warning-pale text-status-warning',
  danger: 'bg-status-negative-pale text-status-negative',
  info: 'bg-status-info-pale text-status-info',
};

@Directive({
  selector: '[nxpChip]',
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-size]': 'size()',
  },
})
export class NxpChipDirective {
  private readonly options = inject(NXP_CHIP_OPTIONS);

  readonly size = input<NxpChipSize>(this.options.size);
  readonly appearance = input<NxpChipAppearance>(this.options.appearance);
  readonly class = input<string>('');

  readonly hostClasses = computed(() =>
    cx(
      'inline-flex items-center justify-center font-medium rounded-full select-none whitespace-nowrap transition-colors duration-fast',
      CHIP_SIZE_CLASSES[this.size()],
      APPEARANCE_CLASSES[this.appearance()],
      this.class(),
    ),
  );
}
