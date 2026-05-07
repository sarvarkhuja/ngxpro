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
import { cx, inputVariants } from '@ngxpro/cdk';
import type {
  DisabledHandler,
  MarkerHandler,
} from '@ngxpro/components/calendar';
import {
  CalendarRangeComponent,
  DateRangePeriod,
} from '@ngxpro/components/calendar-range';
import { formatDateRange, parseDateRange } from '@ngxpro/components/input-date';

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
  styles: `
    .nxp-date-range-pop {
      transform-origin: top left;
      animation: nxp-date-range-pop-in 180ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    @keyframes nxp-date-range-pop-in {
      from {
        opacity: 0;
        transform: scale(0.97) translateY(-4px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .nxp-date-range-pop {
        animation: none;
      }
    }
  `,
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
        aria-haspopup="dialog"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-label]="placeholder()"
        autocomplete="off"
      />

      <span
        class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none select-none
               transition-[color,transform] duration-normal
               [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
        [class.text-text-tertiary]="!isOpen()"
        [class.text-text-action]="isOpen()"
        [class.scale-110]="isOpen()"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4"
        >
          <path
            fill-rule="evenodd"
            d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
            clip-rule="evenodd"
          />
        </svg>
      </span>

      @if (isOpen()) {
        <div
          class="nxp-date-range-pop absolute z-50 mt-2 top-full left-0"
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

  readonly value = input<[Date, Date] | null>(null);
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly minLength = input<number | null>(null);
  readonly maxLength = input<number | null>(null);
  readonly placeholder = input<string>('MM/DD/YYYY – MM/DD/YYYY');
  readonly disabled = input<boolean>(false);
  readonly disabledHandler = input<DisabledHandler | null>(null);
  readonly markerHandler = input<MarkerHandler | null>(null);
  readonly items = input<DateRangePeriod[]>([]);
  readonly class = input<string>('');

  readonly valueChange = output<[Date, Date] | null>();

  protected readonly isOpen = signal(false);
  protected readonly inputValue = signal('');

  protected readonly inputClass = computed(() =>
    cx(inputVariants(), this.class()),
  );

  constructor() {
    effect(() => {
      const v = this.value();
      this.inputValue.set(v ? formatDateRange(v) : '');
    });
  }

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
    /*noop*/
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (
      !(this.el.nativeElement as HTMLElement).contains(event.target as Node)
    ) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.isOpen.set(false);
  }

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
