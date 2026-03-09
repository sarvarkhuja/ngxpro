import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CalendarRangeComponent,
  createDefaultDateRangePeriods,
  DateRangePeriod,
} from '@nxp/components/calendar-range';
import type { DisabledHandler } from 'libs/cdk/src/lib/components/calendar/src';
import {
  DataListComponent,
  NxpDataList,
  OptionDirective,
  OptGroupDirective,
} from '@nxp/components/data-list';

// ------------------------------------------------------------------ helpers

function fmt(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRange(range: [Date, Date] | null): string {
  if (!range) return '—';
  return `${fmt(range[0])} – ${fmt(range[1])}`;
}

function offsetDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// ------------------------------------------------------------------ grouped presets

function createGroupedPresets(): { group: string; items: DateRangePeriod[] }[] {
  const today = new Date();
  const sod = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const t = sod(today);
  const yesterday = new Date(t);
  yesterday.setDate(t.getDate() - 1);
  const startOfWeek = new Date(t);
  startOfWeek.setDate(t.getDate() - ((t.getDay() + 6) % 7));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const startOfMonth = new Date(t.getFullYear(), t.getMonth(), 1);
  const endOfMonth = new Date(t.getFullYear(), t.getMonth() + 1, 0);
  const startLastMonth = new Date(t.getFullYear(), t.getMonth() - 1, 1);
  const endLastMonth = new Date(t.getFullYear(), t.getMonth(), 0);
  const startQ = new Date(t.getFullYear(), Math.floor(t.getMonth() / 3) * 3, 1);
  const endQ = new Date(startQ.getFullYear(), startQ.getMonth() + 3, 0);
  const startYear = new Date(t.getFullYear(), 0, 1);
  const endYear = new Date(t.getFullYear(), 11, 31);

  return [
    {
      group: 'Quick',
      items: [
        new DateRangePeriod([t, t], 'Today'),
        new DateRangePeriod([yesterday, yesterday], 'Yesterday'),
        new DateRangePeriod([offsetDate(-7), t], 'Last 7 days'),
        new DateRangePeriod([offsetDate(-30), t], 'Last 30 days'),
      ],
    },
    {
      group: 'This period',
      items: [
        new DateRangePeriod([startOfWeek, endOfWeek], 'This week'),
        new DateRangePeriod([startOfMonth, endOfMonth], 'This month'),
        new DateRangePeriod([startQ, endQ], 'This quarter'),
        new DateRangePeriod([startYear, endYear], 'This year'),
      ],
    },
    {
      group: 'Previous period',
      items: [
        new DateRangePeriod([startLastMonth, endLastMonth], 'Last month'),
      ],
    },
  ];
}

/**
 * Full showcase demo for CalendarRange + DataList.
 *
 * Sections:
 *  1. DataList standalone — keyboard nav, sizes, groups, empty state
 *  2. Basic range picker — two calendars side-by-side
 *  3. Preset periods sidebar — DataList integration
 *  4. Grouped presets — OptGroup inside DataList
 *  5. Min / Max bounds (±30 days)
 *  6. Min / Max range length (3 – 14 days)
 *  7. Disabled weekends
 *  8. Custom marker handler
 */
@Component({
  selector: 'app-calendar-range-demo',
  standalone: true,
  imports: [
    CalendarRangeComponent,
    DataListComponent,
    OptionDirective,
    OptGroupDirective,
    RouterModule,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

      <!-- ── Page header ─────────────────────────────────────────────────── -->
      <div class="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm px-6 py-4 flex items-center gap-4">
        <a
          routerLink="/"
          class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Home
        </a>
        <span class="text-gray-300 dark:text-gray-700">|</span>
        <h1 class="text-sm font-semibold text-gray-900 dark:text-white">
          Calendar Range + DataList
        </h1>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-12 space-y-20">

        <!-- ── Hero ───────────────────────────────────────────────────────── -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-xs font-mono font-medium bg-primary/10 text-action border border-primary/30">
              @nxp/components/calendar-range
            </span>
            <span class="px-2 py-0.5 rounded text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              @nxp/components/data-list
            </span>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
            Calendar Range &amp; DataList
          </h1>
          <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
            Dual-calendar date-range picker with hover preview, keyboard navigation,
            preset periods via <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">NxpDataList</code>,
            and min / max constraints.
          </p>
        </div>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 1 — DataList standalone                               -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-8">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">DataList</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">nxp-data-list</code> +
              <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">button[nxpOption]</code> +
              <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">[nxpOptGroup]</code>
              — the @nxp equivalent of Taiga UI's <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">TuiDataList</code>.
              Role <code class="text-sm font-mono">listbox</code> on the container, role <code class="text-sm font-mono">option</code> on each button.
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

          <!-- Grouped options via OptGroup -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              With <code class="font-mono">[nxpOptGroup]</code> — grouped options
            </h3>
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 inline-flex">
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
              <div class="ml-6 flex items-start pt-2">
                <div class="text-sm space-y-1">
                  <p class="text-gray-500 dark:text-gray-400 text-xs">Selected:</p>
                  <p class="font-semibold text-gray-900 dark:text-white">{{ dlGroup() ?? '—' }}</p>
                  <p class="text-xs text-gray-400 mt-4">
                    Use ↑ ↓ keys to navigate.<br>
                    Home / End jump to first / last.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 2 — Basic range picker                                -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-6">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Basic range picker</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              Two calendars side-by-side. Click a start day, hover to preview, click an end day.
              Press <kbd class="px-1 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">Esc</kbd>
              to cancel a pick in progress.
            </p>
          </div>

          <div class="flex flex-col lg:flex-row gap-6 items-start">
            <nxp-calendar-range
              [value]="basicRange()"
              (valueChange)="basicRange.set($event)"
            />
            <div class="space-y-3 min-w-48">
              <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-1">
                <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">From</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ basicRange() ? fmt(basicRange()![0]) : '—' }}
                </p>
              </div>
              <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-1">
                <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">To</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ basicRange() ? fmt(basicRange()![1]) : '—' }}
                </p>
              </div>
              @if (basicRange()) {
                <div class="rounded-lg border border-primary/30 bg-primary/10 p-4 space-y-1">
                  <p class="text-xs font-medium text-action uppercase tracking-wide">Duration</p>
                  <p class="text-lg font-bold text-action">
                    {{ daysBetween(basicRange()!) }} days
                  </p>
                </div>
                <button
                  class="w-full text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 py-2 transition-colors"
                  (click)="basicRange.set(null)"
                >
                  Clear selection
                </button>
              }
            </div>
          </div>
        </section>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 3 — Preset periods sidebar (DataList)                 -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-6">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Preset periods
              <span class="ml-2 text-sm font-normal text-action align-middle">
                uses NxpDataList
              </span>
            </h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              Pass <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">[items]</code> to
              replace the second calendar with a <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">nxp-data-list</code> sidebar.
              Each preset is a <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">button[nxpOption]</code> with
              full keyboard navigation. Click the active item again to deselect.
            </p>
          </div>

          <div class="flex flex-col xl:flex-row gap-6 items-start">
            <nxp-calendar-range
              [items]="presets"
              [value]="presetsRange()"
              (valueChange)="presetsRange.set($event)"
            />
            <div class="space-y-2 min-w-56">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Selected range</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatRange(presetsRange()) }}
              </p>
              <p class="text-xs text-gray-400 pt-2">
                Tip: use ↑ ↓ in the sidebar to navigate presets via keyboard.
              </p>
            </div>
          </div>
        </section>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 4 — Grouped presets (OptGroup inside DataList)        -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-6">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Grouped presets</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              This demo builds the preset list manually with
              <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">[nxpOptGroup]</code>
              sections for Quick, This period, and Previous period groupings.
              Groups include <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">role="group"</code> and
              <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">aria-label</code> for full accessibility.
            </p>
          </div>

          <div class="inline-flex rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
            <!-- Left calendar -->
            <nxp-calendar-range
              [value]="groupedRange()"
              (valueChange)="groupedRange.set($event)"
            />
            <!-- Grouped preset sidebar (manual DataList) -->
            <div class="w-px bg-gray-200 dark:bg-gray-800 self-stretch"></div>
            <div class="p-3 flex flex-col justify-center">
              <nxp-data-list size="sm" label="Preset date ranges" class="min-w-[9rem]">
                @for (section of groupedPresets; track section.group) {
                  <div nxpOptGroup [label]="section.group">
                    @for (item of section.items; track item.label) {
                      <button
                        nxpOption
                        [selected]="isGroupedActive(item)"
                        (click)="onGroupedSelect(item)"
                      >
                        <span class="flex-1 truncate">{{ item.label }}</span>
                        @if (isGroupedActive(item)) {
                          <svg class="h-3.5 w-3.5 shrink-0 ml-auto" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd"/>
                          </svg>
                        }
                      </button>
                    }
                  </div>
                }
              </nxp-data-list>
            </div>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            Selected: <strong class="text-gray-900 dark:text-white">{{ formatRange(groupedRange()) }}</strong>
          </p>
        </section>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 5 — Min / Max bounds                                  -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-6">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Min / Max bounds</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              Restrict selectable dates to a window (here: ±30 days from today).
              Out-of-range days are rendered as disabled.
            </p>
          </div>
          <div class="flex flex-col lg:flex-row gap-6 items-start">
            <nxp-calendar-range
              [min]="boundsMin"
              [max]="boundsMax"
              [value]="boundsRange()"
              (valueChange)="boundsRange.set($event)"
            />
            <div class="space-y-2 text-sm">
              <p class="text-gray-500 dark:text-gray-400">
                <span class="font-medium text-gray-700 dark:text-gray-300">Min:</span>
                {{ fmt(boundsMin) }}
              </p>
              <p class="text-gray-500 dark:text-gray-400">
                <span class="font-medium text-gray-700 dark:text-gray-300">Max:</span>
                {{ fmt(boundsMax) }}
              </p>
              <p class="pt-2 font-medium text-gray-900 dark:text-white">
                {{ formatRange(boundsRange()) }}
              </p>
            </div>
          </div>
        </section>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 6 — Min / Max range length                            -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-6">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Min / Max range length</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              After picking the start date, only end dates that produce a range
              between <strong>3</strong> and <strong>14</strong> days are enabled.
              Days too close or too far are automatically disabled.
            </p>
          </div>
          <div class="flex flex-col lg:flex-row gap-6 items-start">
            <nxp-calendar-range
              [minLength]="3"
              [maxLength]="14"
              [value]="lengthRange()"
              (valueChange)="lengthRange.set($event)"
            />
            <div class="space-y-3 min-w-40">
              @if (lengthRange()) {
                <div class="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-4">
                  <p class="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Duration</p>
                  <p class="text-2xl font-bold text-green-700 dark:text-green-300">
                    {{ daysBetween(lengthRange()!) }}
                    <span class="text-sm font-normal">days</span>
                  </p>
                </div>
              } @else {
                <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 text-sm text-gray-400">
                  Pick a start date, then an end date 3–14 days away.
                </div>
              }
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatRange(lengthRange()) }}
              </p>
            </div>
          </div>
        </section>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 7 — Disabled weekends                                 -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-6">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Disabled weekends</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              Pass a <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">disabledHandler</code>
              to disable arbitrary dates. Here weekends (Sat/Sun) are non-selectable.
            </p>
          </div>
          <div class="flex flex-col lg:flex-row gap-6 items-start">
            <nxp-calendar-range
              [disabledHandler]="isWeekend"
              [value]="weekdayRange()"
              (valueChange)="weekdayRange.set($event)"
            />
            <div class="text-sm space-y-2">
              <p class="text-gray-500 dark:text-gray-400">Only Mon–Fri are selectable.</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ formatRange(weekdayRange()) }}
              </p>
            </div>
          </div>
        </section>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!--  SECTION 8 — Preset periods + bounds combined                  -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <section class="space-y-6">
          <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Presets + bounds combined</h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              Preset sidebar with min/max bounds applied. Dates outside ±60 days are disabled;
              preset items whose ranges fall outside bounds are still shown but will select out-of-range dates
              (useful for analytics dashboards where you want the label even if data is partial).
            </p>
          </div>
          <div class="flex flex-col xl:flex-row gap-6 items-start">
            <nxp-calendar-range
              [items]="presets"
              [min]="boundsMin"
              [max]="boundsMax"
              [value]="combinedRange()"
              (valueChange)="combinedRange.set($event)"
            />
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ formatRange(combinedRange()) }}
            </p>
          </div>
        </section>

      </div>
    </div>
  `,
})
export class CalendarRangeDemoComponent {
  // ------------------------------------------------------------------ DataList demos
  readonly dl1 = signal<string | null>(null);
  readonly dl2 = signal<string | null>(null);
  readonly dl3 = signal<string | null>(null);
  readonly dlGroup = signal<string | null>(null);

  // ------------------------------------------------------------------ CalendarRange demos
  readonly basicRange = signal<[Date, Date] | null>(null);
  readonly presetsRange = signal<[Date, Date] | null>(null);
  readonly boundsRange = signal<[Date, Date] | null>(null);
  readonly lengthRange = signal<[Date, Date] | null>(null);
  readonly weekdayRange = signal<[Date, Date] | null>(null);
  readonly groupedRange = signal<[Date, Date] | null>(null);
  readonly combinedRange = signal<[Date, Date] | null>(null);

  // ------------------------------------------------------------------ Preset data
  readonly presets: DateRangePeriod[] = createDefaultDateRangePeriods();
  readonly groupedPresets = createGroupedPresets();

  /** Active grouped preset (for the manual DataList demo). */
  private activeGroupedItem = signal<DateRangePeriod | null>(null);

  // ------------------------------------------------------------------ Bounds
  readonly boundsMin = offsetDate(-30);
  readonly boundsMax = offsetDate(30);

  // ------------------------------------------------------------------ Handlers
  readonly isWeekend: DisabledHandler = (d: Date) => {
    const day = d.getDay();
    return day === 0 || day === 6;
  };

  // ------------------------------------------------------------------ Helpers
  readonly fmt = fmt;
  readonly formatRange = formatRange;

  daysBetween(range: [Date, Date]): number {
    return (
      Math.round((range[1].getTime() - range[0].getTime()) / 86_400_000) + 1
    );
  }

  // ------------------------------------------------------------------ Grouped preset handlers
  isGroupedActive(item: DateRangePeriod): boolean {
    const active = this.activeGroupedItem();
    if (active === item) return true;
    const val = this.groupedRange();
    if (!val) return false;
    return (
      val[0].toDateString() === item.range[0].toDateString() &&
      val[1].toDateString() === item.range[1].toDateString()
    );
  }

  onGroupedSelect(item: DateRangePeriod): void {
    if (this.activeGroupedItem() === item) {
      this.activeGroupedItem.set(null);
      this.groupedRange.set(null);
      return;
    }
    this.activeGroupedItem.set(item);
    this.groupedRange.set([item.range[0], item.range[1]]);
  }
}
