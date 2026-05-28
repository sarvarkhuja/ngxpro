import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { cx, NXP_DATA_LIST_HOST, NXP_ITEMS_HANDLERS } from '@ngxpro/cdk';
import {
  NXP_TEXTFIELD,
  NXP_TEXTFIELD_ACCESSOR,
} from '@ngxpro/cdk/components/textfield';
import { NxpMultiSelectComponent } from './multi-select.component';
import { NxpMultiSelectDirective } from './multi-select.directive';

/** Anything that exposes the multi-select selection query API. */
type MultiSelectHost<T> = {
  isItemSelected(item: T): boolean;
  getLabel(item: T): string;
};

function isMultiSelectHost<T>(value: unknown): value is MultiSelectHost<T> {
  return (
    value instanceof NxpMultiSelectComponent ||
    value instanceof NxpMultiSelectDirective
  );
}

/**
 * Option row rendered inside a multi-select dropdown.
 *
 * Selection clicks flow through `NXP_DATA_LIST_HOST` (provided by either
 * `<nxp-multi-select>` directly, or by `<nxp-textfield>` when the directive
 * variant is in use). The host's `handleOption(item)` toggles membership.
 *
 * `isSelected` is read from the parent host, resolved in priority order:
 *   1. `inject(NxpMultiSelectComponent)` — direct parent component
 *   2. `inject(NXP_TEXTFIELD).accessor()` — multi-select directive sitting
 *      on an `<input>` sibling inside `<nxp-textfield>`
 *   3. `inject(NXP_TEXTFIELD_ACCESSOR)` — direct token fallback
 *
 * `(pointerdown).preventDefault()` keeps focus on the trigger while the
 * user mouses an option so the dropdown doesn't collapse before `click`.
 */
@Component({
  selector: 'nxp-multi-select-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    tabindex: '0',
    '[attr.aria-selected]': 'isSelected() ? true : null',
    '[attr.aria-disabled]': 'isDisabled() ? true : null',
    '[class]': 'classes()',
    '(pointerdown)': '$event.preventDefault()',
    '(click)': 'select()',
    '(keydown.enter)': 'select(); $event.preventDefault()',
    '(keydown.space)': 'select(); $event.preventDefault()',
  },
  template: `
    <span
      class="flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border transition-colors duration-fast"
      [class]="checkboxClass()"
      aria-hidden="true"
    >
      @if (isSelected()) {
        <svg
          viewBox="0 0 12 12"
          fill="none"
          class="h-3 w-3"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2 6l3 3 5-5"
          />
        </svg>
      }
    </span>

    <span class="flex-1 truncate">{{ label() }}</span>
  `,
})
export class NxpMultiSelectOptionComponent<T = unknown> {
  private readonly handlers = inject(NXP_ITEMS_HANDLERS);
  private readonly host = inject(NXP_DATA_LIST_HOST, { optional: true });

  // Resolution paths — first match wins (component > textfield-wrapped
  // directive > raw textfield accessor token).
  private readonly directHost = inject(NxpMultiSelectComponent, {
    optional: true,
  }) as NxpMultiSelectComponent<T> | null;
  private readonly textfield = inject(NXP_TEXTFIELD, { optional: true }) as {
    accessor?: () => unknown;
  } | null;
  private readonly directAccessor = inject(NXP_TEXTFIELD_ACCESSOR, {
    optional: true,
  });

  readonly value = input.required<T>();

  protected readonly label = computed(() => {
    const item = this.value();
    if (item == null) return '';
    // Prefer the resolved label from the parent host — it knows about any
    // per-instance `textField` and won't be tricked by a sibling-typed
    // stringifier in a wider provider scope.
    const host = this.resolveHost();
    if (host) return host.getLabel(item);
    const fallback = this.handlers.stringify()(item);
    return fallback != null && fallback !== ''
      ? String(fallback)
      : String(item);
  });

  protected readonly isSelected = computed(
    () => this.resolveHost()?.isItemSelected(this.value()) ?? false,
  );

  protected readonly isDisabled = computed(() =>
    this.handlers.disabledItemHandler()(this.value()),
  );

  protected readonly classes = computed(() =>
    cx(
      // `relative z-10` keeps the row above the data-list's absolutely
      // positioned hover/selected pills.
      'relative z-10 flex w-full cursor-pointer items-center gap-2.5 rounded-s px-3 py-1.5',
      'text-sm font-medium text-left select-none',
      'transition-colors duration-fast',
      'outline-none focus-visible:outline focus-visible:outline-2',
      'focus-visible:outline-offset-1 focus-visible:outline-border-focus',
      this.isSelected()
        ? 'bg-primary/10 text-text-primary'
        : 'text-text-secondary hover:bg-bg-neutral-1',
      this.isDisabled() && 'opacity-50 cursor-not-allowed pointer-events-none',
    ),
  );

  protected readonly checkboxClass = computed(() =>
    this.isSelected()
      ? 'border-primary bg-primary text-text-on-accent'
      : 'border-border-normal bg-bg-base',
  );

  protected select(): void {
    if (!this.isDisabled()) {
      this.host?.handleOption(this.value());
    }
  }

  private resolveHost(): MultiSelectHost<T> | null {
    if (this.directHost) return this.directHost;
    const fromTextfield = this.textfield?.accessor?.();
    if (isMultiSelectHost<T>(fromTextfield)) return fromTextfield;
    if (isMultiSelectHost<T>(this.directAccessor)) return this.directAccessor;
    return null;
  }
}
