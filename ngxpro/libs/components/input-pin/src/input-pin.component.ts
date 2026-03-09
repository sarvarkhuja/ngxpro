import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cx } from '@nxp/cdk';

// ---- Style constants ----

const CELL_BASE = [
  'relative w-10 h-12 flex items-center justify-center',
  'rounded-md border text-lg font-mono',
  'cursor-pointer select-none transition-colors duration-150',
].join(' ');

const CELL_DEFAULT = [
  'border-gray-300 bg-white text-gray-900',
  'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50',
].join(' ');

const CELL_FOCUSED = [
  'border-blue-500 ring-2 ring-blue-500/20',
  'dark:border-blue-400 dark:ring-blue-400/20',
].join(' ');

const CELL_FILLED = [
  'border-gray-400',
  'dark:border-gray-500',
].join(' ');

const CELL_ERROR = [
  'border-red-500 ring-2 ring-red-500/20',
  'dark:border-red-400 dark:ring-red-400/20',
].join(' ');

const CELL_DISABLED = [
  'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-60',
].join(' ');

/**
 * PIN / OTP input component.
 *
 * Renders individual visual cells (one per digit) backed by a single hidden
 * native `<input>` element that handles keyboard input and form integration.
 *
 * Implements `ControlValueAccessor` for full compatibility with `[(ngModel)]`
 * and reactive forms.
 *
 * @example
 * <!-- Template-driven -->
 * <nxp-input-pin [(ngModel)]="pin" [length]="6" />
 *
 * @example
 * <!-- Reactive form, alphanumeric, visible chars -->
 * <nxp-input-pin [formControl]="pinCtrl" type="alphanumeric" mask="text" [length]="4" />
 */
