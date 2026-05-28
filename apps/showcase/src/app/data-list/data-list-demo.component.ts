import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DataListComponent,
  OptionDirective,
  OptGroupDirective,
} from '@ngxpro/components/data-list';
import { NxpCheckboxDirective } from '@ngxpro/cdk/components/checkbox';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { DataListApiComponent } from './data-list-api.component';

// ------------------------------------------------------------------ types

interface TodoItem {
  label: string;
  done: boolean;
}

interface Permission {
  label: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-data-list-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    DataListComponent,
    OptionDirective,
    OptGroupDirective,
    NxpCheckboxDirective,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    DataListApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="DataList"
      package="components"
      type="component"
      path="components/data-list"
    >
      <p class="text-base text-text-secondary mb-6">
        Accessible listbox with animated proximity-hover indicators, keyboard
        navigation, sizes, groups, and empty state. Composable with checkboxes,
        inputs, and custom content.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Live wiring of the data-list inputs from the API tab. Tweak label, size, and emptyLabel below to see the listbox react."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div
            class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3 w-full max-w-xs"
          >
            <nxp-data-list
              [label]="label()"
              [size]="size()"
              [emptyLabel]="emptyLabel()"
              [class]="extraClass()"
            >
              <button
                nxpOption
                [selected]="playgroundSelected() === 'a'"
                (click)="playgroundSelected.set('a')"
              >
                Option A
              </button>
              <button
                nxpOption
                [selected]="playgroundSelected() === 'b'"
                (click)="playgroundSelected.set('b')"
              >
                Option B
              </button>
              <button
                nxpOption
                [selected]="playgroundSelected() === 'c'"
                (click)="playgroundSelected.set('c')"
              >
                Option C
              </button>
              <button nxpOption [disabled]="true">Disabled</button>
            </nxp-data-list>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="Three size variants: sm, md (default), lg. Arrow / Home / End keys navigate without a mouse."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Size: sm -->
            <div class="space-y-3">
              <h3
                class="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Size <code class="font-mono">sm</code>
              </h3>
              <div
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3"
              >
                <nxp-data-list size="sm" label="Compact list">
                  <button
                    nxpOption
                    [selected]="dl1() === 'a'"
                    (click)="dl1.set('a')"
                  >
                    Option A
                  </button>
                  <button
                    nxpOption
                    [selected]="dl1() === 'b'"
                    (click)="dl1.set('b')"
                  >
                    Option B
                  </button>
                  <button
                    nxpOption
                    [selected]="dl1() === 'c'"
                    (click)="dl1.set('c')"
                  >
                    Option C
                  </button>
                  <button nxpOption [disabled]="true">Disabled</button>
                </nxp-data-list>
              </div>
              <p class="text-xs text-gray-400">
                Selected: <strong>{{ dl1() ?? '—' }}</strong>
              </p>
            </div>

            <!-- Size: md (default) -->
            <div class="space-y-3">
              <h3
                class="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Size <code class="font-mono">md</code> (default)
              </h3>
              <div
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3"
              >
                <nxp-data-list label="Default list">
                  <button
                    nxpOption
                    [selected]="dl2() === 'x'"
                    (click)="dl2.set('x')"
                  >
                    Option X
                  </button>
                  <button
                    nxpOption
                    [selected]="dl2() === 'y'"
                    (click)="dl2.set('y')"
                  >
                    Option Y
                  </button>
                  <button
                    nxpOption
                    [selected]="dl2() === 'z'"
                    (click)="dl2.set('z')"
                  >
                    Option Z
                  </button>
                </nxp-data-list>
              </div>
              <p class="text-xs text-gray-400">
                Selected: <strong>{{ dl2() ?? '—' }}</strong>
              </p>
            </div>

            <!-- Size: lg -->
            <div class="space-y-3">
              <h3
                class="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Size <code class="font-mono">lg</code>
              </h3>
              <div
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3"
              >
                <nxp-data-list size="lg" label="Large list">
                  <button
                    nxpOption
                    [selected]="dl3() === '1'"
                    (click)="dl3.set('1')"
                  >
                    Item 1
                  </button>
                  <button
                    nxpOption
                    [selected]="dl3() === '2'"
                    (click)="dl3.set('2')"
                  >
                    Item 2
                  </button>
                  <button
                    nxpOption
                    [selected]="dl3() === '3'"
                    (click)="dl3.set('3')"
                  >
                    Item 3
                  </button>
                </nxp-data-list>
              </div>
              <p class="text-xs text-gray-400">
                Selected: <strong>{{ dl3() ?? '—' }}</strong>
              </p>
            </div>

