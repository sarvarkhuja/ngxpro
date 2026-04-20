import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { cx, calendarContainerClass } from '@nxp/cdk';
import { CalendarHeaderComponent } from './calendar-header.component';
import { CalendarSheetComponent } from './calendar-sheet.component';
import { CalendarYearComponent } from './calendar-year.component';
import { CALENDAR_OPTIONS } from './calendar.options';
import type {
  CalendarView,
  DisabledHandler,
  MarkerHandler,
  WeekStart,
} from './calendar.types';

/**
 * Calendar component — a full-featured month/year date picker.
 *
 * Combines `nxp-calendar-header`, `nxp-calendar-sheet`, and
 * `nxp-calendar-year` into a single orchestrating component.
 *
 * Supports: single-date, date-range, and multi-date selection modes.
 *
 * @example
 * <!-- Single date -->
 * <nxp-calendar [value]="selectedDate" (dayClick)="onDayClick($event)" />
 *
 * @example
 * <!-- Range mode -->
 * <nxp-calendar [rangeMode]="true" [value]="[startDate, endDate]" (dayClick)="onDayClick($event)" />
 *
 * @example
 * <!-- With disabled dates -->
 * <nxp-calendar [disabledHandler]="isWeekend" (dayClick)="onDayClick($event)" />
 */
@Component({
  selector: 'nxp-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CalendarHeaderComponent,
    CalendarSheetComponent,
    CalendarYearComponent,
  ],
  template: `
    <div
      [class]="containerClass()"
      role="application"
      [attr.aria-label]="'Date picker calendar'"
    >
      <!-- Month / Year header -->
      <nxp-calendar-header
        [month]="viewedMonth()"
        [year]="viewedYear()"
        [min]="min()"
        [max]="max()"
        (prevClick)="navigateMonth(-1)"
        (nextClick)="navigateMonth(1)"
        (yearLabelClick)="toggleView()"
      />

      @if (view() === 'month') {
        <!-- Month day grid -->
        <nxp-calendar-sheet
          [year]="viewedYear()"
          [month]="viewedMonth()"
          [value]="value()"
          [hoveredDay]="hoveredDay()"
          [weekStart]="effectiveWeekStart()"
          [disabledHandler]="disabledHandler()"
          [markerHandler]="markerHandler()"
          [showAdjacent]="showAdjacent()"
          [rangeMode]="rangeMode()"
          [min]="min()"
          [max]="max()"
          (dayClick)="onDayClick($event)"
          (hoveredDayChange)="hoveredDay.set($event)"
        />
      } @else {
        <!-- Year picker -->
        <nxp-calendar-year
          [currentYear]="viewedYear()"
          [selectedYear]="selectedYear()"
          [min]="min()"
          [max]="max()"
          (yearClick)="onYearClick($event)"
        />
      }
    </div>
  `,
})
export class CalendarComponent implements OnInit {
  private readonly options = inject(CALENDAR_OPTIONS);

  // ------------------------------------------------------------------ inputs

  /**
   * Selected value — can be:
   * - null               → nothing selected
   * - Date               → single date
   * - [Date, Date]       → range
   * - Date[]             → multi-date
   */
  readonly value = input<Date | [Date, Date] | Date[] | null>(null);

  /** Override the initial viewed month (0–11). Defaults to the current month. */
  readonly month = input<number | undefined>(undefined);

  /** Override the initial viewed year. Defaults to the current year. */
  readonly year = input<number | undefined>(undefined);

  /** Minimum selectable date. */
  readonly min = input<Date | null>(null);

  /** Maximum selectable date. */
  readonly max = input<Date | null>(null);

  /** Override the week-start day (0 = Sun … 6 = Sat). Falls back to CALENDAR_OPTIONS. */
  readonly weekStart = input<WeekStart | undefined>(undefined);

  /** Whether days from adjacent months are shown in the grid. */
  readonly showAdjacent = input<boolean>(true);

  /** Whether the component is in range-selection mode. */
  readonly rangeMode = input<boolean>(false);

  /** Optional handler to disable individual dates. */
  readonly disabledHandler = input<DisabledHandler | null>(null);

  /** Optional handler to add dot markers to dates. */
  readonly markerHandler = input<MarkerHandler | null>(null);

  /** Additional CSS classes for the container. */
  readonly class = input<string>('');

  // ------------------------------------------------------------------ outputs

  /** Emitted when the user clicks a (non-disabled) day. */
  readonly dayClick = output<Date>();

  /** Emitted whenever the viewed month changes (via nav arrows or year picker). */
  readonly monthChange = output<{ year: number; month: number }>();

  // ------------------------------------------------------------------ state

  /** Current view: 'month' grid or 'year' picker. */
  readonly view = signal<CalendarView>('month');

  /** The year currently displayed in the header / sheet. */
  readonly viewedYear = signal<number>(new Date().getFullYear());

  /** The month currently displayed in the sheet (0–11). */
  readonly viewedMonth = signal<number>(new Date().getMonth());

  /** The day currently under the mouse (used for range preview). */
  readonly hoveredDay = model<Date | null>(null);

  // ------------------------------------------------------------------ derived

  protected readonly effectiveWeekStart = computed<WeekStart>(
    () => this.weekStart() ?? this.options.weekStart,
  );

  protected readonly selectedYear = computed<number | null>(() => {
    const val = this.value();
    if (val instanceof Date) return val.getFullYear();
    if (Array.isArray(val) && val.length > 0 && val[0] instanceof Date) {
      return (val[0] as Date).getFullYear();
    }
    return null;
  });

  protected readonly containerClass = computed(() =>
    cx(calendarContainerClass, 'flex-col gap-0 p-4', this.class()),
  );

  // ------------------------------------------------------------------ lifecycle

  ngOnInit(): void {
    // Determine the initial view from the value or the explicit inputs
    const val = this.value();
    let initYear = this.year();
    let initMonth = this.month();

    if (initYear === undefined || initMonth === undefined) {
      if (val instanceof Date) {
        initYear ??= val.getFullYear();
        initMonth ??= val.getMonth();
      } else if (Array.isArray(val) && val.length > 0 && val[0] instanceof Date) {
        initYear ??= (val[0] as Date).getFullYear();
        initMonth ??= (val[0] as Date).getMonth();
      } else {
        const today = new Date();
        initYear ??= today.getFullYear();
        initMonth ??= today.getMonth();
      }
    }

    this.viewedYear.set(initYear!);
    this.viewedMonth.set(initMonth!);
  }

  // ------------------------------------------------------------------ handlers

  protected toggleView(): void {
    this.view.update((v) => (v === 'month' ? 'year' : 'month'));
  }

  protected navigateMonth(delta: -1 | 1): void {
    let month = this.viewedMonth() + delta;
    let year = this.viewedYear();

    if (month < 0) {
      month = 11;
      year -= 1;
    } else if (month > 11) {
      month = 0;
      year += 1;
    }

    this.viewedYear.set(year);
    this.viewedMonth.set(month);
    this.monthChange.emit({ year, month });
  }

  protected onDayClick(day: Date): void {
    this.dayClick.emit(day);
  }

  protected onYearClick(year: number): void {
    this.viewedYear.set(year);
    this.view.set('month');
    this.monthChange.emit({ year, month: this.viewedMonth() });
  }
}
