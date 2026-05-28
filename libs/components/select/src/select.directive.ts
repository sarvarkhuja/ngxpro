import {
  computed,
  Directive,
  inject,
  input,
  signal,
  type Signal,
} from '@angular/core';
import {
  nxpAsControl,
  NxpControl,
  NxpDropdownDirective,
  NxpDropdownOpen,
  nxpDropdownEnabled,
  nxpInjectElement,
  type NxpBooleanHandler,
  type NxpIdentityMatcher,
  type NxpItemsHandlers,
  type NxpStringHandler,
} from '@ngxpro/cdk';
import {
  nxpAsTextfieldAccessor,
  type NxpTextfieldAccessor,
} from '@ngxpro/cdk/components/textfield';

const NEVER_DISABLED = ((): false => false) as NxpBooleanHandler<unknown>;

function readField(item: unknown, key: string): unknown {
  return (item as Record<string, unknown>)[key];
}

/**
 * Select directive for `<input nxpSelect>` inside `<nxp-textfield>`.
 *
 * The input is always read-only — the user must pick from the dropdown list.
 * Click-to-open is handled by `NxpDropdownOpen` (host directive on
 * `nxp-textfield`); this directive only adds keyboard shortcuts.
 *
 * Implements `NxpItemsHandlers<T>` so the wrapping `<nxp-textfield>` delegates
 * stringify / identity resolution to it. Pass `textField` / `valueField` to
 * pick object items by property without a DI provider.
 *
 * @example
 * ```html
 * <nxp-textfield>
 *   <label nxpLabel>Country</label>
 *   <input
 *     nxpInput
 *     nxpSelect
 *     textField="name"
 *     valueField="code"
 *     [formControl]="ctrl"
 *   />
 *   <ng-template nxpDropdown>
 *     <nxp-data-list>
 *       @for (item of items; track item.code) {
 *         <nxp-select-option [value]="item" />
 *       }
 *     </nxp-data-list>
 *   </ng-template>
 * </nxp-textfield>
 * ```
 */
@Directive({
  selector: 'input[nxpSelect]',
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
  implements NxpTextfieldAccessor<T | null>, NxpItemsHandlers<T>
{
  private readonly el = nxpInjectElement<HTMLInputElement>();
  private readonly dropdownOpen = inject(NxpDropdownOpen);
  private readonly dropdownDirective = inject(NxpDropdownDirective);

  private readonly selectedValue = signal<T | null>(null);

  protected readonly dropdownEnabled = nxpDropdownEnabled(this.interactive);

  /**
   * Property name on each item used as the display text. When set, overrides
   * any inherited `NXP_ITEMS_HANDLERS.stringify`.
   */
  readonly textField = input<string | undefined>(undefined);

  /**
   * Property name on each item used for identity matching. When set, items
   * compare by `item[valueField]` instead of `===`.
   */
  readonly valueField = input<string | undefined>(undefined);

  // ------------------------------------------------------------------ NxpItemsHandlers<T>

  readonly stringify: Signal<NxpStringHandler<T>> = computed(() => {
    const field = this.textField();
    if (!field) return String as NxpStringHandler<T>;
    return (item) => {
      if (item == null) return '';
      const raw = readField(item, field);
      return raw == null ? '' : String(raw);
    };
  });

  readonly identityMatcher: Signal<NxpIdentityMatcher<T>> = computed(() => {
    const field = this.valueField();
    if (!field) return (a, b) => a === b;
    return (a, b) =>
      a != null && b != null && readField(a, field) === readField(b, field);
  });

  /**
   * Predicate that marks individual items as disabled inside the dropdown.
   * Returning `true` makes the option non-selectable (skipped by keyboard
   * navigation) and renders it with `aria-disabled` + dimmed styling.
   *
   * Aliased as `disabledItem` for ergonomic template binding:
   * `[disabledItem]="(item) => item.locked"`.
   */
  readonly disabledItemHandler = input<NxpBooleanHandler<T>>(
    NEVER_DISABLED as NxpBooleanHandler<T>,
    { alias: 'disabledItem' },
  );

  /** Reflects ground truth: whether the portal `ComponentRef` actually exists. */
  readonly isOpen = computed(() => !!this.dropdownDirective.ref());

  /**
   * String display value used by `NxpTextfieldAccessor` for empty detection,
   * floating-label positioning, and the cleaner button. Separate from the
   * typed `selectedValue` to avoid coupling the base class signal to `T`.
   */
  override readonly value = computed<string>(() => {
    const v = this.selectedValue();
    return v != null ? this.stringify()(v) : '';
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

  private syncElValue(): void {
    const v = this.selectedValue();
    this.el.value = v != null ? this.stringify()(v) : '';
  }
}
