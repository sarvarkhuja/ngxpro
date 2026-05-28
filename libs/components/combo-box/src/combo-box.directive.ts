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
  NXP_STRICT_MATCHER,
  NXP_DEFAULT_MATCHER,
  type NxpStringMatcher,
  type NxpItemsHandlers,
  type NxpStringHandler,
  type NxpIdentityMatcher,
  type NxpBooleanHandler,
} from '@ngxpro/cdk';
import {
  nxpAsTextfieldAccessor,
  type NxpTextfieldAccessor,
} from '@ngxpro/cdk/components/textfield';
import { NxpSelectOptionComponent } from './select-option.component';

const NEVER_DISABLED = ((): false => false) as NxpBooleanHandler<unknown>;

function readField(item: unknown, key: string): unknown {
  return (item as Record<string, unknown>)[key];
}

@Directive({
  selector: 'input[nxpComboBox]',
  providers: [
    nxpAsOptionContent(NxpSelectOptionComponent),
    nxpAsTextfieldAccessor(NxpComboBoxDirective),
    nxpAsControl(NxpComboBoxDirective),
  ],
  host: {
    '[disabled]': 'disabled()',
    '[attr.autocomplete]': '"off"',
    '[attr.role]': '"combobox"',
    '[attr.aria-autocomplete]': '"list"',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-haspopup]': '"listbox"',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
    '(keydown.escape)': 'closeDropdown()',
    '(keydown.enter)': 'onEnter($event)',
    '(keydown.arrowDown)': 'onArrowOpen()',
    '(keydown.arrowUp)': 'onArrowOpen()',
  },
  exportAs: 'nxpComboBox',
})
export class NxpComboBoxDirective<T = unknown, V = T>
  extends NxpControl<T | V | string | null>
  implements NxpTextfieldAccessor<T | V | string | null>, NxpItemsHandlers<T>
{
  private readonly el = nxpInjectElement<HTMLInputElement>();
  private readonly dropdownDirective = inject(NxpDropdownDirective);
  private readonly dropdownOpen = inject(NxpDropdownOpen);

  readonly items = input<readonly T[]>([]);

  /**
   * Whether the combo-box requires the user to select an existing option.
   * `true` (default) rejects free-text on blur if no exact match.
   * `false` accepts any typed string as the value.
   */
  readonly strict = input(true);

  /**
   * Custom matcher used when filtering items.
   * Defaults to `NXP_DEFAULT_MATCHER` (substring match, case-insensitive).
   */
  readonly matcher = input<NxpStringMatcher<T>>(NXP_DEFAULT_MATCHER);

  /**
   * Property name on each item used as the display text. When set, overrides
   * any inherited `NXP_ITEMS_HANDLERS.stringify`.
   * Example: `textField="text"` with items like `{ text: 'Medium', value: 2 }`.
   */
  readonly textField = input<string | undefined>(undefined);

  /**
   * Property name on each item used for identity matching and primitive
   * extraction. When set, items compare by `item[valueField]` instead of `===`.
   * Required when `valuePrimitive` is `true`.
   */
  readonly valueField = input<string | undefined>(undefined);

  /**
   * When `true`, the form control receives `item[valueField]` (a primitive)
   * instead of the full item object. Requires `valueField` to be set.
   */
  readonly valuePrimitive = input(false);

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

  /** Currently matched item from `items[]`, or null when none selected. */
  private readonly selectedItem = signal<T | null>(null);

  /** Set only in non-strict mode when the typed text doesn't match any item. */
  private readonly freeText = signal<string | null>(null);

  /** Text currently visible in the input element. */
  readonly inputText = signal('');

  /** Whether the dropdown is currently open. */
  readonly isOpen = computed(() => !!this.dropdownDirective.ref());

  override readonly value = computed<string>(() => this.inputText());

  /** Value pushed to the form control. */
  private readonly emittedValue = computed<T | V | string | null>(() => {
    const free = this.freeText();
    if (free != null) return free;

    const item = this.selectedItem();
    if (item == null) return null;

    if (this.valuePrimitive()) {
      const field = this.valueField();
      return field ? (readField(item, field) as V) : (item as unknown as V);
    }
    return item;
  });

  readonly filteredItems = computed(() => {
    const text = this.inputText();
    const all = this.items();
    if (!text) return all;
    const matchFn = this.matcher();
    const stringifyFn = this.stringify() as NxpStringHandler<T | string>;
    return all.filter((item) => matchFn(item, text, stringifyFn));
  });

  constructor() {
    super();
    nxpDropdownEnabled(this.interactive);

    // Sync displayed text to the DOM input whenever it changes outside of typing.
    effect(() => {
      const text = this.inputText();
      if (this.el.value !== text) {
        this.el.value = text;
      }
    });
  }

  // -- NxpTextfieldAccessor --------------------------------------------------

  setValue(value: T | V | string | null): void {
    // Called from <nxp-textfield>'s clear button (value=null) and from
    // NxpDataListHost.handleOption when an option is clicked (value=item).
    if (value == null) {
      this.clearState();
      this.emit();
      this.closeDropdown();
      return;
    }

    if (this.items().includes(value as T)) {
      this.selectItem(value as T);
      return;
    }

    // Fallback (rare): external write routed through the accessor path.
    this.applyExternalValue(value);
    this.emit();
    this.closeDropdown();
  }

  override writeValue(value: T | V | string | null): void {
    super.writeValue(value);
    this.applyExternalValue(value);
  }

  // -- event handlers --------------------------------------------------------

  protected onInput(event: Event): void {
    this.inputText.set((event.target as HTMLInputElement).value);
    this.openDropdown();
  }

  protected onBlur(): void {
    this.onTouched();
    const text = this.inputText();

    if (!text) {
      this.clearState();
      this.emit();
      return;
    }

    const match = this.findExactMatch(text);
    if (match !== undefined) {
      this.setSelected(match);
      this.emit();
      return;
    }

    if (!this.strict()) {
      this.selectedItem.set(null);
      this.freeText.set(text);
      this.emit();
      return;
    }

    // Strict + no match: revert to the last confirmed state.
    const current = this.selectedItem();
    this.inputText.set(current == null ? '' : this.stringify()(current));
  }

  protected onEnter(event: Event): void {
    const filtered = this.filteredItems();
    if (filtered.length === 1 && filtered[0] != null) {
      event.preventDefault();
      this.selectItem(filtered[0]);
    }
  }

  /**
   * Open the dropdown on first ArrowDown/ArrowUp; NxpDropdownOpen then moves
   * focus into the listbox panel for subsequent arrows.
   */
  protected onArrowOpen(): void {
    if (!this.isOpen()) this.openDropdown();
  }

  // -- public API -----------------------------------------------------------

  openDropdown(): void {
    if (this.interactive()) this.dropdownOpen.toggle(true);
  }

  closeDropdown(): void {
    this.dropdownOpen.toggle(false);
  }

  selectItem(item: T): void {
    this.setSelected(item);
    this.emit();
    this.closeDropdown();
  }

  // -- private --------------------------------------------------------------

  private setSelected(item: T): void {
    this.selectedItem.set(item);
    this.freeText.set(null);
    this.inputText.set(this.stringify()(item));
  }

  private clearState(): void {
    this.selectedItem.set(null);
    this.freeText.set(null);
    this.inputText.set('');
  }

  private emit(): void {
    this.onChange(this.emittedValue());
  }

  private findExactMatch(text: string): T | undefined {
    const stringifyFn = this.stringify() as NxpStringHandler<T | string>;
    return this.items().find((item) =>
      NXP_STRICT_MATCHER(item, text, stringifyFn),
    );
  }

  /**
   * Map an external value (from the form control or a programmatic write) onto
   * the internal selected/freeText signals so the input text reflects it.
   */
  private applyExternalValue(value: T | V | string | null): void {
    if (value == null) {
      this.clearState();
      return;
    }

    // 1. valuePrimitive — look up the item by valueField.
    const field = this.valueField();
    if (this.valuePrimitive() && field) {
      const match = this.items().find(
        (item) => item != null && readField(item, field) === value,
      );
      if (match !== undefined) {
        this.setSelected(match);
        return;
      }
    }

    // 2. Object value — match via identityMatcher, falling back to the value
    //    itself so display still reflects whatever stringify yields.
    if (typeof value === 'object') {
      const matcher = this.identityMatcher();
      const match = this.items().find((item) => matcher(item, value as T));
      this.setSelected(match ?? (value as T));
      return;
    }

    // 3. String — free text (non-strict) or try to match as display text.
    if (typeof value === 'string') {
      if (!this.strict()) {
        this.selectedItem.set(null);
        this.freeText.set(value);
        this.inputText.set(value);
        return;
      }
      const match = this.findExactMatch(value);
      if (match !== undefined) {
        this.setSelected(match);
        return;
      }
      this.clearState();
      return;
    }

    // 4. Primitive that didn't match by valueField — clear.
    this.clearState();
  }
}
