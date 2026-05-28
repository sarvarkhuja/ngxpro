import {
  computed,
  Directive,
  effect,
  inject,
  input,
  signal,
  type Signal,
} from '@angular/core';
import {
  nxpAsControl,
  NxpControl,
  nxpAsOptionContent,
  NxpDropdownOpen,
  nxpDropdownEnabled,
  NxpDropdownDirective,
  nxpInjectElement,
  type NxpItemsHandlers,
  type NxpStringHandler,
  type NxpIdentityMatcher,
  type NxpBooleanHandler,
} from '@ngxpro/cdk';
import {
  nxpAsTextfieldAccessor,
  type NxpTextfieldAccessor,
} from '@ngxpro/cdk/components/textfield';
import { NxpMultiSelectOptionComponent } from './multi-select-option.component';

const NEVER_DISABLED = ((): false => false) as NxpBooleanHandler<unknown>;

function readField(item: unknown, key: string): unknown {
  return (item as Record<string, unknown>)[key];
}

/**
 * Multi-select directive — chip-less multi-value picker built on the
 * combo-box architecture (`NxpControl` + `NxpTextfieldAccessor` +
 * `NxpItemsHandlers` + `NXP_DATA_LIST_HOST`). Goes inside `<nxp-textfield>`
 * with `<ng-template nxpDropdown>` content like `nxpComboBox`.
 *
 * The host input is read-only and displays the current selection as a
 * comma-separated string. Picking an option in the dropdown toggles it in
 * the value array. The form control receives a `readonly T[]`.
 *
 * @example
 * ```html
 * <nxp-textfield>
 *   <label nxpLabel for="fruits">Fruits</label>
 *   <input
 *     nxpInput
 *     nxpMultiSelect
 *     #ms="nxpMultiSelect"
 *     id="fruits"
 *     [formControl]="fruitsCtrl"
 *     [items]="fruits"
 *     readonly
 *   />
 *   <ng-template nxpDropdown>
 *     <nxp-data-list>
 *       @for (item of ms.items(); track item) {
 *         <nxp-multi-select-option [value]="item" />
 *       }
 *     </nxp-data-list>
 *   </ng-template>
 * </nxp-textfield>
 * ```
 */
