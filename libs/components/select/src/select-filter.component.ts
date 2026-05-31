import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  afterNextRender,
  computed,
  contentChild,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  cx,
  NXP_DEFAULT_MATCHER,
  NXP_ITEMS_HANDLERS,
  NxpDropdownOpen,
  nxpInjectElement,
  type NxpStringHandler,
  type NxpStringMatcher,
} from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';

/**
 * Panel wrapper for `<input nxpSelect>` dropdowns that adds a search input
 * above the option list and an automatic "Create" affordance when the filter
 * matches nothing.
 *
 * Lives inside a `<ng-template nxpDropdown>` and projects the consumer's
 * option template via an `<ng-template>` content child. The filtered list is
 * passed as the implicit context variable.
 *
 * @example
 * ```html
 * <nxp-textfield>
 *   <label nxpLabel>Tag</label>
 *   <input nxpInput nxpSelect [formControl]="tagCtrl" />
 *   <ng-template nxpDropdown>
 *     <nxp-select-filter
 *       [items]="tags()"
 *       placeholder="Search or create…"
 *       (create)="addTag($event)"
 *     >
 *       <ng-template let-list>
 *         @for (t of list; track t) {
 *           <nxp-select-option [value]="t" />
 *         }
 *       </ng-template>
 *     </nxp-select-filter>
 *   </ng-template>
 * </nxp-textfield>
 * ```
 */
@Component({
  selector: 'nxp-select-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    NxpTextfieldComponent,
    NxpInputDirective,
    DataListComponent,
  ],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <div
      class="px-2 pt-2 pb-1.5 border-b border-neutral-200 dark:border-neutral-800"
    >
      <nxp-textfield class="w-full" size="sm">
        <input
          #filterInput
          nxpInput
          type="text"
          autocomplete="off"
          spellcheck="false"
          aria-label="Filter options"
          [placeholder]="placeholder()"
          [value]="search()"
          (input)="onInput($event)"
          (keydown.arrowDown)="focusFirstOption($event)"
          (keydown.escape)="onEscape($event)"
        />
      </nxp-textfield>
    </div>

    <nxp-data-list
      [emptyLabel]="emptyLabel()"
      class="max-h-64 overflow-auto p-1"
    >
      <ng-container
        *ngTemplateOutlet="
          itemTpl();
          context: { $implicit: filteredItems(), search: search() }
        "
      />

      @if (showCreate()) {
        <button
          type="button"
          role="option"
          tabindex="0"
          aria-selected="false"
          [attr.aria-label]="createLabel() + ' ' + trimmedSearch()"
          [class]="createClasses"
          (pointerdown)="$event.preventDefault()"
          (click)="emitCreate()"
          (keydown.enter)="emitCreate()"
          (keydown.space)="onCreateKeydownSpace($event)"
        >
          <svg
            class="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 5v14M5 12h14"
            />
          </svg>
          <span class="flex-1 truncate"
            >{{ createLabel() }} "{{ trimmedSearch() }}"</span
          >
        </button>
      }
    </nxp-data-list>
  `,
})
export class NxpSelectFilterComponent<T = unknown> {
  private readonly hostEl = nxpInjectElement<HTMLElement>();
  private readonly parentHandlers = inject(NXP_ITEMS_HANDLERS, {
    optional: true,
  });
  /**
   * The ancestor textfield's open/close controller, reachable because this
   * panel renders inside the `<ng-template nxpDropdown>` whose injector chains
   * through `<nxp-textfield>`. Optional so the panel still works standalone.
   */
  private readonly dropdown = inject(NxpDropdownOpen, { optional: true });

  // ----------------------------------------------------------------- inputs

  readonly items = input<readonly T[]>([]);

  /** Custom matcher used for filtering. Defaults to case-insensitive substring. */
  readonly matcher = input<NxpStringMatcher<T>>(NXP_DEFAULT_MATCHER);

  /**
   * Stringify override. Falls back to the ancestor textfield's
   * `NXP_ITEMS_HANDLERS.stringify()` (which honors `textField` on the select
   * directive), then to `String(item)`.
   */
  readonly stringify = input<NxpStringHandler<T> | undefined>(undefined);

  readonly placeholder = input<string>('Search…');
  readonly emptyLabel = input<string>('No matches');
  readonly createLabel = input<string>('Create');

  /** Whether the filter input should auto-focus when the dropdown opens. */
  readonly autoFocus = input<boolean>(true);

  // ---------------------------------------------------------------- outputs

  readonly create = output<string>();

  // ------------------------------------------------------------------ state

  /** Current filter text — bound to the search input. */
  readonly search = signal('');

  /** Search text with surrounding whitespace removed — the value the create
   * affordance shows and emits. */
  protected readonly trimmedSearch = computed(() => this.search().trim());

  protected readonly itemTpl = contentChild.required(TemplateRef<unknown>);

  private readonly filterInputRef =
    viewChild<ElementRef<HTMLInputElement>>('filterInput');

  protected readonly effectiveStringify = computed<NxpStringHandler<T>>(() => {
    const explicit = this.stringify();
    if (explicit) return explicit;
    const inherited = this.parentHandlers?.stringify() as
      | NxpStringHandler<T>
      | undefined;
    return inherited ?? (String as NxpStringHandler<T>);
  });

  readonly filteredItems = computed<readonly T[]>(() => {
    const text = this.search().trim();
    const all = this.items();
    if (!text) return all;
    const match = this.matcher();
    const str = this.effectiveStringify() as NxpStringHandler<T | string>;
    return all.filter((item) => match(item, text, str));
  });

  protected readonly hasMatches = computed(
    () => this.filteredItems().length > 0,
  );

  protected readonly showCreate = computed(
    () => this.trimmedSearch().length > 0 && !this.hasMatches(),
  );

  protected readonly hostClass = computed(() =>
    cx('block w-full bg-bg-surface'),
  );

  protected readonly createClasses = cx(
    'relative z-10 flex w-full cursor-pointer items-center gap-2 rounded-s px-3 py-1.5',
    'text-sm font-medium text-left text-primary',
    'hover:bg-bg-neutral-1',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1',
    'focus-visible:outline-border-focus',
    'transition-colors duration-fast select-none',
  );

  constructor() {
    afterNextRender(() => {
      if (this.autoFocus()) this.filterInputRef()?.nativeElement.focus();
    });
  }

  // ---------------------------------------------------------------- handlers

  protected onInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected onEscape(event: Event): void {
    if (this.search()) {
      event.stopPropagation();
      this.search.set('');
    }
  }

  protected focusFirstOption(event: Event): void {
    const first = this.hostEl.querySelector<HTMLElement>(
      '[role="option"]:not([aria-disabled="true"])',
    );
    if (first) {
      event.preventDefault();
      first.focus();
    }
  }

  protected onCreateKeydownSpace(event: Event): void {
    event.preventDefault();
    this.emitCreate();
  }

  protected emitCreate(): void {
    const value = this.trimmedSearch();
    if (!value) return;
    this.create.emit(value);
    this.search.set('');
    // The create row is presented as just another `role="option"`, so picking
    // it closes the dropdown like selecting any option does.
    this.dropdown?.toggle(false);
  }
}
