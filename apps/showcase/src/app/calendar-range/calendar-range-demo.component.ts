import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import type { DisabledHandler } from '@ngxpro/components/calendar';
import {
  CalendarRangeComponent,
  createDefaultDateRangePeriods,
  DateRangePeriod,
} from '@ngxpro/components/calendar-range';
import {
  DataListComponent,
  OptGroupDirective,
  OptionDirective,
} from '@ngxpro/components/data-list';
import { CalendarRangeApiComponent } from './calendar-range-api.component';

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
 * Full showcase demo for CalendarRange.
 *
 * Sections:
 *  1. Basic range picker — two calendars side-by-side
 *  2. Preset periods sidebar — DataList integration
 *  3. Grouped presets — OptGroup inside DataList
 *  4. Min / Max bounds (±30 days)
 *  5. Min / Max range length (3 – 14 days)
 *  6. Disabled weekends
 *  7. Presets + bounds combined
 */
@Component({
  selector: 'app-calendar-range-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CalendarRangeApiComponent,
    CalendarRangeComponent,
    DataListComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    OptGroupDirective,
    OptionDirective,
  ],
  template: `
    <nxp-doc-component-page
      header="Calendar Range"
      package="components"
      type="component"
      path="components/calendar-range"
    >
      <p class="text-base text-text-secondary mb-6">
        Dual-calendar date-range picker with hover preview, keyboard navigation,
        preset periods, and min / max constraints. Click a start day, hover to
        preview, click an end day. Press
        <kbd
          class="px-1 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
          >Esc</kbd
        >
        to cancel a pick in progress.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Basic range picker"
          description="Two calendars side-by-side. Click a start day, hover to preview, click an end day. Press Esc to cancel a pick in progress."
          [content]="{ HTML: basicHtml, TypeScript: basicTs }"
        >
          <div class="flex lg:flex-col gap-6 items-start">
            <nxp-calendar-range
              [value]="basicRange()"
              [min]="basicMin()"
              [max]="basicMax()"
              [minLength]="basicMinLength()"
              [maxLength]="basicMaxLength()"
              [showAdjacent]="basicShowAdjacent()"
              [class]="basicClass()"
              (valueChange)="basicRange.set($event)"
            />
            <div class="flex gap-4 space-y-3 w-full">
              <div
                class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-1"
              >
                <p
                  class="text-xs font-medium text-gray-400 uppercase tracking-wide"
                >
                  From
                </p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ basicRange() ? fmt(basicRange()![0]) : '—' }}
                </p>
              </div>
              <div
                class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-1"
              >
                <p
                  class="text-xs font-medium text-gray-400 uppercase tracking-wide"
                >
                  To
                </p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ basicRange() ? fmt(basicRange()![1]) : '—' }}
                </p>
              </div>
              @if (basicRange()) {
                <div
                  class="rounded-lg border border-primary/30 bg-primary/10 p-4 space-y-1"
                >
                  <p
                    class="text-xs font-medium text-action uppercase tracking-wide"
                  >
                    Duration
                  </p>
                  <p class="text-lg font-bold text-action">
                    {{ daysBetween(basicRange()!) }} days
                  </p>
                </div>
                <button
                  class="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 py-2 transition-colors"
                  (click)="basicRange.set(null)"
                >
                  Clear selection
                </button>
              }
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Preset periods"
          description="Pass [items] to replace the second calendar with a nxp-data-list sidebar. Each preset is a button[nxpOption] with full keyboard navigation. Click the active item again to deselect."
          [content]="{ HTML: presetsHtml, TypeScript: presetsTs }"
        >
          <div class="flex flex-col gap-6 items-start">
            <nxp-calendar-range
              [items]="presets"
              [value]="presetsRange()"
              (valueChange)="presetsRange.set($event)"
            />
            <div class="space-y-2 min-w-56">
              <p
                class="text-xs font-semibold text-gray-400 uppercase tracking-wide"
              >
                Selected range
              </p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatRange(presetsRange()) }}
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Grouped presets"
          description="Build the preset list manually with [nxpOptGroup] sections for Quick, This period, and Previous period groupings. Groups include role='group' and aria-label for full accessibility."
          [content]="{ HTML: groupedHtml, TypeScript: groupedTs }"
        >
          <div class="inline-flex overflow-hidden">
            <nxp-calendar-range
              [value]="groupedRange()"
              (valueChange)="groupedRange.set($event)"
            />
            <div class="w-px bg-gray-200 dark:bg-gray-800 self-stretch"></div>
            <div class="p-3 flex flex-col justify-center">
              <nxp-data-list
                size="sm"
                label="Preset date ranges"
                class="min-w-[9rem]"
              >
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
                          <svg
                            class="h-3.5 w-3.5 shrink-0 ml-auto"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        }
                      </button>
                    }
                  </div>
                }
              </nxp-data-list>
            </div>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Selected:
            <strong class="text-gray-900 dark:text-white">{{
              formatRange(groupedRange())
            }}</strong>
          </p>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Min / Max bounds"
          description="Restrict selectable dates to a window (here: ±30 days from today). Out-of-range days are rendered as disabled."
          [content]="{ HTML: boundsHtml, TypeScript: boundsTs }"
        >
          <div class="flex flex-col items-start">
            <nxp-calendar-range
              [min]="boundsMin"
              [max]="boundsMax"
              [value]="boundsRange()"
              (valueChange)="boundsRange.set($event)"
            />
            <div class="space-y-2 text-sm">
              <p class="text-gray-500 dark:text-gray-400">
                <span class="font-medium text-gray-700 dark:text-gray-300"
                  >Min:</span
                >
                {{ fmt(boundsMin) }}
              </p>
              <p class="text-gray-500 dark:text-gray-400">
                <span class="font-medium text-gray-700 dark:text-gray-300"
                  >Max:</span
                >
                {{ fmt(boundsMax) }}
              </p>
              <p class="pt-2 font-medium text-gray-900 dark:text-white">
                {{ formatRange(boundsRange()) }}
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Min / Max range length"
          description="After picking the start date, only end dates that produce a range between 3 and 14 days are enabled. Days too close or too far are automatically disabled."
          [content]="{ HTML: lengthHtml, TypeScript: lengthTs }"
        >
          <div class="flex flex-col gap-6 items-start">
            <nxp-calendar-range
              [minLength]="3"
              [maxLength]="14"
              [value]="lengthRange()"
              (valueChange)="lengthRange.set($event)"
            />
            <div class="space-y-3 min-w-40">
              @if (lengthRange()) {
                <div
                  class="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-4"
                >
                  <p
                    class="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide"
                  >
                    Duration
                  </p>
                  <p
                    class="text-2xl font-bold text-green-700 dark:text-green-300"
                  >
                    {{ daysBetween(lengthRange()!) }}
                    <span class="text-sm font-normal">days</span>
                  </p>
                </div>
              } @else {
                <div
                  class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 text-sm text-gray-400"
                >
                  Pick a start date, then an end date 3–14 days away.
                </div>
              }
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatRange(lengthRange()) }}
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled weekends"
          description="Pass a disabledHandler to disable arbitrary dates. Here weekends (Sat/Sun) are non-selectable."
          [content]="{ HTML: weekendsHtml, TypeScript: weekendsTs }"
        >
          <div class="flex flex-col gap-6 items-start">
            <nxp-calendar-range
              [disabledHandler]="isWeekend"
              [value]="weekdayRange()"
              (valueChange)="weekdayRange.set($event)"
            />
            <div class="text-sm space-y-2">
              <p class="text-gray-500 dark:text-gray-400">
                Only Mon–Fri are selectable.
              </p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ formatRange(weekdayRange()) }}
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Presets + bounds combined"
          description="Preset sidebar with min/max bounds applied. Dates outside ±30 days are disabled; preset items whose ranges fall outside bounds are still shown but will select out-of-range dates (useful for analytics dashboards where you want the label even if data is partial)."
          [content]="{ HTML: combinedHtml, TypeScript: combinedTs }"
        >
          <div class="flex flex-col gap-6 items-start">
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
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-calendar-range-api
          [(value)]="basicRange"
          [(min)]="basicMin"
          [(max)]="basicMax"
          [(minLength)]="basicMinLength"
          [(maxLength)]="basicMaxLength"
          [(showAdjacent)]="basicShowAdjacent"
          [(class)]="basicClass"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class CalendarRangeDemoComponent {
  // ------------------------------------------------------------------ CalendarRange demos
  readonly basicRange = signal<[Date, Date] | null>(null);
  readonly presetsRange = signal<[Date, Date] | null>(null);
  readonly boundsRange = signal<[Date, Date] | null>(null);
  readonly lengthRange = signal<[Date, Date] | null>(null);
  readonly weekdayRange = signal<[Date, Date] | null>(null);
  readonly groupedRange = signal<[Date, Date] | null>(null);
  readonly combinedRange = signal<[Date, Date] | null>(null);

  // ------------------------------------------------------------------ Playground state for the API tab
  readonly basicMin = signal<Date | null>(null);
  readonly basicMax = signal<Date | null>(null);
  readonly basicMinLength = signal<number | null>(null);
  readonly basicMaxLength = signal<number | null>(null);
  readonly basicShowAdjacent = signal<boolean>(false);
  readonly basicClass = signal<string>('');

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

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly basicHtml = `<nxp-calendar-range
  [value]="range()"
  (valueChange)="range.set($event)"
/>`;

  readonly basicTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarRangeComponent } from '@ngxpro/components/calendar-range';

@Component({
  selector: 'app-basic-range',
  imports: [CalendarRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basic-range.html',
})
export class BasicRangeExample {
  readonly range = signal<[Date, Date] | null>(null);
}`;

  readonly presetsHtml = `<nxp-calendar-range
  [items]="presets"
  [value]="range()"
  (valueChange)="range.set($event)"
/>`;

  readonly presetsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CalendarRangeComponent,
  createDefaultDateRangePeriods,
  DateRangePeriod,
} from '@ngxpro/components/calendar-range';

