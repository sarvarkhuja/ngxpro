import { computed, Directive, inject, signal } from '@angular/core';
import {
  nxpAsControl,
  NxpControl,
  NXP_ITEMS_HANDLERS,
  NxpDropdownDirective,
  NxpDropdownOpen,
  nxpDropdownEnabled,
  nxpInjectElement,
} from '@nxp/cdk';
import {
  nxpAsTextfieldAccessor,
  type NxpTextfieldAccessor,
} from '@nxp/cdk/components/textfield';

/**
 * Select directive for `<input nxpSelect>` inside `<nxp-textfield>`.
 *
 * The input is always read-only — the user must pick from the dropdown list.
 * Click-to-open is handled by `NxpDropdownOpen` (host directive on
 * `nxp-textfield`); this directive only adds keyboard shortcuts.
 *
 * @example
 * ```html
 * <nxp-textfield>
 *   <label nxpLabel>Country</label>
 *   <input nxpInput nxpSelect [formControl]="ctrl" />
 *   <ng-template nxpDropdown>
 *     <nxp-data-list>
 *       @for (item of items; track item) {
 *         <nxp-select-option [value]="item" />
 *       }
 *     </nxp-data-list>
 *   </ng-template>
 * </nxp-textfield>
 * ```
 */
@Directive({
  selector: 'input[nxpSelect]',
  standalone: true,
  providers: [
    nxpAsTextfieldAccessor(NxpSelectDirective),
    nxpAsControl(NxpSelectDirective),
  ],
  host: {
    '[disabled]': 'disabled()',
    '[attr.readonly]': '"readonly"',
    '[attr.autocomplete]': '"off"',
    '[attr.role]': '"combobox"',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-haspopup]': '"listbox"',
    '[attr.aria-autocomplete]': '"none"',
    '(keydown.enter)': 'toggleDropdown()',
    '(keydown.space)': 'openDropdown($event)',
    '(keydown.escape)': 'closeDropdown()',
    '(keydown.arrowDown)': 'openDropdown($event)',
  },
  exportAs: 'nxpSelect',
})
export class NxpSelectDirective<T = unknown>
  extends NxpControl<T | string | null>
  implements NxpTextfieldAccessor<T | null>
{
  private readonly el = nxpInjectElement<HTMLInputElement>();
  private readonly handlers = inject(NXP_ITEMS_HANDLERS);
  private readonly dropdownOpen = inject(NxpDropdownOpen);
  private readonly dropdownDirective = inject(NxpDropdownDirective);

  private readonly selectedValue = signal<T | null>(null);

  protected readonly dropdownEnabled = nxpDropdownEnabled(this.interactive);

  /** Reflects ground truth: whether the portal `ComponentRef` actually exists. */
  readonly isOpen = computed(() => !!this.dropdownDirective.ref());

  /**
   * String display value used by `NxpTextfieldAccessor` for empty detection,
   * floating-label positioning, and the cleaner button. Separate from the
   * typed `selectedValue` to avoid coupling the base class signal to `T`.
   */
  override readonly value = computed<string>(() => {
    const v = this.selectedValue();
    return v != null ? this.stringify(v) : '';
  });

  // ------------------------------------------------------------------ ControlValueAccessor

  override writeValue(value: T | string | null): void {
    super.writeValue(value);
    this.selectedValue.set(value as T | null);
    this.syncElValue();
  }

  // ------------------------------------------------------------------ NxpTextfieldAccessor

  setValue(value: T | null): void {
    this.selectedValue.set(value);
    this.onChange(value as T);
    this.syncElValue();
    // Re-open the dropdown so the user can immediately pick a replacement.
    // Close it (with focus returned to the trigger) when a value is chosen.
    if (value == null) {
      this.dropdownOpen.open.set(true);
    } else {
      this.dropdownOpen.toggle(false);
    }
  }

  // ------------------------------------------------------------------ keyboard

  protected toggleDropdown(): void {
    if (this.interactive()) this.dropdownOpen.open.update((v) => !v);
  }

  protected openDropdown(event: Event): void {
    event.preventDefault();
    if (this.interactive()) this.dropdownOpen.open.set(true);
  }

  protected closeDropdown(): void {
    this.dropdownOpen.toggle(false);
  }

  // ------------------------------------------------------------------ private

  private stringify(value: T): string {
    return this.handlers.stringify()(
      value as Parameters<ReturnType<typeof this.handlers.stringify>>[0],
    );
  }

  private syncElValue(): void {
    const v = this.selectedValue();
    this.el.value = v != null ? this.stringify(v) : '';
  }
}
