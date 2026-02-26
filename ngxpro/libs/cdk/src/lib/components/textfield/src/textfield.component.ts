import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  computed,
  contentChild,
  inject,
  input,
  signal,
} from '@angular/core';
import { cx } from '@nxp/cdk';
import { NXP_TEXTFIELD_ACCESSOR, type NxpTextfieldAccessor } from './textfield-accessor';
import { NXP_TEXTFIELD_OPTIONS, type NxpTextfieldSize } from './textfield.options';

/** Token provided by label[nxpLabel] so textfield can detect label presence. */
export const NXP_LABEL = new InjectionToken<unknown>('NXP_LABEL');

/** Token provided by NxpTextfieldComponent so children can inject the textfield. */
export const NXP_TEXTFIELD = new InjectionToken<NxpTextfieldComponent>('NXP_TEXTFIELD');

@Component({
  selector: 'nxp-textfield',
  standalone: true,
  template: `
    <ng-content select="label[nxpLabel]" />
    <ng-content select="input[nxpInput], textarea[nxpInput]" />
    @if (showCleaner()) {
      <button
        type="button"
        tabindex="-1"
        aria-label="Clear"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
        (click)="clear()"
        (pointerdown.prevent)="0"
      >
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
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
  providers: [
    { provide: NXP_TEXTFIELD, useExisting: NxpTextfieldComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpTextfieldComponent {
  private static _idCounter = 0;
  private readonly _autoId = `nxp-tf-${++NxpTextfieldComponent._idCounter}`;

  protected readonly accessorEl = contentChild(NXP_TEXTFIELD_ACCESSOR, { read: ElementRef });
  protected readonly accessor = contentChild<NxpTextfieldAccessor>(NXP_TEXTFIELD_ACCESSOR);
  protected readonly labelToken = contentChild(NXP_LABEL);

  readonly options = inject(NXP_TEXTFIELD_OPTIONS);
  readonly focused = signal(false);

  /** Override size from options. */
  readonly size = input<NxpTextfieldSize | null>(null);
  /** Whether the field has a validation error. */
  readonly hasError = input(false);
  /** Additional CSS classes for the host. */
  readonly class = input('');

  readonly effectiveSize = computed<NxpTextfieldSize>(
    () => this.size() ?? this.options.size(),
  );

  readonly hasValue = computed(() => {
    const v = this.accessor()?.value();
    return v != null && v !== '';
  });

  /** True when input has a value OR is focused — used by floating label. */
  readonly hasValueOrFocused = computed(() => this.hasValue() || this.focused());

  /** True when a label[nxpLabel] is projected inside this textfield. */
  readonly hasLabel = computed(() => !!this.labelToken());

  readonly showCleaner = computed(
    () => this.options.cleaner() && this.hasValue(),
  );

  get id(): string {
    return this.accessorEl()?.nativeElement?.id || this._autoId;
  }

  protected readonly hostClasses = computed(() =>
    cx(
      // layout
      'relative block overflow-hidden rounded-md border transition-colors duration-150',
      // colors
      'bg-white dark:bg-gray-950',
      'border-gray-300 dark:border-gray-800',
      // size → fixed height
      this.effectiveSize() === 'sm' && 'h-8',
      this.effectiveSize() === 'md' && 'h-10',
      this.effectiveSize() === 'lg' && 'h-12',
      // disabled (via pointer-events on host)
      'has-[input:disabled]:opacity-60 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-gray-50 dark:has-[input:disabled]:bg-gray-900',
      // focus state (ring + border color)
      this.focused() &&
        !this.hasError() && [
          'ring-2 ring-brand-200 dark:ring-brand-700/30',
          'border-brand-500 dark:border-brand-700',
        ],
      // error state
      this.hasError() && [
        'ring-2 ring-red-200 dark:ring-red-700/30',
        'border-red-500 dark:border-red-700',
      ],
      this.class(),
    ),
  );

  protected clear(): void {
    this.accessor()?.setValue(null);
    this.accessorEl()?.nativeElement?.focus();
  }
}
