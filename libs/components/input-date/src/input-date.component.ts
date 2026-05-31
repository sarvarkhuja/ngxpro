import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {
  cx,
  hasErrorInput,
  inputVariants,
  NxpDropdownContent,
  NxpDropdownDirective,
  NxpDropdownOpen,
} from '@ngxpro/cdk';
import { CalendarComponent } from '@ngxpro/components/calendar';
import type {
  DisabledHandler,
  MarkerHandler,
} from '@ngxpro/components/calendar';
import {
  caretForDigitCount,
  digitsBefore,
  formatDate,
  maskDate,
  parseDate,
} from './date-input.utils';

const isDigitChar = (ch: string): boolean => !!ch && ch >= '0' && ch <= '9';

/**
 * Single-date input with calendar dropdown.
 *
 * Clicking the input opens a `nxp-calendar` dropdown. Selecting a day closes
 * the dropdown and updates the value. The user may also type a date directly:
 * input is masked to digits-only and auto-formatted as `DD/MM/YYYY` while
 * typing; on blur it is validated and impossible dates (e.g. 31/02) mark the
 * field invalid while keeping the typed text.
 *
 * The dropdown is rendered through the CDK dropdown portal
 * (`NxpDropdownDirective` / `nxpDropdown`), so it escapes any ancestor
 * `overflow` clipping and is positioned/closed by the shared portal machinery
 * (click-outside, focus zones) rather than a hand-rolled listener.
 *
 * Implements `ControlValueAccessor` and `Validator` so it works with both
 * template-driven and reactive Angular forms (a failed parse surfaces an
 * `invalidDate` error). `value` is a `model()` so reactive form `setValue()`
 * propagates back through `writeValue()` and updates the calendar.
 *
 * @example
 * <!-- Template-driven -->
 * <nxp-input-date [(ngModel)]="date" placeholder="DD/MM/YYYY" />
 *
 * @example
 * <!-- Reactive form -->
 * <nxp-input-date [formControl]="dateControl" [min]="minDate" [max]="maxDate" />
 */