@Directive({
  selector: 'input[nxpMultiSelect]',
  providers: [
    nxpAsOptionContent(NxpMultiSelectOptionComponent),
    nxpAsTextfieldAccessor(NxpMultiSelectDirective),
    nxpAsControl(NxpMultiSelectDirective),
  ],
  host: {
    '[disabled]': 'disabled()',
    readonly: 'true',
    '[attr.autocomplete]': '"off"',
    '[attr.role]': '"combobox"',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-haspopup]': '"listbox"',
    '[attr.aria-multiselectable]': '"true"',
    '(blur)': 'onBlur()',
    '(keydown.escape)': 'closeDropdown()',
    '(keydown.enter)': 'onActivate($event)',
    '(keydown.space)': 'onActivate($event)',
    '(keydown.arrowDown)': 'onArrowOpen($event)',
    '(keydown.arrowUp)': 'onArrowOpen($event)',
    '(keydown.backspace)': 'removeLast()',
  },
  exportAs: 'nxpMultiSelect',
})
export class NxpMultiSelectDirective<T = unknown>
  extends NxpControl<readonly T[] | string | null>
  implements NxpTextfieldAccessor<readonly T[] | T | null>, NxpItemsHandlers<T>
{
  private readonly el = nxpInjectElement<HTMLInputElement>();
  private readonly dropdownDirective = inject(NxpDropdownDirective);
  private readonly dropdownOpen = inject(NxpDropdownOpen);

  readonly items = input<readonly T[]>([]);

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

  /** Joiner used to assemble the comma-separated display string. */
  readonly separator = input(', ');

  // -- NxpItemsHandlers<T> ---------------------------------------------------

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

  readonly disabledItemHandler = signal(NEVER_DISABLED as NxpBooleanHandler<T>);

  // -- internal state --------------------------------------------------------

  /** Currently selected items. */
  private readonly selected = signal<readonly T[]>([]);

  /** Whether the dropdown is currently open. */
  readonly isOpen = computed(() => !!this.dropdownDirective.ref());

  /** Display string assembled from `selected().map(stringify).join(sep)`. */
  readonly inputText = computed(() => {
    const sep = this.separator();
    const sf = this.stringify();
    return this.selected()
      .map((item) => sf(item))
      .join(sep);
  });

  /** Required by `NxpTextfieldAccessor` — what the cleaner & wrapper see. */
  override readonly value = computed<string>(() => this.inputText());

  /** Public read-only view of the selected array. */
  readonly selectedItems = computed(() => this.selected());

  constructor() {
    super();
    nxpDropdownEnabled(this.interactive);

    // Sync the visible DOM text every time selection or stringify changes.
    effect(() => {
      const text = this.inputText();
      if (this.el.value !== text) {
        this.el.value = text;
      }
    });
  }

  // -- NxpTextfieldAccessor --------------------------------------------------

  /**
   * Called from `<nxp-textfield>`'s cleaner (value=null) and from
   * `NxpTextfieldComponent.handleOption` when an option is clicked
   * (value=single item). An external write of a full array path also goes
   * through here when wired via the accessor.
   */
  setValue(value: readonly T[] | T | null): void {
    if (value == null) {
      this.writeSelected([]);
      this.closeDropdown();
      return;
    }
    if (Array.isArray(value)) {
      this.writeSelected(value as readonly T[]);
      return;
    }
    // Single item from data-list — toggle membership.
    this.toggleItem(value as T);
  }

  override writeValue(value: readonly T[] | string | null): void {
    super.writeValue(value);
    // Only array writes affect the selected set; strings come from the
    // accessor's `value()` signal mirror and aren't a real form value.
    if (Array.isArray(value)) {
      this.selected.set(value as readonly T[]);
    } else if (value == null) {
      this.selected.set([]);
    }
  }

  // -- event handlers --------------------------------------------------------

  protected onBlur(): void {
    this.onTouched();
  }

  /** Enter / Space toggle the dropdown without submitting a form. */
  protected onActivate(event: Event): void {
    event.preventDefault();
    if (this.isOpen()) this.closeDropdown();
    else this.openDropdown();
  }

  /**
   * Arrow keys open the dropdown; `NxpDropdownOpen` then moves focus into
   * the listbox panel for subsequent arrow navigation.
   */
  protected onArrowOpen(event: Event): void {
    event.preventDefault();
    if (!this.isOpen()) this.openDropdown();
  }

  // -- public API ------------------------------------------------------------

  openDropdown(): void {
    if (this.interactive()) this.dropdownOpen.toggle(true);
  }

  closeDropdown(): void {
    this.dropdownOpen.toggle(false);
  }

  toggleDropdown(): void {
    if (this.isOpen()) this.closeDropdown();
    else this.openDropdown();
  }

  /** Toggle a single item in the current selection. */
  toggleItem(item: T): void {
    const matcher = this.identityMatcher();
    const cur = this.selected();
    const idx = cur.findIndex((v) => matcher(v, item));
    const next =
      idx >= 0 ? [...cur.slice(0, idx), ...cur.slice(idx + 1)] : [...cur, item];
    this.writeSelected(next);
  }

  /** Remove the item at the given index. */
  removeAt(index: number): void {
    const cur = this.selected();
    if (index < 0 || index >= cur.length) return;
    this.writeSelected([...cur.slice(0, index), ...cur.slice(index + 1)]);
  }

  /** Remove the last selected item — wired to Backspace. */
  removeLast(): void {
    const cur = this.selected();
    if (cur.length) this.removeAt(cur.length - 1);
  }

  /** Replace the whole selection — used by group select-all / select-none. */
  setItems(items: readonly T[]): void {
    this.writeSelected(items);
  }

  /** Whether the given item is currently selected. */
  isItemSelected(item: T): boolean {
    const matcher = this.identityMatcher();
    return this.selected().some((v) => matcher(v, item));
  }

  /** Resolved label — used by option / group via the host bridge. */
  getLabel(item: T): string {
    return this.stringify()(item);
  }

  /** Resolved identity matcher — used by group's select-all bookkeeping. */
  getIdentity(): NxpIdentityMatcher<T> {
    return this.identityMatcher();
  }

  // -- private ---------------------------------------------------------------

  private writeSelected(items: readonly T[]): void {
    this.selected.set(items);
    this.onChange(items);
  }
}
