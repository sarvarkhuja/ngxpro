import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { nxpItemsHandlersProvider } from '@nxp/cdk';
import { NxpLabelDirective } from '@nxp/cdk/components/label';
import { NxpMultiSelectComponent } from '@nxp/components/multi-select';

interface Country {
  code: string;
  name: string;
}

const COUNTRIES: Country[] = [
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
];

const FRUITS = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Kiwi',
  'Lemon',
  'Mango',
  'Orange',
  'Peach',
  'Pear',
  'Plum',
  'Strawberry',
];

@Component({
  selector: 'app-multi-select-demo',
  standalone: true,
  imports: [
    JsonPipe,
    RouterModule,
    ReactiveFormsModule,
    NxpLabelDirective,
    NxpMultiSelectComponent,
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
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Multi-Select</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nxp-multi-select</code>
            — chip-based multi-value picker. Selected items appear as removable chips; click or Space/Enter opens the listbox. Toggle options with checkboxes; Backspace removes last chip.
          </p>
        </div>

        <!-- String items -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">String items</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Click or press Space / Enter / Arrow Down to open; Escape to close. Select multiple fruits.
          </p>
          <div class="max-w-md">
            <label nxpLabel>Favourite fruits</label>
            <nxp-multi-select
              class="mt-1.5 w-full min-w-0"
              [formControl]="fruitsCtrl"
              [items]="fruits"
              placeholder="Select fruits..."
              emptyLabel="No fruits"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Value: {{ fruitsCtrl.value | json }}
            </p>
          </div>
        </section>

        <!-- Object items with custom stringify -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Object items with custom stringify
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Items are
            <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">&#123; code, name &#125;</code>
            objects. Custom stringify shows the country name; identity by code.
          </p>
          <div class="max-w-md">
            <label nxpLabel>Countries</label>
            <nxp-multi-select
              class="mt-1.5 w-full min-w-0"
              [formControl]="countriesCtrl"
              [items]="countries"
              placeholder="Select countries..."
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Value: {{ countriesCtrl.value | json }}
            </p>
          </div>
        </section>

        <!-- Empty label -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Custom empty label</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">emptyLabel</code>
            is shown in the dropdown when <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">items</code> is empty.
          </p>
          <div class="max-w-md">
            <label nxpLabel>No options (empty list)</label>
            <nxp-multi-select
              class="mt-1.5 w-full min-w-0"
              [formControl]="emptyCtrl"
              [items]="[]"
              placeholder="Select..."
              emptyLabel="No options available"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Value: {{ emptyCtrl.value | json }}
            </p>
          </div>
        </section>

        <!-- Disabled -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Disabled</h2>
          <div class="max-w-md">
            <label nxpLabel>Favourite fruits</label>
            <nxp-multi-select
              class="mt-1.5 w-full min-w-0"
              [formControl]="disabledCtrl"
              [items]="fruits"
              placeholder="Disabled"
            />
          </div>
        </section>

      </div>
    </div>
  `,
  providers: [
    nxpItemsHandlersProvider<Country>({
      stringify: signal((c: Country) => c.name),
      identityMatcher: signal((a: Country, b: Country) => a.code === b.code),
    }),
  ],
})
export class MultiSelectDemoComponent {
  readonly fruits = FRUITS;
  readonly countries = COUNTRIES;

  readonly fruitsCtrl = new FormControl<string[]>(['Apple', 'Mango']);
  readonly countriesCtrl = new FormControl<Country[]>([]);
  readonly emptyCtrl = new FormControl<string[]>([]);
  readonly disabledCtrl = new FormControl<string[]>({
    value: ['Banana', 'Orange'],
    disabled: true,
  });
}
