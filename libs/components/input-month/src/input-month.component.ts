import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  cx,
  hasErrorInput,
  inputVariants,
  NXP_DOCUMENT,
  NXP_IS_BROWSER,
} from '@ngxpro/cdk';
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
 * Implements `ControlValueAccessor` for Angular forms integration. `value`
 * is a `model()` so reactive form `setValue()` propagates back through
 * `writeValue()` and updates the calendar.
 */
@Component({
  selector: 'nxp-input-month',
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
        [id]="inputId() || null"
        [class]="inputClass()"
        [value]="inputValue()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        (click)="toggle()"
        (keydown.escape)="close()"
        aria-haspopup="dialog"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-label]="
          ariaLabelledBy() ? null : (ariaLabel() ?? placeholder())
        "
        [attr.aria-labelledby]="ariaLabelledBy() || null"
        [attr.aria-invalid]="hasError() || null"
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
  private readonly doc = inject(NXP_DOCUMENT);
  private readonly isBrowser = inject(NXP_IS_BROWSER);
  private readonly destroyRef = inject(DestroyRef);

  readonly value = model<MonthCoord | null>(null);
  readonly min = input<MonthCoord | null>(null);
  readonly max = input<MonthCoord | null>(null);
  readonly placeholder = input<string>('Month YYYY');
  readonly disabled = model<boolean>(false);
  readonly rangeMode = input<boolean>(false);
  readonly disabledHandler = input<((m: MonthCoord) => boolean) | null>(null);
  readonly class = input<string>('');

  /** Forwards an `id` to the inner input so consumers can pair a `<label for="...">`. */
  readonly inputId = input<string>('');
  /** Accessible name override; falls back to placeholder when not set. */
  readonly ariaLabel = input<string | null>(null);
  /** Reference to a labelling element by id; takes precedence over `ariaLabel`. */
  readonly ariaLabelledBy = input<string | null>(null);
  /** Marks the input as invalid (sets `aria-invalid`); style hook for callers wiring form validity. */
  readonly hasError = input<boolean>(false);

  protected readonly isOpen = signal(false);
  protected readonly inputValue = signal('');

  protected readonly inputClass = computed(() =>
    cx(
      inputVariants(),
      // Reserve room for the trailing calendar icon (rendered absolutely).
      'pr-10 cursor-pointer',
      this.hasError() && hasErrorInput,
      this.class(),
    ),
  );

  protected readonly effectiveDisabledHandler = computed(
    () => this.disabledHandler() ?? (() => false),
  );

  constructor() {
    effect(() => {
      const v = this.value();
      this.inputValue.set(v ? formatMonth(v) : '');
    });

    if (this.isBrowser) {
      const onDocClick = (event: Event): void => {
        if (
          !(this.el.nativeElement as HTMLElement).contains(event.target as Node)
        ) {
          this.isOpen.set(false);
        }
      };
      const onDocEsc = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') this.isOpen.set(false);
      };
      this.doc.addEventListener('click', onDocClick, true);
      this.doc.addEventListener('keydown', onDocEsc);
      this.destroyRef.onDestroy(() => {
        this.doc.removeEventListener('click', onDocClick, true);
        this.doc.removeEventListener('keydown', onDocEsc);
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onChange: (v: MonthCoord | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onTouched: () => void = () => {};

  writeValue(v: MonthCoord | null): void {
    this.value.set(v);
  }

  registerOnChange(fn: (v: MonthCoord | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
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
    this.value.set(m);
    this.isOpen.set(false);
    this._onChange(m);
    this._onTouched();
  }
}
