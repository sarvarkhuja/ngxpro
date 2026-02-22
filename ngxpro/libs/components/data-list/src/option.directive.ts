import { computed, Directive, inject, input } from '@angular/core';
import { cx } from '@nxp/cdk';
import { DataListComponent } from './data-list.component';

/**
 * Option directive — apply to `<button>` elements inside `<nxp-data-list>`.
 *
 * Adds `role="option"`, keyboard-navigable focus, and Tailwind styling.
 * Inherits `size` from the nearest ancestor `<nxp-data-list>` via direct
 * parent injection — matches the Taiga UI child-injects-parent pattern.
 *
 * @example
 * <nxp-data-list>
 *   <button nxpOption [selected]="isActive" (click)="select()">
 *     Option label
 *   </button>
 * </nxp-data-list>
 *
 * @example
 * <!-- With checkmark icon for active state -->
 * <button nxpOption [selected]="item === active" (click)="pick(item)">
 *   <span class="flex-1">{{ item.label }}</span>
 *   @if (item === active) {
 *     <svg class="h-3.5 w-3.5" ...>...</svg>
 *   }
 * </button>
 */
@Directive({
  selector: 'button[nxpOption]',
  standalone: true,
  host: {
    role: 'option',
    type: 'button',
    '[class]': 'classes()',
    '[attr.aria-selected]': 'selected() ? true : null',
    '[attr.aria-disabled]': 'disabled() ? true : null',
    '[disabled]': 'disabled() || null',
  },
})
export class OptionDirective {
  /**
   * The parent DataListComponent — injected to inherit the `size` signal.
   * `optional: true` allows using nxpOption outside a DataList if needed.
   */
  private readonly list = inject(DataListComponent, { optional: true });

  // ------------------------------------------------------------------ inputs

  /** Whether the option is currently selected. Sets `aria-selected`. */
  readonly selected = input<boolean>(false);

  /** Whether the option is disabled. Sets `aria-disabled` + native `disabled`. */
  readonly disabled = input<boolean>(false);

  /**
   * Size variant — overrides the parent DataList size if provided.
   * Falls back to parent DataList's `size()` or `'md'`.
   */
  readonly size = input<'sm' | 'md' | 'lg' | undefined>(undefined);

  // ------------------------------------------------------------------ computed classes

  protected readonly classes = computed(() => {
    const s = this.size() ?? this.list?.size() ?? 'md';
    const active = this.selected();
    const off = this.disabled();

    const sizing: Record<string, string> = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-sm',
    };

    return cx(
      // Layout
      'flex w-full items-center gap-2 rounded-md font-medium text-left',
      'transition-colors duration-100 select-none',
      // Focus ring
      'outline-none focus-visible:outline focus-visible:outline-2',
      'focus-visible:outline-offset-1 focus-visible:outline-brand-500',
      // Size padding
      sizing[s] ?? sizing['md'],
      // State: active vs default
      active
        ? 'bg-brand-600 text-white dark:bg-brand-500 dark:text-white'
        : [
            'text-gray-700 dark:text-gray-300',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
          ],
      // Disabled
      off && 'opacity-40 cursor-not-allowed pointer-events-none',
    );
  });
}
