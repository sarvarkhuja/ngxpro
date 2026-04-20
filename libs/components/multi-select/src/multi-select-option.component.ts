import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { cx, NXP_ITEMS_HANDLERS } from '@nxp/cdk';
import { NxpMultiSelectComponent } from './multi-select.component';

/**
 * Option item for use inside `<nxp-multi-select>`.
 *
 * Renders a checkbox indicator reflecting the current selection state.
 * Communicates selection back to the parent `NxpMultiSelectComponent` via
 * direct injection (options are always children of the multi-select).
 *
 * Uses `NXP_ITEMS_HANDLERS` for stringify, identity, and disabled checks.
 *
 * @example
 * ```html
 * <!-- Auto-rendered inside nxp-multi-select via [items] input -->
 * <nxp-multi-select [items]="countries" [formControl]="ctrl" />
 * ```
 */
@Component({
  selector: 'nxp-multi-select-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    '[attr.aria-selected]': 'isSelected() ? true : null',
    '[attr.aria-disabled]': 'isDisabled() ? true : null',
    '[class]': 'classes()',
    tabindex: '0',
    '(pointerdown)': '$event.preventDefault()',
    '(click)': 'select()',
    '(keydown.enter)': 'select(); $event.preventDefault()',
    '(keydown.space)': 'select(); $event.preventDefault()',
  },
  template: `
    <!-- Checkbox indicator -->
    <span
      class="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-100"
      [class]="checkboxClass()"
      aria-hidden="true"
    >
      @if (isSelected()) {
        <svg viewBox="0 0 12 12" fill="none" class="h-3 w-3" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2 6l3 3 5-5" />
        </svg>
      }
    </span>

    <!-- Label -->
    <span class="flex-1 truncate">{{ label() }}</span>
  `,
})
export class NxpMultiSelectOptionComponent<T = unknown> {
  private readonly handlers = inject(NXP_ITEMS_HANDLERS);
  // Always a child of NxpMultiSelectComponent — injected for both
  // isItemSelected() check and handleOption() calls.
  private readonly multiSelect = inject(NxpMultiSelectComponent, { optional: true }) as NxpMultiSelectComponent<T> | null;

  readonly value = input.required<T>();

  protected readonly label = computed(() =>
    this.handlers.stringify()(this.value()),
  );

  protected readonly isSelected = computed(() =>
    this.multiSelect?.isItemSelected(this.value()) ?? false,
  );

  protected readonly isDisabled = computed(() =>
    this.handlers.disabledItemHandler()(this.value()),
  );

  protected readonly classes = computed(() =>
    cx(
      'flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-1.5',
      'text-sm font-medium text-left select-none',
      'transition-colors duration-100',
      'outline-none focus-visible:outline focus-visible:outline-2',
      'focus-visible:outline-offset-1 focus-visible:outline-blue-500',
      this.isSelected()
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
      this.isDisabled() && 'opacity-40 cursor-not-allowed pointer-events-none',
    ),
  );

  protected readonly checkboxClass = computed(() =>
    this.isSelected()
      ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-400'
      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900',
  );

  protected select(): void {
    if (!this.isDisabled()) {
      this.multiSelect?.handleOption(this.value());
    }
  }
}
