import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { cx } from '@nxp/cdk';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/**
 * Calendar header — displays "← Month Year →" navigation.
 *
 * The year label is a button that, when clicked, switches to the year picker.
 * Prev/next buttons emit `prevClick` / `nextClick` for the parent to update
 * the viewed month.
 */
@Component({
  selector: 'nxp-calendar-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between px-1 pb-2">
      <!-- Previous month button -->
      <button
        type="button"
        [class]="navBtnClass"
        [disabled]="prevDisabled()"
        [attr.aria-label]="'Go to previous month'"
        (click)="prevClick.emit()"
      >
        <i class="ri-arrow-left-s-line h-4 w-4" aria-hidden="true"></i>
      </button>

      <!-- Month / Year label — click to open year picker -->
      <button
        type="button"
        [class]="labelBtnClass"
        [attr.aria-label]="'Select year, currently ' + monthName() + ' ' + year()"
        (click)="yearLabelClick.emit()"
      >
        {{ monthName() }} {{ year() }}
      </button>

      <!-- Next month button -->
      <button
        type="button"
        [class]="navBtnClass"
        [disabled]="nextDisabled()"
        [attr.aria-label]="'Go to next month'"
        (click)="nextClick.emit()"
      >
        <i class="ri-arrow-right-s-line h-4 w-4" aria-hidden="true"></i>
      </button>
    </div>
  `,
})
export class CalendarHeaderComponent {
  /** Currently viewed month (0–11). */
  readonly month = input.required<number>();

  /** Currently viewed year (e.g. 2025). */
  readonly year = input.required<number>();

  /** Optional minimum date — disables the prev button when at the min month. */
  readonly min = input<Date | null>(null);

  /** Optional maximum date — disables the next button when at the max month. */
  readonly max = input<Date | null>(null);

  /** Fired when the user clicks the left arrow. */
  readonly prevClick = output<void>();

  /** Fired when the user clicks the right arrow. */
  readonly nextClick = output<void>();

  /** Fired when the user clicks the month/year label (switch to year view). */
  readonly yearLabelClick = output<void>();

  protected readonly monthName = computed(() => MONTH_NAMES[this.month()]);

  protected readonly prevDisabled = computed(() => {
    const minDate = this.min();
    if (!minDate) return false;
    return (
      this.year() < minDate.getFullYear() ||
      (this.year() === minDate.getFullYear() &&
        this.month() <= minDate.getMonth())
    );
  });

  protected readonly nextDisabled = computed(() => {
    const maxDate = this.max();
    if (!maxDate) return false;
    return (
      this.year() > maxDate.getFullYear() ||
      (this.year() === maxDate.getFullYear() &&
        this.month() >= maxDate.getMonth())
    );
  });

  protected readonly navBtnClass = cx(
    'flex items-center justify-center',
    'h-7 w-7 rounded-md',
    'text-gray-600 dark:text-gray-400',
    'hover:bg-gray-100 dark:hover:bg-gray-800',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
    'transition-colors duration-150',
    'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
  );

  protected readonly labelBtnClass = cx(
    'flex-1 text-center text-sm font-semibold',
    'text-gray-900 dark:text-gray-50',
    'rounded-md px-2 py-1',
    'hover:bg-gray-100 dark:hover:bg-gray-800',
    'transition-colors duration-150',
    'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
  );
}
