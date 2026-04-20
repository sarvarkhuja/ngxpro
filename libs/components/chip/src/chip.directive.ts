import {
  Directive,
  computed,
  inject,
  input,
} from '@angular/core';
import { cx } from '@nxp/cdk';
import {
  NXP_CHIP_OPTIONS,
  type NxpChipAppearance,
  type NxpChipSize,
} from './chip.options';

export const CHIP_SIZE_CLASSES: Record<NxpChipSize, string> = {
  xs: 'h-5 px-2 text-xs gap-1',
  s:  'h-6 px-2.5 text-xs gap-1',
  m:  'h-7 px-3 text-sm gap-1.5',
};

const APPEARANCE_CLASSES: Record<NxpChipAppearance, string> = {
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  primary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  danger:  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  info:    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
};

@Directive({
  selector: '[nxpChip]',
  standalone: true,
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
      'inline-flex items-center justify-center font-medium rounded-full select-none whitespace-nowrap transition-colors',
      CHIP_SIZE_CLASSES[this.size()],
      APPEARANCE_CLASSES[this.appearance()],
      this.class(),
    ),
  );
}
