import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { cx, dayCellVariants } from '@nxp/cdk';
import { CalendarSheetPipe } from './calendar-sheet.pipe';
import type { DayRange, DisabledHandler, MarkerHandler, WeekStart } from './calendar.types';

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
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarSheetPipe],
  template: `
    <!-- Week-day header row -->
    <div class="grid grid-cols-7 mb-1" role="row">
      @for (label of weekdayLabels(); track label) {
        <div
          class="h-8 flex items-center justify-center text-xs font-medium text-text-tertiary select-none"
          role="columnheader"
          [attr.aria-label]="label"
        >
          {{ label }}
        </div>
      }
    </div>

    <!-- Day grid: 6 rows × 7 cols -->
    <div role="grid" [attr.aria-label]="gridLabel()">
      @for (week of (year() | calendarSheet:month():weekStart()); track $index) {
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
                [attr.aria-label]="day.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })"
                [attr.aria-selected]="isSelected(day) || null"
                [attr.aria-disabled]="isDisabled(day) || null"
                [attr.aria-current]="isToday(day) ? 'date' : null"
                (click)="!isDisabled(day) && dayClick.emit(day)"
                (mouseenter)="hoveredDayChange.emit(day)"
                (mouseleave)="hoveredDayChange.emit(null)"
                (focus)="hoveredDayChange.emit(day)"
                (blur)="hoveredDayChange.emit(null)"
              >
                {{ day.getDate() }}

                <!-- Dot markers -->
                @if (markers(day).length > 0) {
                  <span class="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
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
  /** Currently viewed year. */
  readonly year = input.required<number>();

  /** Currently viewed month (0–11). */
  readonly month = input.required<number>();

  /**
   * Selected value — can be:
   * - null / undefined     → nothing selected
   * - Date                 → single selection
   * - [Date, Date]         → range selection (start + end)
   * - Date[]               → multi selection
   */
  readonly value = input<Date | [Date, Date] | Date[] | null>(null);

  /** Currently hovered date (used for range preview). */
  readonly hoveredDay = model<Date | null>(null);

  /** First day of the week. 0 = Sun, 1 = Mon (default). */
  readonly weekStart = input<WeekStart>(1);

  /** Optional handler to disable individual dates. */
  readonly disabledHandler = input<DisabledHandler | null>(null);

  /** Optional handler to add dot markers to dates. */
  readonly markerHandler = input<MarkerHandler | null>(null);

  /** Whether to show days from the previous/next month. */
  readonly showAdjacent = input<boolean>(true);

  /** Whether the component is in range-selection mode. */
  readonly rangeMode = input<boolean>(false);

  /** Minimum selectable date. */
  readonly min = input<Date | null>(null);

  /** Maximum selectable date. */
  readonly max = input<Date | null>(null);

  /** Emitted when the user clicks a (non-disabled) day. */
  readonly dayClick = output<Date>();

  /** Emitted when the hovered day changes (null on mouse-leave). */
  readonly hoveredDayChange = output<Date | null>();

  // ------------------------------------------------------------------ helpers

  protected readonly weekdayLabels = computed(() => {
    const ws = this.weekStart();
    return Array.from({ length: 7 }, (_, i) => ALL_WEEKDAY_LABELS[(ws + i) % 7]);
  });

  protected readonly gridLabel = computed(
    () => `Calendar — ${this.year()}-${String(this.month() + 1).padStart(2, '0')}`,
  );

  /** Returns dot-marker colors for the given date. */
  protected markers(day: Date): string[] {
    const handler = this.markerHandler();
    return handler ? handler(day) : [];
  }

  protected isToday(day: Date): boolean {
    return isToday(day);
  }

  /** Whether the day belongs to a different month than the viewed month. */
  protected isAdjacent(day: Date): boolean {
    return day.getMonth() !== this.month();
  }

  /** Whether the day is a Saturday (6) or Sunday (0). */
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

  /** Computes the range state for a given day. */
  protected rangeState(day: Date): DayRange {
    const val = this.value();
    if (!val) return null;

    if (val instanceof Date) {
      return isSameDay(day, val) ? 'active' : null;
    }

    // Range: [Date, Date]
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

    // Multi: Date[]
    if (Array.isArray(val)) {
      return (val as Date[]).some((v) => isSameDay(day, v)) ? 'active' : null;
    }

    return null;
  }

  /**
   * Wrapper class for the range-middle background strip.
   * Applied on the gridcell wrapper (not the button) so the blue strip
   * extends edge-to-edge while the button itself keeps a rounded shape.
   */
  protected rangeBgClass(day: Date): string {
    if (!this.rangeMode()) return '';
    const state = this.rangeState(day);

    if (state === 'middle') {
      return 'bg-primary/10';
    }
    return '';
  }

  protected dayCellClass(day: Date): string {
    const adjacent = this.isAdjacent(day);
    const disabled = this.isDisabled(day);
    const today = isToday(day);
    const weekend = this.isWeekend(day);
    const rangeState = this.rangeState(day);

    if (disabled) {
      return dayCellVariants({ state: 'disabled' });
    }

    if (!this.showAdjacent() && adjacent) {
      return dayCellVariants({ state: 'invisible' });
    }

    if (rangeState === 'active') {
      return dayCellVariants({ state: 'active' });
    }

    if (rangeState === 'start' || rangeState === 'end') {
      return dayCellVariants({ state: 'startEnd' });
    }

    if (rangeState === 'middle') {
      return dayCellVariants({ state: 'middle' });
    }

    return dayCellVariants({ state: 'default', adjacent, today, weekend });
  }
}
