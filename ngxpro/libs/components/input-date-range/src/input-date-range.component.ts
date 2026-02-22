import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cx } from '@nxp/cdk';
import type { DisabledHandler, MarkerHandler } from '@nxp/components/calendar';
import {
  CalendarRangeComponent,
  DateRangePeriod,
} from '@nxp/components/calendar-range';
import {
  formatDateRange,
  parseDateRange,
} from '@nxp/components/input-date';

// ---- Shared style constants ----

const INPUT_BASE = [
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10',
  'text-sm text-gray-900 placeholder-gray-400',
  'shadow-sm transition-colors duration-100',
  'outline-none ring-0',
  'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
  'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
  'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:placeholder-gray-500',
  'dark:focus:border-blue-400 dark:focus:ring-blue-400/20',
  'dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
].join(' ');

/**
 * Date-range input with dual-calendar dropdown.
 *
 * Clicking the input opens a `nxp-calendar-range` dropdown. Selecting a
 * complete range closes the dropdown and updates the value. The user may also
 * type a range directly (format: "MM/DD/YYYY – MM/DD/YYYY"); on blur, the
 * raw text is parsed.
 *
 * Implements `ControlValueAccessor` for Angular forms integration.
 *
 * @example
 * <!-- Template-driven -->
 * <nxp-input-date-range [(ngModel)]="range" />
 *
 * @example
 * <!-- With preset periods sidebar -->
 * <nxp-input-date-range [items]="presets" [formControl]="rangeControl" />
 */
@Component({
  selector: 'nxp-input-date-range',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarRangeComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateRangeComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative w-full">
      <input
        type="text"
        [class]="inputClass()"
        [value]="inputValue()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        (click)="toggle()"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (keydown.escape)="close()"
        aria-haspopup="true"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-label]="placeholder()"
        autocomplete="off"
      />

      <!-- Calendar-range icon -->
      <span
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
          <path fill-rule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clip-rule="evenodd"/>
        </svg>
      </span>

      <!-- Calendar-range dropdown -->
      @if (isOpen()) {
        <div
          class="absolute z-50 mt-1 top-full left-0"
          role="dialog"
          aria-modal="true"
          aria-label="Date range picker"
        >
          <nxp-calendar-range
            [value]="value()"
            [min]="min()"
            [max]="max()"
            [minLength]="minLength()"
            [maxLength]="maxLength()"
            [disabledHandler]="disabledHandler()"
            [markerHandler]="markerHandler()"
            [items]="items()"
            (valueChange)="onRangePicked($event)"
          />
        </div>
      }
    </div>
  `,
})
export class InputDateRangeComponent implements ControlValueAccessor {
  private readonly el = inject(ElementRef);

  // ------------------------------------------------------------------ inputs

  /** Currently selected date range. */
  readonly value = input<[Date, Date] | null>(null);

  /** Minimum selectable date. */
  readonly min = input<Date | null>(null);

  /** Maximum selectable date. */
  readonly max = input<Date | null>(null);

  /** Minimum range length in days (inclusive). */
  readonly minLength = input<number | null>(null);

  /** Maximum range length in days (inclusive). */
  readonly maxLength = input<number | null>(null);

  /** Placeholder text. */
  readonly placeholder = input<string>('MM/DD/YYYY – MM/DD/YYYY');

  /** Whether the input is disabled. */
  readonly disabled = input<boolean>(false);

  /** Optional handler to disable individual dates. */
  readonly disabledHandler = input<DisabledHandler | null>(null);

  /** Optional handler to add dot markers to dates. */
  readonly markerHandler = input<MarkerHandler | null>(null);

  /** Named preset periods shown in the calendar sidebar. */
  readonly items = input<DateRangePeriod[]>([]);

  /** Additional CSS classes for the input element. */
  readonly class = input<string>('');

  // ------------------------------------------------------------------ outputs

  /** Emitted when the selected range changes. */
  readonly valueChange = output<[Date, Date] | null>();

  // ------------------------------------------------------------------ internal state

  protected readonly isOpen = signal(false);
  protected readonly inputValue = signal('');

  // ------------------------------------------------------------------ computed

  protected readonly inputClass = computed(() =>
    cx(INPUT_BASE, this.class()),
  );

  // ------------------------------------------------------------------ sync value → inputValue

  constructor() {
    effect(() => {
      const v = this.value();
      this.inputValue.set(v ? formatDateRange(v) : '');
    });
  }

  // ------------------------------------------------------------------ CVA

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onChange: (v: [Date, Date] | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onTouched: () => void = () => {};

  writeValue(v: [Date, Date] | null): void {
    this.inputValue.set(v ? formatDateRange(v) : '');
  }

  registerOnChange(fn: (v: [Date, Date] | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // Handled via the disabled() input signal
  }

  // ------------------------------------------------------------------ click-outside / ESC

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!(this.el.nativeElement as HTMLElement).contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.isOpen.set(false);
  }

  // ------------------------------------------------------------------ handlers

  protected toggle(): void {
    if (!this.disabled()) {
      this.isOpen.update((v) => !v);
    }
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected onRangePicked(range: [Date, Date] | null): void {
    if (range) {
      this.inputValue.set(formatDateRange(range));
      this.isOpen.set(false);
    }
    this.valueChange.emit(range);
    this._onChange(range);
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.inputValue.set(raw);
  }

  protected onBlur(): void {
    const parsed = parseDateRange(this.inputValue());
    if (parsed) {
      this.valueChange.emit(parsed);
      this._onChange(parsed);
    } else if (!this.inputValue()) {
      this.valueChange.emit(null);
      this._onChange(null);
    }
    this._onTouched();
  }
}
