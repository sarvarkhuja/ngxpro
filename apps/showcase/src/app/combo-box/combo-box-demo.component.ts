import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpDropdownContent } from '@nxp/cdk';
import { NxpInputDirective } from '@nxp/cdk/components/input';
import { NxpLabelDirective } from '@nxp/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldOptionsDirective,
} from '@nxp/cdk/components/textfield';
import { DataListComponent } from '@nxp/components/data-list';
import {
  NxpComboBoxDirective,
  NxpSelectOptionComponent,
} from '@nxp/components/combo-box';

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Brazil',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Egypt',
  'France',
  'Germany',
  'India',
  'Italy',
  'Japan',
  'Mexico',
  'Netherlands',
  'Spain',
  'Switzerland',
  'United Kingdom',
  'United States',
] as const;

@Component({
  selector: 'app-combo-box-demo',
  standalone: true,
  imports: [
    JsonPipe,
    RouterModule,
    ReactiveFormsModule,
    NxpTextfieldOptionsDirective,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    NxpComboBoxDirective,
    NxpSelectOptionComponent,
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
            Combo Box
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >input[nxpComboBox]</code
            >
            inside
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxp-textfield</code
            >
            — searchable dropdown with
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxp-data-list</code
            >
            and
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxp-select-option</code
            >. Filters options as you type; supports strict (must pick) or
            free-text mode.
          </p>
        </div>

        <!-- Basic (strict) -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Basic (strict — must select from list)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Type to filter; select an option. On blur, invalid text reverts to
            the last selected value.
          </p>
          <div class="max-w-md">
            <nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
              <label nxpLabel for="country">Country</label>
              <input
                nxpInput
                nxpComboBox
                #cb="nxpComboBox"
                id="country"
                type="text"
                placeholder=" "
                [formControl]="countryCtrl"
                [items]="countries"
              />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of cb.filteredItems(); track item) {
                    <nxp-select-option [value]="item" />
                  }
                </nxp-data-list>
              </ng-template>
            </nxp-textfield>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Value: {{ countryCtrl.value | json }}
            </p>
          </div>
        </section>

        <!-- Non-strict (free text) -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Non-strict (free text allowed)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <code>[strict]="false"</code> — any typed text is accepted as the
            value even if it doesn’t match an option.
          </p>
          <div class="max-w-md">
            <nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
              <label nxpLabel for="fruit">Fruit or custom</label>
              <input
                nxpInput
                nxpComboBox
                #cbFruit="nxpComboBox"
                id="fruit"
                type="text"
                placeholder=" "
                [formControl]="fruitCtrl"
                [items]="fruits"
                [strict]="false"
              />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of cbFruit.filteredItems(); track item) {
                    <nxp-select-option [value]="item" />
                  }
                </nxp-data-list>
              </ng-template>
            </nxp-textfield>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Value: {{ fruitCtrl.value | json }}
            </p>
          </div>
        </section>

        <!-- Disabled -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Disabled
          </h2>
          <div class="max-w-md">
            <nxp-textfield class="w-full">
              <label nxpLabel for="country-disabled">Country</label>
              <input
                nxpInput
                nxpComboBox
                #cbDisabled="nxpComboBox"
                id="country-disabled"
                type="text"
                placeholder=" "
                [formControl]="disabledCountryCtrl"
                [items]="countries"
              />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of cbDisabled.filteredItems(); track item) {
                    <nxp-select-option [value]="item" />
                  }
                </nxp-data-list>
              </ng-template>
            </nxp-textfield>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class ComboBoxDemoComponent {
  readonly countries = COUNTRIES as unknown as string[];
  readonly fruits = [
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

  readonly countryCtrl = new FormControl<string | null>(null);
  readonly fruitCtrl = new FormControl<string | null>(null);
  readonly disabledCountryCtrl = new FormControl<string | null>({
    value: 'France',
    disabled: true,
  });
}