            <!-- Empty state -->
            <div class="space-y-3">
              <h3
                class="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Empty state
              </h3>
              <div
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3"
              >
                <nxp-data-list emptyLabel="No options available" />
              </div>
              <p class="text-xs text-gray-400">
                Shown when no options are projected.
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Grouped options"
          description='Use [nxpOptGroup] to organize options into labeled groups with role="group" and aria-label.'
          [content]="{ HTML: groupedHtml, TypeScript: groupedTs }"
        >
          <div class="flex gap-8 items-start flex-wrap">
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4"
            >
              <nxp-data-list label="Grouped options" size="sm">
                <div nxpOptGroup label="Fruits">
                  <button
                    nxpOption
                    [selected]="dlGroup() === 'apple'"
                    (click)="dlGroup.set('apple')"
                  >
                    Apple
                  </button>
                  <button
                    nxpOption
                    [selected]="dlGroup() === 'banana'"
                    (click)="dlGroup.set('banana')"
                  >
                    Banana
                  </button>
                  <button
                    nxpOption
                    [selected]="dlGroup() === 'cherry'"
                    (click)="dlGroup.set('cherry')"
                  >
                    Cherry
                  </button>
                </div>
                <div nxpOptGroup label="Vegetables">
                  <button
                    nxpOption
                    [selected]="dlGroup() === 'carrot'"
                    (click)="dlGroup.set('carrot')"
                  >
                    Carrot
                  </button>
                  <button
                    nxpOption
                    [selected]="dlGroup() === 'pea'"
                    (click)="dlGroup.set('pea')"
                  >
                    Pea
                  </button>
                </div>
                <div nxpOptGroup label="Grains">
                  <button nxpOption [disabled]="true">
                    Wheat (unavailable)
                  </button>
                  <button
                    nxpOption
                    [selected]="dlGroup() === 'rice'"
                    (click)="dlGroup.set('rice')"
                  >
                    Rice
                  </button>
                </div>
              </nxp-data-list>
            </div>
            <div class="text-sm space-y-1">
              <p class="text-gray-500 dark:text-gray-400 text-xs">Selected:</p>
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ dlGroup() ?? '—' }}
              </p>
              <p class="text-xs text-gray-400 mt-4">
                Use &uarr; &darr; keys to navigate.<br />
                Home / End jump to first / last.
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="With checkboxes"
          description="Compose nxp-checkbox inside options for multi-select lists. The animated hover overlay still tracks pointer proximity."
          [content]="{ HTML: checkboxesHtml, TypeScript: checkboxesTs }"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Todo list -->
            <div class="space-y-3">
              <h3
                class="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Todo list
              </h3>
              <div
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 max-w-sm"
              >
                <nxp-data-list label="Todo items">
                  @for (item of todos; track item.label) {
                    <button nxpOption (click)="item.done = !item.done">
                      <input
                        type="checkbox"
                        nxpCheckbox
                        size="s"
                        [ngModel]="item.done"
                        (click)="$event.stopPropagation()"
                        (ngModelChange)="item.done = $event"
                      />
                      <span
                        [class.line-through]="item.done"
                        [class.text-gray-400]="item.done"
                      >
                        {{ item.label }}
                      </span>
                    </button>
                  }
                </nxp-data-list>
              </div>
              <p class="text-xs text-gray-400">
                Completed: <strong>{{ completedCount() }}</strong> /
                {{ todos.length }}
              </p>
            </div>

            <!-- Permissions list -->
            <div class="space-y-3">
              <h3
                class="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Permissions
              </h3>
              <div
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 max-w-md"
              >
                <nxp-data-list label="Permissions" size="lg">
                  @for (perm of permissions; track perm.label) {
                    <button nxpOption (click)="perm.enabled = !perm.enabled">
                      <input
                        type="checkbox"
                        nxpCheckbox
                        size="s"
                        [ngModel]="perm.enabled"
                        (click)="$event.stopPropagation()"
                        (ngModelChange)="perm.enabled = $event"
                      />
                      <div class="flex flex-col gap-0.5 min-w-0">
                        <span class="font-medium truncate">{{
                          perm.label
                        }}</span>
                        <span
                          class="text-xs text-gray-400 dark:text-gray-500 truncate"
                          >{{ perm.description }}</span
                        >
                      </div>
                    </button>
                  }
                </nxp-data-list>
              </div>
              <p class="text-xs text-gray-400">
                Enabled: <strong>{{ enabledPermissions() }}</strong>
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="With input filter"
          description="Place a native <input> above the data-list to create a filterable list. The animated hover indicators work seamlessly as items appear and disappear."
          [content]="{ HTML: filterHtml, TypeScript: filterTs }"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Filterable country list -->
            <div class="space-y-3">
              <h3
                class="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Country picker
              </h3>
              <div
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 max-w-xs"
              >
                <input
                  type="text"
                  placeholder="Search countries..."
                  class="w-full mb-2 px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  [ngModel]="countryFilter()"
                  (ngModelChange)="countryFilter.set($event)"
                />
                <nxp-data-list
                  size="sm"
                  label="Countries"
                  [emptyLabel]="'No countries match ‘' + countryFilter() + '’'"
                >
                  @for (c of filteredCountries(); track c) {
                    <button
                      nxpOption
                      [selected]="selectedCountry() === c"
                      (click)="selectedCountry.set(c)"
                    >
                      {{ c }}
                    </button>
                  }
                </nxp-data-list>
              </div>
              <p class="text-xs text-gray-400">
                Selected: <strong>{{ selectedCountry() ?? '—' }}</strong>
              </p>
            </div>

            <!-- Filterable multi-select with checkboxes -->
            <div class="space-y-3">
              <h3
                class="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Filterable multi-select
              </h3>
              <div
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 max-w-xs"
              >
                <input
                  type="text"
                  placeholder="Filter languages..."
                  class="w-full mb-2 px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  [ngModel]="langFilter()"
                  (ngModelChange)="langFilter.set($event)"
                />
                <nxp-data-list
                  size="sm"
                  label="Languages"
                  [emptyLabel]="'No match'"
                >
                  @for (lang of filteredLanguages(); track lang) {
                    <button nxpOption (click)="toggleLang(lang)">
                      <input
                        type="checkbox"
                        nxpCheckbox
                        size="s"
                        [ngModel]="selectedLangs().has(lang)"
                        (click)="$event.stopPropagation()"
                        (ngModelChange)="toggleLang(lang)"
                      />
                      {{ lang }}
                    </button>
                  }
                </nxp-data-list>
              </div>
              <p class="text-xs text-gray-400">
                Selected: <strong>{{ selectedLangsDisplay() || '—' }}</strong>
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Rich content"
          description="Options can contain arbitrary projected content — icons, descriptions, badges, etc."
          [content]="{ HTML: richHtml, TypeScript: richTs }"
        >
          <div
            class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 inline-block max-w-sm"
          >
            <nxp-data-list label="Actions">
              <button
                nxpOption
                [selected]="richSelected() === 'profile'"
                (click)="richSelected.set('profile')"
              >
                <svg
                  class="h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div class="flex flex-col min-w-0">
                  <span class="font-medium">Profile</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500"
                    >View and edit your profile</span
                  >
                </div>
              </button>
              <button
                nxpOption
                [selected]="richSelected() === 'settings'"
                (click)="richSelected.set('settings')"
              >
                <svg
                  class="h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div class="flex flex-col min-w-0">
                  <span class="font-medium">Settings</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500"
                    >Manage account settings</span
                  >
                </div>
              </button>
              <button
                nxpOption
                [selected]="richSelected() === 'billing'"
                (click)="richSelected.set('billing')"
              >
                <svg
                  class="h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <div class="flex flex-col min-w-0">
                  <span class="font-medium">Billing</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500"
                    >Invoices and payment methods</span
                  >
                </div>
                <span
                  class="ml-auto shrink-0 text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded"
                  >Pro</span
                >
              </button>
              <button nxpOption [disabled]="true">
                <svg
                  class="h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span class="font-medium">Sign out</span>
              </button>
            </nxp-data-list>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-data-list-api
          [(label)]="label"
          [(emptyLabel)]="emptyLabel"
          [(size)]="size"
          [(class)]="extraClass"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class DataListDemoComponent {
  // ── Playground state (shared with API tab) ──────────────────────────────
  readonly label = signal<string>('Playground list');
  readonly emptyLabel = signal<string>('No options');
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly extraClass = signal<string>('');
  readonly playgroundSelected = signal<string | null>(null);

  // ── Size demos ──────────────────────────────────────────────────────────
  readonly dl1 = signal<string | null>(null);
  readonly dl2 = signal<string | null>(null);
  readonly dl3 = signal<string | null>(null);
  readonly dlGroup = signal<string | null>(null);

  // ── Checkbox demos ──────────────────────────────────────────────────────
  readonly todos: TodoItem[] = [
    { label: 'Review pull request', done: false },
    { label: 'Update documentation', done: true },
    { label: 'Fix failing tests', done: false },
    { label: 'Deploy to staging', done: false },
    { label: 'Write changelog', done: false },
  ];

  readonly permissions: Permission[] = [
    { label: 'Read', description: 'View resources and data', enabled: true },
    {
      label: 'Write',
      description: 'Create and modify resources',
      enabled: true,
    },
    {
      label: 'Delete',
      description: 'Remove resources permanently',
      enabled: false,
    },
    {
      label: 'Admin',
      description: 'Full system administration',
      enabled: false,
    },
  ];

  completedCount = () => this.todos.filter((t) => t.done).length;
  enabledPermissions = () =>
    this.permissions
      .filter((p) => p.enabled)
      .map((p) => p.label)
      .join(', ');

  // ── Filter demos ────────────────────────────────────────────────────────
  readonly countries = [
    'Argentina',
    'Australia',
    'Brazil',
    'Canada',
    'China',
    'France',
    'Germany',
    'India',
    'Italy',
    'Japan',
    'Mexico',
    'Netherlands',
    'Norway',
    'South Korea',
    'Spain',
    'Sweden',
    'Switzerland',
    'United Kingdom',
    'United States',
  ];
  readonly countryFilter = signal('');
  readonly selectedCountry = signal<string | null>(null);
  readonly filteredCountries = () => {
    const q = this.countryFilter().toLowerCase();
    return q
      ? this.countries.filter((c) => c.toLowerCase().includes(q))
      : this.countries;
  };

  readonly languages = [
    'TypeScript',
    'JavaScript',
    'Python',
    'Rust',
    'Go',
    'Java',
    'C#',
    'C++',
    'Ruby',
    'Swift',
    'Kotlin',
    'Dart',
  ];
  readonly langFilter = signal('');
  readonly selectedLangs = signal(new Set<string>());
  readonly filteredLanguages = () => {
    const q = this.langFilter().toLowerCase();
    return q
      ? this.languages.filter((l) => l.toLowerCase().includes(q))
      : this.languages;
  };
  readonly selectedLangsDisplay = () => [...this.selectedLangs()].join(', ');

  toggleLang(lang: string): void {
    const next = new Set(this.selectedLangs());
    if (next.has(lang)) {
      next.delete(lang);
    } else {
      next.add(lang);
    }
    this.selectedLangs.set(next);
  }

  // ── Rich content demo ───────────────────────────────────────────────────
  readonly richSelected = signal<string | null>(null);

  // ── Example source snippets shown inside <nxp-doc-example> tabs ─────────
  readonly playgroundHtml = `<nxp-data-list
  [label]="label()"
  [size]="size()"
  [emptyLabel]="emptyLabel()"
>
  <button nxpOption [selected]="selected() === 'a'" (click)="selected.set('a')">Option A</button>
  <button nxpOption [selected]="selected() === 'b'" (click)="selected.set('b')">Option B</button>
  <button nxpOption [selected]="selected() === 'c'" (click)="selected.set('c')">Option C</button>
  <button nxpOption [disabled]="true">Disabled</button>
</nxp-data-list>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DataListComponent,
  OptionDirective,
} from '@ngxpro/components/data-list';

@Component({
  selector: 'app-data-list-playground',
  imports: [DataListComponent, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class DataListPlaygroundExample {
  readonly label = signal<string>('Playground list');
  readonly emptyLabel = signal<string>('No options');
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly selected = signal<string | null>(null);
}`;

  readonly sizesHtml = `<!-- sm -->
<nxp-data-list size="sm" label="Compact list">
  <button nxpOption [selected]="dl1() === 'a'" (click)="dl1.set('a')">Option A</button>
  <button nxpOption [selected]="dl1() === 'b'" (click)="dl1.set('b')">Option B</button>
  <button nxpOption [disabled]="true">Disabled</button>
</nxp-data-list>

<!-- md (default) -->
<nxp-data-list label="Default list">
  <button nxpOption [selected]="dl2() === 'x'" (click)="dl2.set('x')">Option X</button>
  <button nxpOption [selected]="dl2() === 'y'" (click)="dl2.set('y')">Option Y</button>
</nxp-data-list>

<!-- lg -->
<nxp-data-list size="lg" label="Large list">
  <button nxpOption [selected]="dl3() === '1'" (click)="dl3.set('1')">Item 1</button>
  <button nxpOption [selected]="dl3() === '2'" (click)="dl3.set('2')">Item 2</button>
</nxp-data-list>

<!-- Empty -->
<nxp-data-list emptyLabel="No options available" />`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DataListComponent,
  OptionDirective,
} from '@ngxpro/components/data-list';

