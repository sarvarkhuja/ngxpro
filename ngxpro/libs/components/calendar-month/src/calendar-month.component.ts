import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { cx } from '@nxp/cdk';
import { CalendarYearComponent } from '@nxp/components/calendar';
import { CALENDAR_MONTH_OPTIONS } from './calendar-month.providers';

/** Short month labels (Jan–Dec). */
export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** A { year, month } coordinate — month is 0-indexed. */
export interface MonthCoord {
  year: number;
  month: number;
}

/** A month range — both ends are inclusive, month is 0-indexed. */
export interface MonthRange {
  from: MonthCoord;
  to: MonthCoord;
}

/** The value accepted by CalendarMonthComponent. */
export type CalendarMonthValue = MonthCoord | MonthRange | null;

/** Converts a MonthCoord to a linear integer for range arithmetic. */
function toLinear(m: MonthCoord): number {
  return m.year * 12 + m.month;
}

/**
 * Month picker — displays a 3×4 grid of months for a given year.
 *
 * Supports single-month selection, month-range selection (with hover preview),
 * min/max bounds, minLength/maxLength range constraints, and a
 * year-picker overlay (via CalendarYearComponent).
 *
 * @example
 * <!-- Single month -->
 * <nxp-calendar-month [value]="selected" (monthClick)="selected = $event" />
 *
 * @example
 * <!-- Range mode -->
 * <nxp-calendar-month [value]="range" (monthClick)="onMonthClick($event)" />
 */
