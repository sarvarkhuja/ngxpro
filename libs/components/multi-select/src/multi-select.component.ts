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
} from '@ngxpro/cdk';
import { DataListComponent } from '@ngxpro/components/data-list';
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
  templateUrl: './multi-select.component.html',
})
export class NxpMultiSelectComponent<T = unknown>
  implements ControlValueAccessor, NxpDataListHost<T>
{
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly handlers = inject<NxpItemsHandlers<T>>(NXP_ITEMS_HANDLERS);

  private readonly triggerInputRef =
    viewChild<ElementRef<HTMLInputElement>>('triggerInput');

  private static _idCounter = 0;
  readonly listboxId = `nxp-multi-select-listbox-${++NxpMultiSelectComponent._idCounter}`;

  private _onChange: (value: readonly T[]) => void = () => {
    /*noop*/
  };
  private _onTouched: () => void = () => {
    /*noop*/
  };

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
      'relative block rounded-m border transition-colors duration-normal',
      'bg-bg-base',
      this.focused() || this.isOpen()
        ? 'border-primary ring-2 ring-primary/20'
        : 'border-border-normal hover:border-border-hover',
      this.disabled() &&
        'opacity-50 cursor-not-allowed bg-bg-neutral-1 pointer-events-none',
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