@Component({
  selector: 'app-presets',
  imports: [CalendarRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './presets.html',
})
export class PresetsRangeExample {
  readonly presets: DateRangePeriod[] = createDefaultDateRangePeriods();
  readonly range = signal<[Date, Date] | null>(null);
}`;

  readonly groupedHtml = `<nxp-calendar-range
  [value]="range()"
  (valueChange)="range.set($event)"
/>
<nxp-data-list size="sm" label="Preset date ranges">
  @for (section of groupedPresets; track section.group) {
    <div nxpOptGroup [label]="section.group">
      @for (item of section.items; track item.label) {
        <button
          nxpOption
          [selected]="isActive(item)"
          (click)="onSelect(item)"
        >
          {{ item.label }}
        </button>
      }
    </div>
  }
</nxp-data-list>`;

  readonly groupedTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CalendarRangeComponent,
  DateRangePeriod,
} from '@ngxpro/components/calendar-range';
import {
  DataListComponent,
  OptGroupDirective,
  OptionDirective,
} from '@ngxpro/components/data-list';

@Component({
  selector: 'app-grouped-presets',
  imports: [
    CalendarRangeComponent,
    DataListComponent,
    OptGroupDirective,
    OptionDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grouped-presets.html',
})
export class GroupedPresetsExample {
  readonly range = signal<[Date, Date] | null>(null);
  readonly groupedPresets = [
    {
      group: 'Quick',
      items: [
        new DateRangePeriod([new Date(), new Date()], 'Today'),
      ],
    },
  ];
  private active = signal<DateRangePeriod | null>(null);

  isActive(item: DateRangePeriod): boolean {
    return this.active() === item;
  }

  onSelect(item: DateRangePeriod): void {
    if (this.active() === item) {
      this.active.set(null);
      this.range.set(null);
      return;
    }
    this.active.set(item);
    this.range.set([item.range[0], item.range[1]]);
  }
}`;

  readonly boundsHtml = `<nxp-calendar-range
  [min]="min"
  [max]="max"
  [value]="range()"
  (valueChange)="range.set($event)"
/>`;

  readonly boundsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarRangeComponent } from '@ngxpro/components/calendar-range';

function offsetDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

@Component({
  selector: 'app-bounds',
  imports: [CalendarRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bounds.html',
})
export class BoundsRangeExample {
  readonly min = offsetDate(-30);
  readonly max = offsetDate(30);
  readonly range = signal<[Date, Date] | null>(null);
}`;

  readonly lengthHtml = `<nxp-calendar-range
  [minLength]="3"
  [maxLength]="14"
  [value]="range()"
  (valueChange)="range.set($event)"
/>`;

  readonly lengthTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarRangeComponent } from '@ngxpro/components/calendar-range';

@Component({
  selector: 'app-length-range',
  imports: [CalendarRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './length-range.html',
})
export class LengthRangeExample {
  readonly range = signal<[Date, Date] | null>(null);
}`;

  readonly weekendsHtml = `<nxp-calendar-range
  [disabledHandler]="isWeekend"
  [value]="range()"
  (valueChange)="range.set($event)"
/>`;

  readonly weekendsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarRangeComponent } from '@ngxpro/components/calendar-range';
import type { DisabledHandler } from '@ngxpro/components/calendar';

@Component({
  selector: 'app-weekends',
  imports: [CalendarRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weekends.html',
})
export class WeekendsRangeExample {
  readonly range = signal<[Date, Date] | null>(null);

  readonly isWeekend: DisabledHandler = (d: Date) => {
    const day = d.getDay();
    return day === 0 || day === 6;
  };
}`;

  readonly combinedHtml = `<nxp-calendar-range
  [items]="presets"
  [min]="min"
  [max]="max"
  [value]="range()"
  (valueChange)="range.set($event)"
/>`;

  readonly combinedTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CalendarRangeComponent,
  createDefaultDateRangePeriods,
  DateRangePeriod,
} from '@ngxpro/components/calendar-range';

function offsetDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

@Component({
  selector: 'app-combined',
  imports: [CalendarRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combined.html',
})
export class CombinedRangeExample {
  readonly presets: DateRangePeriod[] = createDefaultDateRangePeriods();
  readonly min = offsetDate(-30);
  readonly max = offsetDate(30);
  readonly range = signal<[Date, Date] | null>(null);
}`;
}
