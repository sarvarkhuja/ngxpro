import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpComboBoxComponent } from '@ngxpro/components/combo-box';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
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
  selector: 'app-combo-box-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NxpComboBoxComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    ComboBoxApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Combo Box"
      package="components"
      type="component"
      path="components/combo-box"
    >
      <p class="text-base text-text-secondary mb-6">
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >&lt;nxp-combo-box&gt;</code
        >
        — a self-contained editable single-select with type-to-filter. One
        element +
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >[formControl]</code
        >
        +
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >[items]</code
        >. Supports strict (must pick) or free-text mode, object items, and
        primitive value emission.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Basic"
          description="Type to filter; select an option. In strict mode (the default) invalid text reverts to the last selected value on blur."
          [content]="{ HTML: basicHtml, TypeScript: basicTs }"
        >
          <div class="w-64">
            <nxp-combo-box
              [formControl]="countryCtrl"
              [items]="countries"
              placeholder="Search a country"
            />
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
            <nxp-combo-box
              [formControl]="fruitCtrl"
              [items]="fruits"
              [strict]="false"
              placeholder="Pick or type a fruit"
            />
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ fruitCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled"
          description="Disable the bound form control to make the combo-box non-interactive — the dropdown cannot open."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <div class="w-64">
            <nxp-combo-box
              [formControl]="disabledCountryCtrl"
              [items]="countries"
              placeholder="Search a country"
            />
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Object dataset (full object value)"
          description='Bind to objects with [textField] for display and [valueField] for identity. The form value is the matched object — e.g. { "text": "Medium", "value": 2 }.'
          [content]="{ HTML: objectHtml, TypeScript: objectTs }"
        >
          <div class="w-64">
            <nxp-combo-box
              [formControl]="priorityCtrl"
              [items]="priorities"
              textField="text"
              valueField="value"
              placeholder="Pick a priority"
            />
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ priorityCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Primitive value"
          description='With [valuePrimitive]="true" the form control receives item[valueField] (a number here) instead of the full object. Initial value 2 round-trips to display "Medium".'
          [content]="{ HTML: primitiveHtml, TypeScript: primitiveTs }"
        >
          <div class="w-64">
            <nxp-combo-box
              [formControl]="priorityPrimitiveCtrl"
              [items]="priorities"
              textField="text"
              valueField="value"
              [valuePrimitive]="true"
              placeholder="Pick a priority"
            />
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
  readonly fruits = FRUITS;
  readonly priorities = PRIORITIES;

  readonly countryCtrl = new FormControl<string | null>(null);
  readonly fruitCtrl = new FormControl<string | null>(null);
  readonly disabledCountryCtrl = new FormControl<string | null>({
    value: 'France',
    disabled: true,
  });
  readonly priorityCtrl = new FormControl<Priority | null>(null);
  readonly priorityPrimitiveCtrl = new FormControl<number | null>(2);

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly basicHtml = `<nxp-combo-box
  [formControl]="countryCtrl"
  [items]="countries"
  placeholder="Search a country"
/>
<p>Value: {{ countryCtrl.value | json }}</p>`;

  readonly basicTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpComboBoxComponent } from '@ngxpro/components/combo-box';

@Component({
  selector: 'app-basic-combo-box',
  imports: [JsonPipe, ReactiveFormsModule, NxpComboBoxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basic-combo-box.html',
})
export class BasicComboBoxExample {
  readonly countries = ['Afghanistan', 'Albania', /* ... */];
  readonly countryCtrl = new FormControl<string | null>(null);
}`;

  readonly nonStrictHtml = `<nxp-combo-box
  [formControl]="fruitCtrl"
  [items]="fruits"
  [strict]="false"
  placeholder="Pick or type a fruit"
/>
<p>Value: {{ fruitCtrl.value | json }}</p>`;

  readonly nonStrictTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpComboBoxComponent } from '@ngxpro/components/combo-box';

@Component({
  selector: 'app-non-strict-combo-box',
  imports: [JsonPipe, ReactiveFormsModule, NxpComboBoxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './non-strict-combo-box.html',
})
export class NonStrictComboBoxExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', /* ... */];
  readonly fruitCtrl = new FormControl<string | null>(null);
}`;

  readonly disabledHtml = `<nxp-combo-box
  [formControl]="disabledCountryCtrl"
  [items]="countries"
  placeholder="Search a country"
/>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpComboBoxComponent } from '@ngxpro/components/combo-box';

@Component({
  selector: 'app-disabled-combo-box',
  imports: [ReactiveFormsModule, NxpComboBoxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-combo-box.html',
})
export class DisabledComboBoxExample {
  readonly countries = ['Afghanistan', 'Albania', /* ... */];
  readonly disabledCountryCtrl = new FormControl<string | null>({
    value: 'France',
    disabled: true,
  });
}`;

  readonly objectHtml = `<nxp-combo-box
  [formControl]="priorityCtrl"
  [items]="priorities"
  textField="text"
  valueField="value"
  placeholder="Pick a priority"
/>
<p>Value: {{ priorityCtrl.value | json }}</p>`;

  readonly objectTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpComboBoxComponent } from '@ngxpro/components/combo-box';

interface Priority { text: string; value: number; }

@Component({
  selector: 'app-object-combo-box',
  imports: [JsonPipe, ReactiveFormsModule, NxpComboBoxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './object-combo-box.html',
})
export class ObjectComboBoxExample {
  readonly priorities: Priority[] = [
    { text: 'Low', value: 1 },
    { text: 'Medium', value: 2 },
    { text: 'High', value: 3 },
    { text: 'Urgent', value: 4 },
  ];
  readonly priorityCtrl = new FormControl<Priority | null>(null);
}`;

  readonly primitiveHtml = `<nxp-combo-box
  [formControl]="priorityCtrl"
  [items]="priorities"
  textField="text"
  valueField="value"
  [valuePrimitive]="true"
  placeholder="Pick a priority"
/>
<p>Value: {{ priorityCtrl.value | json }}</p>`;

  readonly primitiveTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpComboBoxComponent } from '@ngxpro/components/combo-box';

interface Priority { text: string; value: number; }

@Component({
  selector: 'app-primitive-combo-box',
  imports: [JsonPipe, ReactiveFormsModule, NxpComboBoxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './primitive-combo-box.html',
})
export class PrimitiveComboBoxExample {
  readonly priorities: Priority[] = [
    { text: 'Low', value: 1 },
    { text: 'Medium', value: 2 },
    { text: 'High', value: 3 },
    { text: 'Urgent', value: 4 },
  ];
  // valuePrimitive=true → the form receives item[valueField] (a number)
  readonly priorityCtrl = new FormControl<number | null>(2);
}`;
}
