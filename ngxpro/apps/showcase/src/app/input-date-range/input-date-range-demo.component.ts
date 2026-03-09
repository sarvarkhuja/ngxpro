import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputDateRangeComponent } from '@nxp/components/input-date-range';
import {
  createDefaultDateRangePeriods,
  DateRangePeriod,
} from '@nxp/components/calendar-range';
import type {
  DisabledHandler,
  MarkerHandler,
} from '@nxp/components/calendar';

@Component({
  selector: 'app-input-date-range-demo',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputDateRangeComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div class="max-w-4xl mx-auto space-y-16">
        <!-- Page header -->
        <div>
          <a routerLink="/" class="text-sm text-blue-500 hover:underline"
            >← Back to home</a
          >
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Input Date Range
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Text input with a dual-calendar range dropdown. Click once for the
            start date, again for the end date. Also accepts keyboard entry in
            "MM/DD/YYYY – MM/DD/YYYY" format. Supports preset periods, length
            constraints, and Angular forms.
          </p>
        </div>

        <!-- Section: Basic usage -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Basic usage
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <!-- Signal binding -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Signal binding
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Click to open the dual-calendar, pick start then end. Or type
                directly.
              </p>
              <nxp-input-date-range
                [value]="basicRange()"
                (valueChange)="basicRange.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{ formatRange(basicRange()) }}</code>
              </p>
            </div>

            <!-- ngModel -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Two-way [(ngModel)]
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Template-driven forms with two-way binding.
              </p>
              <nxp-input-date-range [(ngModel)]="ngModelRange" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                ngModel:
                <code class="font-mono">{{ formatRange(ngModelRange) }}</code>
              </p>
            </div>

            <!-- Reactive form -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Reactive FormControl
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Works with
                <code class="font-mono text-xs"
                  >FormControl&lt;[Date, Date]&gt;</code
                >.
              </p>
              <nxp-input-date-range [formControl]="rangeControl" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Control:
                <code class="font-mono">{{
                  formatRange(rangeControl.value)
                }}</code>
              </p>
            </div>

            <!-- Disabled state -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Disabled state
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                The input is non-interactive when disabled.
              </p>
              <nxp-input-date-range
                [value]="basicRange()"
                [disabled]="true"
                placeholder="Disabled"
              />
            </div>
          </div>
        </section>

        <!-- Section: Preset periods -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Preset periods
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <!-- Default presets -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Default presets sidebar
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Built-in presets (Today, Yesterday, This week, This month, Last
                month, All time) shown in a sidebar for quick selection.
              </p>
              <nxp-input-date-range
                [value]="presetRange()"
                [items]="defaultPeriods"
                (valueChange)="presetRange.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{ formatRange(presetRange()) }}</code>
              </p>
            </div>

            <!-- Custom presets -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Custom presets
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Define your own named periods: "Next 7 days", "Next 30 days",
                "Next 90 days".
              </p>
              <nxp-input-date-range
                [value]="customPresetRange()"
                [items]="customPeriods"
                (valueChange)="customPresetRange.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  formatRange(customPresetRange())
                }}</code>
              </p>
            </div>
          </div>
        </section>

        <!-- Section: Constraints -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Constraints
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <!-- Min / Max bounds -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Min / Max bounds
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Only dates within ±30 days of today are selectable.
              </p>
              <nxp-input-date-range
                [value]="boundedRange()"
                [min]="minDate"
                [max]="maxDate"
                (valueChange)="boundedRange.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  formatRange(boundedRange())
                }}</code>
              </p>
            </div>

            <!-- Length constraints -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Length constraints
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Minimum 3 days, maximum 14 days. Days that would violate the
                constraint are greyed out.
              </p>
              <nxp-input-date-range
                [value]="constrainedRange()"
                [minLength]="3"
                [maxLength]="14"
                (valueChange)="constrainedRange.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  formatRange(constrainedRange())
                }}</code>
              </p>
            </div>

            <!-- Disabled weekends -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Disabled weekends
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                A custom
                <code class="font-mono text-xs">disabledHandler</code>
                prevents selection of Saturdays and Sundays.
              </p>
              <nxp-input-date-range
                [value]="weekdayRange()"
                [disabledHandler]="isWeekend"
                (valueChange)="weekdayRange.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  formatRange(weekdayRange())
                }}</code>
              </p>
            </div>

            <!-- Markers -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Event markers
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Coloured dots on the 5th, 10th, and 15th of each month.
              </p>
              <nxp-input-date-range
                [value]="markerRange()"
                [markerHandler]="markerFn"
                (valueChange)="markerRange.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  formatRange(markerRange())
                }}</code>
              </p>
            </div>
          </div>
        </section>

        <!-- Section: API reference -->
        <section class="space-y-6">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            API reference
          </h2>

          <div class="overflow-x-auto">
            <table
              class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300"
            >
              <thead
                class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <tr>
                  <th class="px-4 py-2">Input</th>
                  <th class="px-4 py-2">Type</th>
                  <th class="px-4 py-2">Default</th>
                  <th class="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-2 font-mono">value</td>
                  <td class="px-4 py-2 font-mono">[Date, Date] | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">Currently selected date range</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">min</td>
                  <td class="px-4 py-2 font-mono">Date | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">Minimum selectable date</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">max</td>
                  <td class="px-4 py-2 font-mono">Date | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">Maximum selectable date</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">minLength</td>
                  <td class="px-4 py-2 font-mono">number | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">
                    Minimum range length in days (inclusive)
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">maxLength</td>
                  <td class="px-4 py-2 font-mono">number | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">
                    Maximum range length in days (inclusive)
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">placeholder</td>
                  <td class="px-4 py-2 font-mono">string</td>
                  <td class="px-4 py-2 font-mono">
                    'MM/DD/YYYY – MM/DD/YYYY'
                  </td>
                  <td class="px-4 py-2">Placeholder text</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">disabled</td>
                  <td class="px-4 py-2 font-mono">boolean</td>
                  <td class="px-4 py-2 font-mono">false</td>
                  <td class="px-4 py-2">Whether the input is disabled</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">disabledHandler</td>
                  <td class="px-4 py-2 font-mono">DisabledHandler | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">
                    Callback to disable individual dates
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">markerHandler</td>
                  <td class="px-4 py-2 font-mono">MarkerHandler | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">Callback to add dot markers</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">items</td>
                  <td class="px-4 py-2 font-mono">DateRangePeriod[]</td>
                  <td class="px-4 py-2 font-mono">[]</td>
                  <td class="px-4 py-2">
                    Named preset periods shown in sidebar
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="overflow-x-auto mt-4">
            <table
              class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300"
            >
              <thead
                class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <tr>
                  <th class="px-4 py-2">Output</th>
                  <th class="px-4 py-2">Type</th>
                  <th class="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-2 font-mono">valueChange</td>
                  <td class="px-4 py-2 font-mono">[Date, Date] | null</td>
                  <td class="px-4 py-2">
                    Emitted when the selected range changes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class InputDateRangeDemoComponent {
  private static readonly DAY_MS = 86_400_000;

  readonly basicRange = signal<[Date, Date] | null>(null);
  ngModelRange: [Date, Date] | null = null;
  readonly rangeControl = new FormControl<[Date, Date] | null>(null);

  readonly presetRange = signal<[Date, Date] | null>(null);
  readonly customPresetRange = signal<[Date, Date] | null>(null);
  readonly boundedRange = signal<[Date, Date] | null>(null);
  readonly constrainedRange = signal<[Date, Date] | null>(null);
  readonly weekdayRange = signal<[Date, Date] | null>(null);
  readonly markerRange = signal<[Date, Date] | null>(null);

  readonly defaultPeriods = createDefaultDateRangePeriods();

  readonly customPeriods: DateRangePeriod[] = (() => {
    const today = new Date();
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const d = InputDateRangeDemoComponent.DAY_MS;
    return [
      new DateRangePeriod(
        [start, new Date(start.getTime() + 7 * d)],
        'Next 7 days',
      ),
      new DateRangePeriod(
        [start, new Date(start.getTime() + 30 * d)],
        'Next 30 days',
      ),
      new DateRangePeriod(
        [start, new Date(start.getTime() + 90 * d)],
        'Next 90 days',
      ),
    ];
  })();

  readonly minDate = new Date(
    Date.now() - 30 * InputDateRangeDemoComponent.DAY_MS,
  );
  readonly maxDate = new Date(
    Date.now() + 30 * InputDateRangeDemoComponent.DAY_MS,
  );

  readonly isWeekend: DisabledHandler = (date: Date) => {
    const dow = date.getDay();
    return dow === 0 || dow === 6;
  };

  readonly markerFn: MarkerHandler = (
    date: Date,
  ): [] | [string] | [string, string] => {
    const d = date.getDate();
    if (d % 15 === 0) return ['#3b82f6', '#ef4444'];
    if (d % 10 === 0) return ['#10b981'];
    if (d % 5 === 0) return ['#f59e0b'];
    return [];
  };

  formatRange(range: [Date, Date] | null | undefined): string {
    if (!range) return 'null';
    return `${range[0].toLocaleDateString()} – ${range[1].toLocaleDateString()}`;
  }
}
