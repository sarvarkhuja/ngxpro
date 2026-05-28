import {
  Directive,
  ElementRef,
  computed,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { cx } from '@ngxpro/cdk';
import {
  NXP_BLOCK_GROUP,
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
  outline: 'border-border-normal bg-bg-base',
  filled: 'border-transparent bg-bg-neutral-1',
  primary: 'border-primary/30 bg-primary/10',
  success: 'border-status-positive/30 bg-status-positive-pale',
  danger: 'border-status-negative/30 bg-status-negative-pale',
};

/** When inside a group, backgrounds must be transparent so overlay divs show through. */
const APPEARANCE_GROUP_CLASSES: Record<NxpBlockAppearance, string> = {
  outline: 'border-border-normal bg-transparent',
  filled: 'border-transparent bg-transparent',
  primary: 'border-primary/30 bg-transparent',
  success: 'border-status-positive/30 bg-transparent',
  danger: 'border-status-negative/30 bg-transparent',
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
  selector: '[nxpBlock]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class NxpBlockDirective {
  private readonly options = inject(NXP_BLOCK_OPTIONS);
  private readonly blockGroup = inject(NXP_BLOCK_GROUP, { optional: true });
  protected readonly control = contentChild(NgControl);

  /** Host element — exposed so `NxpBlockGroupComponent` can measure it. */
  readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  /** Size variant. */
  readonly size = input<NxpBlockSize>(this.options.size);

  /** Visual appearance. */
  readonly appearance = input<NxpBlockAppearance>(this.options.appearance);

  /** Additional CSS classes merged via cx(). */
  readonly class = input<string>('');

  readonly hostClasses = computed(() => {
    const disabled = !!this.control()?.disabled;
    const inGroup = !!this.blockGroup;
    return cx(
      'relative flex cursor-pointer select-none items-start gap-3 rounded-m border',
      'transition-[background-color,border-color,box-shadow] duration-normal ease-out',
      // When inside a group, the overlay handles hover/focus/checked — just lift content above overlays
      inGroup && 'z-10',
      // Standalone: block handles its own hover/focus/checked styles —
      // focus ring uses the design-system Geist focus blue (§6), not a
      // primary tint.
      !inGroup &&
        'focus-within:ring-2 focus-within:ring-border-focus focus-within:ring-offset-1',
      !inGroup &&
        '[&:has(input:checked)]:border-primary [&:has(input:checked)]:bg-primary/10',
      SIZE_CLASSES[this.size()],
      inGroup
        ? APPEARANCE_GROUP_CLASSES[this.appearance()]
        : APPEARANCE_CLASSES[this.appearance()],
      !disabled && !inGroup && 'hover:border-primary hover:bg-primary/8',
      disabled && 'cursor-not-allowed opacity-50',
      this.class(),
    );
  });
}
