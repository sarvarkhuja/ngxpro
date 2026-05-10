import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { dayCellVariants } from '@ngxpro/cdk';
import { CalendarSheetPipe } from './calendar-sheet.pipe';
import type {
  DayRange,
  DisabledHandler,
  MarkerHandler,
  WeekStart,
} from './calendar.types';

/** Short week-day labels in Sunday-first order. */
const ALL_WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Calendar sheet — renders the 7-column week-day header and 6×7 day grid.
 *
 * Handles: today highlight, single/range/multi selection, disabled days,
 * adjacent-month day dimming, weekend colouring, and dot markers.
 */
@Component({
  selector: 'nxp-calendar-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarSheetPipe],
  template: `
    <div class="grid grid-cols-7 mb-1.5" role="row">
      @for (label of weekdayLabels(); track label) {
        <div
          class="h-7 flex items-center justify-center text-[11px] font-medium tracking-wide uppercase text-text-tertiary select-none"
          role="columnheader"
          [attr.aria-label]="label"
        >
          {{ label }}
        </div>
      }
    </div>

    <div role="grid" [attr.aria-label]="gridLabel()" class="grid gap-y-0.5">
      @for (
        week of year() | calendarSheet: month() : weekStart();
        track $index
      ) {
        <div class="grid grid-cols-7" role="row">
          @for (day of week; track day.getTime()) {
            <div
              role="gridcell"
              class="relative flex items-center justify-center p-0.5"
              [class]="rangeBgClass(day)"
            >
              <button
                type="button"
                [class]="dayCellClass(day)"
                [disabled]="isDisabled(day)"
                [attr.aria-label]="
                  day.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                "
                [attr.aria-selected]="isSelected(day) || null"
                [attr.aria-disabled]="isDisabled(day) || null"
                [attr.aria-current]="isToday(day) ? 'date' : null"
                (click)="!isDisabled(day) && dayClick.emit(day)"
                (mouseenter)="hoveredDayChange.emit(day)"
                (mouseleave)="hoveredDayChange.emit(null)"
                (focus)="hoveredDayChange.emit(day)"
                (blur)="hoveredDayChange.emit(null)"
              >
                <span class="tabular-nums">{{ day.getDate() }}</span>

                @if (markers(day).length > 0) {
                  <span
                    class="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5"
                    aria-hidden="true"
                  >
                    @for (color of markers(day); track $index) {
                      <span
                        class="h-1 w-1 rounded-full"
                        [style.background-color]="color"
                      ></span>
                    }
                  </span>
                }
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class CalendarSheetComponent {
  readonly year = input.required<number>();
  readonly month = input.required<number>();
  readonly value = input<Date | [Date, Date] | Date[] | null>(null);
  readonly hoveredDay = model<Date | null>(null);
  readonly weekStart = input<WeekStart>(1);
  readonly disabledHandler = input<DisabledHandler | null>(null);
  readonly markerHandler = input<MarkerHandler | null>(null);
  readonly showAdjacent = input<boolean>(true);
  readonly rangeMode = input<boolean>(false);
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);

  readonly dayClick = output<Date>();
  readonly hoveredDayChange = output<Date | null>();

  protected readonly weekdayLabels = computed(() => {
    const ws = this.weekStart();
    return Array.from(
      { length: 7 },
      (_, i) => ALL_WEEKDAY_LABELS[(ws + i) % 7],
    );
  });

  protected readonly gridLabel = computed(
    () =>
      `Calendar — ${this.year()}-${String(this.month() + 1).padStart(2, '0')}`,
  );

  protected markers(day: Date): string[] {
    const handler = this.markerHandler();
    return handler ? handler(day) : [];
  }

  protected isToday(day: Date): boolean {
    return isToday(day);
  }

  protected isAdjacent(day: Date): boolean {
    return day.getMonth() !== this.month();
  }

  protected isWeekend(day: Date): boolean {
    const dow = day.getDay();
    return dow === 0 || dow === 6;
  }

  protected isDisabled(day: Date): boolean {
    const handler = this.disabledHandler();
    if (handler && handler(day)) return true;

    const min = this.min();
    const max = this.max();
    const s = startOfDay(day);
    if (min && s < startOfDay(min)) return true;
    if (max && s > startOfDay(max)) return true;
    return false;
  }

  protected isSelected(day: Date): boolean {
    return this.rangeState(day) !== null;
  }

  protected rangeState(day: Date): DayRange {
    const val = this.value();
    if (!val) return null;

    if (val instanceof Date) {
      return isSameDay(day, val) ? 'active' : null;
    }

    if (
      Array.isArray(val) &&
      val.length === 2 &&
      val[0] instanceof Date &&
      val[1] instanceof Date &&
      this.rangeMode()
    ) {
      const [start, end] = [startOfDay(val[0]), startOfDay(val[1])];
      const d = startOfDay(day);
      if (isSameDay(day, val[0]) && isSameDay(day, val[1])) return 'active';
      if (isSameDay(day, val[0])) return 'start';
      if (isSameDay(day, val[1])) return 'end';
      if (d > start && d < end) return 'middle';
      return null;
    }

    if (Array.isArray(val)) {
      return (val as Date[]).some((v) => isSameDay(day, v)) ? 'active' : null;
    }

    return null;
  }

  /**
   * Wrapper class for the range-middle background strip.
   * Extends edge-to-edge with rounded corners on the start/end cells.
   */
  protected rangeBgClass(day: Date): string {
    if (!this.rangeMode()) return '';
    const state = this.rangeState(day);

    if (state === 'middle') return 'bg-primary/12';
    if (state === 'start') return 'bg-primary/12 rounded-l-lg';
    if (state === 'end') return 'bg-primary/12 rounded-r-lg';
    return '';
  }

  protected dayCellClass(day: Date): string {
    const adjacent = this.isAdjacent(day);
    const disabled = this.isDisabled(day);
    const today = isToday(day);
    const weekend = this.isWeekend(day);
    const rangeState = this.rangeState(day);

    if (disabled) return dayCellVariants({ state: 'disabled' });

    if (!this.showAdjacent() && adjacent) {
      return dayCellVariants({ state: 'invisible' });
    }

    if (rangeState === 'active') return dayCellVariants({ state: 'active' });
    if (rangeState === 'start' || rangeState === 'end') {
      return dayCellVariants({ state: 'startEnd' });
    }
    if (rangeState === 'middle') return dayCellVariants({ state: 'middle' });

    return dayCellVariants({ state: 'default', adjacent, today, weekend });
  }
}
