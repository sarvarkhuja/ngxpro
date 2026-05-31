import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  type Signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  cx,
  NXP_DEFAULT_MATCHER,
  NXP_ITEMS_HANDLERS,
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
import {
  DataListComponent,
  OptGroupDirective,
} from '@ngxpro/components/data-list';
import { NxpSelectOptionComponent } from '@ngxpro/components/combo-box';
import { NxpSelectFilterComponent } from './select-filter.component';

const NEVER_DISABLED = ((): false => false) as NxpBooleanHandler<unknown>;

function readField(item: unknown, key: string): unknown {
  return (item as Record<string, unknown>)[key];
}

/**
 * Self-contained single-select picker — the component form of `nxpSelect`.
 *
 * Renders its own read-only trigger and a portal-hosted dropdown listbox built
 * from the `[items]` input, so consumers get a single element + `[formControl]`
 * instead of hand-assembling `<nxp-textfield>` + `<input nxpSelect>` + dropdown
 * template. For custom dropdown content (grouping, filtering, the
 * `nxp-select-filter` "create" affordance) use the `input[nxpSelect]` directive
 * directly — that remains the extensible escape hatch.
 *
 * Wired through the same CDK plumbing as `<nxp-multi-select>`:
 * - `NXP_DATA_LIST_HOST` — options call `handleOption(item)` to select
 * - `NXP_ITEMS_HANDLERS` — stringify / identityMatcher / disabledItemHandler
 * - `NXP_TEXTFIELD_ACCESSOR` — options read `value()` for their selected check
 * - `NxpDropdownDirective` + `NxpDropdownOpen` + `NxpDropdownFixed` — host
 *   directives that hoist the panel into the CDK portal and width-lock it
 *
 * @example
 * ```html
 * <nxp-select
 *   [formControl]="countryCtrl"
 *   [items]="countries"
 *   textField="name"
 *   valueField="code"
 *   placeholder="Select a country…"
 * />
 * ```
 */
