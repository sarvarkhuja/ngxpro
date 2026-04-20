import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputDateComponent } from '@nxp/components/input-date';
import type {
  DisabledHandler,
  MarkerHandler,
} from '@nxp/components/calendar';

@Component({
  selector: 'app-input-date-demo',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, InputDateComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div class="max-w-4xl mx-auto space-y-16">
        <!-- Page header -->
        <div>
          <a routerLink="/" class="text-sm text-blue-500 hover:underline"
            >← Back to home</a
          >
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Input Date
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Text input with an inline calendar dropdown. Supports keyboard date
            entry (MM/DD/YYYY, MM-DD-YYYY, YYYY-MM-DD), min/max bounds, disabled
            dates, markers, and Angular forms.
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
                Click the input to open the calendar or type a date directly.
              </p>
              <nxp-input-date
                [value]="basicDate()"
                (valueChange)="basicDate.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  basicDate() ? basicDate()!.toLocaleDateString() : 'null'
                }}</code>
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
              <nxp-input-date [(ngModel)]="ngModelDate" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                ngModel:
                <code class="font-mono">{{
                  ngModelDate ? ngModelDate.toLocaleDateString() : 'null'
                }}</code>
              </p>
            </div>

            <!-- Reactive form -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Reactive FormControl
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Works with
                <code class="font-mono text-xs">FormControl&lt;Date&gt;</code>.
              </p>
              <nxp-input-date [formControl]="dateControl" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Control:
                <code class="font-mono">{{
                  dateControl.value
                    ? dateControl.value.toLocaleDateString()
                    : 'null'
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
                Only dates within ±7 days of today are selectable.
              </p>
              <nxp-input-date
                [value]="boundedDate()"
                [min]="minDate"
                [max]="maxDate"
                (valueChange)="boundedDate.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  boundedDate()
                    ? boundedDate()!.toLocaleDateString()
                    : 'null'
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
              <nxp-input-date
                [value]="weekdayDate()"
                [disabledHandler]="isWeekend"
                (valueChange)="weekdayDate.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  weekdayDate()
                    ? weekdayDate()!.toLocaleDateString()
                    : 'null'
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
              <nxp-input-date
                [value]="basicDate()"
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
            <!-- Markers -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Event markers
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Coloured dots highlight dates with events. 5th = amber, 10th =
                green, 15th = blue + red.
              </p>
              <nxp-input-date
                [value]="markerDate()"
                [markerHandler]="markerFn"
                (valueChange)="markerDate.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  markerDate()
                    ? markerDate()!.toLocaleDateString()
                    : 'null'
                }}</code>
              </p>
            </div>

            <!-- Week start Sunday -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Week starts on Sunday
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <code class="font-mono text-xs">[weekStart]="0"</code>
                changes the first column to Sunday.
              </p>
              <nxp-input-date
                [value]="sundayDate()"
                [weekStart]="0"
                (valueChange)="sundayDate.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  sundayDate()
                    ? sundayDate()!.toLocaleDateString()
                    : 'null'
                }}</code>
              </p>
            </div>

            <!-- Custom placeholder -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Custom placeholder
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Override the default placeholder text.
              </p>
              <nxp-input-date
                [value]="placeholderDate()"
                placeholder="Pick a date…"
                (valueChange)="placeholderDate.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  placeholderDate()
                    ? placeholderDate()!.toLocaleDateString()
                    : 'null'
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
                  <td class="px-4 py-2 font-mono">Date | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">Currently selected date</td>
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
                  <td class="px-4 py-2 font-mono">placeholder</td>
                  <td class="px-4 py-2 font-mono">string</td>
                  <td class="px-4 py-2 font-mono">'MM/DD/YYYY'</td>
                  <td class="px-4 py-2">Placeholder text</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">disabled</td>
                  <td class="px-4 py-2 font-mono">boolean</td>
                  <td class="px-4 py-2 font-mono">false</td>
                  <td class="px-4 py-2">Whether the input is disabled</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">weekStart</td>
                  <td class="px-4 py-2 font-mono">0–6</td>
                  <td class="px-4 py-2 font-mono">1 (Mon)</td>
                  <td class="px-4 py-2">First day of week (0 = Sun)</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">disabledHandler</td>
                  <td class="px-4 py-2 font-mono">DisabledHandler | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">Callback to disable individual dates</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">markerHandler</td>
                  <td class="px-4 py-2 font-mono">MarkerHandler | null</td>
                  <td class="px-4 py-2 font-mono">null</td>
                  <td class="px-4 py-2">Callback to add dot markers</td>
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
                  <td class="px-4 py-2 font-mono">Date | null</td>
                  <td class="px-4 py-2">
                    Emitted when the selected date changes
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
export class InputDateDemoComponent {
  readonly basicDate = signal<Date | null>(null);
  ngModelDate: Date | null = null;
  readonly dateControl = new FormControl<Date | null>(null);

  readonly boundedDate = signal<Date | null>(null);
  readonly weekdayDate = signal<Date | null>(null);
  readonly markerDate = signal<Date | null>(null);
  readonly sundayDate = signal<Date | null>(null);
  readonly placeholderDate = signal<Date | null>(null);

  readonly minDate = new Date(Date.now() - 7 * 86_400_000);
  readonly maxDate = new Date(Date.now() + 7 * 86_400_000);

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
}
