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
import { cx } from '@ngxpro/cdk';
import { NxpDropdownDirective, NxpDropdownOpen } from '@ngxpro/cdk';
import { NXP_TEXTFIELD_END } from './textfield-end.directive';
import { nxpAsDataListHost, NxpDataListHost } from '@ngxpro/cdk';
import {
  NXP_TEXTFIELD,
  nxpAsTextfieldAccessor,
  NXP_TEXTFIELD_ACCESSOR,
  NXP_LABEL,
  NxpTextfieldAccessor,
} from './textfield-accessor';

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

    return cx(
      'relative block overflow-hidden rounded-m border transition-colors duration-normal',
      'bg-bg-base',
      'border-border-normal',
      this.effectiveSize() === 'sm' && 'h-8',
      this.effectiveSize() === 'md' && 'h-10',
      this.effectiveSize() === 'lg' && 'h-12',
      'has-[input:disabled]:opacity-50 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-bg-neutral-1',
      this.focused() &&
        !this.hasError() &&
        'ring-2 ring-primary/30 border-primary',
      this.hasError() &&
        'ring-2 ring-status-negative/30 border-status-negative',
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