@Component({
  selector: 'nxp-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    DataListComponent,
    NxpSelectOptionComponent,
    NxpDropdownContent,
    OptGroupDirective,
    NxpSelectFilterComponent,
  ],
  hostDirectives: [NxpDropdownDirective, NxpDropdownOpen, NxpDropdownFixed],
  providers: [
    nxpAsDataListHost(NxpSelectComponent),
    { provide: NXP_ITEMS_HANDLERS, useExisting: NxpSelectComponent },
    nxpAsTextfieldAccessor(NxpSelectComponent),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NxpSelectComponent,
      multi: true,
    },
  ],
  host: { '[class]': 'hostClass()' },
  template: `
    <div
      class="flex items-center gap-1 min-h-9 w-full px-2.5 py-1.5 cursor-pointer"
      role="presentation"
      (click)="onWrapperClick($event)"
    >
      <input
        #triggerInput
        [id]="inputId"
        class="min-w-0 flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-quaternary disabled:cursor-not-allowed disabled:text-text-quaternary caret-transparent cursor-default select-none truncate"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-label]="placeholder()"
        [attr.aria-controls]="listboxId"
        role="combobox"
        readonly
        (focus)="focused.set(true)"
        (blur)="onBlur()"
        (keydown.space)="onSpace($event)"
        (keydown.enter)="onEnter($event)"
      />

      @if (clearable() && selected() !== null && !disabled()) {
        <button
          type="button"
          class="shrink-0 rounded-xs p-0.5 text-text-tertiary hover:text-text-primary outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus"
          aria-label="Clear selection"
          (pointerdown)="$event.preventDefault()"
          (click)="clear($event)"
        >
          <svg
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      }

      <svg
        class="h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-normal"
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
      @if (filterable() || creatable()) {
        <nxp-select-filter
          [items]="items()"
          [matcher]="matcher()"
          [placeholder]="filterPlaceholder()"
          [emptyLabel]="emptyLabel()"
          [createLabel]="createLabel()"
          (create)="create.emit($event)"
        >
          <ng-template let-list>
            <ng-container
              *ngTemplateOutlet="optionList; context: { $implicit: list }"
            />
          </ng-template>
        </nxp-select-filter>
      } @else {
        <nxp-data-list
          [id]="listboxId"
          role="listbox"
          [emptyLabel]="emptyLabel()"
        >
          <ng-container
            *ngTemplateOutlet="optionList; context: { $implicit: items() }"
          />
        </nxp-data-list>
      }
    </ng-template>

    <ng-template #optionList let-list>
      @if (groupBy()) {
        @for (group of toGroups(list); track group.label) {
          <div nxpOptGroup [label]="group.label">
            @for (item of group.items; track $index) {
              <nxp-select-option [value]="item" />
            }
          </div>
        }
      } @else {
        @for (item of list; track $index) {
          <nxp-select-option [value]="item" />
        }
      }
    </ng-template>
  `,
})
export class NxpSelectComponent<T = unknown>
  implements
    ControlValueAccessor,
    NxpDataListHost<T>,
    NxpItemsHandlers<T>,
    NxpTextfieldAccessor<T>
{
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dropdownDirective = inject(NxpDropdownDirective);
  private readonly dropdownOpen = inject(NxpDropdownOpen);

  private readonly triggerInputRef =
    viewChild<ElementRef<HTMLInputElement>>('triggerInput');

  private static _idCounter = 0;
  readonly listboxId = `nxp-select-listbox-${++NxpSelectComponent._idCounter}`;
  /**
   * Stable per-instance id for the trigger input. A form field element with
   * neither `id` nor `name` trips the browser's "form field element should
   * have an id or name attribute" audit; the id also lets external labels
   * associate via `for`.
   */
  readonly inputId = `nxp-select-input-${NxpSelectComponent._idCounter}`;

  private _onChange: (value: T | null) => void = () => {
    /* noop */
  };
  private _onTouched: () => void = () => {
    /* noop */
  };

  // ------------------------------------------------------------------ inputs

  /** Items shown in the dropdown list. */
  readonly items = input<readonly T[]>([]);

  /** Placeholder shown in the trigger when nothing is selected. */
  readonly placeholder = input('Select...');

  /** Text shown in the dropdown when no items are provided. */
  readonly emptyLabel = input('No options');

  /** Show a clear button when a value is selected. */
  readonly clearable = input(false);

  /**
   * Property name on each item used as the display text. When set, takes
   * precedence over any injected `NXP_ITEMS_HANDLERS.stringify`.
   */
  readonly textField = input<string | undefined>(undefined);

  /**
   * Property name on each item used for identity matching. When set, items
   * compare by `item[valueField]` instead of `===`.
   */
  readonly valueField = input<string | undefined>(undefined);

  /**
   * Property name used to bucket items into labelled groups. When set, options
   * render under `nxpOptGroup` headers. Consistent with `textField` /
   * `valueField`.
   */
  readonly groupBy = input<string | undefined>(undefined);

  /** Show an in-panel search box that filters the options as you type. */
  readonly filterable = input(false);

  /** Matcher used when filtering. Defaults to case-insensitive substring. */
  readonly matcher = input<NxpStringMatcher<T>>(NXP_DEFAULT_MATCHER);

  /** Placeholder for the in-panel search input. */
  readonly filterPlaceholder = input('Search…');

  /**
   * Show a "Create …" row when the search matches nothing. Implies a search
   * box, so the panel renders the same in-dropdown filter as `filterable`.
   */
  readonly creatable = input(false);

  /** Label prefix for the create row. */
  readonly createLabel = input('Create');

  /** Emits the trimmed search text when the create row is chosen. */
  readonly create = output<string>();

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

  /**
   * Per-item disable predicate. Aliased as `disabledItem` for ergonomic
   * binding: `[disabledItem]="(item) => item.locked"`. Consumed by
   * `<nxp-select-option>` via `NXP_ITEMS_HANDLERS` for `aria-disabled` and
   * keyboard-skip.
   */
  readonly disabledItemHandler = input<NxpBooleanHandler<T>>(
    NEVER_DISABLED as NxpBooleanHandler<T>,
    { alias: 'disabledItem' },
  );

  // ------------------------------------------------------------------ state

  /** Currently selected item, or null. */
  readonly selected = signal<T | null>(null);

  /** Whether the trigger is focused. */
  readonly focused = signal(false);

  /** Whether the control is disabled. */
  readonly disabled = signal(false);

  /** Whether the dropdown panel is currently mounted. */
  readonly isOpen = computed(() => !!this.dropdownDirective.ref());

  /**
   * String display value — required by `NxpTextfieldAccessor` and bound to the
   * trigger input. The reused `<nxp-select-option>` reads this back to decide
   * which row shows the selected checkmark.
   */
  readonly value = computed<string>(() => {
    const v = this.selected();
    return v != null ? this.stringify()(v) : '';
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

  /** Called by option components when clicked. Selects and closes. */
  handleOption(option: T): void {
    if (this.disabled()) return;
    this.writeSelected(option);
    this.closeDropdown();
    this.triggerInputRef()?.nativeElement?.focus();
  }

  // ---------------------------------------------------------- NxpTextfieldAccessor

  /** Called from the textfield cleaner path (value=null) and option clicks. */
  setValue(value: T | null): void {
    if (value == null) {
      this.writeSelected(null);
      this.closeDropdown();
      return;
    }
    this.writeSelected(value);
    this.closeDropdown();
  }

  // ------------------------------------------------------------------ public API

  openDropdown(): void {
    if (this.disabled()) return;
    this.dropdownOpen.toggle(true);
  }

  closeDropdown(): void {
    this.dropdownOpen.toggle(false);
  }

  /** Whether the given item is the current selection. */
  isItemSelected(item: T): boolean {
    const current = this.selected();
    return current != null && this.identityMatcher()(current, item);
  }

  /** Bucket a list by the `groupBy` field, preserving first-seen order. */
  toGroups(list: readonly T[]): { label: string; items: T[] }[] {
    const field = this.groupBy();
    const map = new Map<string, T[]>();
    for (const item of list) {
      const label = field ? String(readField(item, field) ?? '') : '';
      const bucket = map.get(label);
      if (bucket) bucket.push(item);
      else map.set(label, [item]);
    }
    return Array.from(map, ([label, items]) => ({ label, items }));
  }

  // ------------------------------------------------------------------ handlers

  protected onWrapperClick(event: Event): void {
    if (this.disabled()) return;
    // Handle the toggle ourselves and stop the event before it reaches
    // NxpDropdownOpen's host (click) listener, which would double-fire.
    event.stopPropagation();
    this.dropdownOpen.toggle(!this.isOpen());
    this.triggerInputRef()?.nativeElement?.focus();
  }

  protected onBlur(): void {
    this.focused.set(false);
    this._onTouched();
  }

  protected onSpace(event: Event): void {
    event.preventDefault();
    this.openDropdown();
  }

  protected onEnter(event: Event): void {
    event.preventDefault();
    this.dropdownOpen.toggle(!this.isOpen());
  }

  protected clear(event: Event): void {
    event.stopPropagation();
    this.writeSelected(null);
    this.triggerInputRef()?.nativeElement?.focus();
  }

  // ------------------------------------------------------------------ ControlValueAccessor

  writeValue(value: T | null): void {
    this.selected.set(value ?? null);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: T | null) => void): void {
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

  private writeSelected(item: T | null): void {
    this.selected.set(item);
    this._onChange(item);
  }
}
