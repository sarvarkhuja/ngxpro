import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChild,
  inject,
  input,
  signal,
  type Signal,
} from '@angular/core';

import {
  NXP_TEXTFIELD_OPTIONS,
  type NxpTextfieldSize,
} from './textfield.options';
import { cx } from '@ngxpro/cdk';
import {
  NxpDropdownDirective,
  NxpDropdownFixed,
  NxpDropdownOpen,
} from '@ngxpro/cdk';
import { NXP_TEXTFIELD_END } from './textfield-end.directive';
import { nxpAsDataListHost, NxpDataListHost } from '@ngxpro/cdk';
import {
  NXP_ITEMS_HANDLERS,
  type NxpItemsHandlers,
  type NxpStringHandler,
  type NxpIdentityMatcher,
} from '@ngxpro/cdk';
import type { NxpBooleanHandler } from '@ngxpro/cdk';
import {
  NXP_TEXTFIELD,
  nxpAsTextfieldAccessor,
  NXP_TEXTFIELD_ACCESSOR,
  NXP_LABEL,
  NxpTextfieldAccessor,
} from './textfield-accessor';

const DEFAULT_STRINGIFY = String as unknown as NxpStringHandler<unknown>;
const DEFAULT_IDENTITY: NxpIdentityMatcher<unknown> = (a, b) => a === b;
const DEFAULT_DISABLED: NxpBooleanHandler<unknown> = () => false;

function isItemsHandlers(o: unknown): o is NxpItemsHandlers<unknown> {
  if (!o || typeof o !== 'object') return false;
  const x = o as Partial<NxpItemsHandlers<unknown>>;
  return (
    typeof x.stringify === 'function' &&
    typeof x.identityMatcher === 'function' &&
    typeof x.disabledItemHandler === 'function'
  );
}

