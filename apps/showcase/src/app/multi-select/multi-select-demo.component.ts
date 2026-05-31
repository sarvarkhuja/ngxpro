import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent, NxpDropdownOptionsDirective } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { DataListComponent } from '@ngxpro/components/data-list';
import type { NxpChipSize } from '@ngxpro/components/chip';
import {
  NxpMultiSelectComponent,
  NxpMultiSelectDirective,
  NxpMultiSelectOptionComponent,
} from '@ngxpro/components/multi-select';
import { MultiSelectApiComponent } from './multi-select-api.component';

interface Country {
  code: string;
  name: string;
}

interface Scenario {
  readonly key: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly placeholder: string;
  readonly items: readonly string[];
  readonly seed: readonly string[];
}

interface SizeRow {
  readonly value: NxpChipSize;
  readonly label: string;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NxpDropdownContent,
    NxpDropdownOptionsDirective,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    NxpMultiSelectComponent,
    NxpMultiSelectDirective,
    NxpMultiSelectOptionComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    MultiSelectApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Multi Select"
      package="components"
      type="component"
      path="components/multi-select"
    >
      <p class="text-base text-text-secondary mb-6 tracking-tight">
        <code [class]="cls.code">nxp-multi-select</code> — chip-based picker
        that renders the selection as removable
        <code [class]="cls.code">nxp-input-chip-item</code> pills inside the
        same shadow-bordered shell as
        <code [class]="cls.code">nxp-textfield</code>. Click, press Space /
        Enter / Arrow Down to open; Backspace removes the last chip; Escape
        closes the panel.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Hero"
          description="Click the field, toggle options from the dropdown, or tap a suggestion below to seed the selection. Backspace removes the last chip; Escape closes the panel."
          [content]="{ HTML: heroHtml, TypeScript: heroTs }"
        >
          <div class="w-full max-w-xl space-y-3">
            <div class="flex items-baseline justify-between">
              <label nxpLabel for="hero-fruits" [class]="cls.label">
                Favourite fruits
              </label>
              <span [class]="cls.mono">
                {{ heroCtrl.value?.length ?? 0 }} selected
              </span>
            </div>
            <nxp-multi-select
              id="hero-fruits"
              class="w-full min-w-0"
              [formControl]="heroCtrl"
              [items]="fruits"
              placeholder="Select fruits…"
            />
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <span [class]="cls.caption">Quick add</span>
              @for (s of suggestions; track s) {
                @let added = isHeroSelected(s);
                <button
                  type="button"
                  (click)="toggleHeroSuggestion(s)"
                  [class]="added ? cls.pillAdded : cls.pillIdle"
                >
                  @if (added) {
                    <i class="ri-check-line text-[12px]" aria-hidden="true"></i>
                  } @else {
                    <span aria-hidden="true">+</span>
                  }
                  {{ s }}
                </button>
              }
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Real-world patterns"
          description="Common multi-select scenarios — switch tabs to see how the same wrapper handles different domain values, from email recipients to language tags."
          [content]="{ HTML: scenariosHtml, TypeScript: scenariosTs }"
        >
          <div class="w-full grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
            <div
              class="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0"
            >
              @for (s of scenarios; track s.key) {
                @let active = scenarioKey() === s.key;
                <button
                  type="button"
                  (click)="selectScenario(s.key)"
                  [attr.aria-pressed]="active"
                  [class]="active ? cls.tabActive : cls.tabIdle"
                >
                  <span [class]="cls.tabKicker">{{ s.label }}</span>
                  <span
                    class="text-sm font-medium leading-tight tracking-tight"
                  >
                    {{ s.title }}
                  </span>
                </button>
              }
            </div>
            <div [class]="cls.card">
              @let s = activeScenario();
              <div class="space-y-1 mb-3">
                <p
                  class="text-sm font-semibold text-text-primary tracking-tight"
                >
                  {{ s.title }}
                </p>
                <p class="text-xs text-text-secondary">{{ s.description }}</p>
              </div>
              <nxp-multi-select
                class="w-full min-w-0"
                [formControl]="scenarioCtrl"
                [items]="s.items"
                [placeholder]="s.placeholder"
              />
              <div
                class="flex items-center justify-between pt-3 text-[11px] font-mono text-text-secondary"
              >
                <span>
                  selected =
                  <span class="text-text-primary">
                    {{ scenarioCtrl.value?.length ?? 0 }} /
                    {{ s.items.length }}
                  </span>
                </span>
                <button
                  type="button"
                  (click)="resetScenario()"
                  class="inline-flex items-center gap-1 hover:text-text-primary transition-colors"
                >
                  <i class="ri-refresh-line" aria-hidden="true"></i>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Object items via textField / valueField"
          description="Directive form — input[nxpMultiSelect] inside nxp-textfield. Items are { code, name } objects: textField='name' makes the trigger show the country name, valueField='code' compares identity by code. No global provider needed."
          [content]="{ HTML: objectHtml, TypeScript: objectTs }"
        >
          <div class="w-full max-w-md">
            <nxp-textfield class="w-full">
              <label nxpLabel for="countries">Countries</label>
              <input
                nxpInput
                nxpMultiSelect
                id="countries"
                type="text"
                placeholder=" "
                textField="name"
                valueField="code"
                [formControl]="countriesCtrl"
                [items]="countries"
              />
              <ng-template nxpDropdown>
                <nxp-data-list>
                  @for (item of countries; track item.code) {
                    <nxp-multi-select-option [value]="item" />
                  }
                </nxp-data-list>
              </ng-template>
            </nxp-textfield>
            <p [class]="cls.mono + ' mt-1'">
              value = {{ countriesCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="chipSize controls pill density (sm by default) without affecting the wrapper height."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="w-full max-w-xl space-y-4">
            @for (s of sizes; track s.value) {
              <div class="space-y-1.5">
                <div class="flex items-baseline justify-between">
                  <label
                    nxpLabel
                    [attr.for]="'size-' + s.value"
                    [class]="cls.label"
                  >
                    {{ s.label }}
                  </label>
                  <code [class]="cls.code">chipSize="{{ s.value }}"</code>
                </div>
                <nxp-multi-select
                  [id]="'size-' + s.value"
                  class="w-full min-w-0"
                  [formControl]="sizeCtrls[s.value]"
                  [items]="fruits"
                  [chipSize]="s.value"
                />
              </div>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Empty list & disabled"
          description="emptyLabel customises the empty state. Disabled mirrors the flat input chrome — chips stay visible but cannot be removed and the dropdown cannot open."
          [content]="{ HTML: statesHtml, TypeScript: statesTs }"
        >
          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label nxpLabel for="empty" [class]="cls.label">
                  Empty list
                </label>
                <span [class]="cls.badge">items = []</span>
              </div>
              <nxp-multi-select
                id="empty"
                class="w-full min-w-0"
                [formControl]="emptyCtrl"
                [items]="[]"
                placeholder="Select…"
                emptyLabel="No options available"
              />
              <p [class]="cls.mono">value = {{ emptyCtrl.value | json }}</p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label nxpLabel for="disabled" [class]="cls.label">
                  Disabled
                </label>
                <span [class]="cls.badgeMuted">read-only</span>
              </div>
              <nxp-multi-select
                id="disabled"
                class="w-full min-w-0"
                [formControl]="disabledCtrl"
                [items]="fruits"
                placeholder="Disabled"
              />
              <p class="text-[11px] text-text-secondary">
                Chips render flat — no X button, no dropdown.
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Chip-less directive variant"
          description="Power-user form: <input nxpMultiSelect> inside <nxp-textfield>, mirroring the nxpComboBox architecture. Selection renders as comma-separated text in the input — pick this when the field should look identical to single-value selects."
          [content]="{ HTML: directiveHtml, TypeScript: directiveTs }"
        >
          <div class="w-80">
            <nxp-textfield class="w-full" [nxpDropdownMaxHeight]="220">
              <label nxpLabel for="directive-fruits">Favourite fruits</label>
              <input
                nxpInput
                nxpMultiSelect
                #ms="nxpMultiSelect"
                id="directive-fruits"
                type="text"
                placeholder="Select fruits…"
                [formControl]="directiveCtrl"
                [items]="fruits"
                readonly
              />
              <ng-template nxpDropdown>
                <nxp-data-list emptyLabel="No fruits">
                  @for (item of ms.items(); track item) {
                    <nxp-multi-select-option [value]="item" />
                  }
                </nxp-data-list>
              </ng-template>
            </nxp-textfield>
            <p [class]="cls.mono + ' mt-1'">
              value = {{ directiveCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Playground"
          description="Live preview bound to the API tab — edit any row over there to see this multi-select react. Values persist to the URL query string."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="w-full max-w-xl space-y-2">
            <label nxpLabel for="playground" [class]="cls.label">
              Playground
            </label>
            <nxp-multi-select
              id="playground"
              class="w-full min-w-0"
              [formControl]="playgroundCtrl"
              [items]="fruits"
              [placeholder]="placeholder()"
              [chipSize]="chipSize()"
              [emptyLabel]="emptyLabel()"
            />
            <p [class]="cls.mono">
              value =
              <span class="text-text-primary">
                {{ playgroundCtrl.value | json }}
              </span>
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-multi-select-api
          [(placeholder)]="placeholder"
          [(emptyLabel)]="emptyLabel"
          [(chipSize)]="chipSize"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class MultiSelectDemoComponent {
  readonly fruits = FRUITS;
  readonly countries = COUNTRIES;

  // -- hero ----------------------------------------------------------------
  readonly heroCtrl = new FormControl<readonly string[]>(['Apple', 'Mango']);
  readonly suggestions = [
    'Cherry',
    'Banana',
    'Kiwi',
    'Orange',
    'Strawberry',
    'Peach',
  ] as const;

  // -- scenarios -----------------------------------------------------------
  readonly scenarios: readonly Scenario[] = [
    {
      key: 'recipients',
      label: 'Mail',
      title: 'Notify on deploy',
      description:
        'Pick which channels receive a Slack ping when a Vercel deploy succeeds.',
      placeholder: 'Add channel…',
      items: [
        '#deploys',
        '#frontend',
        '#mobile',
        '#ops',
        '#design',
        '#oncall',
        '#release',
      ],
      seed: ['#deploys', '#oncall'],
    },
    {
      key: 'languages',
      label: 'i18n',
      title: 'Localised content',
      description:
        'Which locales should the marketing page be translated into for the next launch?',
      placeholder: 'Pick a locale…',
      items: [
        'English',
        'Spanish',
        'French',
        'German',
        'Japanese',
        'Portuguese',
        'Korean',
      ],
      seed: ['English', 'Japanese'],
    },
    {
      key: 'roles',
      label: 'IAM',
      title: 'Team permissions',
      description:
        'Grant access scopes to a teammate. Use the dropdown to multi-select roles; chip removal revokes a scope.',
      placeholder: 'Grant role…',
      items: ['admin', 'editor', 'viewer', 'billing', 'deploy', 'analytics'],
      seed: ['viewer', 'analytics'],
    },
  ];
  readonly scenarioKey = signal('recipients');
  readonly activeScenario = computed<Scenario>(
    () =>
      this.scenarios.find((s) => s.key === this.scenarioKey()) ??
      this.scenarios[0],
  );
  readonly scenarioCtrl = new FormControl<readonly string[]>([
    ...this.scenarios[0].seed,
  ]);

  // -- countries -----------------------------------------------------------
  readonly countriesCtrl = new FormControl<readonly Country[]>([]);

  // -- sizes ---------------------------------------------------------------
  readonly sizes: readonly SizeRow[] = [
    { value: 'sm', label: 'Small (default)' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];
  readonly sizeCtrls: Record<
    NxpChipSize,
    FormControl<readonly string[] | null>
  > = {
    sm: new FormControl<readonly string[]>(['Apple']),
    md: new FormControl<readonly string[]>(['Banana', 'Cherry']),
    lg: new FormControl<readonly string[]>(['Mango']),
  };

  // -- states --------------------------------------------------------------
  readonly emptyCtrl = new FormControl<readonly string[]>([]);
  readonly disabledCtrl = new FormControl<readonly string[]>({
    value: ['Banana', 'Orange'],
    disabled: true,
  });

  // -- directive variant ---------------------------------------------------
  readonly directiveCtrl = new FormControl<readonly string[]>([
    'Apple',
    'Kiwi',
  ]);

  // -- playground (bound to API tab) ---------------------------------------
  readonly playgroundCtrl = new FormControl<readonly string[]>([
    'Apple',
    'Cherry',
  ]);
  readonly placeholder = signal('Pick fruits…');
  readonly emptyLabel = signal('No options');
  readonly chipSize = signal<NxpChipSize>('sm');

  protected readonly cls = {
    label: 'text-sm font-medium text-text-primary tracking-tight',
    caption:
      'text-[11px] font-mono uppercase tracking-wider text-text-secondary',
    mono: 'text-[11px] font-mono text-text-secondary',
    code:
      'font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#fafafa] text-text-primary ' +
      'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] dark:bg-white/[0.04] ' +
      'dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]',
    card:
      'rounded-lg bg-white dark:bg-[#0a0a0a] p-5 ' +
      'shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)] ' +
      'dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
    pillIdle:
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ' +
      'transition-colors text-text-primary bg-white hover:bg-[#fafafa] ' +
      'shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:bg-[#0a0a0a] ' +
      'dark:hover:bg-white/[0.04] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
    pillAdded:
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ' +
      'transition-colors text-text-secondary bg-[#fafafa] cursor-default ' +
      'dark:bg-white/[0.03]',
    tabActive:
      'flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-md text-left ' +
      'whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink transition-colors ' +
      'bg-[#171717] text-white dark:bg-white dark:text-[#171717]',
    tabIdle:
      'flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-md text-left ' +
      'whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink transition-colors ' +
      'text-text-secondary hover:bg-[#fafafa] hover:text-text-primary ' +
      'dark:hover:bg-white/[0.04]',
    tabKicker: 'text-[11px] font-mono uppercase tracking-wider opacity-70',
    badge:
      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono ' +
      'uppercase tracking-wider bg-[#ebf5ff] text-[#0068d6] ' +
      'dark:bg-[#0068d6]/[0.14] dark:text-[#7bb6ff]',
    badgeMuted:
      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono ' +
      'uppercase tracking-wider bg-[#fafafa] text-text-secondary ' +
      'shadow-[0_0_0_1px_rgba(0,0,0,0.06)] dark:bg-white/[0.04] ' +
      'dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
  } as const;

  // -- hero handlers -------------------------------------------------------
  protected isHeroSelected(value: string): boolean {
    return this.heroCtrl.value?.includes(value) ?? false;
  }

  protected toggleHeroSuggestion(value: string): void {
    const current = this.heroCtrl.value ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    this.heroCtrl.setValue(next);
  }

  // -- scenario handlers ---------------------------------------------------
  protected selectScenario(key: string): void {
    this.scenarioKey.set(key);
    const next = this.scenarios.find((s) => s.key === key);
    if (next) this.scenarioCtrl.setValue([...next.seed]);
  }

  protected resetScenario(): void {
    this.scenarioCtrl.setValue([...this.activeScenario().seed]);
  }

  // -- code snippets -------------------------------------------------------

  readonly heroHtml = `<label nxpLabel for="hero-fruits">Favourite fruits</label>
<nxp-multi-select
  id="hero-fruits"
  class="w-full min-w-0"
  [formControl]="heroCtrl"
  [items]="fruits"
  placeholder="Select fruits…"
/>

@for (s of suggestions; track s) {
  <button type="button" (click)="toggleHeroSuggestion(s)">+ {{ s }}</button>
}`;

  readonly heroTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpMultiSelectComponent } from '@ngxpro/components/multi-select';

@Component({
  selector: 'app-hero-multi-select',
  imports: [ReactiveFormsModule, NxpLabelDirective, NxpMultiSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-multi-select.html',
})
export class HeroMultiSelectExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', /* ... */];
  readonly suggestions = ['Cherry', 'Banana', 'Kiwi', /* ... */];
  readonly heroCtrl = new FormControl<readonly string[]>(['Apple', 'Mango']);

  toggleHeroSuggestion(value: string): void {
    const current = this.heroCtrl.value ?? [];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    this.heroCtrl.setValue(next);
  }
}`;

  readonly scenariosHtml = `@for (s of scenarios; track s.key) {
  <button type="button" (click)="selectScenario(s.key)">{{ s.title }}</button>
}

<nxp-multi-select
  class="w-full min-w-0"
  [formControl]="scenarioCtrl"
  [items]="activeScenario().items"
  [placeholder]="activeScenario().placeholder"
/>`;

  readonly scenariosTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpMultiSelectComponent } from '@ngxpro/components/multi-select';

interface Scenario {
  readonly key: string;
  readonly title: string;
  readonly placeholder: string;
  readonly items: readonly string[];
  readonly seed: readonly string[];
}

@Component({
  selector: 'app-scenarios-multi-select',
  imports: [ReactiveFormsModule, NxpMultiSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scenarios-multi-select.html',
})
export class ScenariosMultiSelectExample {
  readonly scenarios: readonly Scenario[] = [
    { key: 'recipients', title: 'Notify on deploy', placeholder: 'Add channel…',
      items: ['#deploys', '#frontend', '#mobile', '#ops', '#design'],
      seed: ['#deploys', '#oncall'] },
    /* ... */
  ];
  readonly scenarioKey = signal('recipients');
  readonly activeScenario = computed(() =>
    this.scenarios.find(s => s.key === this.scenarioKey()) ?? this.scenarios[0],
  );
  readonly scenarioCtrl = new FormControl<readonly string[]>([...this.scenarios[0].seed]);

  selectScenario(key: string): void {
    this.scenarioKey.set(key);
    const next = this.scenarios.find(s => s.key === key);
    if (next) this.scenarioCtrl.setValue([...next.seed]);
  }
}`;

  readonly objectHtml = `<nxp-textfield class="w-full">
  <label nxpLabel for="countries">Countries</label>
  <input
    nxpInput
    nxpMultiSelect
    id="countries"
    type="text"
    placeholder=" "
    textField="name"
    valueField="code"
    [formControl]="countriesCtrl"
    [items]="countries"
  />
  <ng-template nxpDropdown>
    <nxp-data-list>
      @for (item of countries; track item.code) {
        <nxp-multi-select-option [value]="item" />
      }
    </nxp-data-list>
  </ng-template>
</nxp-textfield>
<p>value = {{ countriesCtrl.value | json }}</p>`;

  readonly objectTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';
import {
  NxpMultiSelectDirective,
  NxpMultiSelectOptionComponent,
} from '@ngxpro/components/multi-select';

interface Country {
  code: string;
  name: string;
}

@Component({
  selector: 'app-object-multi-select',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NxpDropdownContent,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    DataListComponent,
    NxpMultiSelectDirective,
    NxpMultiSelectOptionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './object-multi-select.html',
})
export class ObjectMultiSelectExample {
  readonly countries: Country[] = [
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    /* ... */
  ];
  readonly countriesCtrl = new FormControl<readonly Country[]>([]);
}`;

  readonly sizesHtml = `<nxp-multi-select [formControl]="smCtrl" [items]="fruits" chipSize="sm" />
<nxp-multi-select [formControl]="mdCtrl" [items]="fruits" chipSize="md" />
<nxp-multi-select [formControl]="lgCtrl" [items]="fruits" chipSize="lg" />`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpMultiSelectComponent } from '@ngxpro/components/multi-select';

@Component({
  selector: 'app-sizes-multi-select',
  imports: [ReactiveFormsModule, NxpMultiSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes-multi-select.html',
})
export class SizesMultiSelectExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', /* ... */];
  readonly smCtrl = new FormControl<readonly string[]>(['Apple']);
  readonly mdCtrl = new FormControl<readonly string[]>(['Banana', 'Cherry']);
  readonly lgCtrl = new FormControl<readonly string[]>(['Mango']);
}`;

  readonly statesHtml = `<label nxpLabel for="empty">Empty list</label>
<nxp-multi-select id="empty" class="w-full min-w-0" [formControl]="emptyCtrl" [items]="[]" placeholder="Select…" emptyLabel="No options available" />

<label nxpLabel for="disabled">Disabled</label>
<nxp-multi-select id="disabled" class="w-full min-w-0" [formControl]="disabledCtrl" [items]="fruits" placeholder="Disabled" />`;

  readonly statesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpMultiSelectComponent } from '@ngxpro/components/multi-select';

@Component({
  selector: 'app-states-multi-select',
  imports: [ReactiveFormsModule, NxpLabelDirective, NxpMultiSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './states-multi-select.html',
})
export class StatesMultiSelectExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', /* ... */];
  readonly emptyCtrl = new FormControl<readonly string[]>([]);
  readonly disabledCtrl = new FormControl<readonly string[]>({ value: ['Banana', 'Orange'], disabled: true });
}`;

  readonly directiveHtml = `<nxp-textfield class="w-full" [nxpDropdownMaxHeight]="220">
  <label nxpLabel for="fruits">Favourite fruits</label>
  <input
    nxpInput
    nxpMultiSelect
    #ms="nxpMultiSelect"
    id="fruits"
    type="text"
    placeholder="Select fruits…"
    [formControl]="directiveCtrl"
    [items]="fruits"
    readonly
  />
  <ng-template nxpDropdown>
    <nxp-data-list emptyLabel="No fruits">
      @for (item of ms.items(); track item) {
        <nxp-multi-select-option [value]="item" />
      }
    </nxp-data-list>
  </ng-template>
</nxp-textfield>`;

  readonly directiveTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { DataListComponent } from '@ngxpro/components/data-list';
import {
  NxpMultiSelectDirective,
  NxpMultiSelectOptionComponent,
} from '@ngxpro/components/multi-select';

@Component({
  selector: 'app-directive-multi-select',
  imports: [
    ReactiveFormsModule,
    NxpTextfieldComponent,
    NxpLabelDirective,
    NxpInputDirective,
    NxpDropdownContent,
    DataListComponent,
    NxpMultiSelectDirective,
    NxpMultiSelectOptionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './directive-multi-select.html',
})
export class DirectiveMultiSelectExample {
  readonly fruits = ['Apple', 'Banana', /* ... */];
  readonly directiveCtrl = new FormControl<readonly string[]>(['Apple', 'Kiwi']);
}`;

  readonly playgroundHtml = `<label nxpLabel for="playground">Playground</label>
<nxp-multi-select
  id="playground"
  class="w-full min-w-0"
  [formControl]="playgroundCtrl"
  [items]="fruits"
  [placeholder]="placeholder()"
  [chipSize]="chipSize()"
  [emptyLabel]="emptyLabel()"
/>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpMultiSelectComponent } from '@ngxpro/components/multi-select';
import type { NxpChipSize } from '@ngxpro/components/chip';

@Component({
  selector: 'app-playground-multi-select',
  imports: [ReactiveFormsModule, NxpLabelDirective, NxpMultiSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground-multi-select.html',
})
export class PlaygroundMultiSelectExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', /* ... */];
  readonly playgroundCtrl = new FormControl<readonly string[]>(['Apple', 'Cherry']);
  readonly placeholder = signal('Pick fruits…');
  readonly emptyLabel = signal('No options');
  readonly chipSize = signal<NxpChipSize>('sm');
}`;
}
