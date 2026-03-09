import { DecimalPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputMonthComponent } from '@nxp/components/input-month';
import type { MonthCoord } from '@nxp/components/calendar-month';

@Component({
  selector: 'app-input-month-demo',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputMonthComponent,
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
            Input Month
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Month picker input with a calendar-month dropdown. The input is
            read-only — the user selects a month from the grid. Displays the
            value as "Month YYYY" (e.g. "March 2026").
          </p>
        </div>

        <!-- Section: Basic usage -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Basic usage
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <!-- Signal binding -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Signal binding
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Click to open the month grid and select a month.
              </p>
              <nxp-input-month
                [value]="basicMonth()"
                (valueChange)="basicMonth.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{ formatCoord(basicMonth()) }}</code>
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
              <nxp-input-month [(ngModel)]="ngModelMonth" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                ngModel:
                <code class="font-mono">{{ formatCoord(ngModelMonth) }}</code>
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
                  >FormControl&lt;MonthCoord&gt;</code
                >.
              </p>
              <nxp-input-month [formControl]="monthControl" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Control:
                <code class="font-mono">{{
                  formatCoord(monthControl.value)
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

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <!-- Min / Max bounds -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Min / Max bounds
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Limited to Jan 2025 – Dec 2026. Months outside this range are
                greyed out.
              </p>
              <nxp-input-month
                [value]="boundedMonth()"
                [min]="minMonth"
                [max]="maxMonth"
                (valueChange)="boundedMonth.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  formatCoord(boundedMonth())
                }}</code>
              </p>
            </div>

            <!-- Disabled handler -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Disabled months
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                A custom
                <code class="font-mono text-xs">disabledHandler</code>
                prevents Q1 months (Jan–Mar) from being selected.
              </p>
              <nxp-input-month
                [value]="disabledMonth()"
                [disabledHandler]="isQ1"
                (valueChange)="disabledMonth.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  formatCoord(disabledMonth())
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
              <nxp-input-month
                [value]="basicMonth()"
                [disabled]="true"
                placeholder="Disabled"
              />
            </div>
          </div>
        </section>

        <!-- Section: Customization -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Customization
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <!-- Custom placeholder -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Custom placeholder
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Override the default "Month YYYY" placeholder.
              </p>
              <nxp-input-month
                [value]="placeholderMonth()"
                placeholder="Select billing period…"
                (valueChange)="placeholderMonth.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  formatCoord(placeholderMonth())
                }}</code>
              </p>
            </div>

            <!-- Pre-selected value -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Pre-selected value
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Initial value set to the current month.
              </p>
              <nxp-input-month
                [value]="preselectedMonth()"
                (valueChange)="preselectedMonth.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  formatCoord(preselectedMonth())
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
                  <td class="px-4 py-2 font-mono">MonthCoord | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">
                    Currently selected month
                    (<code class="font-mono text-xs"
                      >{{ '{' }} year, month {{ '}' }}</code
                    >)
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">min</td>
                  <td class="px-4 py-2 font-mono">MonthCoord | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">
                    Minimum selectable month (inclusive)
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">max</td>
                  <td class="px-4 py-2 font-mono">MonthCoord | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">
                    Maximum selectable month (inclusive)
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">placeholder</td>
                  <td class="px-4 py-2 font-mono">string</td>
                  <td class="px-4 py-2 font-mono">'Month YYYY'</td>
                  <td class="px-4 py-2">Placeholder text</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">disabled</td>
                  <td class="px-4 py-2 font-mono">boolean</td>
                  <td class="px-4 py-2 font-mono">false</td>
                  <td class="px-4 py-2">Whether the input is disabled</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">rangeMode</td>
                  <td class="px-4 py-2 font-mono">boolean</td>
                  <td class="px-4 py-2 font-mono">false</td>
                  <td class="px-4 py-2">
                    Enable month-range selection in dropdown
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">disabledHandler</td>
                  <td class="px-4 py-2 font-mono">
                    (m: MonthCoord) =&gt; boolean
                  </td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">
                    Callback to disable individual months
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
                  <td class="px-4 py-2 font-mono">MonthCoord | null</td>
                  <td class="px-4 py-2">
                    Emitted when the selected month changes
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
export class InputMonthDemoComponent {
  private readonly now = new Date();

  readonly basicMonth = signal<MonthCoord | null>(null);
  ngModelMonth: MonthCoord | null = null;
  readonly monthControl = new FormControl<MonthCoord | null>(null);

  readonly boundedMonth = signal<MonthCoord | null>(null);
  readonly disabledMonth = signal<MonthCoord | null>(null);
  readonly placeholderMonth = signal<MonthCoord | null>(null);
  readonly preselectedMonth = signal<MonthCoord | null>({
    year: this.now.getFullYear(),
    month: this.now.getMonth(),
  });

  readonly minMonth: MonthCoord = { year: 2025, month: 0 };
  readonly maxMonth: MonthCoord = { year: 2026, month: 11 };

  readonly isQ1 = (m: MonthCoord): boolean => m.month <= 2;

  formatCoord(m: MonthCoord | null | undefined): string {
    if (!m) return 'null';
    const names = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${names[m.month]} ${m.year}`;
  }
}
