import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  cx,
  NXP_ITEMS_HANDLERS,
  nxpAsDataListHost,
  type NxpDataListHost,
  type NxpItemsHandlers,
} from '@nxp/cdk';
import { DataListComponent } from '@nxp/components/data-list';
import { NxpMultiSelectOptionComponent } from './multi-select-option.component';

/**
 * Multi-select component — self-contained chip-based multi-value picker.
 *
 * Renders selected items as removable chips. Opens an inline dropdown panel
 * with a listbox of options. Implements `ControlValueAccessor` for use with
 * Angular reactive forms or template-driven forms.
 *
 * Uses `NXP_ITEMS_HANDLERS` for stringify, identity matching, and disabled checks.
 * Communicates with child options via `NXP_DATA_LIST_HOST`.
 *
 * @example
 * ```html
 * <nxp-multi-select
 *   [formControl]="countriesCtrl"
 *   [items]="countries"
 *   placeholder="Select countries..."
 * />
 * ```
 *
 * @example
 * <!-- With custom stringify + identity -->
 * ```typescript
 * providers: [nxpItemsHandlersProvider({
 *   stringify: signal(c => c.name),
 *   identityMatcher: signal((a, b) => a.id === b.id),
 * })]
 * ```
 */
@Component({
  selector: 'nxp-multi-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataListComponent, NxpMultiSelectOptionComponent],
  providers: [
    nxpAsDataListHost(NxpMultiSelectComponent),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NxpMultiSelectComponent,
      multi: true,
    },
  ],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <!-- Trigger area: chips + hidden input for keyboard/a11y -->
    <div
      class="flex flex-wrap items-center gap-1 min-h-9 w-full p-1.5 cursor-text"
      (click)="onTriggerClick($event)"
    >
      <!-- Selected chips -->
      @for (item of value(); track identityTrack($index, item)) {
        <span class="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 leading-none shrink-0">
          <span class="truncate max-w-[12rem]">{{ stringify(item) }}</span>
          @if (!disabled()) {
            <button
              type="button"
              class="ml-0.5 shrink-0 rounded-sm opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
              (click)="removeAt($index); $event.stopPropagation()"
              [attr.aria-label]="'Remove ' + stringify(item)"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" class="h-3 w-3" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          }
        </span>
      }

      <!-- Focusable input for keyboard/a11y -->
      <input
        #triggerInput
        class="min-w-0 flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:cursor-not-allowed caret-transparent cursor-default select-none"
        [placeholder]="value().length === 0 ? placeholder() : ''"
        [disabled]="disabled()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-label]="placeholder()"
        role="combobox"
        readonly
        (focus)="focused.set(true)"
        (blur)="onBlur()"
        (keydown.escape)="closeDropdown()"
        (keydown.backspace)="onBackspace()"
        (keydown.space)="openDropdown(); $event.preventDefault()"
        (keydown.enter)="onTriggerClick($event)"
        (keydown.arrowDown)="openDropdown(); $event.preventDefault()"
      />

      <!-- Chevron icon -->
      <svg
        class="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-150 ml-1"
        [class.rotate-180]="isOpen()"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- Dropdown panel -->
    @if (isOpen()) {
      <div
        class="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-lg"
        role="listbox"
        aria-multiselectable="true"
      >
        <nxp-data-list [emptyLabel]="emptyLabel()">
          @for (item of items(); track $index) {
            <nxp-multi-select-option [value]="item" />
          }
        </nxp-data-list>
      </div>
    }
  `,
})
export class NxpMultiSelectComponent<T = unknown>
  implements ControlValueAccessor, NxpDataListHost<T>
{
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly handlers = inject<NxpItemsHandlers<T>>(NXP_ITEMS_HANDLERS);

  private readonly triggerInputRef = viewChild<ElementRef<HTMLInputElement>>('triggerInput');

  private _onChange: (value: readonly T[]) => void = () => {};
  private _onTouched: () => void = () => {};

  // ------------------------------------------------------------------ inputs

  /** Items to display in the dropdown list. */
  readonly items = input<readonly T[]>([]);

  /** Placeholder shown in the trigger when nothing is selected. */
  readonly placeholder = input('Select...');

  /** Text shown in the dropdown when no items are provided. */
  readonly emptyLabel = input('No options');

  /** Extra CSS classes merged onto the host element. */
  readonly class = input('');

  // ------------------------------------------------------------------ state

  /** Currently selected values. */
  readonly value = signal<readonly T[]>([]);

  /** Whether the dropdown panel is open. */
  readonly isOpen = signal(false);

  /** Whether the trigger input is focused. */
  readonly focused = signal(false);

  /** Whether the control is disabled. */
  readonly disabled = signal(false);

  // ------------------------------------------------------------------ host class

  protected readonly hostClass = computed(() =>
    cx(
      'relative block rounded-md border transition-colors duration-150',
      'bg-white dark:bg-gray-950',
      this.focused() || this.isOpen()
        ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/20'
        : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
      this.disabled() && 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900 pointer-events-none',
      this.class(),
    ),
  );

  // ------------------------------------------------------------------ lifecycle

  constructor() {
    // Single subscription: close on click outside the host element
    fromEvent<MouseEvent>(this.doc, 'click', { capture: true })
      .pipe(
        filter(() => this.isOpen()),
        filter((e) => !this.el.nativeElement.contains(e.target as Node)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.closeDropdown();
        this.cdr.markForCheck();
      });
  }

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
    const matcher = this.handlers.identityMatcher();
    const idx = current.findIndex((v) => matcher(v, item));
    if (idx >= 0) {
      this.setValue([...current.slice(0, idx), ...current.slice(idx + 1)]);
    } else {
      this.setValue([...current, item]);
    }
  }

  /** Remove the item at the given index. */
  removeAt(index: number): void {
    const current = [...this.value()];
    current.splice(index, 1);
    this.setValue(current);
    this.triggerInputRef()?.nativeElement?.focus();
  }

  /** Replace the entire selection — used by group select-all/none. */
  setItems(items: readonly T[]): void {
    this.setValue(items);
  }

  /** Whether a given item is in the current selection. */
  isItemSelected(item: T): boolean {
    const matcher = this.handlers.identityMatcher();
    return this.value().some((v) => matcher(v, item));
  }

  /** Open the dropdown panel. */
  openDropdown(): void {
    if (this.disabled()) return;
    this.isOpen.set(true);
  }

  /** Close the dropdown panel. */
  closeDropdown(): void {
    this.isOpen.set(false);
  }

  // ------------------------------------------------------------------ event handlers

  protected onTriggerClick(event: Event): void {
    event.preventDefault();
    if (this.disabled()) return;
    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
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

  // ------------------------------------------------------------------ helpers

  stringify(item: T): string {
    return this.handlers.stringify()(item);
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

  private setValue(items: readonly T[]): void {
    this.value.set(items);
    this._onChange(items);
  }
}
