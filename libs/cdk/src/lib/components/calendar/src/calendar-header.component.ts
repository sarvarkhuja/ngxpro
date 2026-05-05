import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { cx, navButtonClass } from '../../../utils';

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
    <div class="flex items-center justify-between gap-1 pb-3">
      <button
        type="button"
        [class]="navBtnClass"
        [disabled]="prevDisabled()"
        [attr.aria-label]="'Go to previous month'"
        (click)="prevClick.emit()"
      >
        <i class="ri-arrow-left-s-line text-base leading-none" aria-hidden="true"></i>
      </button>

      <button
        type="button"
        [class]="labelBtnClass"
        [attr.aria-label]="'Select year, currently ' + monthName() + ' ' + year()"
        (click)="yearLabelClick.emit()"
      >
        <span class="tabular-nums">{{ monthName() }} {{ year() }}</span>
      </button>

      <button
        type="button"
        [class]="navBtnClass"
        [disabled]="nextDisabled()"
        [attr.aria-label]="'Go to next month'"
        (click)="nextClick.emit()"
      >
        <i class="ri-arrow-right-s-line text-base leading-none" aria-hidden="true"></i>
      </button>
    </div>
  `,
})
export class CalendarHeaderComponent {
  readonly month = input.required<number>();
  readonly year = input.required<number>();
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);

  readonly prevClick = output<void>();
  readonly nextClick = output<void>();
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

  protected readonly navBtnClass = navButtonClass;

  protected readonly labelBtnClass = cx(
    'flex-1 flex items-center justify-center',
    'h-8 px-2 rounded-lg',
    'text-sm font-semibold text-text-primary',
    'hover:bg-bg-neutral-1',
    'transition-[background-color,color,transform] duration-150',
    '[transition-timing-function:cubic-bezier(0.23,1,0.32,1)]',
    'active:scale-[0.98]',
    'outline-none focus-visible:ring-1 focus-visible:ring-border-focus',
  );
}
