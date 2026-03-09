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
import { NxpSelectOptionComponent } from '@nxp/components/combo-box';
import { NxpSelectDirective } from '@nxp/components/select';

interface Country {
  code: string;
  name: string;
}

const COUNTRIES: Country[] = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'ES', name: 'Spain' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
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
  selector: 'app-select-demo',
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
    NxpSelectDirective,
    NxpSelectOptionComponent,
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
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Select</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">input[nxpSelect]</code>
            inside
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nxp-textfield</code>
            — strict dropdown picker. The input is read-only; the user must select from the list.
          </p>
        </div>

        <!-- String items -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">String items</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Click or press Space / Enter to open; Escape to close.
            Selecting an option closes the dropdown and updates the form value.
          </p>
          <div class="max-w-md">
            <nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
              <label nxpLabel for="fruit">Favourite fruit</label>
              <input nxpInput nxpSelect id="fruit" type="text" placeholder=" " [formControl]="fruitCtrl" />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of fruits; track item) {
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

        <!-- Object items -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Object items with custom stringify
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Items are
            <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">&#123; code, name &#125;</code>
            objects. A custom stringify shows the country name.
          </p>
          <div class="max-w-md">
            <nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
              <label nxpLabel for="country">Country</label>
              <input nxpInput nxpSelect id="country" type="text" placeholder=" " [formControl]="countryCtrl" />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of countries; track item.code) {
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

        <!-- Disabled -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Disabled</h2>
          <div class="max-w-md">
            <nxp-textfield class="w-full">
              <label nxpLabel for="fruit-disabled">Favourite fruit</label>
              <input nxpInput nxpSelect id="fruit-disabled" type="text" placeholder=" " [formControl]="disabledCtrl" />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of fruits; track item) {
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
export class SelectDemoComponent {
  readonly fruits = FRUITS;
  readonly countries = COUNTRIES;

  readonly fruitCtrl = new FormControl<string | null>(null);
  readonly countryCtrl = new FormControl<Country | null>(null);
  readonly disabledCtrl = new FormControl<string | null>({ value: 'Mango', disabled: true });
}
