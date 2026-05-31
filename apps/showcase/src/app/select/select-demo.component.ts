import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpSelectComponent } from '@ngxpro/components/select';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { SelectApiComponent } from './select-api.component';

interface Country {
  code: string;
  name: string;
}

interface GroupedCountry extends Country {
  continent: string;
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

const GROUPED_COUNTRIES: GroupedCountry[] = [
  { code: 'FR', name: 'France', continent: 'Europe' },
  { code: 'DE', name: 'Germany', continent: 'Europe' },
  { code: 'IT', name: 'Italy', continent: 'Europe' },
  { code: 'ES', name: 'Spain', continent: 'Europe' },
  { code: 'GB', name: 'United Kingdom', continent: 'Europe' },
  { code: 'CN', name: 'China', continent: 'Asia' },
  { code: 'IN', name: 'India', continent: 'Asia' },
  { code: 'JP', name: 'Japan', continent: 'Asia' },
  { code: 'CA', name: 'Canada', continent: 'Americas' },
  { code: 'MX', name: 'Mexico', continent: 'Americas' },
  { code: 'US', name: 'United States', continent: 'Americas' },
  { code: 'BR', name: 'Brazil', continent: 'Americas' },
  { code: 'EG', name: 'Egypt', continent: 'Africa' },
  { code: 'DZ', name: 'Algeria', continent: 'Africa' },
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
    ReactiveFormsModule,
    NxpSelectComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    SelectApiComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nxp-doc-component-page
      header="Select"
      package="components"
      type="component"
      path="components/select"
    >
      <p class="text-base text-text-secondary mb-6">
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >&lt;nxp-select&gt;</code
        >
        — a self-contained single-select picker. One element +
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >[formControl]</code
        >
        +
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >[items]</code
        >, with optional in-panel filtering, grouping, per-item disabling and
        create-on-no-match. The input is read-only; the user picks from the
        list.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Basic"
          description="One element with [formControl] + [items]. Click or press Space / Enter to open, Escape to close. [clearable] adds a reset button."
          [content]="{ HTML: basicHtml, TypeScript: basicTs }"
        >
          <div class="w-64">
            <nxp-select
              [formControl]="fruitCtrl"
              [items]="fruits"
              placeholder="Select a fruit"
              [clearable]="true"
            />
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ fruitCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Object items"
          description="Pass textField / valueField to label and match object items by property — the form value is the matched object."
          [content]="{ HTML: objectHtml, TypeScript: objectTs }"
        >
          <div class="w-64">
            <nxp-select
              [formControl]="countryCtrl"
              [items]="countries"
              textField="name"
              valueField="code"
              placeholder="Select a country"
              [clearable]="true"
            />
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ countryCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled"
          description="Disable the bound form control to lock the picker. The trigger is non-interactive and the dropdown will not open."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <div class="w-64">
            <nxp-select
              [formControl]="disabledCtrl"
              [items]="fruits"
              placeholder="Select a fruit"
            />
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled items"
          description="The [disabledItem] predicate flags individual items as non-selectable — dimmed, aria-disabled, and skipped by keyboard navigation."
          [content]="{ HTML: disabledItemsHtml, TypeScript: disabledItemsTs }"
        >
          <div class="w-64">
            <nxp-select
              [formControl]="disabledItemsCtrl"
              [items]="fruits"
              [disabledItem]="isFruitDisabled"
              placeholder="Select a fruit"
            />
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ disabledItemsCtrl.value | json }} (Banana and Date are
              locked)
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Filterable + grouped"
          description="[filterable] adds an auto-focused search box inside the panel; [groupBy] buckets options under headers by a property (continent here)."
          [content]="{ HTML: filterGroupedHtml, TypeScript: filterGroupedTs }"
        >
          <div class="w-72">
            <nxp-select
              [formControl]="groupedCountryCtrl"
              [items]="groupedCountries"
              textField="name"
              valueField="code"
              groupBy="continent"
              [filterable]="true"
              filterPlaceholder="Search countries…"
              placeholder="Select a country"
            />
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ groupedCountryCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Default value + create on no match"
          description="FormControl seeded with 'angular'. [creatable] shows a Create row when the search matches nothing — handle (create) to push the new value into your items array."
          [content]="{ HTML: createHtml, TypeScript: createTs }"
        >
          <div class="w-72">
            <nxp-select
              [formControl]="tagCtrl"
              [items]="tags()"
              [creatable]="true"
              filterPlaceholder="Search or create…"
              (create)="addTag($event)"
              placeholder="Pick a tag"
            />
            <p class="mt-1 text-xs text-text-secondary">
              Tags: {{ tags() | json }} · Value: {{ tagCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-select-api />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class SelectDemoComponent {
  readonly fruits = FRUITS;
  readonly countries = COUNTRIES;
  readonly groupedCountries = GROUPED_COUNTRIES;

  readonly fruitCtrl = new FormControl<string | null>(null);
  readonly countryCtrl = new FormControl<Country | null>(null);
  readonly disabledCtrl = new FormControl<string | null>({
    value: 'Mango',
    disabled: true,
  });
  readonly disabledItemsCtrl = new FormControl<string | null>(null);
  readonly groupedCountryCtrl = new FormControl<GroupedCountry | null>(null);

  readonly tags = signal<string[]>(['angular', 'typescript', 'rxjs']);
  readonly tagCtrl = new FormControl<string | null>('angular');

  readonly isFruitDisabled = (fruit: string): boolean =>
    fruit === 'Banana' || fruit === 'Date';

  addTag(name: string): void {
    const trimmed = name.trim();
    if (!trimmed || this.tags().includes(trimmed)) return;
    this.tags.update((prev) => [...prev, trimmed]);
    this.tagCtrl.setValue(trimmed);
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly basicHtml = `<nxp-select
  [formControl]="fruitCtrl"
  [items]="fruits"
  placeholder="Select a fruit"
  [clearable]="true"
/>
<p>Value: {{ fruitCtrl.value | json }}</p>`;

  readonly basicTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpSelectComponent } from '@ngxpro/components/select';

@Component({
  selector: 'app-basic-select',
  imports: [JsonPipe, ReactiveFormsModule, NxpSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basic-select.html',
})
export class BasicSelectExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Mango'];
  readonly fruitCtrl = new FormControl<string | null>(null);
}`;

  readonly objectHtml = `<nxp-select
  [formControl]="countryCtrl"
  [items]="countries"
  textField="name"
  valueField="code"
  placeholder="Select a country"
  [clearable]="true"
/>
<p>Value: {{ countryCtrl.value | json }}</p>`;

  readonly objectTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpSelectComponent } from '@ngxpro/components/select';

interface Country {
  code: string;
  name: string;
}

@Component({
  selector: 'app-object-select',
  imports: [JsonPipe, ReactiveFormsModule, NxpSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './object-select.html',
})
export class ObjectSelectExample {
  readonly countries: Country[] = [
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'JP', name: 'Japan' },
    { code: 'US', name: 'United States' },
  ];
  readonly countryCtrl = new FormControl<Country | null>(null);
}`;

  readonly disabledHtml = `<nxp-select
  [formControl]="disabledCtrl"
  [items]="fruits"
  placeholder="Select a fruit"
/>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpSelectComponent } from '@ngxpro/components/select';

@Component({
  selector: 'app-disabled-select',
  imports: [ReactiveFormsModule, NxpSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-select.html',
})
export class DisabledSelectExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Mango'];
  readonly disabledCtrl = new FormControl<string | null>({
    value: 'Mango',
    disabled: true,
  });
}`;

  readonly disabledItemsHtml = `<nxp-select
  [formControl]="disabledItemsCtrl"
  [items]="fruits"
  [disabledItem]="isFruitDisabled"
  placeholder="Select a fruit"
/>
<p>Value: {{ disabledItemsCtrl.value | json }}</p>`;

  readonly disabledItemsTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpSelectComponent } from '@ngxpro/components/select';

@Component({
  selector: 'app-disabled-items-select',
  imports: [JsonPipe, ReactiveFormsModule, NxpSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-items-select.html',
})
export class DisabledItemsSelectExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Mango'];
  readonly disabledItemsCtrl = new FormControl<string | null>(null);
  readonly isFruitDisabled = (fruit: string): boolean =>
    fruit === 'Banana' || fruit === 'Date';
}`;

  readonly filterGroupedHtml = `<nxp-select
  [formControl]="countryCtrl"
  [items]="countries"
  textField="name"
  valueField="code"
  groupBy="continent"
  [filterable]="true"
  filterPlaceholder="Search countries…"
  placeholder="Select a country"
/>
<p>Value: {{ countryCtrl.value | json }}</p>`;

  readonly filterGroupedTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpSelectComponent } from '@ngxpro/components/select';

interface Country {
  code: string;
  name: string;
  continent: string;
}

@Component({
  selector: 'app-grouped-select',
  imports: [JsonPipe, ReactiveFormsModule, NxpSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grouped-select.html',
})
export class GroupedSelectExample {
  readonly countries: Country[] = [
    { code: 'FR', name: 'France', continent: 'Europe' },
    { code: 'DE', name: 'Germany', continent: 'Europe' },
    { code: 'JP', name: 'Japan', continent: 'Asia' },
    { code: 'US', name: 'United States', continent: 'Americas' },
  ];
  readonly countryCtrl = new FormControl<Country | null>(null);
}`;

  readonly createHtml = `<nxp-select
  [formControl]="tagCtrl"
  [items]="tags()"
  [creatable]="true"
  filterPlaceholder="Search or create…"
  (create)="addTag($event)"
  placeholder="Pick a tag"
/>
<p>Tags: {{ tags() | json }} · Value: {{ tagCtrl.value | json }}</p>`;

  readonly createTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpSelectComponent } from '@ngxpro/components/select';

@Component({
  selector: 'app-create-tag-select',
  imports: [ReactiveFormsModule, NxpSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-tag-select.html',
})
export class CreateTagSelectExample {
  // Default selection — FormControl seeded with the initial value.
  readonly tags = signal<string[]>(['angular', 'typescript', 'rxjs']);
  readonly tagCtrl = new FormControl<string | null>('angular');

  addTag(name: string): void {
    const trimmed = name.trim();
    if (!trimmed || this.tags().includes(trimmed)) return;
    this.tags.update((prev) => [...prev, trimmed]);
    this.tagCtrl.setValue(trimmed);
  }
}`;
}
