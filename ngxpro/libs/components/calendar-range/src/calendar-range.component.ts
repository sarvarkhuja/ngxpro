import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { cx } from '@nxp/cdk';
import { CalendarComponent } from '@nxp/components/calendar';
import type {
  DisabledHandler,
  MarkerHandler,
} from '@nxp/components/calendar';
import { DataListComponent, OptionDirective } from '@nxp/components/data-list';
import { calculateDisabledHandler } from './calculate-disabled-handler';
import { computeEffectiveMax, computeEffectiveMin } from './day-caps';
import { DateRangePeriod } from './date-range-period';

// ------------------------------------------------------------------ helpers

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function addMonths(date: Date, n: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

/**
 * Dual-calendar date-range picker.
 *
 * Shows two consecutive months side-by-side (desktop) or one calendar with a
 * `<nxp-data-list>` preset-period sidebar when `items` are provided.
 *
 * Keyboard behaviour:
 * - **ESC** while picking: cancels the in-progress pick and restores
 *   the previous value.
 * - **Arrow Up / Down** inside the preset sidebar: navigates between
 *   period options (provided by `<nxp-data-list>`).
 *
 * @example
 * <!-- Basic usage -->
 * <nxp-calendar-range [value]="range()" (valueChange)="range.set($event)" />
 *
 * @example
 * <!-- With preset periods sidebar (uses NxpDataList internally) -->
 * <nxp-calendar-range
 *   [items]="presets"
 *   [value]="range()"
 *   (valueChange)="range.set($event)"
 * />
 *
 * @example
 * <!-- With length constraints -->
 * <nxp-calendar-range
 *   [minLength]="3"
 *   [maxLength]="14"
 *   (valueChange)="range.set($event)"
 * />
 */
@Component({
  selector: 'nxp-calendar-range',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarComponent, DataListComponent, OptionDirective],
  template: `
    <div
      class="inline-flex rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 overflow-hidden"
      role="group"
      aria-label="Date range picker"
    >
      <!-- Left calendar -->
      <div class="p-4">
        <nxp-calendar
          [rangeMode]="true"
          [value]="displayValue()"
          [year]="leftYear()"
          [month]="leftMonthIdx()"
          [min]="effectiveMin()"
          [max]="effectiveMax()"
          [disabledHandler]="computedDisabledHandler()"
          [markerHandler]="markerHandler()"
          [showAdjacent]="false"
          [(hoveredDay)]="hoveredDay"
          (dayClick)="onDayClick($event)"
          (monthChange)="onLeftCalendarMonthChange($event)"
        />
      </div>

      <!-- Divider (shown when rendering two calendars side-by-side) -->
      @if (!items().length) {
        <div class="w-px bg-gray-200 dark:bg-gray-800 self-stretch"></div>
      }

      <!-- Right calendar (month+1) — shown only when no sidebar items -->
      @if (!items().length) {
        <div class="p-4">
          <nxp-calendar
            [rangeMode]="true"
            [value]="displayValue()"
            [year]="rightYear()"
            [month]="rightMonthIdx()"
            [min]="effectiveMin()"
            [max]="effectiveMax()"
            [disabledHandler]="computedDisabledHandler()"
            [markerHandler]="markerHandler()"
            [showAdjacent]="false"
            [(hoveredDay)]="hoveredDay"
            (dayClick)="onDayClick($event)"
            (monthChange)="onRightCalendarMonthChange($event)"
          />
        </div>
      }

      <!-- Divider before preset sidebar -->
      @if (items().length) {
        <div class="w-px bg-gray-200 dark:bg-gray-800 self-stretch"></div>
      }

      <!--
        Preset period sidebar.
        Uses <nxp-data-list> (equivalent to TuiDataList) so the list
        gains full keyboard navigation (↑ ↓ Home End) and ARIA semantics
        (role="listbox" on the container, role="option" on each button).
      -->
      @if (items().length) {
        <div class="flex flex-col justify-center p-2">
          <nxp-data-list
            label="Preset date ranges"
            [emptyLabel]="'No presets available'"
            size="sm"
            class="min-w-[8.5rem]"
          >
            @for (item of items(); track item.label) {
              <button
                nxpOption
                [selected]="isItemActive(item)"
                [attr.aria-label]="item.label"
                (click)="onItemSelect(item)"
              >
                <span class="flex-1 truncate">{{ item.label }}</span>

                <!-- Checkmark shown for the active preset -->
                @if (isItemActive(item)) {
                  <svg
                    class="ml-auto h-3.5 w-3.5 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                }
              </button>
            }
          </nxp-data-list>
        </div>
      }
    </div>
  `,
})
export class CalendarRangeComponent implements OnInit {
  // ------------------------------------------------------------------ inputs

  /** Currently selected date range. */
  readonly value = input<[Date, Date] | null>(null);

  /** Minimum selectable date. */
  readonly min = input<Date | null>(null);

  /** Maximum selectable date. */
  readonly max = input<Date | null>(null);

  /**
   * Minimum range length in days (inclusive).
   * e.g. `2` means the user must pick at least a 2-day range.
   */
  readonly minLength = input<number | null>(null);

  /**
   * Maximum range length in days (inclusive).
   * e.g. `7` means the user can pick at most a 7-day range.
   */
  readonly maxLength = input<number | null>(null);

  /** Optional handler to disable individual dates. */
  readonly disabledHandler = input<DisabledHandler | null>(null);

  /** Optional handler to add dot markers to dates. */
  readonly markerHandler = input<MarkerHandler | null>(null);

