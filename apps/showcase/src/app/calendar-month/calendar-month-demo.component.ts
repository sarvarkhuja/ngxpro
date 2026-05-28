import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { CalendarMonthComponent } from '@ngxpro/components/calendar-month';
import type {
  CalendarMonthValue,
  MonthCoord,
  MonthRange,
} from '@ngxpro/components/calendar-month';
import { CalendarMonthApiComponent } from './calendar-month-api.component';

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatMonth(m: MonthCoord): string {
  return `${MONTH_LABELS[m.month]} ${m.year}`;
}

/**
 * Showcase demo for CalendarMonthComponent.
 *
 * Demonstrates:
 *  1. Single month selection
 *  2. Range selection with hover preview
 *  3. Min / max bounds
 *  4. MinLength / maxLength constraints
 *  5. Disabled specific months
 *  6. Year navigation
 */
@Component({
  selector: 'app-calendar-month-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CalendarMonthApiComponent,
    CalendarMonthComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Calendar Month"
      package="components"
      type="component"
      path="components/calendar-month"
    >
      <p class="text-base text-text-secondary mb-6">
        Month picker — displays a 3×4 grid of months for a given year. Supports
        single-month selection, month-range selection with hover preview,
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >min</code
        >
        /
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >max</code
        >
        bounds, length-constrained ranges, and a year-picker overlay.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Single month"
          description="Click any month cell to select it. The component emits a MonthCoord on click."
          [content]="{ HTML: singleHtml, TypeScript: singleTs }"
        >
          <div class="space-y-3">
            <nxp-calendar-month
              [value]="singleValue()"
              (monthClick)="singleValue.set($event)"
            />
            @if (singleValue()) {
              <p class="text-sm text-text-secondary">
                Selected: <strong>{{ formatMonth(singleValue()!) }}</strong>
              </p>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Range selection"
          description="Click start month, then hover and click end month. Range mode shows a live hover preview of the in-progress range."
          [content]="{ HTML: rangeHtml, TypeScript: rangeTs }"
        >
          <div class="space-y-3">
            <nxp-calendar-month
              [rangeMode]="true"
              [value]="rangeValue()"
              (monthClick)="onRangeClick($event)"
            />
            @if (rangeValue()) {
              <p class="text-sm text-text-secondary">
                @if (isMonthRange(rangeValue()!)) {
                  From
                  <strong>{{
                    formatMonth(asRange(rangeValue()!).from)
                  }}</strong>
                  to
                  <strong>{{ formatMonth(asRange(rangeValue()!).to) }}</strong>
                } @else {
                  Start:
                  <strong>{{ formatMonth(asCoord(rangeValue()!)) }}</strong> —
                  pick end month
                }
              </p>
              <button
                class="text-xs text-red-500 hover:underline"
                (click)="rangeValue.set(null)"
              >
                Clear range
              </button>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Min / Max bounds"
          description="Only months within ±6 months of today are selectable. Out-of-bounds cells render disabled and year navigation is clamped."
          [content]="{ HTML: boundsHtml, TypeScript: boundsTs }"
        >
          <div class="space-y-3">
            <nxp-calendar-month
              [value]="boundedValue()"
              [min]="minMonth"
              [max]="maxMonth"
              (monthClick)="boundedValue.set($event)"
            />
            @if (boundedValue()) {
              <p class="text-sm text-text-secondary">
                Selected:
                <strong>{{ formatMonth(asCoord(boundedValue()!)) }}</strong>
              </p>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Length constraints"
          description="Range must be between 2 and 4 months (minLength=2, maxLength=4). Cells outside the allowed delta from the picked start are disabled while picking the end."
          [content]="{ HTML: constraintsHtml, TypeScript: constraintsTs }"
        >
          <div class="space-y-3">
            <nxp-calendar-month
              [rangeMode]="true"
              [value]="constrainedValue()"
              [minLength]="2"
              [maxLength]="4"
              (monthClick)="onConstrainedRangeClick($event)"
            />
            @if (constrainedValue()) {
              <p class="text-sm text-text-secondary">
                @if (isMonthRange(constrainedValue()!)) {
                  From
                  <strong>{{
                    formatMonth(asRange(constrainedValue()!).from)
                  }}</strong>
                  to
                  <strong>{{
                    formatMonth(asRange(constrainedValue()!).to)
                  }}</strong>
                } @else {
                  Start:
                  <strong>{{
                    formatMonth(asCoord(constrainedValue()!))
                  }}</strong>
                  — pick end month
                }
              </p>
              <button
                class="text-xs text-red-500 hover:underline"
                (click)="constrainedValue.set(null)"
              >
                Clear
              </button>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled months"
          description="Pass a disabledHandler predicate to mark arbitrary months as non-selectable. Here Q1 months (Jan–Mar) are disabled every year."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <div class="space-y-3">
            <nxp-calendar-month
              [value]="disabledValue()"
              [disabledHandler]="isQ1Month"
              (monthClick)="disabledValue.set($event)"
            />
            @if (disabledValue()) {
              <p class="text-sm text-text-secondary">
                Selected:
                <strong>{{ formatMonth(asCoord(disabledValue()!)) }}</strong>
              </p>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Year navigation"
          description="Click the year label to open the year picker overlay. The (yearChange) output fires whenever the active year changes via the arrows or the picker."
          [content]="{ HTML: navHtml, TypeScript: navTs }"
        >
          <div class="space-y-3">
            <nxp-calendar-month
              [value]="navValue()"
              (monthClick)="navValue.set($event)"
              (yearChange)="onYearChange($event)"
            />
            <p class="text-sm text-text-secondary">
              Viewed year:
              <strong class="text-text-primary">{{ viewedYear() }}</strong>
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-calendar-month-api />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class CalendarMonthDemoComponent {
  protected readonly formatMonth = formatMonth;

  // 1. Single
  readonly singleValue = signal<MonthCoord | null>(null);

  // 2. Range
  readonly rangeValue = signal<CalendarMonthValue>(null);

  onRangeClick(month: MonthCoord): void {
    const current = this.rangeValue();

    if (!current) {
      // Start first end of range
      this.rangeValue.set(month);
      return;
    }

    // If it's already a full range, restart
    if (this.isMonthRange(current)) {
      this.rangeValue.set(month);
      return;
    }

    // It's a single coord — create the range
    const start = current as MonthCoord;
    const startL = start.year * 12 + start.month;
    const endL = month.year * 12 + month.month;

    if (startL <= endL) {
      this.rangeValue.set({ from: start, to: month });
    } else {
      this.rangeValue.set({ from: month, to: start });
    }
  }

  // 3. Bounded
  readonly boundedValue = signal<CalendarMonthValue>(null);
  readonly minMonth: MonthCoord = (() => {
    const now = new Date();
    let m = now.getMonth() - 6;
    let y = now.getFullYear();
    if (m < 0) {
      m += 12;
      y -= 1;
    }
    return { year: y, month: m };
  })();
  readonly maxMonth: MonthCoord = (() => {
    const now = new Date();
    let m = now.getMonth() + 6;
    let y = now.getFullYear();
    if (m > 11) {
      m -= 12;
      y += 1;
    }
    return { year: y, month: m };
  })();

  // 4. Constrained range
  readonly constrainedValue = signal<CalendarMonthValue>(null);

  onConstrainedRangeClick(month: MonthCoord): void {
    const current = this.constrainedValue();
    if (!current || this.isMonthRange(current)) {
      this.constrainedValue.set(month);
      return;
    }
    const start = current as MonthCoord;
    const startL = start.year * 12 + start.month;
    const endL = month.year * 12 + month.month;
    if (startL <= endL) {
      this.constrainedValue.set({ from: start, to: month });
    } else {
      this.constrainedValue.set({ from: month, to: start });
    }
  }

  // 5. Disabled Q1
  readonly disabledValue = signal<CalendarMonthValue>(null);
  readonly isQ1Month = (m: MonthCoord): boolean => m.month < 3;

  // 6. Year navigation
  readonly navValue = signal<CalendarMonthValue>(null);
  readonly viewedYear = signal<number>(new Date().getFullYear());

  onYearChange(year: number): void {
    this.viewedYear.set(year);
  }

  // ------------------------------------------------------------------ type helpers

  isMonthRange(v: CalendarMonthValue): v is MonthRange {
    return v != null && 'from' in v;
  }

  asRange(v: CalendarMonthValue): MonthRange {
    return v as MonthRange;
  }

  asCoord(v: CalendarMonthValue): MonthCoord {
    return v as MonthCoord;
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────

  readonly singleHtml = `<nxp-calendar-month
  [value]="singleValue()"
  (monthClick)="singleValue.set($event)"
/>
@if (singleValue()) {
  <p>Selected: <strong>{{ formatMonth(singleValue()!) }}</strong></p>
}`;

  readonly singleTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarMonthComponent } from '@ngxpro/components/calendar-month';
import type { MonthCoord } from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-single-month',
  imports: [CalendarMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './single-month.html',
})
export class SingleMonthExample {
  readonly singleValue = signal<MonthCoord | null>(null);

  formatMonth(m: MonthCoord): string {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return \`\${labels[m.month]} \${m.year}\`;
  }
}`;

  readonly rangeHtml = `<nxp-calendar-month
  [rangeMode]="true"
  [value]="rangeValue()"
  (monthClick)="onRangeClick($event)"
/>`;

  readonly rangeTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarMonthComponent } from '@ngxpro/components/calendar-month';
import type {
  CalendarMonthValue,
  MonthCoord,
  MonthRange,
} from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-range-month',
  imports: [CalendarMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './range-month.html',
})
export class RangeMonthExample {
  readonly rangeValue = signal<CalendarMonthValue>(null);

  onRangeClick(month: MonthCoord): void {
    const current = this.rangeValue();
    if (!current) {
      this.rangeValue.set(month);
      return;
    }
    if (this.isMonthRange(current)) {
      this.rangeValue.set(month);
      return;
    }
    const start = current as MonthCoord;
    const startL = start.year * 12 + start.month;
    const endL = month.year * 12 + month.month;
    if (startL <= endL) {
      this.rangeValue.set({ from: start, to: month });
    } else {
      this.rangeValue.set({ from: month, to: start });
    }
  }

  isMonthRange(v: CalendarMonthValue): v is MonthRange {
    return v != null && 'from' in v;
  }
}`;

  readonly boundsHtml = `<nxp-calendar-month
  [value]="boundedValue()"
  [min]="minMonth"
  [max]="maxMonth"
  (monthClick)="boundedValue.set($event)"
/>`;

  readonly boundsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarMonthComponent } from '@ngxpro/components/calendar-month';
import type {
  CalendarMonthValue,
  MonthCoord,
} from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-bounded-month',
  imports: [CalendarMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bounded-month.html',
})
export class BoundedMonthExample {
  readonly boundedValue = signal<CalendarMonthValue>(null);

  readonly minMonth: MonthCoord = (() => {
    const now = new Date();
    let m = now.getMonth() - 6;
    let y = now.getFullYear();
    if (m < 0) { m += 12; y -= 1; }
    return { year: y, month: m };
  })();

  readonly maxMonth: MonthCoord = (() => {
    const now = new Date();
    let m = now.getMonth() + 6;
    let y = now.getFullYear();
    if (m > 11) { m -= 12; y += 1; }
    return { year: y, month: m };
  })();
}`;

  readonly constraintsHtml = `<nxp-calendar-month
  [rangeMode]="true"
  [value]="constrainedValue()"
  [minLength]="2"
  [maxLength]="4"
  (monthClick)="onConstrainedRangeClick($event)"
/>`;

  readonly constraintsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarMonthComponent } from '@ngxpro/components/calendar-month';
import type {
  CalendarMonthValue,
  MonthCoord,
  MonthRange,
} from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-constrained-range',
  imports: [CalendarMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './constrained-range.html',
})
export class ConstrainedRangeExample {
  readonly constrainedValue = signal<CalendarMonthValue>(null);

  onConstrainedRangeClick(month: MonthCoord): void {
    const current = this.constrainedValue();
    if (!current || this.isMonthRange(current)) {
      this.constrainedValue.set(month);
      return;
    }
    const start = current as MonthCoord;
    const startL = start.year * 12 + start.month;
    const endL = month.year * 12 + month.month;
    if (startL <= endL) {
      this.constrainedValue.set({ from: start, to: month });
    } else {
      this.constrainedValue.set({ from: month, to: start });
    }
  }

  isMonthRange(v: CalendarMonthValue): v is MonthRange {
    return v != null && 'from' in v;
  }
}`;

  readonly disabledHtml = `<nxp-calendar-month
  [value]="disabledValue()"
  [disabledHandler]="isQ1Month"
  (monthClick)="disabledValue.set($event)"
/>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarMonthComponent } from '@ngxpro/components/calendar-month';
import type {
  CalendarMonthValue,
  MonthCoord,
} from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-disabled-months',
  imports: [CalendarMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-months.html',
})
export class DisabledMonthsExample {
  readonly disabledValue = signal<CalendarMonthValue>(null);

  /** Disable Q1 months (Jan, Feb, Mar) every year. */
  readonly isQ1Month = (m: MonthCoord): boolean => m.month < 3;
}`;

  readonly navHtml = `<nxp-calendar-month
  [value]="navValue()"
  (monthClick)="navValue.set($event)"
  (yearChange)="onYearChange($event)"
/>
<p>Viewed year: <strong>{{ viewedYear() }}</strong></p>`;

  readonly navTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarMonthComponent } from '@ngxpro/components/calendar-month';
import type { CalendarMonthValue } from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-year-nav',
  imports: [CalendarMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './year-nav.html',
})
export class YearNavExample {
  readonly navValue = signal<CalendarMonthValue>(null);
  readonly viewedYear = signal<number>(new Date().getFullYear());

  onYearChange(year: number): void {
    this.viewedYear.set(year);
  }
}`;
}
