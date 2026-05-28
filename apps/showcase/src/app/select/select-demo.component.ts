import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldOptionsDirective,
} from '@ngxpro/cdk/components/textfield';
import {
  DataListComponent,
  OptGroupDirective,
} from '@ngxpro/components/data-list';
import { NxpSelectOptionComponent } from '@ngxpro/components/combo-box';
import {
  NxpSelectDirective,
  NxpSelectFilterComponent,
} from '@ngxpro/components/select';
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
    NxpTextfieldOptionsDirective,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    OptGroupDirective,
    NxpSelectDirective,
    NxpSelectFilterComponent,
    NxpSelectOptionComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    SelectApiComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nxp-doc-component-page
      header="Select"
      package="components"
      type="directive"
      path="components/select"
    >
      <p class="text-base text-text-secondary mb-6">
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >input[nxpSelect]</code
        >
        inside
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-textfield</code
        >
        — strict dropdown picker. The input is read-only; the user must select
        from the list.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="String items"
          description="Click or press Space / Enter to open; Escape to close. Selecting an option closes the dropdown and updates the form value."
          [content]="{ HTML: stringHtml, TypeScript: stringTs }"
        >
          <div class="w-64">
            <nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
              <label nxpLabel for="fruit">Favourite fruit</label>
              <input
                nxpInput
                nxpSelect
                id="fruit"
                type="text"
                placeholder=" "
                [readOnly]="readOnly()"
                [pseudoInvalid]="pseudoInvalid()"
                [formControl]="fruitCtrl"
              />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of fruits; track item) {
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
          heading="Object items via textField / valueField"
          description="Items are { code, name } objects. Pass textField='name' so the trigger and options show the country name, and valueField='code' so identity is compared by code. No global provider needed."
          [content]="{ HTML: objectHtml, TypeScript: objectTs }"
        >
          <div class="w-64">
            <nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
              <label nxpLabel for="country">Country</label>
              <input
                nxpInput
                nxpSelect
                id="country"
                type="text"
                placeholder=" "
                textField="name"
                valueField="code"
                [readOnly]="readOnly()"
                [pseudoInvalid]="pseudoInvalid()"
                [formControl]="countryCtrl"
              />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of countries; track item.code) {
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
          heading="Disabled"
          description="Disable the underlying form control to lock the picker. The input is non-interactive and the dropdown does not open."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <div class="w-64">
            <nxp-textfield class="w-full">
              <label nxpLabel for="fruit-disabled">Favourite fruit</label>
              <input
                nxpInput
                nxpSelect
                id="fruit-disabled"
                type="text"
                placeholder=" "
                [formControl]="disabledCtrl"
              />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of fruits; track item) {
                    <nxp-select-option [value]="item" />
                  }
                </nxp-data-list>
              </ng-template>
            </nxp-textfield>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Filterable + grouped"
          description="Filter input lives inside the dropdown panel and auto-focuses when opened. Options are grouped by continent via nxpOptGroup; the headers stay visible while filtering."
          [content]="{ HTML: filterGroupedHtml, TypeScript: filterGroupedTs }"
        >
          <div class="w-72">
            <nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
              <label nxpLabel for="country-filtered">Country</label>
              <input
                nxpInput
                nxpSelect
                id="country-filtered"
                type="text"
                placeholder=" "
                textField="name"
                valueField="code"
                [formControl]="groupedCountryCtrl"
              />
              <ng-template nxpDropdown>
                <nxp-select-filter
                  [items]="groupedCountries"
                  placeholder="Search countries…"
                >
                  <ng-template let-list>
                    @for (group of groupContinents(list); track group.label) {
                      <div nxpOptGroup [label]="group.label">
                        @for (item of group.items; track item.code) {
                          <nxp-select-option [value]="item" />
                        }
                      </div>
                    }
                  </ng-template>
                </nxp-select-filter>
              </ng-template>
            </nxp-textfield>
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ groupedCountryCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled items"
          description="The disabledItem predicate flags individual items as non-selectable. Disabled options render with aria-disabled, dim styling, and are skipped by keyboard navigation."
          [content]="{ HTML: disabledItemsHtml, TypeScript: disabledItemsTs }"
        >
          <div class="w-64">
            <nxp-textfield class="w-full">
              <label nxpLabel for="fruit-disabled-items">Favourite fruit</label>
              <input
                nxpInput
                nxpSelect
                id="fruit-disabled-items"
                type="text"
                placeholder=" "
                [disabledItem]="isFruitDisabled"
                [formControl]="disabledItemsCtrl"
              />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of fruits; track item) {
                    <nxp-select-option [value]="item" />
                  }
                </nxp-data-list>
              </ng-template>
            </nxp-textfield>
            <p class="mt-1 text-xs text-text-secondary">
              Value: {{ disabledItemsCtrl.value | json }} (Banana and Date are
              locked)
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Default value + create on no match"
          description="FormControl seeded with 'angular' so the picker shows a default selection on load. Type a non-matching tag and press Enter on the Create row — the consumer receives (create) and can push the new value into its items array."
          [content]="{ HTML: createHtml, TypeScript: createTs }"
        >
          <div class="w-72">
            <nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
              <label nxpLabel for="tag-select">Tag</label>
              <input
                nxpInput
                nxpSelect
                id="tag-select"
                type="text"
                placeholder=" "
                [formControl]="tagCtrl"
              />
              <ng-template nxpDropdown>
                <nxp-select-filter
                  [items]="tags()"
                  placeholder="Search or create…"
                  emptyLabel=""
                  (create)="addTag($event)"
                >
                  <ng-template let-list>
                    @for (t of list; track t) {
                      <nxp-select-option [value]="t" />
                    }
                  </ng-template>
                </nxp-select-filter>
              </ng-template>
            </nxp-textfield>
            <p class="mt-1 text-xs text-text-secondary">
              Tags: {{ tags() | json }} · Value:
              {{ tagCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-select-api
          [(readOnly)]="readOnly"
          [(pseudoInvalid)]="pseudoInvalid"
        />
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

  readonly groupedCountryCtrl = new FormControl<GroupedCountry | null>(null);
  readonly disabledItemsCtrl = new FormControl<string | null>(null);

  readonly tags = signal<string[]>(['angular', 'typescript', 'rxjs']);
  readonly tagCtrl = new FormControl<string | null>('angular');

  readonly readOnly = signal(false);
  readonly pseudoInvalid = signal<boolean | null>(null);

  readonly isFruitDisabled = (fruit: string): boolean =>
    fruit === 'Banana' || fruit === 'Date';

  groupContinents(
    list: readonly GroupedCountry[],
  ): { label: string; items: GroupedCountry[] }[] {
    const map = new Map<string, GroupedCountry[]>();
    for (const item of list) {
      const bucket = map.get(item.continent);
      if (bucket) bucket.push(item);
      else map.set(item.continent, [item]);
    }
    return Array.from(map, ([label, items]) => ({ label, items }));
  }

  addTag(name: string): void {
    const trimmed = name.trim();
    if (!trimmed || this.tags().includes(trimmed)) return;
    this.tags.update((prev) => [...prev, trimmed]);
    this.tagCtrl.setValue(trimmed);
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly stringHtml = `<nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
  <label nxpLabel for="fruit">Favourite fruit</label>
  <input
    nxpInput
    nxpSelect
    id="fruit"
    type="text"
    placeholder=" "
    [formControl]="fruitCtrl"
  />
  <ng-template nxpDropdown>
    <nxp-data-list>
      @for (item of fruits; track item) {
        <nxp-select-option [value]="item" />
      }
    </nxp-data-list>
  </ng-template>
</nxp-textfield>
<p>Value: {{ fruitCtrl.value | json }}</p>`;

  readonly stringTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldOptionsDirective,
} from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';
import { NxpSelectOptionComponent } from '@ngxpro/components/combo-box';
import { NxpSelectDirective } from '@ngxpro/components/select';

@Component({
  selector: 'app-string-select',
  imports: [
    JsonPipe,
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
  templateUrl: './string-select.html',
})
export class StringSelectExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Mango'];
  readonly fruitCtrl = new FormControl<string | null>(null);
}`;

  readonly objectHtml = `<nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
  <label nxpLabel for="country">Country</label>
  <input
    nxpInput
    nxpSelect
    id="country"
    type="text"
    placeholder=" "
    textField="name"
    valueField="code"
    [formControl]="countryCtrl"
  />
  <ng-template nxpDropdown>
    <nxp-data-list>
      @for (item of countries; track item.code) {
        <nxp-select-option [value]="item" />
      }
    </nxp-data-list>
  </ng-template>
</nxp-textfield>
<p>Value: {{ countryCtrl.value | json }}</p>`;

  readonly objectTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldOptionsDirective,
} from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';
import { NxpSelectOptionComponent } from '@ngxpro/components/combo-box';
import { NxpSelectDirective } from '@ngxpro/components/select';

interface Country {
  code: string;
  name: string;
}

@Component({
  selector: 'app-object-select',
  imports: [
    JsonPipe,
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

  readonly disabledHtml = `<nxp-textfield class="w-full">
  <label nxpLabel for="fruit-disabled">Favourite fruit</label>
  <input
    nxpInput
    nxpSelect
    id="fruit-disabled"
    type="text"
    placeholder=" "
    [formControl]="disabledCtrl"
  />
  <ng-template nxpDropdown>
    <nxp-data-list>
      @for (item of fruits; track item) {
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
import { NxpSelectOptionComponent } from '@ngxpro/components/combo-box';
import { NxpSelectDirective } from '@ngxpro/components/select';

@Component({
  selector: 'app-disabled-select',
  imports: [
    ReactiveFormsModule,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    NxpSelectDirective,
    NxpSelectOptionComponent,
  ],
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

  readonly filterGroupedHtml = `<nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
  <label nxpLabel for="country-filtered">Country</label>
  <input
    nxpInput
    nxpSelect
    id="country-filtered"
    type="text"
    placeholder=" "
    textField="name"
    valueField="code"
    [formControl]="groupedCountryCtrl"
  />
  <ng-template nxpDropdown>
    <nxp-select-filter [items]="countries" placeholder="Search countries…">
      <ng-template let-list>
        @for (group of groupContinents(list); track group.label) {
          <div nxpOptGroup [label]="group.label">
            @for (item of group.items; track item.code) {
              <nxp-select-option [value]="item" />
            }
          </div>
        }
      </ng-template>
    </nxp-select-filter>
  </ng-template>
</nxp-textfield>`;

  readonly filterGroupedTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { OptGroupDirective } from '@ngxpro/components/data-list';
import { NxpSelectOptionComponent } from '@ngxpro/components/combo-box';
import {
  NxpSelectDirective,
  NxpSelectFilterComponent,
} from '@ngxpro/components/select';

interface Country { code: string; name: string; continent: string; }

@Component({
  selector: 'app-grouped-select',
  imports: [
    ReactiveFormsModule,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    OptGroupDirective,
    NxpSelectDirective,
    NxpSelectFilterComponent,
    NxpSelectOptionComponent,
  ],
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
  readonly groupedCountryCtrl = new FormControl<Country | null>(null);

  groupContinents(list: readonly Country[]): { label: string; items: Country[] }[] {
    const map = new Map<string, Country[]>();
    for (const item of list) {
      const bucket = map.get(item.continent);
      if (bucket) bucket.push(item);
      else map.set(item.continent, [item]);
    }
    return Array.from(map, ([label, items]) => ({ label, items }));
  }
}`;

  readonly disabledItemsHtml = `<nxp-textfield class="w-full">
  <label nxpLabel for="fruit-disabled-items">Favourite fruit</label>
  <input
    nxpInput
    nxpSelect
    id="fruit-disabled-items"
    type="text"
    placeholder=" "
    [disabledItem]="isFruitDisabled"
    [formControl]="disabledItemsCtrl"
  />
  <ng-template nxpDropdown>
    <nxp-data-list>
      @for (item of fruits; track item) {
        <nxp-select-option [value]="item" />
      }
    </nxp-data-list>
  </ng-template>
</nxp-textfield>`;

  readonly disabledItemsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';
import { NxpSelectOptionComponent } from '@ngxpro/components/combo-box';
import { NxpSelectDirective } from '@ngxpro/components/select';

@Component({
  selector: 'app-disabled-items-select',
  imports: [
    ReactiveFormsModule,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    NxpSelectDirective,
    NxpSelectOptionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-items-select.html',
})
export class DisabledItemsSelectExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Mango'];
  readonly disabledItemsCtrl = new FormControl<string | null>(null);
  readonly isFruitDisabled = (fruit: string) =>
    fruit === 'Banana' || fruit === 'Date';
}`;

  readonly createHtml = `<nxp-textfield class="w-full" [nxpTextfieldCleaner]="true">
  <label nxpLabel for="tag-select">Tag</label>
  <input
    nxpInput
    nxpSelect
    id="tag-select"
    type="text"
    placeholder=" "
    [formControl]="tagCtrl"
  />
  <ng-template nxpDropdown>
    <nxp-select-filter
      [items]="tags()"
      placeholder="Search or create…"
      emptyLabel=""
      (create)="addTag($event)"
    >
      <ng-template let-list>
        @for (t of list; track t) {
          <nxp-select-option [value]="t" />
        }
      </ng-template>
    </nxp-select-filter>
  </ng-template>
</nxp-textfield>`;

  readonly createTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpSelectOptionComponent } from '@ngxpro/components/combo-box';
import {
  NxpSelectDirective,
  NxpSelectFilterComponent,
} from '@ngxpro/components/select';

@Component({
  selector: 'app-create-tag-select',
  imports: [
    ReactiveFormsModule,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    NxpSelectDirective,
    NxpSelectFilterComponent,
    NxpSelectOptionComponent,
  ],
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
