import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalendarMonthComponent } from '@nxp/components/calendar-month';
import type { CalendarMonthValue, MonthCoord, MonthRange } from '@nxp/components/calendar-month';

const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatMonth(m: MonthCoord): string {
  return `${MONTH_LABELS[m.month]} ${m.year}`;
}

/**
 * Showcase demo for CalendarMonthComponent.
 *
 * Demonstrates:
 *  1. Single month selection
 *  2. Range selection with hover preview
 *  3. Min / max bounds
 *  4. MinLength / maxLength constraints
 *  5. Disabled specific months
 */
@Component({
  selector: 'app-calendar-month-demo',
  standalone: true,
  imports: [CalendarMonthComponent, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div class="max-w-5xl mx-auto space-y-12">

        <!-- Header -->
        <div>
          <a routerLink="/" class="text-sm text-blue-500 hover:underline">← Back to home</a>
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Calendar Month</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Month picker with single, range, and constrained selection modes.
          </p>
        </div>

        <!-- Demo grid -->
        <div class="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">

          <!-- 1. Single month selection -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Single month</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Click any month cell to select it.</p>
            <nxp-calendar-month
              [value]="singleValue()"
              (monthClick)="singleValue.set($event)"
            />
            @if (singleValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Selected: <strong>{{ formatMonth(singleValue()!) }}</strong>
              </p>
            }
          </section>

          <!-- 2. Range selection -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Range selection</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Click start month, then hover and click end month.</p>
            <nxp-calendar-month
              [rangeMode]="true"
              [value]="rangeValue()"
              (monthClick)="onRangeClick($event)"
            />
            @if (rangeValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                @if (isMonthRange(rangeValue()!)) {
                  From <strong>{{ formatMonth(asRange(rangeValue()!).from) }}</strong>
                  to <strong>{{ formatMonth(asRange(rangeValue()!).to) }}</strong>
                } @else {
                  Start: <strong>{{ formatMonth(asCoord(rangeValue()!)) }}</strong> — pick end month
                }
              </p>
              <button
                class="text-xs text-red-500 hover:underline"
                (click)="rangeValue.set(null)"
              >Clear range</button>
            }
          </section>

          <!-- 3. Min / Max bounds -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Min / Max bounds</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Only months within ±6 months of today are selectable.
            </p>
            <nxp-calendar-month
              [value]="boundedValue()"
              [min]="minMonth"
              [max]="maxMonth"
              (monthClick)="boundedValue.set($event)"
            />
            @if (boundedValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Selected: <strong>{{ formatMonth(asCoord(boundedValue()!)) }}</strong>
              </p>
            }
          </section>

          <!-- 4. Range with minLength / maxLength -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Length constraints</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Range must be between 2 and 4 months (minLength=2, maxLength=4).
            </p>
            <nxp-calendar-month
              [rangeMode]="true"
              [value]="constrainedValue()"
              [minLength]="2"
              [maxLength]="4"
              (monthClick)="onConstrainedRangeClick($event)"
            />
            @if (constrainedValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                @if (isMonthRange(constrainedValue()!)) {
                  From <strong>{{ formatMonth(asRange(constrainedValue()!).from) }}</strong>
                  to <strong>{{ formatMonth(asRange(constrainedValue()!).to) }}</strong>
                } @else {
                  Start: <strong>{{ formatMonth(asCoord(constrainedValue()!)) }}</strong> — pick end month
                }
              </p>
              <button
                class="text-xs text-red-500 hover:underline"
                (click)="constrainedValue.set(null)"
              >Clear</button>
            }
          </section>

          <!-- 5. Disabled specific months (Q1 months disabled) -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Disabled months</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Q1 months (Jan–Mar) are disabled every year.
            </p>
            <nxp-calendar-month
              [value]="disabledValue()"
              [disabledHandler]="isQ1Month"
              (monthClick)="disabledValue.set($event)"
            />
            @if (disabledValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Selected: <strong>{{ formatMonth(asCoord(disabledValue()!)) }}</strong>
              </p>
            }
          </section>

          <!-- 6. Year navigation only (no value pre-set) -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Year navigation</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Click the year label to open the year picker overlay.
            </p>
            <nxp-calendar-month
              [value]="navValue()"
              (monthClick)="navValue.set($event)"
              (yearChange)="onYearChange($event)"
            />
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Viewed year: <strong class="text-gray-700 dark:text-gray-300">{{ viewedYear() }}</strong>
            </p>
          </section>

        </div>
      </div>
    </div>
  `,
})
export class CalendarMonthDemoComponent {
  protected readonly formatMonth = formatMonth;

  // 1. Single
  readonly singleValue = signal<MonthCoord | null>(null);

  // 2. Range
  readonly rangeValue = signal<CalendarMonthValue>(null);

  onRangeClick(month: MonthCoord): void {
    const current = this.rangeValue();

    if (!current) {
      // Start first end of range
      this.rangeValue.set(month);
      return;
    }

    // If it's already a full range, restart
    if (this.isMonthRange(current)) {
      this.rangeValue.set(month);
      return;
    }

    // It's a single coord — create the range
    const start = current as MonthCoord;
    const startL = start.year * 12 + start.month;
    const endL = month.year * 12 + month.month;

    if (startL <= endL) {
      this.rangeValue.set({ from: start, to: month });
    } else {
      this.rangeValue.set({ from: month, to: start });
    }
  }

  // 3. Bounded
  readonly boundedValue = signal<CalendarMonthValue>(null);
  readonly minMonth: MonthCoord = (() => {
    const now = new Date();
    let m = now.getMonth() - 6;
    let y = now.getFullYear();
    if (m < 0) { m += 12; y -= 1; }
    return { year: y, month: m };
  })();
  readonly maxMonth: MonthCoord = (() => {
    const now = new Date();
    let m = now.getMonth() + 6;
    let y = now.getFullYear();
    if (m > 11) { m -= 12; y += 1; }
    return { year: y, month: m };
  })();

  // 4. Constrained range
  readonly constrainedValue = signal<CalendarMonthValue>(null);

  onConstrainedRangeClick(month: MonthCoord): void {
    const current = this.constrainedValue();
    if (!current || this.isMonthRange(current)) {
      this.constrainedValue.set(month);
      return;
    }
    const start = current as MonthCoord;
    const startL = start.year * 12 + start.month;
    const endL = month.year * 12 + month.month;
    if (startL <= endL) {
      this.constrainedValue.set({ from: start, to: month });
    } else {
      this.constrainedValue.set({ from: month, to: start });
    }
  }

  // 5. Disabled Q1
  readonly disabledValue = signal<CalendarMonthValue>(null);
  readonly isQ1Month = (m: MonthCoord): boolean => m.month < 3;

  // 6. Year navigation
  readonly navValue = signal<CalendarMonthValue>(null);
  readonly viewedYear = signal<number>(new Date().getFullYear());

  onYearChange(year: number): void {
    this.viewedYear.set(year);
  }

  // ------------------------------------------------------------------ type helpers

  isMonthRange(v: CalendarMonthValue): v is MonthRange {
    return v != null && 'from' in v;
  }

  asRange(v: CalendarMonthValue): MonthRange {
    return v as MonthRange;
  }

  asCoord(v: CalendarMonthValue): MonthCoord {
    return v as MonthCoord;
  }
}
