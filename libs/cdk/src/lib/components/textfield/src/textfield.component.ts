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
  NXP_TEXTFIELD_OPTIONS,
  type NxpTextfieldSize,
} from './textfield.options';
import { cx } from '../../../utils';
import { NxpDropdownDirective, NxpDropdownOpen } from '../../../portals';
import { nxpAsDataListHost, NxpDataListHost } from '../../../tokens';
import {
  NXP_TEXTFIELD,
  nxpAsTextfieldAccessor,
  NxpTextfieldAccessor,
  NXP_TEXTFIELD_ACCESSOR,
  NXP_LABEL,
} from './textfield-accessor';
import { NXP_TEXTFIELD_END } from './textfield-end.directive';

@Component({
  selector: 'nxp-textfield',
  standalone: true,
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
      } @else if (!hasEndProjected() && iconEnd(); as iconEndClass) {
        <i
          [attr.class]="iconClass('end') + ' ' + iconEndClass"
          aria-hidden="true"
        ></i>
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
  hostDirectives: [NxpDropdownDirective, NxpDropdownOpen],
  providers: [
    { provide: NXP_TEXTFIELD, useExisting: NxpTextfieldComponent },
    nxpAsDataListHost(NxpTextfieldComponent),
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

  readonly accessor = contentChild<NxpTextfieldAccessor>(NXP_TEXTFIELD_ACCESSOR);

  protected readonly labelToken = contentChild(NXP_LABEL);

  readonly hasLabel = computed(() => !!this.labelToken());

  protected readonly endProjected = contentChild(NXP_TEXTFIELD_END);

  /** True when an `[nxpTextfieldEnd]` element is projected into the trailing slot. */
  readonly hasEndProjected = computed(() => !!this.endProjected());

  readonly options = inject(NXP_TEXTFIELD_OPTIONS);
  readonly focused = signal(false);

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
    () =>
      this.options.cleaner() && this.hasValue() && !this.hasEndProjected(),
  );

  /** True when the trailing slot contains anything (cleaner, iconEnd, or projected). Used by NxpInputDirective for padding. */
  readonly hasEndAdornment = computed(
    () => this.showCleaner() || !!this.iconEnd() || this.hasEndProjected(),
  );

  /** True when the leading slot contains an icon. Used by NxpInputDirective for padding. */
  readonly hasStartAdornment = computed(() => !!this.iconStart());

  get id(): string {
    return this.accessorEl()?.nativeElement?.id ?? this._autoId;
  }

  protected iconClass(side: 'start' | 'end'): string {
    return cx(
      'absolute top-1/2 -translate-y-1/2 text-base leading-none text-gray-400 dark:text-gray-500 pointer-events-none z-10',
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

    // Box mode: relative wrapper IS the styled box.
    return cx(
      'relative block overflow-hidden rounded-md border transition-colors duration-150',
      'bg-white dark:bg-gray-950',
      'border-gray-300 dark:border-gray-800',
      this.effectiveSize() === 'sm' && 'h-8',
      this.effectiveSize() === 'md' && 'h-10',
      this.effectiveSize() === 'lg' && 'h-12',
      'has-[input:disabled]:opacity-60 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-gray-50 dark:has-[input:disabled]:bg-gray-900',
      this.focused() && !this.hasError() && 'ring-2 ring-primary/30 border-primary',
      this.hasError() && 'ring-2 ring-red-200 dark:ring-red-700/30 border-red-500 dark:border-red-700',
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
