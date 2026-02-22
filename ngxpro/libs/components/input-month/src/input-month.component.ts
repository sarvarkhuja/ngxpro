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
import {
  CalendarMonthComponent,
} from '@nxp/components/calendar-month';
import type { MonthCoord } from '@nxp/components/calendar-month';
import { formatMonth } from '@nxp/components/input-date';

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
 * Month picker input with calendar-month dropdown.
 *
 * Clicking the input opens a `nxp-calendar-month` dropdown. Selecting a month
 * closes the dropdown and updates the value. The displayed value is formatted
 * as "Month YYYY" (e.g. "January 2025").
 *
 * Implements `ControlValueAccessor` for Angular forms integration.
 *
 * @example
 * <!-- Template-driven -->
 * <nxp-input-month [(ngModel)]="month" />
 *
 * @example
 * <!-- Reactive form with min/max bounds -->
 * <nxp-input-month [formControl]="monthControl" [min]="minMonth" [max]="maxMonth" />
 */
@Component({
  selector: 'nxp-input-month',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarMonthComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMonthComponent),
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
        (keydown.escape)="close()"
        aria-haspopup="true"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-label]="placeholder()"
        readonly
      />

      <!-- Calendar icon -->
      <span
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
          <path fill-rule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clip-rule="evenodd"/>
        </svg>
      </span>

      <!-- Calendar-month dropdown -->
      @if (isOpen()) {
        <div
          class="absolute z-50 mt-1 top-full left-0"
          role="dialog"
          aria-modal="true"
          aria-label="Month picker"
        >
          <nxp-calendar-month
            [value]="value()"
            [min]="min()"
            [max]="max()"
            [rangeMode]="rangeMode()"
            [disabledHandler]="effectiveDisabledHandler()"
            (monthClick)="onMonthPicked($event)"
          />
        </div>
      }
    </div>
  `,
})
export class InputMonthComponent implements ControlValueAccessor {
  private readonly el = inject(ElementRef);

  // ------------------------------------------------------------------ inputs

  /** Currently selected month. */
  readonly value = input<MonthCoord | null>(null);

  /** Minimum selectable month (inclusive). */
  readonly min = input<MonthCoord | null>(null);

  /** Maximum selectable month (inclusive). */
  readonly max = input<MonthCoord | null>(null);

  /** Placeholder text shown when no value is set. */
  readonly placeholder = input<string>('Month YYYY');

  /** Whether the input is disabled. */
  readonly disabled = input<boolean>(false);

  /** Enable month-range selection mode in the calendar dropdown. */
  readonly rangeMode = input<boolean>(false);

  /** Optional handler to disable individual months. */
  readonly disabledHandler = input<((m: MonthCoord) => boolean) | null>(null);

  /** Additional CSS classes for the input element. */
  readonly class = input<string>('');

  // ------------------------------------------------------------------ outputs

  /** Emitted when the selected month changes. */
  readonly valueChange = output<MonthCoord | null>();

  // ------------------------------------------------------------------ internal state

  protected readonly isOpen = signal(false);
  protected readonly inputValue = signal('');

  // ------------------------------------------------------------------ computed

  protected readonly inputClass = computed(() =>
    cx(INPUT_BASE, 'cursor-pointer', this.class()),
  );

  /** Fall back to a no-op handler when none is provided. */
  protected readonly effectiveDisabledHandler = computed(
    () => this.disabledHandler() ?? (() => false),
  );

  // ------------------------------------------------------------------ sync value → inputValue

  constructor() {
    effect(() => {
      const v = this.value();
      this.inputValue.set(v ? formatMonth(v) : '');
    });
  }

  // ------------------------------------------------------------------ CVA

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onChange: (v: MonthCoord | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onTouched: () => void = () => {};

  writeValue(v: MonthCoord | null): void {
    this.inputValue.set(v ? formatMonth(v) : '');
  }

  registerOnChange(fn: (v: MonthCoord | null) => void): void {
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

  protected onMonthPicked(m: MonthCoord): void {
    this.inputValue.set(formatMonth(m));
    this.isOpen.set(false);
    this.valueChange.emit(m);
    this._onChange(m);
    this._onTouched();
  }
}
