import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
  type Signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  cx,
  NXP_DEFAULT_MATCHER,
  NXP_ITEMS_HANDLERS,
  NXP_STRICT_MATCHER,
  NxpDropdownContent,
  NxpDropdownDirective,
  NxpDropdownFixed,
  NxpDropdownOpen,
  nxpAsDataListHost,
  type NxpBooleanHandler,
  type NxpDataListHost,
  type NxpIdentityMatcher,
  type NxpItemsHandlers,
  type NxpStringHandler,
  type NxpStringMatcher,
} from '@ngxpro/cdk';
import {
  nxpAsTextfieldAccessor,
  type NxpTextfieldAccessor,
} from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';
import { NxpSelectOptionComponent } from './select-option.component';

const NEVER_DISABLED = ((): false => false) as NxpBooleanHandler<unknown>;

function readField(item: unknown, key: string): unknown {
  return (item as Record<string, unknown>)[key];
}

/**
 * Self-contained editable single-select with type-to-filter — the component
 * form of `nxpComboBox`.
 *
 * Renders its own editable trigger and a portal-hosted dropdown built from the
 * `[items]` input, so consumers get a single element + `[formControl]` instead
 * of hand-assembling `<nxp-textfield>` + `<input nxpComboBox>` + dropdown
 * template. For custom dropdown content use the `input[nxpComboBox]` directive
 * directly — that remains the extensible escape hatch.
 *
 * Behavioural parity with `NxpComboBoxDirective`: strict / non-strict free
 * text, `valueField` identity, `valuePrimitive` emission, substring filtering,
 * and Enter-selects-sole-match.
 *
 * @example
 * ```html
 * <nxp-combo-box
 *   [formControl]="sizeCtrl"
 *   [items]="sizes"
 *   textField="text"
 *   valueField="value"
 *   [valuePrimitive]="true"
 *   placeholder="Pick a size…"
 * />
 * ```
 */
