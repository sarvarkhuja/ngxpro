import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent, NxpDropdownOptionsDirective } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldOptionsDirective,
} from '@ngxpro/cdk/components/textfield';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { DataListComponent } from '@ngxpro/components/data-list';
import {
  NxpComboBoxDirective,
  NxpSelectOptionComponent,
} from '@ngxpro/components/combo-box';
import { ComboBoxApiComponent } from './combo-box-api.component';

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

interface Priority {
  text: string;
  value: number;
}

const PRIORITIES: Priority[] = [
  { text: 'Low', value: 1 },
  { text: 'Medium', value: 2 },
  { text: 'High', value: 3 },
  { text: 'Urgent', value: 4 },
];

@Component({
  selector: 'app-combo-box-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NxpTextfieldOptionsDirective,
    NxpDropdownContent,
    NxpDropdownOptionsDirective,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    NxpComboBoxDirective,
    NxpSelectOptionComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    ComboBoxApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Combo Box"
      package="components"
      type="directive"
      path="components/combo-box"
    >
      <p class="text-base text-text-secondary mb-6">
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
        >. Filters options as you type; supports strict (must pick) or free-text
        mode.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Basic (strict — must select from list)"
          description="Type to filter; select an option. On blur, invalid text reverts to the last selected value."
          [content]="{ HTML: basicHtml, TypeScript: basicTs }"
        >
          <div class="w-64">
            <nxp-textfield class="w-full" [nxpDropdownMaxHeight]="200">
              <label nxpLabel for="country">Country</label>
              <input
                nxpInput
                nxpComboBox
                #cb="nxpComboBox"
                id="country"
                type="text"
                placeholder="Select a country"
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
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ countryCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Non-strict (free text allowed)"
          description='Set [strict]="false" — any typed text is accepted as the value even if it does not match an option.'
          [content]="{ HTML: nonStrictHtml, TypeScript: nonStrictTs }"
        >
          <div class="w-64">
            <nxp-textfield class="w-full" [nxpDropdownMaxHeight]="200">
              <label nxpLabel for="fruit">Fruit or custom</label>
              <input
                nxpInput
                nxpComboBox
                #cbFruit="nxpComboBox"
                id="fruit"
                type="text"
                placeholder="Pick or type a fruit"
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
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ fruitCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled"
          description="When the form control is disabled the combo-box is non-interactive and the dropdown cannot open."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <div class="w-64">
            <nxp-textfield class="w-full" [nxpDropdownMaxHeight]="200">
              <label nxpLabel for="country-disabled">Country</label>
              <input
                nxpInput
                nxpComboBox
                #cbDisabled="nxpComboBox"
                id="country-disabled"
                type="text"
                placeholder="Select a country"
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
        </nxp-doc-example>

        <nxp-doc-example
          heading="Object dataset (full object value)"
          description='Bind to an array of objects with [textField] for display and [valueField] for identity. The form value is the matched object — e.g. { "text": "Medium", "value": 2 }.'
          [content]="{ HTML: objectHtml, TypeScript: objectTs }"
        >
          <div class="w-64">
            <nxp-textfield class="w-full" [nxpDropdownMaxHeight]="200">
              <label nxpLabel for="priority">Priority</label>
              <input
                nxpInput
                nxpComboBox
                #cbPrio="nxpComboBox"
                id="priority"
                type="text"
                placeholder="Pick a priority"
                [formControl]="priorityCtrl"
                [items]="priorities"
                textField="text"
                valueField="value"
              />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of cbPrio.filteredItems(); track item.value) {
                    <nxp-select-option [value]="item" />
                  }
                </nxp-data-list>
              </ng-template>
            </nxp-textfield>
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ priorityCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Object dataset (primitive value)"
          description='With [valuePrimitive]="true", the form control receives item[valueField] (a primitive) instead of the full object. Initial value 2 round-trips to display "Medium".'
          [content]="{ HTML: primitiveHtml, TypeScript: primitiveTs }"
        >
          <div class="w-64">
            <nxp-textfield class="w-full" [nxpDropdownMaxHeight]="200">
              <label nxpLabel for="priority-prim">Priority</label>
              <input
                nxpInput
                nxpComboBox
                #cbPrioP="nxpComboBox"
                id="priority-prim"
                type="text"
                placeholder="Pick a priority"
                [formControl]="priorityPrimitiveCtrl"
                [items]="priorities"
                textField="text"
                valueField="value"
                [valuePrimitive]="true"
              />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of cbPrioP.filteredItems(); track item.value) {
                    <nxp-select-option [value]="item" />
                  }
                </nxp-data-list>
              </ng-template>
            </nxp-textfield>
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ priorityPrimitiveCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-combo-box-api />
      </ng-template>
    </nxp-doc-component-page>
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

  readonly priorities = PRIORITIES;

  readonly countryCtrl = new FormControl<string | null>(null);
  readonly fruitCtrl = new FormControl<string | null>(null);
  readonly disabledCountryCtrl = new FormControl<string | null>({
    value: 'France',
    disabled: true,
  });
  readonly priorityCtrl = new FormControl<Priority | null>(null);
  readonly priorityPrimitiveCtrl = new FormControl<number | null>(2);

  readonly basicHtml = `<nxp-textfield [nxpDropdownMaxHeight]="200">
  <label nxpLabel for="country">Country</label>
  <input
    nxpInput
    nxpComboBox
    #cb="nxpComboBox"
    id="country"
    type="text"
    placeholder="Select a country"
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
</nxp-textfield>`;

  readonly basicTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';