@Component({
  selector: 'nxp-calendar-month',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarYearComponent],
  template: `
    <div
      class="inline-flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 w-72"
      role="application"
      [attr.aria-label]="'Month picker'"
    >
      @if (isYearPickerShown) {
        <!-- Year picker overlay -->
        <nxp-calendar-year
          [currentYear]="activeYear()"
          [selectedYear]="activeYear()"
          [min]="minAsDate()"
          [max]="maxAsDate()"
          (yearClick)="onPickerYearClick($event)"
        />
      } @else {
        <!-- Year navigation header -->
        <div
          class="flex items-center justify-between"
          role="group"
          [attr.aria-label]="'Year navigation'"
        >
          <button
            type="button"
            [class]="navBtnClass()"
            [disabled]="isPrevYearDisabled()"
            [attr.aria-label]="'Previous year'"
            (click)="onPreviousYear()"
          >
            <i class="ri-arrow-left-s-line size-4" aria-hidden="true"></i>
          </button>

          <button
            type="button"
            [class]="yearLabelClass()"
            [attr.aria-label]="'Select year, currently ' + activeYear()"
            [attr.aria-expanded]="isYearPickerShown"
            (click)="onYearClick()"
          >
            {{ activeYear() }}
          </button>

          <button
            type="button"
            [class]="navBtnClass()"
            [disabled]="isNextYearDisabled()"
            [attr.aria-label]="'Next year'"
            (click)="onNextYear()"
          >
            <i class="ri-arrow-right-s-line size-4" aria-hidden="true"></i>
          </button>
        </div>

        <!-- 3 rows × 4 columns month grid -->
        <div role="grid" [attr.aria-label]="'Months of ' + activeYear()">
          @for (row of rows; track row) {
            <div class="grid grid-cols-4 gap-1" role="row">
              @for (col of cols; track col) {
                @let monthIdx = row * 4 + col;
                @let item = { year: activeYear(), month: monthIdx };
                @let rangeState = getItemRange(item);
                @let isDisabled = handler()(item);
                @let isToday = isCurrentMonth(item);
                <button
                  type="button"
                  [class]="monthBtnClass(rangeState, isDisabled, isToday)"
                  [disabled]="isDisabled"
                  [attr.data-range]="rangeState"
                  [attr.aria-selected]="
                    rangeState === 'active' ||
                    rangeState === 'start' ||
                    rangeState === 'end' ||
                    null
                  "
                  [attr.aria-disabled]="isDisabled || null"
                  [attr.aria-label]="MONTH_NAMES[monthIdx] + ' ' + activeYear()"
                  role="gridcell"
                  (click)="onItemClick(item)"
                  (mouseenter)="onItemHovered(true, item)"
                  (mouseleave)="onItemHovered(false, item)"
                >
                  {{ MONTH_NAMES[monthIdx] }}
                </button>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class CalendarMonthComponent {
  protected readonly MONTH_NAMES = MONTH_NAMES;
  protected readonly rows = [0, 1, 2] as const;
  protected readonly cols = [0, 1, 2, 3] as const;

  private readonly options = inject(CALENDAR_MONTH_OPTIONS);

  // ------------------------------------------------------------------ inputs

  /**
   * Overrides the initially-displayed year.
   * Falls back to the selected value's year, then to today's year.
   */
  readonly year = input<number | undefined>(undefined);

  /**
   * Enable month-range selection mode.
   * When true, the first click sets the range start and the second sets the end.
   * Overrides the injected CALENDAR_MONTH_OPTIONS.rangeMode when provided.
   */
  readonly rangeMode = input<boolean | undefined>(undefined);

  /** Optional lower bound (inclusive). */
  readonly min = input<MonthCoord | null>(null);

  /** Optional upper bound (inclusive). */
  readonly max = input<MonthCoord | null>(null);

  /**
   * Selected value — either a single MonthCoord, a MonthRange, or null.
   * In rangeMode the component expects a MonthRange once both ends are chosen.
   */
  readonly value = input<CalendarMonthValue>(null);

  /** Returns true if the given month should be disabled. */
  readonly disabledHandler = input<(m: MonthCoord) => boolean>(() => false);

  /**
   * Minimum range length (inclusive) when in range-picking mode.
   * A value of 2 prevents selecting a single-month range.
   */
  readonly minLength = input<number | null>(null);

  /**
   * Maximum range length (inclusive) when in range-picking mode.
   * A value of 3 prevents selecting a range longer than 3 months.
   */
  readonly maxLength = input<number | null>(null);

  // ------------------------------------------------------------------ outputs

  /** Emitted when the user clicks a non-disabled month cell. */
  readonly monthClick = output<MonthCoord>();

  /** Emitted when the hovered month changes (for external range-preview logic). */
  readonly hoveredItemChange = output<MonthCoord | null>();

  /** Emitted when the user navigates to a different year. */
  readonly yearChange = output<number>();

  // ------------------------------------------------------------------ state

  /** Effective rangeMode: input takes precedence over injected options. */
  protected readonly effectiveRangeMode = computed(
    () => this.rangeMode() ?? this.options.rangeMode,
  );

  /** Whether the year-picker overlay is currently shown. */
  protected isYearPickerShown = false;

  /** The month currently under the mouse cursor (used for range preview). */
  protected hoveredItem: MonthCoord | null = null;

  /**
   * The year currently shown in the header / grid.
   * Derived from the `year` input → value → today, but writable so
   * prev/next navigation updates it independently.
   */
  protected readonly activeYear = linkedSignal<number>(() => {
    const y = this.year();
    if (y != null) return y;

    const v = this.value();
    if (v && 'year' in v && !('from' in v)) return (v as MonthCoord).year;
    if (v && 'from' in v) return (v as MonthRange).from.year;

    return new Date().getFullYear();
  });

  // ------------------------------------------------------------------ derived

  /**
   * True when the user has selected the first month and is hovering to pick
   * the second month in a range.
   *
   * Conditions:
   * - rangeMode on + value is a single MonthCoord (not yet a range)
   * - rangeMode off + value is a MonthRange where from === to
   */
  protected readonly isRangePicking = computed(() => {
    if (!this.effectiveRangeMode()) return false;
    const v = this.value();
    // rangeMode: first coord selected — waiting for second end
    return !!v && 'year' in v && !('from' in v);
  });

  /**
   * Merged disable predicate: min/max bounds + minLength/maxLength
   * range constraints + caller-supplied disabledHandler.
   */
  protected readonly handler = computed(() => {
    const disabledHandler = this.disabledHandler();
    const value = this.value();
    const isRangePicking = this.isRangePicking();
    const min = this.min();
    const max = this.max();
    const minLength = this.minLength();
    const maxLength = this.maxLength();

    return (item: MonthCoord): boolean => {
      if (min && toLinear(item) < toLinear(min)) return true;
      if (max && toLinear(item) > toLinear(max)) return true;

      if (isRangePicking && value) {
        const selectedMonth =
          'from' in value ? (value as MonthRange).from : (value as MonthCoord);
        const delta = Math.abs(toLinear(item) - toLinear(selectedMonth));

        if (maxLength != null && delta > maxLength) return true;
        if (minLength != null && delta > 0 && delta < minLength) return true;
      }

      return disabledHandler(item);
    };
  });

  /**
   * Converts the `min` MonthCoord to a Date object so it can be passed to
   * CalendarYearComponent (which expects `Date | null`).
   */
  protected readonly minAsDate = computed<Date | null>(() => {
    const m = this.min();
    return m ? new Date(m.year, m.month, 1) : null;
  });

  /**
   * Converts the `max` MonthCoord to a Date object so it can be passed to
   * CalendarYearComponent (which expects `Date | null`).
   */
  protected readonly maxAsDate = computed<Date | null>(() => {
    const m = this.max();
    return m ? new Date(m.year, m.month, 1) : null;
  });

  // ------------------------------------------------------------------ helpers

  /** Returns the range state of the given month cell for styling. */
  getItemRange(item: MonthCoord): 'active' | 'start' | 'middle' | 'end' | null {
    const value = this.value();
    if (!value) return null;

    const itemL = toLinear(item);

    // Non-range mode: only ever show 'active' for exact match, never range states.
    if (!this.effectiveRangeMode()) {
      if ('from' in value) return null;
      return toLinear(value as MonthCoord) === itemL ? 'active' : null;
    }

    // Range mode — compute effective range using hoveredItem for preview
    const from: MonthCoord =
      'from' in value ? (value as MonthRange).from : (value as MonthCoord);
    const to: MonthCoord =
      'from' in value ? (value as MonthRange).to : (value as MonthCoord);

    const fromL = toLinear(from);
    const toL = toLinear(to);
    const hovL =
      this.isRangePicking() && this.hoveredItem
        ? toLinear(this.hoveredItem)
        : null;

    const effectiveEnd = hovL ?? toL;
    const minL = Math.min(fromL, effectiveEnd);
    const maxL = Math.max(fromL, effectiveEnd);

    if (minL === maxL && minL === itemL) return 'active';
    if (minL === itemL) return 'start';
    if (maxL === itemL) return 'end';
    if (minL < itemL && itemL < maxL) return 'middle';

    return null;
  }

  /** True if this MonthCoord matches the current real-world month. */
  protected isCurrentMonth(item: MonthCoord): boolean {
    const now = new Date();
    return item.year === now.getFullYear() && item.month === now.getMonth();
  }

  /** True if stepping back a year would go below `min`. */
  protected isPrevYearDisabled(): boolean {
    const min = this.min();
    if (!min) return false;
    return this.activeYear() - 1 < min.year;
  }

  /** True if stepping forward a year would go above `max`. */
  protected isNextYearDisabled(): boolean {
    const max = this.max();
    if (!max) return false;
    return this.activeYear() + 1 > max.year;
  }

  // ------------------------------------------------------------------ class helpers

  protected navBtnClass(): string {
    return cx(
      'p-1.5 rounded-md transition-colors',
      'text-gray-700 dark:text-gray-300',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
    );
  }

  protected yearLabelClass(): string {
    return cx(
      'text-sm font-semibold transition-colors',
      'text-gray-900 dark:text-gray-50',
      'hover:text-action',
      'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
    );
  }

  protected monthBtnClass(
    rangeState: ReturnType<CalendarMonthComponent['getItemRange']>,
    disabled: boolean,
    isToday: boolean,
  ): string {
    if (disabled) {
      return cx(
        'h-10 rounded-md text-sm font-medium text-center',
        'text-gray-400 dark:text-gray-600',
        'opacity-40 cursor-not-allowed pointer-events-none',
      );
    }

    if (rangeState === 'active') {
      return cx(
        'h-10 rounded-md text-sm font-medium text-center cursor-pointer transition-colors',
        'bg-primary-hover text-text-on-accent',
        'hover:bg-primary-pressed',
        'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
      );
    }

    if (rangeState === 'start') {
      return cx(
        'h-10 rounded-md rounded-r-none text-sm font-medium text-center cursor-pointer transition-colors',
        'bg-primary-hover text-text-on-accent',
        'hover:bg-primary-pressed',
        'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
      );
    }

    if (rangeState === 'end') {
      return cx(
        'h-10 rounded-md rounded-l-none text-sm font-medium text-center cursor-pointer transition-colors',
        'bg-primary-hover text-text-on-accent',
        'hover:bg-primary-pressed',
        'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
      );
    }

    if (rangeState === 'middle') {
      return cx(
        'h-10 rounded-none text-sm font-medium text-center cursor-pointer transition-colors',
        'bg-primary/20 text-action',
        'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
      );
    }

    return cx(
      'h-10 rounded-md text-sm font-medium text-center cursor-pointer transition-colors',
      'text-gray-700 dark:text-gray-300',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      isToday ? 'ring-1 ring-primary' : '',
      'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
    );
  }

  // ------------------------------------------------------------------ event handlers

  protected onItemClick(item: MonthCoord): void {
    this.monthClick.emit(item);
  }

  protected onItemHovered(entering: boolean, item: MonthCoord): void {
    this.hoveredItem = entering ? item : null;
    this.hoveredItemChange.emit(this.hoveredItem);
  }

  protected onYearClick(): void {
    this.isYearPickerShown = !this.isYearPickerShown;
  }

  protected onPreviousYear(): void {
    const prev = this.activeYear() - 1;
    this.activeYear.set(prev);
    this.yearChange.emit(prev);
  }

  protected onNextYear(): void {
    const next = this.activeYear() + 1;
    this.activeYear.set(next);
    this.yearChange.emit(next);
  }

  protected onPickerYearClick(year: number): void {
    this.activeYear.set(year);
    this.isYearPickerShown = false;
    this.yearChange.emit(year);
  }
}