@Component({
  selector: 'nxp-combo-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataListComponent, NxpSelectOptionComponent, NxpDropdownContent],
  hostDirectives: [NxpDropdownDirective, NxpDropdownOpen, NxpDropdownFixed],
  providers: [
    nxpAsDataListHost(NxpComboBoxComponent),
    { provide: NXP_ITEMS_HANDLERS, useExisting: NxpComboBoxComponent },
    nxpAsTextfieldAccessor(NxpComboBoxComponent),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NxpComboBoxComponent,
      multi: true,
    },
  ],
  host: { '[class]': 'hostClass()' },
  template: `
    <div
      class="flex items-center gap-1 min-h-9 w-full px-2.5 py-1.5"
      role="presentation"
    >
      <input
        #triggerInput
        [id]="inputId"
        class="min-w-0 flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-quaternary disabled:cursor-not-allowed disabled:text-text-quaternary truncate"
        autocomplete="off"
        [value]="inputText()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-autocomplete]="'list'"
        [attr.aria-controls]="listboxId"
        role="combobox"
        (focus)="focused.set(true)"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (keydown.escape)="closeDropdown()"
        (keydown.enter)="onEnter($event)"
        (keydown.arrowDown)="onArrowOpen()"
        (keydown.arrowUp)="onArrowOpen()"
      />

      <svg
        class="h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-normal cursor-pointer"
        [class.rotate-180]="isOpen()"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        (click)="onChevronClick($event)"
      >
        <path
          fill-rule="evenodd"
          d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <ng-template nxpDropdown>
      <nxp-data-list
        [id]="listboxId"
        role="listbox"
        [emptyLabel]="emptyLabel()"
      >
        @for (item of filteredItems(); track $index) {
          <nxp-select-option [value]="item" />
        }
      </nxp-data-list>
    </ng-template>
  `,
})
export class NxpComboBoxComponent<T = unknown, V = T>
  implements
    ControlValueAccessor,
    NxpDataListHost<T>,
    NxpItemsHandlers<T>,
    NxpTextfieldAccessor<T | V | string>
{
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dropdownDirective = inject(NxpDropdownDirective);
  private readonly dropdownOpen = inject(NxpDropdownOpen);

  private readonly triggerInputRef =
    viewChild<ElementRef<HTMLInputElement>>('triggerInput');

  private static _idCounter = 0;
  readonly listboxId = `nxp-combo-box-listbox-${++NxpComboBoxComponent._idCounter}`;
  /**
   * Stable per-instance id for the trigger input. A form field element with
   * neither `id` nor `name` trips the browser's "form field element should
   * have an id or name attribute" audit; the id also lets external labels
   * associate via `for`.
   */
  readonly inputId = `nxp-combo-box-input-${NxpComboBoxComponent._idCounter}`;

  private _onChange: (value: T | V | string | null) => void = () => {
    /* noop */
  };
  private _onTouched: () => void = () => {
    /* noop */
  };

  // ------------------------------------------------------------------ inputs

  /** Items shown in (and filtered within) the dropdown list. */
  readonly items = input<readonly T[]>([]);

  /**
   * Whether the combo-box requires an existing option. `true` (default)
   * rejects free text on blur if no exact match; `false` accepts any string.
   */
  readonly strict = input(true);

  /** Matcher used when filtering items. Defaults to case-insensitive substring. */
  readonly matcher = input<NxpStringMatcher<T>>(NXP_DEFAULT_MATCHER);

  /**
   * Property name on each item used as the display text. When set, overrides
   * any injected `NXP_ITEMS_HANDLERS.stringify`.
   */
  readonly textField = input<string | undefined>(undefined);

  /**
   * Property name on each item used for identity matching and primitive
   * extraction. When set, items compare by `item[valueField]` instead of `===`.
   */
  readonly valueField = input<string | undefined>(undefined);

  /**
   * When `true`, the form control receives `item[valueField]` (a primitive)
   * instead of the full item object. Requires `valueField` to be set.
   */
  readonly valuePrimitive = input(false);

  /** Placeholder shown when the input is empty. */
  readonly placeholder = input('Select...');

  /** Text shown in the dropdown when no items match. */
  readonly emptyLabel = input('No options');

  /** Extra CSS classes merged onto the host element. */
  readonly class = input('');

  // ------------------------------------------------------- NxpItemsHandlers<T>

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

  // ------------------------------------------------------------------ state

  /** Currently matched item from `items[]`, or null when none selected. */
  private readonly selectedItem = signal<T | null>(null);

  /** Set only in non-strict mode when the typed text doesn't match any item. */
  private readonly freeText = signal<string | null>(null);

  /** Text currently visible in the input element. */
  readonly inputText = signal('');

  /** Whether the trigger is focused. */
  readonly focused = signal(false);

  /** Whether the control is disabled. */
  readonly disabled = signal(false);

  /** Whether the dropdown panel is currently mounted. */
  readonly isOpen = computed(() => !!this.dropdownDirective.ref());

  /** Required by `NxpTextfieldAccessor`; also bound to the trigger input. */
  readonly value = computed<string>(() => this.inputText());

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

  // ------------------------------------------------------------------ host class

  protected readonly hostClass = computed(() =>
    cx(
      'relative block rounded-m transition-shadow duration-normal',
      'bg-bg-base',
      this.focused() || this.isOpen()
        ? 'shadow-input-focus'
        : 'shadow-border hover:shadow-input-hover',
      this.disabled() &&
        'cursor-not-allowed bg-bg-neutral-1 shadow-border pointer-events-none',
      this.class(),
    ),
  );

  // ------------------------------------------------------------- NxpDataListHost

  handleOption(option: T): void {
    if (this.disabled()) return;
    this.selectItem(option);
    this.triggerInputRef()?.nativeElement?.focus();
  }

  // ---------------------------------------------------------- NxpTextfieldAccessor

  setValue(value: T | V | string | null): void {
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
    this.applyExternalValue(value);
    this.emit();
    this.closeDropdown();
  }

  // ------------------------------------------------------------------ public API

  openDropdown(): void {
    if (!this.disabled()) this.dropdownOpen.toggle(true);
  }

  closeDropdown(): void {
    this.dropdownOpen.toggle(false);
  }

  selectItem(item: T): void {
    this.setSelected(item);
    this.emit();
    this.closeDropdown();
  }

  // ------------------------------------------------------------------ handlers

  protected onInput(event: Event): void {
    this.inputText.set((event.target as HTMLInputElement).value);
    this.openDropdown();
  }

  protected onBlur(): void {
    this.focused.set(false);
    this._onTouched();
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

  protected onArrowOpen(): void {
    if (!this.isOpen()) this.openDropdown();
  }

  protected onChevronClick(event: Event): void {
    event.stopPropagation();
    if (this.disabled()) return;
    this.dropdownOpen.toggle(!this.isOpen());
    this.triggerInputRef()?.nativeElement?.focus();
  }

  // ------------------------------------------------------------------ ControlValueAccessor

  writeValue(value: T | V | string | null): void {
    this.applyExternalValue(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: T | V | string | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  // ------------------------------------------------------------------ private

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
    this._onChange(this.emittedValue());
  }

  private findExactMatch(text: string): T | undefined {
    const stringifyFn = this.stringify() as NxpStringHandler<T | string>;
    return this.items().find((item) =>
      NXP_STRICT_MATCHER(item, text, stringifyFn),
    );
  }

  /**
   * Map an external value (from the form control or a programmatic write) onto
   * the internal selected / freeText signals so the input text reflects it.
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

    // 2. Object value — match via identityMatcher, falling back to the value.
    if (typeof value === 'object') {
      const matcher = this.identityMatcher();
      const match = this.items().find((item) => matcher(item, value as T));
      this.setSelected(match ?? (value as T));
      return;
    }

    // 3. String — free text (non-strict) or match as display text.
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