@Component({
  selector: 'nxp-input-pin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxpInputPinComponent),
      multi: true,
    },
  ],
  template: `
    <!-- Visual cells -->
    <div
      [class]="containerClass()"
      [attr.aria-label]="'PIN input, ' + length() + ' digits'"
      role="group"
    >
      @for (cell of cells(); track $index) {
        <div
          [class]="cellClass($index)"
          (pointerdown)="onCellPointerDown($event, $index)"
          [attr.aria-label]="'Digit ' + ($index + 1)"
        >
          <span>{{ displayChar($index) }}</span>
        </div>
      }
    </div>

    <!-- Hidden native input — handles all keyboard events and CVA -->
    <input
      #hiddenInput
      [type]="nativeInputType()"
      [attr.maxlength]="length()"
      [disabled]="isDisabled()"
      [attr.inputmode]="type() === 'numeric' ? 'numeric' : 'text'"
      [attr.pattern]="type() === 'numeric' ? '[0-9]*' : null"
      [attr.autocomplete]="'one-time-code'"
      spellcheck="false"
      autocorrect="off"
      autocapitalize="off"
      class="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none"
      style="clip: rect(0,0,0,0); clip-path: inset(50%);"
      aria-hidden="true"
      (focus)="onFocus()"
      (blur)="onBlur()"
      (input)="onInput($event)"
      (keydown)="onKeydown($event)"
      (selectionchange)="onSelectionChange()"
    />
  `,
  host: {
    class: 'relative inline-flex',
  },
})
export class NxpInputPinComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  // ------------------------------------------------------------------ refs

  private readonly hiddenInputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('hiddenInput');

  // ------------------------------------------------------------------ inputs

  /** Number of PIN cells to render. */
  readonly length = input<number>(6);

  /** Whether to restrict input to digits only. */
  readonly type = input<'numeric' | 'alphanumeric'>('numeric');

  /** Placeholder character shown in empty cells. */
  readonly placeholder = input<string>('·');

  /** Whether the input is disabled. */
  readonly disabled = input<boolean>(false);

  /** Whether the input is in an error state. */
  readonly invalid = input<boolean>(false);

  /** Whether filled cells show the actual character or a bullet. */
  readonly mask = input<'password' | 'text'>('password');

  /** Additional CSS classes on the container element. */
  readonly class = input<string>('');

  // ------------------------------------------------------------------ outputs

  /** Emitted whenever the PIN value changes. */
  readonly valueChange = output<string>();

  // ------------------------------------------------------------------ internal state

  /** The current PIN string value. */
  protected readonly pinValue = signal<string>('');

  /** Whether the hidden input currently has focus. */
  protected readonly isFocused = signal<boolean>(false);

  /**
   * Which cell index is currently "active" (caret position).
   * Tracks selectionStart of the hidden input.
   */
  protected readonly activeIndex = signal<number>(-1);

  /** Merged disabled state (from input signal or CVA setDisabledState). */
  protected readonly isDisabled = signal<boolean>(false);

  // ------------------------------------------------------------------ computed

  /** Array used to drive the @for loop. */
  protected readonly cells = computed(() => Array.from({ length: this.length() }));

  /** The type attribute to set on the hidden input (always 'text' so we can manipulate freely). */
  protected readonly nativeInputType = computed(() => 'text');

  protected readonly containerClass = computed(() =>
    cx('flex gap-2', this.class())
  );

  // ------------------------------------------------------------------ CVA

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onChange: (v: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onTouched: () => void = () => {};

  writeValue(v: string | null): void {
    const str = v ?? '';
    this.pinValue.set(str);
    // Sync to hidden input if available
    const el = this.hiddenInputRef()?.nativeElement;
    if (el) {
      el.value = str;
    }
  }

  registerOnChange(fn: (v: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  // ------------------------------------------------------------------ event handlers

  /** Clicking a cell focuses the hidden input and positions the caret at that cell's index. */
  protected onCellPointerDown(event: PointerEvent, index: number): void {
    event.preventDefault();
    if (this.isDisabled() || this.disabled()) {
      return;
    }
    const el = this.hiddenInputRef().nativeElement;
    el.focus();

    // Clamp index to the length of current value (can't click past filled chars)
    const clampedIndex = Math.min(index, this.pinValue().length);
    el.setSelectionRange(clampedIndex, clampedIndex + 1);
    this.activeIndex.set(clampedIndex);
  }

  protected onFocus(): void {
    this.isFocused.set(true);
    // Position caret at end of current value by default
    const el = this.hiddenInputRef().nativeElement;
    const pos = this.pinValue().length;
    const clampedPos = Math.min(pos, this.length() - 1);
    el.setSelectionRange(clampedPos, clampedPos + 1);
    this.activeIndex.set(clampedPos);
  }

  protected onBlur(): void {
    this.isFocused.set(false);
    this.activeIndex.set(-1);
    this._onTouched();
  }

  protected onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    let raw = el.value;

    // Enforce numeric-only restriction
    if (this.type() === 'numeric') {
      raw = raw.replace(/\D/g, '');
    }

    // Enforce max length
    if (raw.length > this.length()) {
      raw = raw.slice(0, this.length());
    }

    // Sync back if filtering changed the value
    if (el.value !== raw) {
      el.value = raw;
    }

    this.pinValue.set(raw);
    this.valueChange.emit(raw);
    this._onChange(raw);

    // Advance caret: after typing, move to next empty cell
    const nextPos = Math.min(raw.length, this.length() - 1);
    el.setSelectionRange(nextPos, nextPos + 1);
    this.activeIndex.set(nextPos);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const el = this.hiddenInputRef().nativeElement;
    const currentPos = el.selectionStart ?? 0;

    // Keep selection as single-char range (overwrite mode feel)
    if (event.key === 'ArrowLeft') {
      const newPos = Math.max(0, currentPos - 1);
      el.setSelectionRange(newPos, newPos + 1);
      this.activeIndex.set(newPos);
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowRight') {
      const newPos = Math.min(this.length() - 1, currentPos + 1);
      el.setSelectionRange(newPos, newPos + 1);
      this.activeIndex.set(newPos);
      event.preventDefault();
      return;
    }

    // Backspace: delete char at current position and move caret back
    if (event.key === 'Backspace') {
      event.preventDefault();
      const current = this.pinValue();
      if (currentPos > 0 && current.length > 0) {
        // Remove the character before the caret
        const deleteAt = Math.min(currentPos, current.length) - 1;
        const newVal = current.slice(0, deleteAt) + current.slice(deleteAt + 1);
        el.value = newVal;
        this.pinValue.set(newVal);
        this.valueChange.emit(newVal);
        this._onChange(newVal);
        const newPos = Math.max(0, deleteAt);
        el.setSelectionRange(newPos, newPos + 1);
        this.activeIndex.set(newPos);
      } else if (currentPos === 0 && current.length > 0) {
        // At start — delete first char
        const newVal = current.slice(1);
        el.value = newVal;
        this.pinValue.set(newVal);
        this.valueChange.emit(newVal);
        this._onChange(newVal);
        el.setSelectionRange(0, 1);
        this.activeIndex.set(0);
      }
      return;
    }

    // Delete key: delete char at current position
    if (event.key === 'Delete') {
      event.preventDefault();
      const current = this.pinValue();
      if (currentPos < current.length) {
        const newVal = current.slice(0, currentPos) + current.slice(currentPos + 1);
        el.value = newVal;
        this.pinValue.set(newVal);
        this.valueChange.emit(newVal);
        this._onChange(newVal);
        el.setSelectionRange(currentPos, currentPos + 1);
        this.activeIndex.set(currentPos);
      }
      return;
    }
  }

  protected onSelectionChange(): void {
    const el = this.hiddenInputRef().nativeElement;
    if (!this.isFocused()) return;

    // Keep the selection as a single-char range (never at end sentinel)
    const start = el.selectionStart ?? 0;
    if (start === this.length()) {
      const clampedPos = this.length() - 1;
      el.setSelectionRange(clampedPos, clampedPos + 1);
      this.activeIndex.set(clampedPos);
    } else {
      this.activeIndex.set(start);
    }
  }

  // ------------------------------------------------------------------ display helpers

  /** Returns the character to display in a given cell. */
  protected displayChar(index: number): string {
    const char = this.pinValue()[index];
    if (!char) {
      return this.placeholder();
    }
    return this.mask() === 'password' ? '●' : char;
  }

  /** Returns the Tailwind classes for a specific cell. */
  protected cellClass(index: number): string {
    const isActive = this.isFocused() && this.activeIndex() === index;
    const isFilled = index < this.pinValue().length;
    const isInvalid = this.invalid();
    const isOff = this.isDisabled() || this.disabled();

    return cx(
      CELL_BASE,
      // State classes — order matters: error > focused > filled > default
      isInvalid
        ? CELL_ERROR
        : isActive
          ? CELL_FOCUSED
          : isFilled
            ? CELL_FILLED
            : CELL_DEFAULT,
      isOff && CELL_DISABLED,
    );
  }
}
