import { Directive, computed, contentChild, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { cx } from '@nxp/cdk';
import {
  NXP_BLOCK_OPTIONS,
  type NxpBlockAppearance,
  type NxpBlockSize,
} from './block.options';

const SIZE_CLASSES: Record<NxpBlockSize, string> = {
  s: 'px-3 py-2 text-sm',
  m: 'px-4 py-3 text-sm',
  l: 'px-4 py-4 text-base',
};

const APPEARANCE_CLASSES: Record<NxpBlockAppearance, string> = {
  outline: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
  filled:  'border-transparent bg-gray-100 dark:bg-gray-800',
  primary: 'border-blue-500/30 bg-blue-50 dark:border-blue-400/30 dark:bg-blue-950/30',
  success: 'border-green-500/30 bg-green-50 dark:border-green-400/30 dark:bg-green-950/30',
  danger:  'border-red-500/30 bg-red-50 dark:border-red-400/30 dark:bg-red-950/30',
};

/**
 * Block directive — apply to `label` or `input` to style it as a selectable card.
 *
 * Typically wraps a checkbox or radio so the entire card is clickable.
 * Mirrors disabled state from any nested `NgControl`.
 *
 * Defaults are driven by `NXP_BLOCK_OPTIONS` and can be overridden via
 * `nxpBlockOptionsProvider()`.
 *
 * @example
 * <!-- Checkbox block -->
 * <label nxpBlock>
 *   <input type="checkbox" [formControl]="ctrl" />
 *   <span>Option label</span>
 * </label>
 *
 * @example
 * <!-- Success appearance, small -->
 * <label nxpBlock appearance="success" size="s">
 *   <input type="checkbox" [formControl]="ctrl" />
 *   <span>Compact option</span>
 * </label>
 *
 * @example
 * <!-- Override defaults for a subtree -->
 * providers: [nxpBlockOptionsProvider({ appearance: 'filled', size: 'm' })]
 */
@Directive({
  selector: 'label[nxpBlock],input[nxpBlock]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class NxpBlockDirective {
  private readonly options = inject(NXP_BLOCK_OPTIONS);
  protected readonly control = contentChild(NgControl);

  /** Size variant. */
  readonly size = input<NxpBlockSize>(this.options.size);

  /** Visual appearance. */
  readonly appearance = input<NxpBlockAppearance>(this.options.appearance);

  /** Additional CSS classes merged via cx(). */
  readonly class = input<string>('');

  readonly hostClasses = computed(() => {
    const disabled = !!this.control()?.disabled;
    return cx(
      'relative flex cursor-pointer select-none items-start gap-3 rounded-lg border transition-all duration-150',
      'focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:ring-offset-1',
      SIZE_CLASSES[this.size()],
      APPEARANCE_CLASSES[this.appearance()],
      !disabled && 'hover:border-blue-400 hover:bg-blue-50/50 dark:hover:border-blue-500 dark:hover:bg-blue-950/20',
      disabled && 'cursor-not-allowed opacity-50',
      this.class(),
    );
  });
}
