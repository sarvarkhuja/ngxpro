import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from 'libs/cdk/src/lib/components/calendar/src';
import type {
  DisabledHandler,
  MarkerHandler,
} from 'libs/cdk/src/lib/components/calendar/src';

/**
 * Showcase demo for the CalendarComponent.
 *
 * Demonstrates:
 *  1. Single-date selection
 *  2. Range-mode selection
 *  3. Disabled dates (weekends)
 *  4. Dot markers on specific dates
 *  5. Min / Max bounds
 */
@Component({
  selector: 'app-calendar-demo',
  standalone: true,
  imports: [CalendarComponent, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div class="max-w-5xl mx-auto space-y-12">
        <!-- Header -->
        <div>
          <a routerLink="/" class="text-sm text-blue-500 hover:underline"
            >← Back to home</a
          >
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Full-featured calendar with single, range, and multi-date selection.
          </p>
        </div>

        <!-- Grid of demos -->
        <div class="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
          <!-- 1. Single date selection -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Single date
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Click any day to select it.
            </p>
            <nxp-calendar
              [value]="singleValue()"
              (dayClick)="singleValue.set($event)"
            />
            @if (singleValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Selected:
                <strong>{{ singleValue()!.toLocaleDateString() }}</strong>
              </p>
            }
          </section>

          <!-- 2. Range selection -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Range selection
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Click start then end date.
            </p>
            <nxp-calendar
              [rangeMode]="true"
              [value]="rangeValue()"
              (dayClick)="onRangeClick($event)"
            />
            @if (rangeValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                @if (rangeValue()!.length === 2) {
                  From
                  <strong>{{ rangeValue()![0].toLocaleDateString() }}</strong>
                  to
                  <strong>{{ rangeValue()![1]?.toLocaleDateString() }}</strong>
                } @else {
                  Start:
                  <strong>{{ rangeValue()![0].toLocaleDateString() }}</strong> —
                  pick end date
                }
              </p>
            }
            @if (rangeValue()) {
              <button
                class="text-xs text-red-500 hover:underline"
                (click)="clearRange()"
              >
                Clear range
              </button>
            }
          </section>

          <!-- 3. Disabled weekends -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Disabled weekends
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Saturdays and Sundays are not selectable.
            </p>
            <nxp-calendar
              [value]="disabledValue()"
              [disabledHandler]="isWeekend"
              (dayClick)="disabledValue.set($event)"
            />
            @if (disabledValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Selected:
                <strong>{{ disabledValue()!.toLocaleDateString() }}</strong>
              </p>
            }
          </section>

          <!-- 4. Dot markers -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Event markers
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Coloured dots highlight dates with events.
            </p>
            <nxp-calendar
              [value]="markerValue()"
              [markerHandler]="markerFn"
              (dayClick)="markerValue.set($event)"
            />
          </section>

          <!-- 5. Min / Max bounds -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Min / Max bounds
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Only dates within ±7 days of today are selectable.
            </p>
            <nxp-calendar
              [value]="boundedValue()"
              [min]="minDate"
              [max]="maxDate"
              (dayClick)="boundedValue.set($event)"
            />
            @if (boundedValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Selected:
                <strong>{{ boundedValue()!.toLocaleDateString() }}</strong>
              </p>
            }
          </section>

          <!-- 6. No adjacent month days -->
          <section class="space-y-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hide adjacent days
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Days outside the current month are hidden.
            </p>
            <nxp-calendar
              [value]="adjacentValue()"
              [showAdjacent]="false"
              (dayClick)="adjacentValue.set($event)"
            />
          </section>
        </div>
      </div>
    </div>
  `,
})
export class CalendarDemoComponent {
  // 1. Single
  readonly singleValue = signal<Date | null>(null);

  // 2. Range
  readonly rangeValue = signal<[Date, Date] | [Date] | null>(null);

  onRangeClick(day: Date): void {
    const current = this.rangeValue();
    if (!current || current.length === 2) {
      // Start a new range
      this.rangeValue.set([day]);
    } else {
      const [start] = current;
      if (day < start) {
        this.rangeValue.set([day, start]);
      } else {
        this.rangeValue.set([start, day]);
      }
    }
  }

  clearRange(): void {
    this.rangeValue.set(null);
  }

  // 3. Disabled weekends
  readonly disabledValue = signal<Date | null>(null);
  readonly isWeekend: DisabledHandler = (date: Date) => {
    const dow = date.getDay();
    return dow === 0 || dow === 6;
  };

  // 4. Markers
  readonly markerValue = signal<Date | null>(null);
  readonly markerFn: MarkerHandler = (
    date: Date,
  ): [] | [string] | [string, string] => {
    // Mark every 5th, 10th, 15th, 20th with coloured dots
    const d = date.getDate();
    if (d % 15 === 0) return ['#3b82f6', '#ef4444'];
    if (d % 10 === 0) return ['#10b981'];
    if (d % 5 === 0) return ['#f59e0b'];
    return [];
  };

  // 5. Bounded
  readonly boundedValue = signal<Date | null>(null);
  readonly minDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  })();
  readonly maxDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  })();

  // 6. Adjacent
  readonly adjacentValue = signal<Date | null>(null);
}
