import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChild,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  cx,
  NxpDropdownDirective,
  NxpDropdownOpen,
  NxpDataListHost,
  nxpAsDataListHost,
  NXP_TEXTFIELD_ACCESSOR,
  nxpAsTextfieldAccessor,
  NXP_TEXTFIELD,
  type NxpTextfieldAccessor,
} from '@nxp/cdk';
import {
  NXP_TEXTFIELD_OPTIONS,
  type NxpTextfieldSize,
} from './textfield.options';

@Component({
  selector: 'nxp-textfield',
  standalone: true,
  template: `
    <ng-content select="input[nxpInput], textarea[nxpInput]" />
    @if (showCleaner()) {
      <button
        type="button"
        tabindex="-1"
        aria-label="Clear"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
        (click)="clear()"
        (pointerdown.prevent)="(0)"
      >
        <svg
          class="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    }
    <ng-content />
  `,
  host: {
    '[class]': 'hostClasses()',
    '(focusin)': 'focused.set(true)',
    '(focusout)': 'focused.set(false)',
  },
  hostDirectives: [NxpDropdownDirective, NxpDropdownOpen],
  providers: [
    { provide: NXP_TEXTFIELD, useExisting: NxpTextfieldComponent },
    // Receives `handleOption(value)` calls from portal-rendered options.
    // Mirrors TuiTextfieldComponent.handleOption in Taiga UI.
    nxpAsDataListHost(NxpTextfieldComponent),
    // Exposes NXP_TEXTFIELD_ACCESSOR at the element level as a facade over the
    // real content-child accessor (e.g. NxpSelectDirective on input[nxpSelect]).
    // Portal-rendered options can only walk up to nxp-textfield's injector, not
    // further to a child input's injector, so they would fail to inject the real
    // accessor. This facade bridges that gap for isSelected() comparisons.
    nxpAsTextfieldAccessor(NxpTextfieldComponent),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpTextfieldComponent
  implements NxpDataListHost, NxpTextfieldAccessor
{
  private static _idCounter = 0;
  private readonly _autoId = `nxp-tf-${++NxpTextfieldComponent._idCounter}`;

  protected readonly accessorEl = contentChild(NXP_TEXTFIELD_ACCESSOR, {
    read: ElementRef,
  });

  /** The real accessor (e.g. NxpSelectDirective) projected as content. */
  readonly accessor = contentChild<NxpTextfieldAccessor>(
    NXP_TEXTFIELD_ACCESSOR,
  );

  readonly options = inject(NXP_TEXTFIELD_OPTIONS);
  readonly focused = signal(false);

  readonly size = input<NxpTextfieldSize | null>(null);
  readonly hasError = input(false);
  readonly class = input('');

  readonly effectiveSize = computed<NxpTextfieldSize>(
    () => this.size() ?? this.options.size(),
  );

  // ------------------------------------------------------------------ NxpTextfieldAccessor (facade)

  /**
   * Delegates to the real content-child accessor's display string.
   * Used by portal-rendered options for `isSelected()` comparisons, and
   * by the textfield itself to detect whether the field has a value.
   */
  readonly value = computed(() => this.accessor()?.value() ?? '');

  /** Delegates to `handleOption` — called by the cleaner button. */
  setValue(v: unknown): void {
    this.handleOption(v);
  }

  // ------------------------------------------------------------------ state

  readonly hasValue = computed(() => {
    const v = this.accessor()?.value();
    return v != null && v !== '';
  });

  readonly showCleaner = computed(
    () => this.options.cleaner() && this.hasValue(),
  );

  get id(): string {
    return this.accessorEl()?.nativeElement?.id ?? this._autoId;
  }

  protected readonly hostClasses = computed(() =>
    cx(
      'relative block overflow-hidden rounded-md border transition-colors duration-150',
      'bg-white dark:bg-gray-950',
      'border-gray-300 dark:border-gray-800',
      this.effectiveSize() === 'sm' && 'h-8',
      this.effectiveSize() === 'md' && 'h-10',
      this.effectiveSize() === 'lg' && 'h-12',
      'has-[input:disabled]:opacity-60 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-gray-50 dark:has-[input:disabled]:bg-gray-900',
      this.focused() &&
        !this.hasError() && ['ring-2 ring-primary/30', 'border-primary'],
      this.hasError() && [
        'ring-2 ring-red-200 dark:ring-red-700/30',
        'border-red-500 dark:border-red-700',
      ],
      this.class(),
    ),
  );

  // ------------------------------------------------------------------ NxpDataListHost

  /** Called by options (via `NXP_DATA_LIST_HOST`) when a value is selected. */
  public handleOption(option: unknown): void {
    this.accessor()?.setValue(option);
  }

  protected clear(): void {
    this.accessor()?.setValue(null);
    this.accessorEl()?.nativeElement?.focus();
  }
}