@Component({
  selector: 'nxp-textfield',
  template: `
    <ng-content select="label[nxpLabel]" />
    <div [class]="innerClasses()">
      @if (iconStart(); as iconStartClass) {
        <i
          [attr.class]="iconClass('start') + ' ' + iconStartClass"
          aria-hidden="true"
        ></i>
      }
      <ng-content select="input[nxpInput], textarea[nxpInput]" />
      @if (showCleaner()) {
        <button
          type="button"
          tabindex="-1"
          aria-label="Clear"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 shrink-0 items-center justify-center rounded-xs text-text-tertiary transition-colors hover:text-text-primary"
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
      } @else if (!hasEndProjected() && iconEnd(); as iconEndClass) {
        <i
          [attr.class]="iconClass('end') + ' ' + iconEndClass"
          aria-hidden="true"
        ></i>
      } @else if (!hasEndProjected() && hasDropdown()) {
        <button
          type="button"
          tabindex="-1"
          aria-label="Toggle dropdown"
          [attr.aria-expanded]="isDropdownOpen()"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-xs text-text-tertiary transition-colors hover:text-text-primary"
          (click)="toggleDropdown()"
          (pointerdown.prevent)="(0)"
        >
          <i
            class="ri-arrow-down-s-line text-base leading-none transition-transform duration-normal"
            [class.rotate-180]="isDropdownOpen()"
            aria-hidden="true"
          ></i>
        </button>
      }
      <ng-content select="[nxpTextfieldEnd]" />
    </div>
    <ng-content />
  `,
  host: {
    '[class]': 'hostClasses()',
    '(focusin)': 'focused.set(true)',
    '(focusout)': 'focused.set(false)',
  },
  hostDirectives: [NxpDropdownDirective, NxpDropdownOpen, NxpDropdownFixed],
  providers: [
    { provide: NXP_TEXTFIELD, useExisting: NxpTextfieldComponent },
    nxpAsDataListHost(NxpTextfieldComponent),
    nxpAsTextfieldAccessor(NxpTextfieldComponent),
    { provide: NXP_ITEMS_HANDLERS, useExisting: NxpTextfieldComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpTextfieldComponent
  implements NxpDataListHost, NxpTextfieldAccessor, NxpItemsHandlers<unknown>
{
  /**
   * Parent handlers, captured before this textfield re-provides
   * `NXP_ITEMS_HANDLERS`. Used as the fallback when the content-child accessor
   * (e.g. plain input) does not expose its own handlers.
   */
  private readonly parentHandlers = inject(NXP_ITEMS_HANDLERS, {
    skipSelf: true,
    optional: true,
  });

  readonly stringify: Signal<NxpStringHandler<unknown>> = computed(() => {
    const acc = this.accessor();
    if (acc && isItemsHandlers(acc)) return acc.stringify();
    return this.parentHandlers?.stringify() ?? DEFAULT_STRINGIFY;
  });

  readonly identityMatcher: Signal<NxpIdentityMatcher<unknown>> = computed(
    () => {
      const acc = this.accessor();
      if (acc && isItemsHandlers(acc)) return acc.identityMatcher();
      return this.parentHandlers?.identityMatcher() ?? DEFAULT_IDENTITY;
    },
  );

  readonly disabledItemHandler: Signal<NxpBooleanHandler<unknown>> = computed(
    () => {
      const acc = this.accessor();
      if (acc && isItemsHandlers(acc)) return acc.disabledItemHandler();
      return this.parentHandlers?.disabledItemHandler() ?? DEFAULT_DISABLED;
    },
  );

  private static _idCounter = 0;
  private readonly _autoId = `nxp-tf-${++NxpTextfieldComponent._idCounter}`;

  protected readonly accessorEl = contentChild(NXP_TEXTFIELD_ACCESSOR, {
    read: ElementRef,
  });

  readonly accessor = contentChild<NxpTextfieldAccessor>(
    NXP_TEXTFIELD_ACCESSOR,
  );

  protected readonly labelToken = contentChild(NXP_LABEL);

  readonly hasLabel = computed(() => !!this.labelToken());

  protected readonly endProjected = contentChild(NXP_TEXTFIELD_END);

  /** True when an `[nxpTextfieldEnd]` element is projected into the trailing slot. */
  readonly hasEndProjected = computed(() => !!this.endProjected());

  readonly options = inject(NXP_TEXTFIELD_OPTIONS);
  readonly focused = signal(false);

  private readonly dropdownDirective = inject(NxpDropdownDirective);
  private readonly dropdownOpen = inject(NxpDropdownOpen);

  /** True when a `<ng-template nxpDropdown>` child has registered content. */
  readonly hasDropdown = computed(() => !!this.dropdownDirective.content());

  /** True while the dropdown panel is mounted. */
  readonly isDropdownOpen = computed(() => !!this.dropdownDirective.ref());

  protected toggleDropdown(): void {
    this.dropdownOpen.toggle(!this.isDropdownOpen());
  }

  readonly size = input<NxpTextfieldSize | null>(null);
  readonly hasError = input(false);
  readonly class = input('');

  /** Remix-icon class (e.g. `ri-search-line`) rendered at the start of the field. */
  readonly iconStart = input<string>('');

  /** Remix-icon class (e.g. `ri-settings-line`) rendered at the end of the field. Hidden when the cleaner is visible. */
  readonly iconEnd = input<string>('');

  readonly effectiveSize = computed<NxpTextfieldSize>(
    () => this.size() ?? this.options.size(),
  );

  readonly value = computed(() => this.accessor()?.value() ?? '');

  setValue(v: unknown): void {
    this.handleOption(v);
  }

  readonly hasValue = computed(() => {
    const v = this.accessor()?.value();
    return v != null && v !== '';
  });

  readonly showCleaner = computed(
    () => this.options.cleaner() && this.hasValue() && !this.hasEndProjected(),
  );

  /** True when the trailing slot contains anything (cleaner, iconEnd, auto-chevron, or projected). Used by NxpInputDirective for padding. */
  readonly hasEndAdornment = computed(
    () =>
      this.showCleaner() ||
      !!this.iconEnd() ||
      this.hasEndProjected() ||
      this.hasDropdown(),
  );

  /** True when the leading slot contains an icon. Used by NxpInputDirective for padding. */
  readonly hasStartAdornment = computed(() => !!this.iconStart());

  get id(): string {
    return this.accessorEl()?.nativeElement?.id ?? this._autoId;
  }

  protected iconClass(side: 'start' | 'end'): string {
    return cx(
      'absolute top-1/2 -translate-y-1/2 text-base leading-none text-text-tertiary pointer-events-none z-10',
      side === 'start' ? 'left-3' : 'right-3',
    );
  }

  protected readonly hostClasses = computed(() => {
    if (this.hasLabel()) {
      return cx('flex flex-col gap-1.5', this.class());
    }
    return cx('block', this.class());
  });

  protected readonly innerClasses = computed(() => {
    if (this.hasLabel()) {
      // Form-field mode: relative wrapper around the input so absolute
      // icons/cleaner anchor to the input row, not to the label+input column.
      return 'relative block';
    }

    const focused = this.focused();
    const error = this.hasError();

    return cx(
      'relative block overflow-hidden rounded-m transition-shadow duration-normal',
      'bg-bg-base shadow-border',
      this.effectiveSize() === 'sm' && 'h-8',
      this.effectiveSize() === 'md' && 'h-10',
      this.effectiveSize() === 'lg' && 'h-12',
      // Disabled chrome stays Vercel-flat (no opacity dimming — design-system §7).
      'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-bg-neutral-1',
      // Hover deepens the shadow-border alpha — only when idle.
      !focused && !error && 'hover:shadow-input-hover',
      focused && !error && 'shadow-input-focus',
      error && 'shadow-input-error',
    );
  });

  public handleOption(option: unknown): void {
    this.accessor()?.setValue(option);
  }

  protected clear(): void {
    this.accessor()?.setValue(null);
    this.accessorEl()?.nativeElement?.focus();
  }
}