import {
  NxpComboBoxDirective,
  NxpSelectOptionComponent,
} from '@ngxpro/components/combo-box';

@Component({
  selector: 'app-combo-box-basic',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    NxpComboBoxDirective,
    NxpSelectOptionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combo-box-basic.html',
})
export class ComboBoxBasicExample {
  readonly countries = ['Afghanistan', 'Albania', /* ... */];
  readonly countryCtrl = new FormControl<string | null>(null);
}`;

  readonly nonStrictHtml = `<nxp-textfield [nxpDropdownMaxHeight]="200">
  <label nxpLabel for="fruit">Fruit or custom</label>
  <input
    nxpInput
    nxpComboBox
    #cbFruit="nxpComboBox"
    id="fruit"
    type="text"
    placeholder="Pick or type a fruit"
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
</nxp-textfield>`;

  readonly nonStrictTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';
import {
  NxpComboBoxDirective,
  NxpSelectOptionComponent,
} from '@ngxpro/components/combo-box';

@Component({
  selector: 'app-combo-box-non-strict',
  imports: [
    ReactiveFormsModule,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    NxpComboBoxDirective,
    NxpSelectOptionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combo-box-non-strict.html',
})
export class ComboBoxNonStrictExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', /* ... */];
  readonly fruitCtrl = new FormControl<string | null>(null);
}`;

  readonly disabledHtml = `<nxp-textfield [nxpDropdownMaxHeight]="200">
  <label nxpLabel for="country-disabled">Country</label>
  <input
    nxpInput
    nxpComboBox
    #cbDisabled="nxpComboBox"
    id="country-disabled"
    type="text"
    placeholder="Select a country"
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
</nxp-textfield>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';
import {
  NxpComboBoxDirective,
  NxpSelectOptionComponent,
} from '@ngxpro/components/combo-box';

@Component({
  selector: 'app-combo-box-disabled',
  imports: [
    ReactiveFormsModule,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    NxpComboBoxDirective,
    NxpSelectOptionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combo-box-disabled.html',
})
export class ComboBoxDisabledExample {
  readonly countries = ['Afghanistan', 'Albania', /* ... */];
  readonly disabledCountryCtrl = new FormControl<string | null>({
    value: 'France',
    disabled: true,
  });
}`;

  readonly objectHtml = `<nxp-textfield [nxpDropdownMaxHeight]="200">
  <label nxpLabel for="priority">Priority</label>
  <input
    nxpInput
    nxpComboBox
    #cbPrio="nxpComboBox"
    id="priority"
    type="text"
    placeholder="Pick a priority"
    [formControl]="priorityCtrl"
    [items]="priorities"
    textField="text"
    valueField="value"
  />
  <ng-template nxpDropdown>
    <nxp-data-list>
      @for (item of cbPrio.filteredItems(); track item.value) {
        <nxp-select-option [value]="item" />
      }
    </nxp-data-list>
  </ng-template>
</nxp-textfield>`;

  readonly objectTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';
import {
  NxpComboBoxDirective,
  NxpSelectOptionComponent,
} from '@ngxpro/components/combo-box';

interface Priority { text: string; value: number; }

@Component({
  selector: 'app-combo-box-object',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    NxpComboBoxDirective,
    NxpSelectOptionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combo-box-object.html',
})
export class ComboBoxObjectExample {
  readonly priorities: Priority[] = [
    { text: 'Low', value: 1 },
    { text: 'Medium', value: 2 },
    { text: 'High', value: 3 },
    { text: 'Urgent', value: 4 },
  ];
  readonly priorityCtrl = new FormControl<Priority | null>(null);
}`;

  readonly primitiveHtml = `<nxp-textfield [nxpDropdownMaxHeight]="200">
  <label nxpLabel for="priority-prim">Priority</label>
  <input
    nxpInput
    nxpComboBox
    #cbPrioP="nxpComboBox"
    id="priority-prim"
    type="text"
    placeholder="Pick a priority"
    [formControl]="priorityPrimitiveCtrl"
    [items]="priorities"
    textField="text"
    valueField="value"
    [valuePrimitive]="true"
  />
  <ng-template nxpDropdown>
    <nxp-data-list>
      @for (item of cbPrioP.filteredItems(); track item.value) {
        <nxp-select-option [value]="item" />
      }
    </nxp-data-list>
  </ng-template>
</nxp-textfield>`;

  readonly primitiveTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';
import {
  NxpComboBoxDirective,
  NxpSelectOptionComponent,
} from '@ngxpro/components/combo-box';

interface Priority { text: string; value: number; }

@Component({
  selector: 'app-combo-box-primitive',
  imports: [
    ReactiveFormsModule,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    NxpComboBoxDirective,
    NxpSelectOptionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combo-box-primitive.html',
})
export class ComboBoxPrimitiveExample {
  readonly priorities: Priority[] = [
    { text: 'Low', value: 1 },
    { text: 'Medium', value: 2 },
    { text: 'High', value: 3 },
    { text: 'Urgent', value: 4 },
  ];
  // valuePrimitive=true → the form receives item[valueField] (a number)
  readonly priorityPrimitiveCtrl = new FormControl<number | null>(2);
}`;
}