@Component({
  selector: 'app-data-list-sizes',
  imports: [DataListComponent, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes.html',
})
export class DataListSizesExample {
  readonly dl1 = signal<string | null>(null);
  readonly dl2 = signal<string | null>(null);
  readonly dl3 = signal<string | null>(null);
}`;

  readonly groupedHtml = `<nxp-data-list label="Grouped options" size="sm">
  <div nxpOptGroup label="Fruits">
    <button nxpOption [selected]="dlGroup() === 'apple'" (click)="dlGroup.set('apple')">Apple</button>
    <button nxpOption [selected]="dlGroup() === 'banana'" (click)="dlGroup.set('banana')">Banana</button>
    <button nxpOption [selected]="dlGroup() === 'cherry'" (click)="dlGroup.set('cherry')">Cherry</button>
  </div>
  <div nxpOptGroup label="Vegetables">
    <button nxpOption [selected]="dlGroup() === 'carrot'" (click)="dlGroup.set('carrot')">Carrot</button>
    <button nxpOption [selected]="dlGroup() === 'pea'" (click)="dlGroup.set('pea')">Pea</button>
  </div>
  <div nxpOptGroup label="Grains">
    <button nxpOption [disabled]="true">Wheat (unavailable)</button>
    <button nxpOption [selected]="dlGroup() === 'rice'" (click)="dlGroup.set('rice')">Rice</button>
  </div>
</nxp-data-list>`;

  readonly groupedTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DataListComponent,
  OptGroupDirective,
  OptionDirective,
} from '@ngxpro/components/data-list';

@Component({
  selector: 'app-data-list-grouped',
  imports: [DataListComponent, OptGroupDirective, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grouped.html',
})
export class DataListGroupedExample {
  readonly dlGroup = signal<string | null>(null);
}`;

  readonly checkboxesHtml = `<!-- Todo list -->
<nxp-data-list label="Todo items">
  @for (item of todos; track item.label) {
    <button nxpOption (click)="item.done = !item.done">
      <input
        type="checkbox"
        nxpCheckbox
        size="s"
        [ngModel]="item.done"
        (click)="$event.stopPropagation()"
        (ngModelChange)="item.done = $event"
      />
      <span [class.line-through]="item.done">{{ item.label }}</span>
    </button>
  }
</nxp-data-list>

<!-- Permissions list -->
<nxp-data-list label="Permissions" size="lg">
  @for (perm of permissions; track perm.label) {
    <button nxpOption (click)="perm.enabled = !perm.enabled">
      <input type="checkbox" nxpCheckbox size="s" [ngModel]="perm.enabled"
        (click)="$event.stopPropagation()"
        (ngModelChange)="perm.enabled = $event" />
      <div class="flex flex-col gap-0.5 min-w-0">
        <span class="font-medium truncate">{{ perm.label }}</span>
        <span class="text-xs text-text-tertiary truncate">{{ perm.description }}</span>
      </div>
    </button>
  }
</nxp-data-list>`;

  readonly checkboxesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpCheckboxDirective } from '@ngxpro/cdk/components/checkbox';
