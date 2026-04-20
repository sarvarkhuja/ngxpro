import {
  computed,
  Directive,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import {
  nxpAsControl,
  NxpControl,
  NXP_ITEMS_HANDLERS,
  nxpAsOptionContent,
  NxpDropdownOpen,
  nxpDropdownEnabled,
  NxpDropdownDirective,
  nxpInjectElement,
  NXP_STRICT_MATCHER,
  NXP_DEFAULT_MATCHER,
  type NxpStringMatcher,
} from '@nxp/cdk';
import {
  nxpAsTextfieldAccessor,
  type NxpTextfieldAccessor,
} from '@nxp/cdk/components/textfield';
import { NxpSelectOptionComponent } from './select-option.component';

@Directive({
  selector: 'input[nxpComboBox]',
  standalone: true,
  providers: [
    nxpAsOptionContent(NxpSelectOptionComponent),
    nxpAsTextfieldAccessor(NxpComboBoxDirective),
    nxpAsControl(NxpComboBoxDirective),
  ],
  hostDirectives: [],
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
  },
  exportAs: 'nxpComboBox',
})
export class NxpComboBoxDirective<T = unknown>
  extends NxpControl<T | string | null>
  implements NxpTextfieldAccessor<T | string | null>
{
  private readonly el = nxpInjectElement<HTMLInputElement>();
  private readonly handlers = inject(NXP_ITEMS_HANDLERS);
  private readonly dropdownDirective = inject(NxpDropdownDirective);
  private readonly dropdownOpen = inject(NxpDropdownOpen);

  // ------------------------------------------------------------------ inputs

  readonly items = input<readonly T[]>([]);

  /**
   * Whether the combo-box requires the user to select an existing option.
   * When `true` (default), free-text input is rejected on blur if no exact match.
   * When `false`, any typed string is accepted as the value.
   */
  readonly strict = input(true);

  /**
   * Custom matcher used when filtering items.
   * Defaults to `NXP_DEFAULT_MATCHER` (substring match, case-insensitive).
   */
  readonly matcher = input<NxpStringMatcher<T>>(NXP_DEFAULT_MATCHER);

  // ------------------------------------------------------------------ internal state

  private readonly confirmedValue = signal<T | string | null>(null);

  /** Text currently visible in the input element. */
  readonly inputText = signal('');

  /** Whether the dropdown is currently open. */
  readonly isOpen = computed(() => !!this.dropdownDirective.ref());

  // ------------------------------------------------------------------ NxpTextfieldAccessor

  override readonly value = computed<string>(() => {
    const v = this.confirmedValue();
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return this.stringify(v);
  });

  // ------------------------------------------------------------------ filtered items

  readonly filteredItems = computed(() => {
    const text = this.inputText();
    const all = this.items();
    const matchFn = this.matcher();
    const stringifyFn = this.handlers.stringify();

    if (!text) return all;
    return all.filter((item) => matchFn(item, text, stringifyFn));
  });

  // ------------------------------------------------------------------ lifecycle

  constructor() {
    super();

    nxpDropdownEnabled(this.interactive);

    // Sync confirmedValue -> input text
    effect(() => {
      const v = this.confirmedValue();
      const text = v == null ? '' : typeof v === 'string' ? v : this.stringify(v);
      untracked(() => {
        if (this.el.value !== text) {
          this.el.value = text;
          this.inputText.set(text);
        }
      });
    });

    // Non-strict mode: accept raw text when no options match
    effect(() => {
      const text = this.inputText();
      const filtered = this.filteredItems();

      if (!this.strict() && text && filtered.length === 0) {
        untracked(() => {
          this.confirmedValue.set(text);
          this.onChange(text as T | string | null);
        });
      }
    });
  }

  // ------------------------------------------------------------------ NxpTextfieldAccessor

  setValue(value: T | string | null): void {
    const text = value == null ? '' : typeof value === 'string' ? value : this.stringify(value);
    this.el.value = text;
    this.inputText.set(text);
    this.confirmedValue.set(value);
    this.onChange(value);
    this.closeDropdown();
  }

  // ------------------------------------------------------------------ CVA override

  override writeValue(value: T | null): void {
    super.writeValue(value);
    const text = value == null ? '' : typeof value === 'string' ? value : this.stringify(value);
    this.confirmedValue.set(value);
    this.el.value = text;
    this.inputText.set(text);
  }

  // ------------------------------------------------------------------ event handlers

  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.inputText.set(text);
    this.openDropdown();
  }

  protected onBlur(): void {
    this.onTouched();

    if (!this.strict()) return;

    const text = this.inputText();
    if (!text) {
      this.confirmedValue.set(null);
      this.onChange(null);
      return;
    }

    const stringifyFn = this.handlers.stringify();
    const exactMatch = this.items().find((item) =>
      NXP_STRICT_MATCHER(item, text, stringifyFn),
    );

    if (exactMatch !== undefined) {
      this.confirmedValue.set(exactMatch);
      this.onChange(exactMatch as T | string | null);
    } else {
      // Revert to the last confirmed value
      const current = this.confirmedValue();
      const revertText =
        current == null ? '' : typeof current === 'string' ? current : this.stringify(current);
      this.el.value = revertText;
      this.inputText.set(revertText);
    }
  }

  protected onEnter(event: Event): void {
    const filtered = this.filteredItems();
    if (filtered.length === 1 && filtered[0] != null) {
      event.preventDefault();
      this.selectItem(filtered[0]);
    }
  }

  // ------------------------------------------------------------------ public API

  openDropdown(): void {
    if (this.interactive()) {
      this.dropdownOpen.toggle(true);
    }
  }

  closeDropdown(): void {
    this.dropdownOpen.toggle(false);
  }

  selectItem(item: T): void {
    const text = this.stringify(item);
    this.el.value = text;
    this.inputText.set(text);
    this.confirmedValue.set(item);
    this.onChange(item as T | string | null);
    this.closeDropdown();
  }

  // ------------------------------------------------------------------ private

  private stringify(value: T): string {
    return this.handlers.stringify()(value as Parameters<ReturnType<typeof this.handlers.stringify>>[0]);
  }
}
