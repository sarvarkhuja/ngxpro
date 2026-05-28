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
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  cx,
  NXP_ITEMS_HANDLERS,
  NxpDropdownContent,
  NxpDropdownDirective,
  NxpDropdownFixed,
  NxpDropdownOpen,
  nxpAsDataListHost,
  type NxpDataListHost,
  type NxpIdentityMatcher,
  type NxpItemsHandlers,
  type NxpStringHandler,
} from '@ngxpro/cdk';
import { DataListComponent } from '@ngxpro/components/data-list';
import { NxpInputChipItemComponent } from '@ngxpro/components/input-chip';
import type { NxpChipSize } from '@ngxpro/components/chip';
import { NxpMultiSelectOptionComponent } from './multi-select-option.component';

/**
 * Chip-based multi-value picker.
 *
 * Selected items render as removable pill chips (`<nxp-input-chip-item>`
 * from `@ngxpro/components/input-chip`) inside a shadow-bordered shell,
 * matching the rest of the input family. Clicking the shell opens a
 * portal-rendered dropdown listbox — escapes `overflow-hidden` ancestors
 * just like the `<nxp-textfield>`-wrapped combo-box.
 *
 * Wired through the standard CDK plumbing:
 * - `NXP_ITEMS_HANDLERS` — stringify / identityMatcher / disabledItemHandler
 * - `NXP_DATA_LIST_HOST` — options call `handleOption(item)` to toggle
 * - `NxpDropdownDirective` + `NxpDropdownOpen` + `NxpDropdownFixed` — host
 *   directives that hoist the panel into the CDK portal layer and width-lock
 *   it to the trigger
 *
 * For the chip-less, textfield-wrapped variant, use the sibling
 * `NxpMultiSelectDirective` (`input[nxpMultiSelect]`) directly.
 *
 * @example
 * ```html
 * <nxp-multi-select
 *   [formControl]="fruitsCtrl"
 *   [items]="fruits"
 *   placeholder="Select fruits..."
 *   emptyLabel="No fruits"
 * />
 * ```
 */