import {
  DataListComponent,
  OptionDirective,
} from '@ngxpro/components/data-list';

interface TodoItem {
  label: string;
  done: boolean;
}

interface Permission {
  label: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-data-list-checkboxes',
  imports: [
    FormsModule,
    NxpCheckboxDirective,
    DataListComponent,
    OptionDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkboxes.html',
})
export class DataListCheckboxesExample {
  readonly todos: TodoItem[] = [
    { label: 'Review pull request', done: false },
    { label: 'Update documentation', done: true },
    { label: 'Fix failing tests', done: false },
  ];

  readonly permissions: Permission[] = [
    { label: 'Read', description: 'View resources and data', enabled: true },
    { label: 'Write', description: 'Create and modify resources', enabled: true },
    { label: 'Delete', description: 'Remove resources permanently', enabled: false },
  ];
}`;

  readonly filterHtml = `<!-- Country picker -->
<input
  type="text"
  placeholder="Search countries..."
  [ngModel]="countryFilter()"
  (ngModelChange)="countryFilter.set($event)"
/>
<nxp-data-list size="sm" label="Countries"
  [emptyLabel]="'No countries match ‘' + countryFilter() + '’'">
  @for (c of filteredCountries(); track c) {
    <button nxpOption [selected]="selectedCountry() === c" (click)="selectedCountry.set(c)">
      {{ c }}
    </button>
  }
