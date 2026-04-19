import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpRangeComponent, type NxpRangeSize, type NxpKeySteps } from '@nxp/components/range';

@Component({
  selector: 'app-range-demo',
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NxpRangeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-4xl mx-auto space-y-10">
        <!-- Header -->
        <div>
          <a
            routerLink="/"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            &larr; Back to home
          </a>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Range
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Dual-thumb range slider
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxp-range</code
            >. Supports key steps, segments, constraints, and form binding.
          </p>
        </div>

        <!-- Basic range -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Basic range
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Simple 0–100 range with ngModel.
          </p>
          <nxp-range [(ngModel)]="basicValue" />
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Value: {{ basicValue | json }}
          </p>
        </section>

        <!-- Sizes -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Sizes
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Use the
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">size</code>
            input: <code>s</code>, <code>m</code> (default), <code>l</code>.
          </p>
          @for (s of sizes; track s) {
            <div class="space-y-2">
              <p
                class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
              >
                {{ s }}
              </p>
              <nxp-range [size]="s" [(ngModel)]="sizeValues[s]" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ sizeValues[s] | json }}
              </p>
            </div>
          }
        </section>

        <!-- Segments -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Segments
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Use
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded"
              >segments</code
            >
            to show tick marks on the track.
          </p>
          <nxp-range
            [segments]="5"
            [step]="20"
            [(ngModel)]="segmentedValue"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Value: {{ segmentedValue | json }}
          </p>
        </section>

        <!-- Key steps (non-linear) -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Key Steps (non-linear)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Map slider positions to non-linear domain values.
          </p>
          <nxp-range
            [keySteps]="priceKeySteps"
            [step]="1"
            [(ngModel)]="keyStepValue"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Value: {{ keyStepValue | json }} (range: 50k – 30M)
          </p>
        </section>

        <!-- Margin & limit constraints -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Constraints (margin & limit)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">margin</code>
            enforces minimum distance;
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">limit</code>
            enforces maximum distance.
          </p>
          <div class="space-y-4">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Margin = 10
              </p>
              <nxp-range
                [margin]="10"
                [(ngModel)]="marginValue"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ marginValue | json }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Limit = 50
              </p>
              <nxp-range
                [limit]="50"
                [(ngModel)]="limitValue"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ limitValue | json }}
              </p>
            </div>
          </div>
        </section>

        <!-- Reactive forms -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Reactive forms
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Bind with
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded"
              >[formControl]</code
            >.
          </p>
          <nxp-range [formControl]="rangeCtrl" />
          <p class="text-xs text-gray-500 dark:text-gray-400">
            FormControl value: {{ rangeCtrl.value | json }}
          </p>
        </section>

        <!-- Disabled -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Disabled
          </h2>
          <nxp-range
            [disabled]="true"
            [(ngModel)]="disabledValue"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ disabledValue | json }}
          </p>
        </section>
      </div>
    </div>
  `,
})
export class RangeDemoComponent {
  readonly sizes: readonly NxpRangeSize[] = ['s', 'm', 'l'];

  basicValue: [number, number] = [20, 80];

  sizeValues: Record<string, [number, number]> = {
    s: [10, 40],
    m: [25, 75],
    l: [30, 90],
  };

  segmentedValue: [number, number] = [20, 80];

  priceKeySteps: NxpKeySteps = [
    [0, 50_000],
    [25, 200_000],
    [50, 1_000_000],
    [75, 5_000_000],
    [100, 30_000_000],
  ];
  keyStepValue: [number, number] = [200_000, 5_000_000];

  marginValue: [number, number] = [20, 60];
  limitValue: [number, number] = [30, 70];
  disabledValue: [number, number] = [25, 75];

  rangeCtrl = new FormControl<[number, number]>([15, 85]);
}