@Component({
  selector: 'nxp-input-date',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarComponent, NxpDropdownContent],
  hostDirectives: [NxpDropdownDirective, NxpDropdownOpen],
  host: { class: 'block w-full' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative w-full">
      <input
        type="text"
        inputmode="numeric"
        [id]="inputId() || null"
        [class]="inputClass()"
        [value]="inputValue()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        (click)="toggle()"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
        (blur)="onBlur()"
        (keydown.escape)="close()"
        aria-haspopup="dialog"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-label]="
          ariaLabelledBy() ? null : (ariaLabel() ?? placeholder())
        "
        [attr.aria-labelledby]="ariaLabelledBy() || null"
        [attr.aria-invalid]="hasError() || invalidInput() || null"
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
    </div>

    <ng-template nxpDropdown>
      <nxp-calendar
        [value]="calendarValue()"
        [min]="min()"
        [max]="max()"
        [weekStart]="weekStart()"
        [disabledHandler]="disabledHandler()"
        [markerHandler]="markerHandler()"
        (dayClick)="onDayPicked($event)"
      />
    </ng-template>
  `,
})
export class InputDateComponent implements ControlValueAccessor, Validator {
  private readonly dropdown = inject(NxpDropdownDirective);
  private readonly dropdownOpen = inject(NxpDropdownOpen);

  readonly value = model<Date | null>(null);
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly placeholder = input<string>('DD/MM/YYYY');
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

  /** Whether the calendar portal is currently mounted. */
  protected readonly isOpen = computed(() => !!this.dropdown.ref());
  protected readonly inputValue = signal('');
  /** Set when a typed date fails to parse/validate on blur; drives the error state. */
  protected readonly invalidInput = signal(false);
  /**
   * In-progress typed date, set while the user is typing a complete valid
   * in-bounds date but before it is committed (on blur / day-pick). Lets the
   * open calendar navigate to and highlight what is being typed without
   * eagerly mutating the public `value` / notifying the form on every keystroke.
   */
  private readonly draft = signal<Date | null>(null);

  /** Value shown in the calendar: the in-progress typed date, else the committed value. */
  protected readonly calendarValue = computed(
    () => this.draft() ?? this.value(),
  );

  protected readonly inputClass = computed(() =>
    cx(
      inputVariants(),
      // Reserve room for the trailing calendar icon (rendered absolutely).
      'pr-10',
      (this.hasError() || this.invalidInput()) && hasErrorInput,
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      const v = this.value();
      this.inputValue.set(v ? formatDate(v) : '');
      // The committed value is authoritative; drop any in-progress typed draft.
      this.draft.set(null);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onChange: (v: Date | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onTouched: () => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onValidatorChange: () => void = () => {};

  writeValue(v: Date | null): void {
    this.invalidInput.set(false);
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

  validate(_control: AbstractControl): ValidationErrors | null {
    return this.invalidInput() ? { invalidDate: true } : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onValidatorChange = fn;
  }

  protected toggle(): void {
    if (!this.disabled()) {
      this.dropdownOpen.toggle(!this.isOpen());
    }
  }

  protected close(): void {
    this.dropdownOpen.toggle(false);
  }

  protected onDayPicked(day: Date): void {
    this.invalidInput.set(false);
    this.value.set(day);
    this.dropdownOpen.toggle(false);
    this._onChange(day);
    this._onValidatorChange();
  }

  protected onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const raw = el.value;
    const caret = el.selectionStart ?? raw.length;
    const masked = maskDate(raw);
    const newCaret =
      caret >= raw.length
        ? masked.length
        : caretForDigitCount(masked, digitsBefore(raw, caret));
    if (el.value !== masked) el.value = masked;
    el.setSelectionRange(newCaret, newCaret);
    this.inputValue.set(masked);
    this.invalidInput.set(false);
    this.syncDraft(masked);
  }

  /**
   * Backspacing while the caret sits just after an auto-inserted `/` would
   * otherwise be undone by re-masking. Delete the preceding digit instead.
   */
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Backspace') return;
    const el = event.target as HTMLInputElement;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    if (start !== end || start === 0 || isDigitChar(el.value[start - 1])) {
      return;
    }
    event.preventDefault();
    let i = start - 1;
    while (i >= 0 && !isDigitChar(el.value[i])) i--;
    if (i < 0) return;
    const raw = el.value.slice(0, i) + el.value.slice(i + 1);
    const masked = maskDate(raw);
    el.value = masked;
    const newCaret = caretForDigitCount(masked, digitsBefore(raw, i));
    el.setSelectionRange(newCaret, newCaret);
    this.inputValue.set(masked);
    this.invalidInput.set(false);
    this.syncDraft(masked);
  }

  /**
   * Parse the masked text and, when it yields a complete valid in-bounds date,
   * expose it as the calendar's draft so the open calendar previews it live.
   */
  private syncDraft(masked: string): void {
    const parsed = parseDate(masked);
    this.draft.set(parsed && this.inBounds(parsed) ? parsed : null);
  }

  protected onBlur(): void {
    const text = this.inputValue();
    if (!text) {
      this.invalidInput.set(false);
      this.value.set(null);
      this._onChange(null);
    } else {
      const parsed = parseDate(text);
      if (parsed) {
        // A real date outside the bounds is snapped to the nearest bound
        // rather than rejected (e.g. typing 2040 with max 2030 commits 2030).
        // Impossible dates (e.g. 31/02) still fall through to the invalid state.
        const clamped = this.clampToBounds(parsed);
        this.invalidInput.set(false);
        this.value.set(clamped);
        // Replace the typed text with the committed date. Set it explicitly
        // (rather than relying on the value effect) to cover the case where the
        // clamped date is the same Date reference the value already held.
        this.inputValue.set(formatDate(clamped));
        this._onChange(clamped);
      } else {
        this.invalidInput.set(true);
      }
    }
    this._onValidatorChange();
    this._onTouched();
  }

  /** Whether `d` falls within the optional `min`/`max` bounds (day granularity). */
  private inBounds(d: Date): boolean {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const min = this.min();
    const max = this.max();
    if (min) {
      const lo = new Date(
        min.getFullYear(),
        min.getMonth(),
        min.getDate(),
      ).getTime();
      if (day < lo) return false;
    }
    if (max) {
      const hi = new Date(
        max.getFullYear(),
        max.getMonth(),
        max.getDate(),
      ).getTime();
      if (day > hi) return false;
    }
    return true;
  }

  /**
   * Snap `d` to the nearest of the optional `min`/`max` bounds (day
   * granularity). Returns the `min`/`max` Date when `d` is out of range, else `d`.
   */
  private clampToBounds(d: Date): Date {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const min = this.min();
    const max = this.max();
    if (min) {
      const lo = new Date(
        min.getFullYear(),
        min.getMonth(),
        min.getDate(),
      ).getTime();
      if (day < lo) return min;
    }
    if (max) {
      const hi = new Date(
        max.getFullYear(),
        max.getMonth(),
        max.getDate(),
      ).getTime();
      if (day > hi) return max;
    }
    return d;
  }
}
