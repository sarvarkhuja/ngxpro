import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpInputChipComponent } from '@nxp/components/input-chip';
import { NxpLabelDirective } from '@nxp/cdk/components/label';

@Component({
  selector: 'app-input-chip-demo',
  standalone: true,
  imports: [
    JsonPipe,
    RouterModule,
    ReactiveFormsModule,
    NxpLabelDirective,
    NxpInputChipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto space-y-10">

        <div>
          <a
            routerLink="/"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            &larr; Back to home
          </a>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Input Chip</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nxp-input-chip</code>
            — type or paste values, split by separator (e.g. comma). Chips are removable and editable (double-click). Backspace on empty input removes last chip.
          </p>
        </div>

        <!-- Basic -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Basic (comma separator, unique)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Type text and press Enter or comma to add chips. Duplicates are ignored when unique is true.
          </p>
          <div class="max-w-md">
            <label nxpLabel>Tags</label>
            <nxp-input-chip
              class="mt-1.5 w-full min-w-0"
              [formControl]="tagsCtrl"
              placeholder="Add tags..."
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Value: {{ tagsCtrl.value | json }}
            </p>
          </div>
        </section>

        <!-- Space separator -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Space separator</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">[separator]="' '"</code>
            — type multiple words and press Enter.
          </p>
          <div class="max-w-md">
            <label nxpLabel>Keywords</label>
            <nxp-input-chip
              class="mt-1.5 w-full min-w-0"
              [formControl]="keywordsCtrl"
              placeholder="Type words separated by space"
              [separator]="' '"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Value: {{ keywordsCtrl.value | json }}
            </p>
          </div>
        </section>

        <!-- Chip sizes -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Chip sizes</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">chipSize</code>
            xs, s, m.
          </p>
          <div class="max-w-md space-y-4">
            <label nxpLabel>Size xs</label>
            <nxp-input-chip
              class="mt-1.5 w-full min-w-0"
              [formControl]="sizeXsCtrl"
              placeholder="xs chips"
              chipSize="xs"
            />
            <label nxpLabel class="block mt-4">Size s (default)</label>
            <nxp-input-chip
              class="mt-1.5 w-full min-w-0"
              [formControl]="sizeSCtrl"
              placeholder="s chips"
              chipSize="s"
            />
            <label nxpLabel class="block mt-4">Size m</label>
            <nxp-input-chip
              class="mt-1.5 w-full min-w-0"
              [formControl]="sizeMCtrl"
              placeholder="m chips"
              chipSize="m"
            />
          </div>
        </section>

        <!-- Allow duplicates -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Allow duplicates</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">[unique]="false"</code>
            — same value can appear multiple times.
          </p>
          <div class="max-w-md">
            <label nxpLabel>Items (duplicates allowed)</label>
            <nxp-input-chip
              class="mt-1.5 w-full min-w-0"
              [formControl]="dupesCtrl"
              placeholder="Add items..."
              [unique]="false"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Value: {{ dupesCtrl.value | json }}
            </p>
          </div>
        </section>

        <!-- Disabled -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Disabled</h2>
          <div class="max-w-md">
            <label nxpLabel>Tags</label>
            <nxp-input-chip
              class="mt-1.5 w-full min-w-0"
              [formControl]="disabledCtrl"
              placeholder="Disabled"
            />
          </div>
        </section>

      </div>
    </div>
  `,
})
export class InputChipDemoComponent {
  readonly tagsCtrl = new FormControl<string[]>(['alpha', 'beta']);
  readonly keywordsCtrl = new FormControl<string[]>([]);
  readonly sizeXsCtrl = new FormControl<string[]>([]);
  readonly sizeSCtrl = new FormControl<string[]>([]);
  readonly sizeMCtrl = new FormControl<string[]>([]);
  readonly dupesCtrl = new FormControl<string[]>([]);
  readonly disabledCtrl = new FormControl<string[]>({
    value: ['one', 'two'],
    disabled: true,
  });
}