  /**
   * Named preset periods shown in the sidebar `<nxp-data-list>`.
   * When non-empty, the second calendar is replaced by the preset list.
   */
  readonly items = input<DateRangePeriod[]>([]);

  /** Whether to show days from adjacent months in each calendar sheet. */
  readonly showAdjacent = input<boolean>(false);

  // ------------------------------------------------------------------ outputs

  /** Emitted when the selected range changes (or is cleared). */
  readonly valueChange = output<[Date, Date] | null>();

  // ------------------------------------------------------------------ state

  /**
   * The first click when picking a range.
   * `null` means not currently picking.
   */
  protected readonly pickedStart = signal<Date | null>(null);

  /** Hovered day — shared across both calendars for live preview. */
  protected readonly hoveredDay = signal<Date | null>(null);

  /** Saved value before a pick starts, used for ESC-cancel. */
  protected readonly previousValue = signal<[Date, Date] | null>(null);

  /** The month shown in the LEFT calendar. Right always shows leftMonth+1. */
  protected readonly leftMonth = signal<Date>(new Date());

  /** Which preset period is currently active (if any). */
  protected readonly activeItem = signal<DateRangePeriod | null>(null);

  // ------------------------------------------------------------------ computed

  /** Value displayed in both calendars — includes in-progress pick + hover preview. */
  protected readonly displayValue = computed((): [Date, Date] | null => {
    const ps = this.pickedStart();
    if (ps) {
      const hov = this.hoveredDay();
      if (hov && !isSameDay(hov, ps)) {
        const sorted = [ps, hov].sort((a, b) => a.getTime() - b.getTime());
        return [sorted[0], sorted[1]] as [Date, Date];
      }
      // Single-day preview while waiting for second click
      return [ps, ps];
    }
    return this.value();
  });

  protected readonly leftYear = computed(() => this.leftMonth().getFullYear());
  protected readonly leftMonthIdx = computed(() => this.leftMonth().getMonth());

  /** Right calendar is always leftMonth + 1. */
  protected readonly rightYear = computed(() =>
    addMonths(this.leftMonth(), 1).getFullYear(),
  );
  protected readonly rightMonthIdx = computed(() =>
    addMonths(this.leftMonth(), 1).getMonth(),
  );

  /** Merged disabled handler: base + minLength constraint when picking. */
  protected readonly computedDisabledHandler = computed(
    (): DisabledHandler =>
      calculateDisabledHandler(
        this.disabledHandler(),
        this.pickedStart(),
        this.minLength(),
      ),
  );

  /** Effective min date (clamped by maxLength when picking). */
  protected readonly effectiveMin = computed(() =>
    computeEffectiveMin(this.min(), this.pickedStart(), this.maxLength()),
  );

  /** Effective max date (clamped by maxLength when picking). */
  protected readonly effectiveMax = computed(() =>
    computeEffectiveMax(this.max(), this.pickedStart(), this.maxLength()),
  );

  // ------------------------------------------------------------------ lifecycle

  ngOnInit(): void {
    const val = this.value();
    if (val) {
      this.leftMonth.set(new Date(val[0].getFullYear(), val[0].getMonth(), 1));
    } else {
      const today = new Date();
      this.leftMonth.set(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  }

  // ------------------------------------------------------------------ event handlers

  /** Core range-picking state machine. */
  protected onDayClick(day: Date): void {
    const ps = this.pickedStart();
    if (!ps) {
      // Start picking — save current value for potential ESC-cancel
      this.previousValue.set(this.value());
      this.activeItem.set(null);
      this.pickedStart.set(day);
    } else {
      // Finalize range — sort so start <= end
      const sorted = [ps, day].sort((a, b) => a.getTime() - b.getTime());
      this.pickedStart.set(null);
      this.hoveredDay.set(null);
      this.valueChange.emit([sorted[0], sorted[1]]);
    }
  }

  /** ESC cancels an in-progress pick and restores the previous value. */
  @HostListener('document:keydown.escape', ['$event'])
  protected onEsc(event: Event): void {
    if (!this.pickedStart()) return;
    event.stopPropagation();
    this.pickedStart.set(null);
    this.hoveredDay.set(null);
    this.valueChange.emit(this.previousValue());
  }

  /** Left calendar navigated — update leftMonth directly. */
  protected onLeftCalendarMonthChange(e: {
    year: number;
    month: number;
  }): void {
    this.leftMonth.set(new Date(e.year, e.month, 1));
  }

  /**
   * Right calendar navigated — shift leftMonth so right stays in sync.
   * Right shows leftMonth+1, so when right moves to e.year/e.month,
   * left should show that month minus 1.
   */
  protected onRightCalendarMonthChange(e: {
    year: number;
    month: number;
  }): void {
    const newRight = new Date(e.year, e.month, 1);
    this.leftMonth.set(addMonths(newRight, -1));
  }

  /** Select (or deselect) a preset period from the DataList sidebar. */
  protected onItemSelect(item: DateRangePeriod): void {
    if (this.activeItem() === item) {
      // Clicking the active item deselects it
      this.activeItem.set(null);
      this.valueChange.emit(null);
      return;
    }
    this.activeItem.set(item);
    this.pickedStart.set(null);
    const [from, to] = item.range;
    this.valueChange.emit([from, to]);
    // Scroll left calendar to show the start of the selected period
    this.leftMonth.set(new Date(from.getFullYear(), from.getMonth(), 1));
  }

  /** Whether a preset item matches the current value. */
  protected isItemActive(item: DateRangePeriod): boolean {
    if (this.activeItem() === item) return true;
    const val = this.value();
    if (!val) return false;
    return isSameDay(val[0], item.range[0]) && isSameDay(val[1], item.range[1]);
  }
}