</nxp-data-list>

<!-- Multi-select with checkboxes -->
<input
  type="text"
  placeholder="Filter languages..."
  [ngModel]="langFilter()"
  (ngModelChange)="langFilter.set($event)"
/>
<nxp-data-list size="sm" label="Languages" [emptyLabel]="'No match'">
  @for (lang of filteredLanguages(); track lang) {
    <button nxpOption (click)="toggleLang(lang)">
      <input type="checkbox" nxpCheckbox size="s"
        [ngModel]="selectedLangs().has(lang)"
        (click)="$event.stopPropagation()"
        (ngModelChange)="toggleLang(lang)" />
      {{ lang }}
    </button>
  }
</nxp-data-list>`;

  readonly filterTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpCheckboxDirective } from '@ngxpro/cdk/components/checkbox';
import {
  DataListComponent,
  OptionDirective,
} from '@ngxpro/components/data-list';

@Component({
  selector: 'app-data-list-filter',
  imports: [
    FormsModule,
    NxpCheckboxDirective,
    DataListComponent,
    OptionDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter.html',
})
export class DataListFilterExample {
  readonly countries = ['Argentina', 'Australia', 'Brazil', 'Canada', /* … */];
  readonly countryFilter = signal('');
  readonly selectedCountry = signal<string | null>(null);
  readonly filteredCountries = () => {
    const q = this.countryFilter().toLowerCase();
    return q ? this.countries.filter((c) => c.toLowerCase().includes(q)) : this.countries;
  };

  readonly languages = ['TypeScript', 'JavaScript', 'Python', /* … */];
  readonly langFilter = signal('');
  readonly selectedLangs = signal(new Set<string>());
  readonly filteredLanguages = () => {
    const q = this.langFilter().toLowerCase();
    return q ? this.languages.filter((l) => l.toLowerCase().includes(q)) : this.languages;
  };

  toggleLang(lang: string): void {
    const next = new Set(this.selectedLangs());
    next.has(lang) ? next.delete(lang) : next.add(lang);
    this.selectedLangs.set(next);
  }
}`;

  readonly richHtml = `<nxp-data-list label="Actions">
  <button nxpOption [selected]="richSelected() === 'profile'"
          (click)="richSelected.set('profile')">
    <svg class="h-4 w-4 shrink-0 text-gray-400" ...>...</svg>
    <div class="flex flex-col min-w-0">
      <span class="font-medium">Profile</span>
      <span class="text-xs text-text-tertiary">View and edit your profile</span>
    </div>
  </button>
  <button nxpOption [selected]="richSelected() === 'billing'"
          (click)="richSelected.set('billing')">
    <svg ...>...</svg>
    <div class="flex flex-col min-w-0">
      <span class="font-medium">Billing</span>
      <span class="text-xs text-text-tertiary">Invoices and payment methods</span>
    </div>
    <span class="ml-auto text-xs font-medium px-1.5 py-0.5 rounded
                 bg-blue-50 text-blue-500">Pro</span>
  </button>
  <button nxpOption [disabled]="true">
    <svg ...>...</svg>
    <span class="font-medium">Sign out</span>
  </button>
</nxp-data-list>`;

  readonly richTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DataListComponent,
  OptionDirective,
} from '@ngxpro/components/data-list';

@Component({
  selector: 'app-data-list-rich',
  imports: [DataListComponent, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rich.html',
})
export class DataListRichExample {
  readonly richSelected = signal<string | null>(null);
}`;
}
