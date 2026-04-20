import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  DataListComponent,
  OptionDirective,
  OptGroupDirective,
} from '@nxp/components/data-list';
import { NxpCheckboxComponent } from '@nxp/cdk/components/checkbox';

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
  imports: [
    RouterModule,
    FormsModule,
    DataListComponent,
    OptionDirective,
    OptGroupDirective,
    NxpCheckboxComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

      <!-- ── Page header ─────────────────────────────────────────────────── -->
      <div class="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm px-6 py-4 flex items-center gap-4">
        <a
          routerLink="/"
          class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          &larr; Home
        </a>
        <span class="text-gray-300 dark:text-gray-700">|</span>
        <h1 class="text-sm font-semibold text-gray-900 dark:text-white">
          DataList
        </h1>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-12 space-y-20">

        <!-- ── Hero ───────────────────────────────────────────────────────── -->
        <div class="space-y-3">
          <span class="px-2 py-0.5 rounded text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            @nxp/components/data-list
          </span>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
            DataList
          </h1>
          <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
            Accessible listbox with animated proximity-hover indicators,
            keyboard navigation, sizes, groups, and empty state.
            Composable with checkboxes, inputs, and custom content.
          </p>
        </div>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 1 — Sizes                                             -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-8">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Sizes</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              Three size variants: <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">sm</code>,
              <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">md</code> (default),
              <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">lg</code>.
              Arrow / Home / End keys navigate without a mouse.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            <!-- Size: sm -->
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Size <code class="font-mono">sm</code>
              </h3>
              <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3">
                <nxp-data-list size="sm" label="Compact list">
                  <button nxpOption [selected]="dl1() === 'a'" (click)="dl1.set('a')">Option A</button>
                  <button nxpOption [selected]="dl1() === 'b'" (click)="dl1.set('b')">Option B</button>
                  <button nxpOption [selected]="dl1() === 'c'" (click)="dl1.set('c')">Option C</button>
                  <button nxpOption [disabled]="true">Disabled</button>
                </nxp-data-list>
              </div>
              <p class="text-xs text-gray-400">Selected: <strong>{{ dl1() ?? '—' }}</strong></p>
            </div>

            <!-- Size: md (default) -->
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Size <code class="font-mono">md</code> (default)
              </h3>
              <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3">
                <nxp-data-list label="Default list">
                  <button nxpOption [selected]="dl2() === 'x'" (click)="dl2.set('x')">Option X</button>
                  <button nxpOption [selected]="dl2() === 'y'" (click)="dl2.set('y')">Option Y</button>
                  <button nxpOption [selected]="dl2() === 'z'" (click)="dl2.set('z')">Option Z</button>
                </nxp-data-list>
              </div>
              <p class="text-xs text-gray-400">Selected: <strong>{{ dl2() ?? '—' }}</strong></p>
            </div>

            <!-- Size: lg -->
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Size <code class="font-mono">lg</code>
              </h3>
              <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3">
                <nxp-data-list size="lg" label="Large list">
                  <button nxpOption [selected]="dl3() === '1'" (click)="dl3.set('1')">Item 1</button>
                  <button nxpOption [selected]="dl3() === '2'" (click)="dl3.set('2')">Item 2</button>
                  <button nxpOption [selected]="dl3() === '3'" (click)="dl3.set('3')">Item 3</button>
                </nxp-data-list>
              </div>
              <p class="text-xs text-gray-400">Selected: <strong>{{ dl3() ?? '—' }}</strong></p>
            </div>

            <!-- Empty state -->
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Empty state</h3>
              <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3">
                <nxp-data-list emptyLabel="No options available" />
              </div>
              <p class="text-xs text-gray-400">Shown when no options are projected.</p>
            </div>

          </div>
        </section>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 2 — Grouped options via OptGroup                      -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-8">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Grouped options</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              Use <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">[nxpOptGroup]</code>
              to organize options into labeled groups with
              <code class="text-sm font-mono">role="group"</code> and <code class="text-sm font-mono">aria-label</code>.
            </p>
          </div>

          <div class="flex gap-8 items-start flex-wrap">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
              <nxp-data-list label="Grouped options" size="sm">
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
              </nxp-data-list>
            </div>
            <div class="text-sm space-y-1">
              <p class="text-gray-500 dark:text-gray-400 text-xs">Selected:</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ dlGroup() ?? '—' }}</p>
              <p class="text-xs text-gray-400 mt-4">
                Use &uarr; &darr; keys to navigate.<br>
                Home / End jump to first / last.
              </p>
            </div>
          </div>
        </section>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 3 — With checkboxes                                   -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-8">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">With checkboxes</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              Compose <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">nxp-checkbox</code>
              inside options for multi-select lists. The animated hover overlay
              still tracks pointer proximity.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Todo list -->
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Todo list
              </h3>
              <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 max-w-sm">
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
                      <span [class.line-through]="item.done" [class.text-gray-400]="item.done">
                        {{ item.label }}
                      </span>
                    </button>
                  }
                </nxp-data-list>
              </div>
              <p class="text-xs text-gray-400">
                Completed: <strong>{{ completedCount() }}</strong> / {{ todos.length }}
              </p>
            </div>

            <!-- Permissions list -->
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Permissions
              </h3>
              <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 max-w-md">
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
                        <span class="font-medium truncate">{{ perm.label }}</span>
                        <span class="text-xs text-gray-400 dark:text-gray-500 truncate">{{ perm.description }}</span>
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
        </section>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 4 — With input (filter)                               -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-8">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">With input filter</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              Place a native <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">&lt;input&gt;</code>
              above the data-list to create a filterable list. The animated hover
              indicators work seamlessly as items appear and disappear.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Filterable country list -->
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Country picker
              </h3>
              <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 max-w-xs">
                <input
                  type="text"
                  placeholder="Search countries..."
                  class="w-full mb-2 px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  [ngModel]="countryFilter()"
                  (ngModelChange)="countryFilter.set($event)"
                />
                <nxp-data-list size="sm" label="Countries" [emptyLabel]="'No countries match \u2018' + countryFilter() + '\u2019'">
                  @for (c of filteredCountries(); track c) {
                    <button nxpOption [selected]="selectedCountry() === c" (click)="selectedCountry.set(c)">
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
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Filterable multi-select
              </h3>
              <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 max-w-xs">
                <input
                  type="text"
                  placeholder="Filter languages..."
                  class="w-full mb-2 px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  [ngModel]="langFilter()"
                  (ngModelChange)="langFilter.set($event)"
                />
                <nxp-data-list size="sm" label="Languages" [emptyLabel]="'No match'">
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
        </section>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 5 — With icons and descriptions                       -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-8">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Rich content</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              Options can contain arbitrary projected content — icons,
              descriptions, badges, etc.
            </p>
          </div>

          <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 inline-block max-w-sm">
            <nxp-data-list label="Actions">
              <button nxpOption [selected]="richSelected() === 'profile'" (click)="richSelected.set('profile')">
                <svg class="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <div class="flex flex-col min-w-0">
                  <span class="font-medium">Profile</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">View and edit your profile</span>
                </div>
              </button>
              <button nxpOption [selected]="richSelected() === 'settings'" (click)="richSelected.set('settings')">
                <svg class="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div class="flex flex-col min-w-0">
                  <span class="font-medium">Settings</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Manage account settings</span>
                </div>
              </button>
              <button nxpOption [selected]="richSelected() === 'billing'" (click)="richSelected.set('billing')">
                <svg class="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                <div class="flex flex-col min-w-0">
                  <span class="font-medium">Billing</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Invoices and payment methods</span>
                </div>
                <span class="ml-auto shrink-0 text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded">Pro</span>
              </button>
              <button nxpOption [disabled]="true">
                <svg class="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span class="font-medium">Sign out</span>
              </button>
            </nxp-data-list>
          </div>
        </section>

      </div>
    </div>
  `,
})
export class DataListDemoComponent {
  // ------------------------------------------------------------------ Size demos
  readonly dl1 = signal<string | null>(null);
  readonly dl2 = signal<string | null>(null);
  readonly dl3 = signal<string | null>(null);
  readonly dlGroup = signal<string | null>(null);

  // ------------------------------------------------------------------ Checkbox demos
  readonly todos: TodoItem[] = [
    { label: 'Review pull request', done: false },
    { label: 'Update documentation', done: true },
    { label: 'Fix failing tests', done: false },
    { label: 'Deploy to staging', done: false },
    { label: 'Write changelog', done: false },
  ];

  readonly permissions: Permission[] = [
    { label: 'Read', description: 'View resources and data', enabled: true },
    { label: 'Write', description: 'Create and modify resources', enabled: true },
    { label: 'Delete', description: 'Remove resources permanently', enabled: false },
    { label: 'Admin', description: 'Full system administration', enabled: false },
  ];

  completedCount = () => this.todos.filter((t) => t.done).length;
  enabledPermissions = () =>
    this.permissions
      .filter((p) => p.enabled)
      .map((p) => p.label)
      .join(', ');

  // ------------------------------------------------------------------ Filter demos
  readonly countries = [
    'Argentina', 'Australia', 'Brazil', 'Canada', 'China',
    'France', 'Germany', 'India', 'Italy', 'Japan',
    'Mexico', 'Netherlands', 'Norway', 'South Korea',
    'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',
  ];
  readonly countryFilter = signal('');
  readonly selectedCountry = signal<string | null>(null);
  readonly filteredCountries = () => {
    const q = this.countryFilter().toLowerCase();
    return q ? this.countries.filter((c) => c.toLowerCase().includes(q)) : this.countries;
  };

  readonly languages = [
    'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go',
    'Java', 'C#', 'C++', 'Ruby', 'Swift', 'Kotlin', 'Dart',
  ];
  readonly langFilter = signal('');
  readonly selectedLangs = signal(new Set<string>());
  readonly filteredLanguages = () => {
    const q = this.langFilter().toLowerCase();
    return q ? this.languages.filter((l) => l.toLowerCase().includes(q)) : this.languages;
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

  // ------------------------------------------------------------------ Rich content demo
  readonly richSelected = signal<string | null>(null);
}
