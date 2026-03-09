import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { cx, NXP_DATA_LIST_HOST, NXP_ITEMS_HANDLERS } from '@nxp/cdk';
import { NXP_TEXTFIELD_ACCESSOR } from '@nxp/cdk/components/textfield';

/**
 * Option item rendered inside a Select or ComboBox dropdown.
 *
 * Selection flows via `NXP_DATA_LIST_HOST` (provided by `nxp-textfield`),
 * mirroring Taiga UI's `TuiTextfieldComponent.handleOption` pattern. The host
 * is always reachable from the portal injector chain because `nxp-textfield`
 * is an ancestor of the dropdown's embedded view.
 *
 * `NXP_TEXTFIELD_ACCESSOR` (also on `nxp-textfield`) is used only for the
 * `isSelected` computed — to read the current display string without requiring
 * `NxpControl` injection.
 *
 * `(pointerdown)` calls `preventDefault()` to prevent focus from leaving the
 * trigger input on mouse press, which would otherwise collapse the dropdown
 * before the `click` event fires. Keyboard focus (Tab / Arrow) still works.
 */
@Component({
  selector: 'nxp-select-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    '[attr.aria-selected]': 'isSelected() ? true : null',
    '[attr.aria-disabled]': 'isDisabled() ? true : null',
    '[class]': 'classes()',
    '(pointerdown)': '$event.preventDefault()',
    '(click)': 'select()',
    '(keydown.enter)': 'select()',
    '(keydown.space)': 'select()',
    tabindex: '0',
  },
  template: `
    <span class="flex-1 truncate">{{ label() }}</span>

    @if (isSelected()) {
      <svg
        class="h-3.5 w-3.5 shrink-0 text-current"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    }
  `,
})
export class NxpSelectOptionComponent<T = unknown> {
  private readonly handlers = inject(NXP_ITEMS_HANDLERS);
  private readonly host = inject(NXP_DATA_LIST_HOST, { optional: true });
  private readonly accessor = inject(NXP_TEXTFIELD_ACCESSOR, { optional: true });

  readonly value = input.required<T>();

  protected readonly label = computed(() =>
    this.handlers.stringify()(this.value()),
  );

  protected readonly isSelected = computed(() => {
    const current = this.accessor?.value() ?? '';
    return !!current && current === this.handlers.stringify()(this.value());
  });

  protected readonly isDisabled = computed(() =>
    this.handlers.disabledItemHandler()(this.value()),
  );

  protected readonly classes = computed(() =>
    cx(
      'flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-1.5',
      'text-sm font-medium text-left',
      'transition-colors duration-100 select-none',
      'outline-none focus-visible:outline focus-visible:outline-2',
      'focus-visible:outline-offset-1 focus-visible:outline-blue-500',
      this.isSelected()
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        : ['text-gray-700 dark:text-gray-300', 'hover:bg-gray-100 dark:hover:bg-gray-800'],
      this.isDisabled() && 'opacity-40 cursor-not-allowed pointer-events-none',
    ),
  );

  protected select(): void {
    if (!this.isDisabled()) {
      this.host?.handleOption(this.value());
    }
  }
}
