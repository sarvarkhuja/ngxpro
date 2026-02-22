import { DecimalPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputDateComponent } from '@nxp/components/input-date';
import { InputDateRangeComponent } from '@nxp/components/input-date-range';
import { InputMonthComponent } from '@nxp/components/input-month';
import {
  createDefaultDateRangePeriods,
} from '@nxp/components/calendar-range';
import type { MonthCoord } from '@nxp/components/calendar-month';

/**
 * Showcase demo for the three date input components:
 *  - InputDateComponent        (`nxp-input-date`)
 *  - InputDateRangeComponent   (`nxp-input-date-range`)
 *  - InputMonthComponent       (`nxp-input-month`)
 */
@Component({
  selector: 'app-date-inputs-demo',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputDateComponent,
    InputDateRangeComponent,
    InputMonthComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div class="max-w-4xl mx-auto space-y-16">

        <!-- Page header -->
        <div>
          <a routerLink="/" class="text-sm text-blue-500 hover:underline">← Back to home</a>
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Date Inputs</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Text inputs with calendar dropdowns. All support keyboard date entry
            and Angular reactive/template-driven forms.
          </p>
        </div>

        <!-- ================================================================
             Section 1: InputDate
        ================================================================ -->
        <section class="space-y-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
            nxp-input-date
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

            <!-- 1a. Standalone signal -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">Signal binding</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Click to open calendar or type directly (MM/DD/YYYY).
              </p>
              <nxp-input-date
                [value]="singleDate()"
                (valueChange)="singleDate.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value: <code class="font-mono">{{ singleDate() ? singleDate()!.toLocaleDateString() : 'null' }}</code>
              </p>
            </div>

            <!-- 1b. ngModel -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">With [(ngModel)]</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Two-way binding via template-driven forms.
              </p>
              <nxp-input-date [(ngModel)]="ngModelDate" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                ngModel: <code class="font-mono">{{ ngModelDate ? ngModelDate.toLocaleDateString() : 'null' }}</code>
              </p>
            </div>

            <!-- 1c. Reactive form -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">Reactive form</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Works with <code class="font-mono text-xs">FormControl</code>.
              </p>
              <nxp-input-date [formControl]="dateControl" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Control: <code class="font-mono">{{ dateControl.value ? dateControl.value.toLocaleDateString() : 'null' }}</code>
              </p>
            </div>

            <!-- 1d. Min / Max bounds -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">Min / Max bounds</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Only dates within ±7 days of today are selectable.
              </p>
              <nxp-input-date
                [value]="boundedDate()"
                [min]="minDate"
                [max]="maxDate"
                (valueChange)="boundedDate.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value: <code class="font-mono">{{ boundedDate() ? boundedDate()!.toLocaleDateString() : 'null' }}</code>
              </p>
            </div>

            <!-- 1e. Disabled -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">Disabled state</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                The input is non-interactive when disabled.
              </p>
              <nxp-input-date
                [value]="singleDate()"
                [disabled]="true"
                placeholder="Disabled input"
              />
            </div>

          </div>
        </section>

        <!-- ================================================================
             Section 2: InputDateRange
        ================================================================ -->
        <section class="space-y-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
            nxp-input-date-range
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">

            <!-- 2a. Basic -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">Basic range picker</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Click once for start, again for end. Or type "MM/DD/YYYY – MM/DD/YYYY".
              </p>
              <nxp-input-date-range
                [value]="range()"
                (valueChange)="range.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                @if (range()) {
                  Range: <code class="font-mono">{{ range()![0].toLocaleDateString() }} – {{ range()![1].toLocaleDateString() }}</code>
                } @else {
                  Range: <code class="font-mono">null</code>
                }
              </p>
            </div>

            <!-- 2b. With preset periods -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">With preset periods sidebar</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Predefined ranges shown in a sidebar for quick selection.
              </p>
              <nxp-input-date-range
                [value]="rangeWithPresets()"
                [items]="defaultPeriods"
                (valueChange)="rangeWithPresets.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                @if (rangeWithPresets()) {
                  Range: <code class="font-mono">{{ rangeWithPresets()![0].toLocaleDateString() }} – {{ rangeWithPresets()![1].toLocaleDateString() }}</code>
                } @else {
                  Range: <code class="font-mono">null</code>
                }
              </p>
            </div>

            <!-- 2c. Min / Max length constraint -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">Length constraints</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Minimum 3 days, maximum 14 days allowed.
              </p>
              <nxp-input-date-range
                [value]="constrainedRange()"
                [minLength]="3"
                [maxLength]="14"
                (valueChange)="constrainedRange.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                @if (constrainedRange()) {
                  Range: <code class="font-mono">{{ constrainedRange()![0].toLocaleDateString() }} – {{ constrainedRange()![1].toLocaleDateString() }}</code>
                } @else {
                  Range: <code class="font-mono">null</code>
                }
              </p>
            </div>

            <!-- 2d. Reactive form -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">Reactive form</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Works with <code class="font-mono text-xs">FormControl</code>.
              </p>
              <nxp-input-date-range [formControl]="rangeControl" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                @if (rangeControl.value) {
                  Control: <code class="font-mono">{{ rangeControl.value[0].toLocaleDateString() }} – {{ rangeControl.value[1].toLocaleDateString() }}</code>
                } @else {
                  Control: <code class="font-mono">null</code>
                }
              </p>
            </div>

          </div>
        </section>

        <!-- ================================================================
             Section 3: InputMonth
        ================================================================ -->
        <section class="space-y-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
            nxp-input-month
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

            <!-- 3a. Basic -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">Single month picker</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Click to open the month grid and select a month.
              </p>
              <nxp-input-month
                [value]="selectedMonth()"
                (valueChange)="selectedMonth.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                @if (selectedMonth()) {
                  Value: <code class="font-mono">{{ selectedMonth()!.year }}-{{ selectedMonth()!.month + 1 | number:'2.0-0' }}</code>
                } @else {
                  Value: <code class="font-mono">null</code>
                }
              </p>
            </div>

            <!-- 3b. ngModel -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">With [(ngModel)]</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Two-way binding via template-driven forms.
              </p>
              <nxp-input-month [(ngModel)]="ngModelMonth" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                @if (ngModelMonth) {
                  ngModel: <code class="font-mono">{{ ngModelMonth.year }}-{{ ngModelMonth.month + 1 | number:'2.0-0' }}</code>
                } @else {
                  ngModel: <code class="font-mono">null</code>
                }
              </p>
            </div>

            <!-- 3c. Min / Max bounds -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">Min / Max bounds</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Limited to months within 2024–2025.
              </p>
              <nxp-input-month
                [value]="boundedMonth()"
                [min]="minMonth"
                [max]="maxMonth"
                (valueChange)="boundedMonth.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                @if (boundedMonth()) {
                  Value: <code class="font-mono">{{ boundedMonth()!.year }}-{{ boundedMonth()!.month + 1 | number:'2.0-0' }}</code>
                } @else {
                  Value: <code class="font-mono">null</code>
                }
              </p>
            </div>

            <!-- 3d. Disabled -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">Disabled state</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                The input is non-interactive when disabled.
              </p>
              <nxp-input-month
                [value]="selectedMonth()"
                [disabled]="true"
                placeholder="Disabled"
              />
            </div>

          </div>
        </section>

      </div>
    </div>
  `,
})
export class DateInputsDemoComponent {
  // ---- InputDate state ----
  readonly singleDate = signal<Date | null>(null);
  ngModelDate: Date | null = null;
  readonly dateControl = new FormControl<Date | null>(null);
  readonly boundedDate = signal<Date | null>(null);

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

  // ---- InputDateRange state ----
  readonly range = signal<[Date, Date] | null>(null);
  readonly rangeWithPresets = signal<[Date, Date] | null>(null);
  readonly constrainedRange = signal<[Date, Date] | null>(null);
  readonly rangeControl = new FormControl<[Date, Date] | null>(null);

  readonly defaultPeriods = createDefaultDateRangePeriods();

  // ---- InputMonth state ----
  readonly selectedMonth = signal<MonthCoord | null>(null);
  ngModelMonth: MonthCoord | null = null;
  readonly boundedMonth = signal<MonthCoord | null>(null);

  readonly minMonth: MonthCoord = { year: 2024, month: 0 };   // Jan 2024
  readonly maxMonth: MonthCoord = { year: 2025, month: 11 };  // Dec 2025
}
