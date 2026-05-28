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
import { CalendarComponent } from '@ngxpro/components/calendar';
import type {
  DisabledHandler,
  MarkerHandler,
} from '@ngxpro/components/calendar';
import { formatDate, parseDate } from './date-input.utils';

/**
 * Single-date input with calendar dropdown.
 *
 * Clicking the input opens a `nxp-calendar` dropdown. Selecting a day closes
 * the dropdown and updates the value. The user may also type a date directly;
 * on blur, the raw text is parsed (MM/DD/YYYY, MM-DD-YYYY, YYYY-MM-DD).
 *
 * Implements `ControlValueAccessor` so it works with both template-driven
 * and reactive Angular forms. `value` is a `model()` so reactive form
 * `setValue()` propagates back through `writeValue()` and updates the calendar.
 *
 * @example
 * <!-- Template-driven -->
 * <nxp-input-date [(ngModel)]="date" placeholder="MM/DD/YYYY" />
 *
 * @example
 * <!-- Reactive form -->
 * <nxp-input-date [formControl]="dateControl" [min]="minDate" [max]="maxDate" />
 */
@Component({
  selector: 'nxp-input-date',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
  ],
  styles: `
    .nxp-date-pop {
      transform-origin: top left;
      animation: nxp-date-pop-in 180ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    @keyframes nxp-date-pop-in {
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
      .nxp-date-pop {
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
        (input)="onInput($event)"
        (blur)="onBlur()"
        (keydown.escape)="close()"
        aria-haspopup="dialog"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-label]="
          ariaLabelledBy() ? null : (ariaLabel() ?? placeholder())
        "
        [attr.aria-labelledby]="ariaLabelledBy() || null"
        [attr.aria-invalid]="hasError() || null"
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
          class="nxp-date-pop absolute z-50 mt-2 top-full left-0"
          role="dialog"
          aria-modal="true"
          aria-label="Date picker"
        >
          <nxp-calendar
            [value]="value()"
            [min]="min()"
            [max]="max()"
            [weekStart]="weekStart()"
            [disabledHandler]="disabledHandler()"
            [markerHandler]="markerHandler()"
            (dayClick)="onDayPicked($event)"
          />
        </div>
      }
    </div>
  `,
})
export class InputDateComponent implements ControlValueAccessor {
  private readonly el = inject(ElementRef);
  private readonly doc = inject(NXP_DOCUMENT);
  private readonly isBrowser = inject(NXP_IS_BROWSER);
  private readonly destroyRef = inject(DestroyRef);

  readonly value = model<Date | null>(null);
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly placeholder = input<string>('MM/DD/YYYY');
  readonly disabled = model<boolean>(false);
  readonly weekStart = input<0 | 1 | 2 | 3 | 4 | 5 | 6>(1);
  readonly disabledHandler = input<DisabledHandler | null>(null);
  readonly markerHandler = input<MarkerHandler | null>(null);
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
      'pr-10',
      this.hasError() && hasErrorInput,
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      const v = this.value();
      this.inputValue.set(v ? formatDate(v) : '');
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
  _onChange: (v: Date | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onTouched: () => void = () => {};

  writeValue(v: Date | null): void {
    this.value.set(v);
  }

  registerOnChange(fn: (v: Date | null) => void): void {
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

  protected onDayPicked(day: Date): void {
    this.value.set(day);
    this.isOpen.set(false);
    this._onChange(day);
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.inputValue.set(raw);
  }

  protected onBlur(): void {
    const parsed = parseDate(this.inputValue());
    if (parsed) {
      this.value.set(parsed);
      this._onChange(parsed);
    } else if (!this.inputValue()) {
      this.value.set(null);
      this._onChange(null);
    }
    this._onTouched();
  }
}
