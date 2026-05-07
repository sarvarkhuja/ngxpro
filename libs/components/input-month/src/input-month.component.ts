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
import { CalendarMonthComponent } from '@ngxpro/components/calendar-month';
import type { MonthCoord } from '@ngxpro/components/calendar-month';
import { formatMonth } from '@ngxpro/components/input-date';

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
  styles: `
    .nxp-month-pop {
      transform-origin: top left;
      animation: nxp-month-pop-in 180ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    @keyframes nxp-month-pop-in {
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
      .nxp-month-pop {
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
        (keydown.escape)="close()"
        aria-haspopup="dialog"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-label]="placeholder()"
        readonly
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
          class="nxp-month-pop absolute z-50 mt-2 top-full left-0"
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

  readonly value = input<MonthCoord | null>(null);
  readonly min = input<MonthCoord | null>(null);
  readonly max = input<MonthCoord | null>(null);
  readonly placeholder = input<string>('Month YYYY');
  readonly disabled = input<boolean>(false);
  readonly rangeMode = input<boolean>(false);
  readonly disabledHandler = input<((m: MonthCoord) => boolean) | null>(null);
  readonly class = input<string>('');

  readonly valueChange = output<MonthCoord | null>();

  protected readonly isOpen = signal(false);
  protected readonly inputValue = signal('');

  protected readonly inputClass = computed(() =>
    cx(inputVariants(), 'cursor-pointer', this.class()),
  );

  protected readonly effectiveDisabledHandler = computed(
    () => this.disabledHandler() ?? (() => false),
  );

  constructor() {
    effect(() => {
      const v = this.value();
      this.inputValue.set(v ? formatMonth(v) : '');
    });
  }

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

  protected onMonthPicked(m: MonthCoord): void {
    this.inputValue.set(formatMonth(m));
    this.isOpen.set(false);
    this.valueChange.emit(m);
    this._onChange(m);
    this._onTouched();
  }
}
