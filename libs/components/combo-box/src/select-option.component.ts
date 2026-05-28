import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { cx, NXP_DATA_LIST_HOST, NXP_ITEMS_HANDLERS } from '@ngxpro/cdk';
import { NXP_TEXTFIELD_ACCESSOR } from '@ngxpro/cdk/components/textfield';

/**
 * Option item rendered inside a Select or ComboBox dropdown.
 *
 * Selection flows via `NXP_DATA_LIST_HOST` (provided by `nxp-textfield`),
 * mirroring Taiga UI's `TuiTextfieldComponent.handleOption` pattern. The host
 * is always reachable from the portal injector chain because `nxp-textfield`
 * is an ancestor of the dropdown's embedded view.
 *
 * `(pointerdown).preventDefault()` keeps focus on the trigger input while the
 * user mouses an option — otherwise focus would leave the input on mousedown
 * and the dropdown would collapse before `click` fires. Keyboard focus still
 * works (Tab / Arrow).
 */
@Component({
  selector: 'nxp-select-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    tabindex: '0',
    '[attr.aria-selected]': 'isSelected() ? true : null',
    '[attr.aria-disabled]': 'isDisabled() ? true : null',
    '[class]': 'classes()',
    '(pointerdown)': '$event.preventDefault()',
    '(click)': 'select()',
    '(keydown.enter)': 'select()',
    '(keydown.space)': 'select()',
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
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    }
  `,
})
export class NxpSelectOptionComponent<T = unknown> {
  private readonly handlers = inject(NXP_ITEMS_HANDLERS);
  private readonly host = inject(NXP_DATA_LIST_HOST, { optional: true });
  private readonly accessor = inject(NXP_TEXTFIELD_ACCESSOR, {
    optional: true,
  });

  readonly value = input.required<T>();

  protected readonly label = computed(() =>
    this.handlers.stringify()(this.value()),
  );

  protected readonly isSelected = computed(() => {
    const current = this.accessor?.value();
    return !!current && current === this.label();
  });

  protected readonly isDisabled = computed(() =>
    this.handlers.disabledItemHandler()(this.value()),
  );

  protected readonly classes = computed(() =>
    cx(
      // `relative z-10` keeps the row above the data-list's absolutely
      // positioned hover/selected pills — without it the pill paints over
      // the label after mouseout.
      'relative z-10 flex w-full cursor-pointer items-center gap-2 rounded-s px-3 py-1.5',
      'text-sm font-medium text-left',
      'transition-colors duration-fast select-none',
      'outline-none focus-visible:outline focus-visible:outline-2',
      'focus-visible:outline-offset-1 focus-visible:outline-border-focus',
      this.isSelected()
        ? 'bg-primary/10 text-text-primary'
        : ['text-text-secondary', 'hover:bg-bg-neutral-1'],
      this.isDisabled() && 'opacity-50 cursor-not-allowed pointer-events-none',
    ),
  );

  protected select(): void {
    if (!this.isDisabled()) {
      this.host?.handleOption(this.value());
    }
  }
}