@Component({
  selector: 'nxp-multi-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataListComponent,
    NxpInputChipItemComponent,
    NxpMultiSelectOptionComponent,
    NxpDropdownContent,
  ],
  hostDirectives: [NxpDropdownDirective, NxpDropdownOpen, NxpDropdownFixed],
  providers: [
    nxpAsDataListHost(NxpMultiSelectComponent),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NxpMultiSelectComponent,
      multi: true,
    },
  ],
  host: { '[class]': 'hostClass()' },
  template: `
    <div
      class="flex flex-wrap items-center gap-1 min-h-9 w-full p-1.5 cursor-text"
      role="presentation"
      (click)="onWrapperClick($event)"
    >
      @for (item of value(); track identityTrack($index, item)) {
        <nxp-input-chip-item
          [item]="item"
          [text]="stringify(item)"
          [editable]="false"
          [interactive]="!disabled()"
          [chipDisabled]="isDisabledItem(item)"
          [size]="chipSize()"
          (remove)="removeAt($index)"
        />
      }

      <input
        #triggerInput
        class="min-w-[3rem] flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-quaternary disabled:cursor-not-allowed disabled:text-text-quaternary caret-transparent cursor-default select-none"
        [placeholder]="value().length === 0 ? placeholder() : ''"
        [disabled]="disabled()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-label]="placeholder()"
        [attr.aria-controls]="listboxId"
        role="combobox"
        readonly
        (focus)="focused.set(true)"
        (blur)="onBlur()"
        (keydown.backspace)="onBackspace()"
        (keydown.space)="onSpace($event)"
        (keydown.enter)="onEnter($event)"
      />

      <svg
        class="h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-normal ml-1"
        [class.rotate-180]="isOpen()"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
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
        aria-multiselectable="true"
        [emptyLabel]="emptyLabel()"
      >
        @for (item of items(); track $index) {
          <nxp-multi-select-option [value]="item" />
        }
      </nxp-data-list>
    </ng-template>
  `,
})
export class NxpMultiSelectComponent<T = unknown>
  implements ControlValueAccessor, NxpDataListHost<T>
{
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly handlers = inject<NxpItemsHandlers<T>>(NXP_ITEMS_HANDLERS);
  private readonly dropdownDirective = inject(NxpDropdownDirective);
  private readonly dropdownOpen = inject(NxpDropdownOpen);

  private readonly triggerInputRef =
    viewChild<ElementRef<HTMLInputElement>>('triggerInput');

  private static _idCounter = 0;
  readonly listboxId = `nxp-multi-select-listbox-${++NxpMultiSelectComponent._idCounter}`;

  private _onChange: (value: readonly T[]) => void = () => {
    /* noop */
  };
  private _onTouched: () => void = () => {
    /* noop */
  };

  // ------------------------------------------------------------------ inputs

  /** Items to display in the dropdown list. */
  readonly items = input<readonly T[]>([]);

  /** Placeholder shown in the trigger when nothing is selected. */
  readonly placeholder = input('Select...');

  /** Text shown in the dropdown when no items are provided. */
  readonly emptyLabel = input('No options');

  /** Chip pill size — passed through to `<nxp-input-chip-item>`. */
  readonly chipSize = input<NxpChipSize>('sm');

  /**
   * Property name on each item used as the display text. When set, takes
   * precedence over any injected `NXP_ITEMS_HANDLERS.stringify`. Lets one
   * instance opt into per-property labelling without a DI provider.
   */
  readonly textField = input<string | undefined>(undefined);

  /**
   * Property name on each item used for identity matching. When set, items
   * compare by `item[valueField]` instead of `===` / the injected matcher.
   */
  readonly valueField = input<string | undefined>(undefined);

  /** Extra CSS classes merged onto the host element. */
  readonly class = input('');

  // ------------------------------------------------------------------ resolved handlers

  /**
   * Stringify resolution order: per-instance `textField` first, then the
   * injected `NXP_ITEMS_HANDLERS.stringify`, falling back to `String(item)`
   * when the upstream handler yields an empty string (defends against a
   * shared-scope handler typed for a sibling component — e.g. a `Country`
   * stringifier in scope while this instance is fed plain strings).
   */
  protected readonly resolvedStringify = computed<NxpStringHandler<T>>(() => {
    const field = this.textField();
    if (field) {
      return (item) => {
        if (item == null) return '';
        const raw = (item as Record<string, unknown>)[field];
        return raw == null ? '' : String(raw);
      };
    }
    const upstream = this.handlers.stringify();
    return (item) => {
      if (item == null) return '';
      const result = upstream(item);
      if (result != null && result !== '') return String(result);
      return String(item);
    };
  });

  /** Identity resolution: per-instance `valueField` first, then injected. */
  protected readonly resolvedIdentity = computed<NxpIdentityMatcher<T>>(() => {
    const field = this.valueField();
    if (field) {
      return (a, b) =>
        a != null &&
        b != null &&
        (a as Record<string, unknown>)[field] ===
          (b as Record<string, unknown>)[field];
    }
    return this.handlers.identityMatcher();
  });

  // ------------------------------------------------------------------ state

  /** Currently selected values. */
  readonly value = signal<readonly T[]>([]);

  /** Whether the trigger input is focused. */
  readonly focused = signal(false);

  /** Whether the control is disabled. */
  readonly disabled = signal(false);

  /** Whether the dropdown panel is currently mounted. */
  readonly isOpen = computed(() => !!this.dropdownDirective.ref());

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

  // ------------------------------------------------------------------ NxpDataListHost

  /** Called by option components when clicked. Toggles the item in the selection. */
  handleOption(option: T): void {
    if (this.disabled()) return;
    this.toggleItem(option);
    this.triggerInputRef()?.nativeElement?.focus();
  }

  // ------------------------------------------------------------------ public API

  /** Toggle an item — adds if absent, removes if present. */
  toggleItem(item: T): void {
    const current = this.value();
    const matcher = this.resolvedIdentity();
    const idx = current.findIndex((v) => matcher(v, item));
    if (idx >= 0) {
      this.writeSelected([...current.slice(0, idx), ...current.slice(idx + 1)]);
    } else {
      this.writeSelected([...current, item]);
    }
  }

  /** Remove the item at the given index. */
  removeAt(index: number): void {
    const current = [...this.value()];
    if (index < 0 || index >= current.length) return;
    current.splice(index, 1);
    this.writeSelected(current);
    this.triggerInputRef()?.nativeElement?.focus();
  }

  /** Replace the entire selection — used by group select-all / select-none. */
  setItems(items: readonly T[]): void {
    this.writeSelected(items);
  }

  /** Read-only view of the selected array — used by option / group hosts. */
  selectedItems(): readonly T[] {
    return this.value();
  }

  /** Whether a given item is in the current selection. */
  isItemSelected(item: T): boolean {
    const matcher = this.resolvedIdentity();
    return this.value().some((v) => matcher(v, item));
  }

  /** Open the dropdown panel. */
  openDropdown(): void {
    if (this.disabled()) return;
    this.dropdownOpen.toggle(true);
  }

  /** Close the dropdown panel. */
  closeDropdown(): void {
    this.dropdownOpen.toggle(false);
  }

  // ------------------------------------------------------------------ event handlers

  protected onWrapperClick(event: Event): void {
    if (this.disabled()) return;
    // Always handle the toggle ourselves and stop the event before it reaches
    // NxpDropdownOpen's host (click) listener. That listener resolves its
    // trigger via `nxpGetClosestFocusable` inside the host, which is the
    // input when there are no chips but the first chip's remove `<button>`
    // once chips render — so leaving the auto-toggle on would either
    // double-fire (no chips) or no-op for input clicks (chips present).
    event.stopPropagation();
    this.dropdownOpen.toggle(!this.isOpen());
    this.triggerInputRef()?.nativeElement?.focus();
  }

  protected onBlur(): void {
    this.focused.set(false);
    this._onTouched();
  }

  protected onBackspace(): void {
    const current = this.value();
    if (current.length) {
      this.removeAt(current.length - 1);
    }
  }

  protected onSpace(event: Event): void {
    event.preventDefault();
    this.openDropdown();
  }

  protected onEnter(event: Event): void {
    event.preventDefault();
    this.dropdownOpen.toggle(!this.isOpen());
  }

  // ------------------------------------------------------------------ helpers

  stringify(item: T): string {
    return this.resolvedStringify()(item);
  }

  /** Resolved label — used by option / group via the host bridge. */
  getLabel(item: T): string {
    return this.resolvedStringify()(item);
  }

  /** Resolved identity matcher — used by group's select-all bookkeeping. */
  getIdentity(): NxpIdentityMatcher<T> {
    return this.resolvedIdentity();
  }

  isDisabledItem(item: T): boolean {
    return this.handlers.disabledItemHandler()(item);
  }

  identityTrack(index: number, item: T): unknown {
    return item ?? index;
  }

  // ------------------------------------------------------------------ ControlValueAccessor

  writeValue(value: readonly T[] | null): void {
    this.value.set(value ?? []);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: readonly T[]) => void): void {
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

  private writeSelected(items: readonly T[]): void {
    this.value.set(items);
    this._onChange(items);
  }
}
