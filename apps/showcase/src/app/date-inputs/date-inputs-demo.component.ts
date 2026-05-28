import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputDateComponent } from '@ngxpro/components/input-date';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';
import { InputMonthComponent } from '@ngxpro/components/input-month';
import { createDefaultDateRangePeriods } from '@ngxpro/components/calendar-range';
import type { MonthCoord } from '@ngxpro/components/calendar-month';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { DateInputsApiComponent } from './date-inputs-api.component';

/**
 * Showcase demo for the three date input components:
 *  - InputDateComponent        (`nxp-input-date`)
 *  - InputDateRangeComponent   (`nxp-input-date-range`)
 *  - InputMonthComponent       (`nxp-input-month`)
 */
@Component({
  selector: 'app-date-inputs-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    InputDateComponent,
    InputDateRangeComponent,
    InputMonthComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    DateInputsApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Date Inputs"
      package="components"
      type="component"
      path="components/date-inputs"
    >
      <p class="text-base text-text-secondary mb-6">
        Text inputs with calendar dropdowns —
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-input-date</code
        >,
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-input-date-range</code
        >, and
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-input-month</code
        >. All support keyboard date entry and Angular reactive /
        template-driven forms via
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >ControlValueAccessor</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <!-- ============================================================
             nxp-input-date — Signal binding
        ============================================================ -->
        <nxp-doc-example
          heading="Input date — signal binding"
          description="Click to open the calendar, or type directly (MM/DD/YYYY). Bound to a writable signal via [value]/(valueChange)."
          [content]="{ HTML: signalDateHtml, TypeScript: signalDateTs }"
        >
          <div class="space-y-3 max-w-sm">
            <nxp-input-date
              [value]="singleDate()"
              (valueChange)="singleDate.set($event)"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Value:
              <code class="font-mono">{{
                singleDate() ? singleDate()!.toLocaleDateString() : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-date — ngModel
        ============================================================ -->
        <nxp-doc-example
          heading="Input date — [(ngModel)]"
          description="Two-way binding via template-driven forms."
          [content]="{ HTML: ngModelDateHtml, TypeScript: ngModelDateTs }"
        >
          <div class="space-y-3 max-w-sm">
            <nxp-input-date [(ngModel)]="ngModelDate" />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              ngModel:
              <code class="font-mono">{{
                ngModelDate ? ngModelDate.toLocaleDateString() : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-date — Reactive form
        ============================================================ -->
        <nxp-doc-example
          heading="Input date — reactive form"
          description="Works with FormControl. Implements ControlValueAccessor so setValue() propagates back through writeValue()."
          [content]="{
            HTML: reactiveDateHtml,
            TypeScript: reactiveDateTs,
          }"
        >
          <div class="space-y-3 max-w-sm">
            <nxp-input-date [formControl]="dateControl" />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Control:
              <code class="font-mono">{{
                dateControl.value
                  ? dateControl.value.toLocaleDateString()
                  : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-date — Min / Max bounds
        ============================================================ -->
        <nxp-doc-example
          heading="Input date — min / max bounds"
          description="Only dates within ±7 days of today are selectable. Days outside the bounds are rendered as disabled in the calendar."
          [content]="{ HTML: boundedDateHtml, TypeScript: boundedDateTs }"
        >
          <div class="space-y-3 max-w-sm">
            <nxp-input-date
              [value]="boundedDate()"
              [min]="minDate"
              [max]="maxDate"
              (valueChange)="boundedDate.set($event)"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Value:
              <code class="font-mono">{{
                boundedDate() ? boundedDate()!.toLocaleDateString() : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-date — Disabled
        ============================================================ -->
        <nxp-doc-example
          heading="Input date — disabled state"
          description="The input is non-interactive when disabled, and the calendar dropdown cannot be opened."
          [content]="{ HTML: disabledDateHtml, TypeScript: disabledDateTs }"
        >
          <div class="max-w-sm">
            <nxp-input-date
              [value]="singleDate()"
              [disabled]="true"
              placeholder="Disabled input"
            />
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-date-range — Basic
        ============================================================ -->
        <nxp-doc-example
          heading="Input date range — basic"
          description='Click once for start, again for end. Or type "MM/DD/YYYY – MM/DD/YYYY".'
          [content]="{ HTML: rangeBasicHtml, TypeScript: rangeBasicTs }"
        >
          <div class="space-y-3 max-w-md">
            <nxp-input-date-range
              [value]="range()"
              (valueChange)="range.set($event)"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              @if (range()) {
                Range:
                <code class="font-mono"
                  >{{ range()![0].toLocaleDateString() }} –
                  {{ range()![1].toLocaleDateString() }}</code
                >
              } @else {
                Range: <code class="font-mono">null</code>
              }
            </p>
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-date-range — Preset periods
        ============================================================ -->
        <nxp-doc-example
          heading="Input date range — preset periods"
          description="Predefined ranges shown in a sidebar for quick selection. Pass createDefaultDateRangePeriods() for a sensible default set."
          [content]="{ HTML: rangePresetsHtml, TypeScript: rangePresetsTs }"
        >
          <div class="space-y-3 max-w-md">
            <nxp-input-date-range
              [value]="rangeWithPresets()"
              [items]="defaultPeriods"
              (valueChange)="rangeWithPresets.set($event)"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              @if (rangeWithPresets()) {
                Range:
                <code class="font-mono"
                  >{{ rangeWithPresets()![0].toLocaleDateString() }} –
                  {{ rangeWithPresets()![1].toLocaleDateString() }}</code
                >
              } @else {
                Range: <code class="font-mono">null</code>
              }
            </p>
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-date-range — Length constraints
        ============================================================ -->
        <nxp-doc-example
          heading="Input date range — length constraints"
          description="Minimum 3 days, maximum 14 days allowed via [minLength] / [maxLength]."
          [content]="{
            HTML: rangeConstrainedHtml,
            TypeScript: rangeConstrainedTs,
          }"
        >
          <div class="space-y-3 max-w-md">
            <nxp-input-date-range
              [value]="constrainedRange()"
              [minLength]="3"
              [maxLength]="14"
              (valueChange)="constrainedRange.set($event)"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              @if (constrainedRange()) {
                Range:
                <code class="font-mono"
                  >{{ constrainedRange()![0].toLocaleDateString() }} –
                  {{ constrainedRange()![1].toLocaleDateString() }}</code
                >
              } @else {
                Range: <code class="font-mono">null</code>
              }
            </p>
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-date-range — Reactive form
        ============================================================ -->
        <nxp-doc-example
          heading="Input date range — reactive form"
          description="Works with FormControl typed as [Date, Date] | null."
          [content]="{
            HTML: rangeReactiveHtml,
            TypeScript: rangeReactiveTs,
          }"
        >
          <div class="space-y-3 max-w-md">
            <nxp-input-date-range [formControl]="rangeControl" />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              @if (rangeControl.value) {
                Control:
                <code class="font-mono"
                  >{{ rangeControl.value[0].toLocaleDateString() }} –
                  {{ rangeControl.value[1].toLocaleDateString() }}</code
                >
              } @else {
                Control: <code class="font-mono">null</code>
              }
            </p>
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-month — Basic
        ============================================================ -->
        <nxp-doc-example
          heading="Input month — single month picker"
          description="Click to open the month grid and pick a month. Value is a MonthCoord with zero-indexed month."
          [content]="{ HTML: monthBasicHtml, TypeScript: monthBasicTs }"
        >
          <div class="space-y-3 max-w-sm">
            <nxp-input-month
              [value]="selectedMonth()"
              (valueChange)="selectedMonth.set($event)"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              @if (selectedMonth()) {
                Value:
                <code class="font-mono"
                  >{{ selectedMonth()!.year }}-{{
                    selectedMonth()!.month + 1 | number: '2.0-0'
                  }}</code
                >
              } @else {
                Value: <code class="font-mono">null</code>
              }
            </p>
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-month — ngModel
        ============================================================ -->
        <nxp-doc-example
          heading="Input month — [(ngModel)]"
          description="Two-way binding via template-driven forms."
          [content]="{ HTML: monthNgModelHtml, TypeScript: monthNgModelTs }"
        >
          <div class="space-y-3 max-w-sm">
            <nxp-input-month [(ngModel)]="ngModelMonth" />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              @if (ngModelMonth) {
                ngModel:
                <code class="font-mono"
                  >{{ ngModelMonth.year }}-{{
                    ngModelMonth.month + 1 | number: '2.0-0'
                  }}</code
                >
              } @else {
                ngModel: <code class="font-mono">null</code>
              }
            </p>
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-month — Min / Max bounds
        ============================================================ -->
        <nxp-doc-example
          heading="Input month — min / max bounds"
          description="Limited to months within 2024–2025. Months outside the bounds are rendered as disabled in the grid."
          [content]="{ HTML: monthBoundedHtml, TypeScript: monthBoundedTs }"
        >
          <div class="space-y-3 max-w-sm">
            <nxp-input-month
              [value]="boundedMonth()"
              [min]="minMonth"
              [max]="maxMonth"
              (valueChange)="boundedMonth.set($event)"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              @if (boundedMonth()) {
                Value:
                <code class="font-mono"
                  >{{ boundedMonth()!.year }}-{{
                    boundedMonth()!.month + 1 | number: '2.0-0'
                  }}</code
                >
              } @else {
                Value: <code class="font-mono">null</code>
              }
            </p>
          </div>
        </nxp-doc-example>

        <!-- ============================================================
             nxp-input-month — Disabled
        ============================================================ -->
        <nxp-doc-example
          heading="Input month — disabled state"
          description="The input is non-interactive when disabled, and the month grid cannot be opened."
          [content]="{ HTML: monthDisabledHtml, TypeScript: monthDisabledTs }"
        >
          <div class="max-w-sm">
            <nxp-input-month
              [value]="selectedMonth()"
              [disabled]="true"
              placeholder="Disabled"
            />
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-date-inputs-api />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class DateInputsDemoComponent {
  // ---- InputDate state ----
  readonly singleDate = signal<Date | null>(null);
  ngModelDate: Date | null = null;
  readonly dateControl = new FormControl<Date | null>(null);
  readonly boundedDate = signal<Date | null>(null);

  readonly minDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  })();

  readonly maxDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  })();

  // ---- InputDateRange state ----
  readonly range = signal<[Date, Date] | null>(null);
  readonly rangeWithPresets = signal<[Date, Date] | null>(null);
  readonly constrainedRange = signal<[Date, Date] | null>(null);
  readonly rangeControl = new FormControl<[Date, Date] | null>(null);

  readonly defaultPeriods = createDefaultDateRangePeriods();

  // ---- InputMonth state ----
  readonly selectedMonth = signal<MonthCoord | null>(null);
  ngModelMonth: MonthCoord | null = null;
  readonly boundedMonth = signal<MonthCoord | null>(null);

  readonly minMonth: MonthCoord = { year: 2024, month: 0 }; // Jan 2024
  readonly maxMonth: MonthCoord = { year: 2025, month: 11 }; // Dec 2025

  // ── Example source snippets shown inside <nxp-doc-example> tabs ──────────

  // ── nxp-input-date snippets ─────────────────────────────────────────────
  readonly signalDateHtml = `<nxp-input-date
  [value]="singleDate()"
  (valueChange)="singleDate.set($event)"
/>`;

  readonly signalDateTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-signal-date',
  imports: [InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signal-date.html',
})
export class SignalDateExample {
  readonly singleDate = signal<Date | null>(null);
}`;

  readonly ngModelDateHtml = `<nxp-input-date [(ngModel)]="date" />`;

  readonly ngModelDateTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-ngmodel-date',
  imports: [FormsModule, InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ngmodel-date.html',
})
export class NgModelDateExample {
  date: Date | null = null;
}`;

  readonly reactiveDateHtml = `<nxp-input-date [formControl]="dateControl" />`;

  readonly reactiveDateTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-reactive-date',
  imports: [ReactiveFormsModule, InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reactive-date.html',
})
export class ReactiveDateExample {
  readonly dateControl = new FormControl<Date | null>(null);
}`;

  readonly boundedDateHtml = `<nxp-input-date
  [value]="boundedDate()"
  [min]="minDate"
  [max]="maxDate"
  (valueChange)="boundedDate.set($event)"
/>`;

  readonly boundedDateTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-bounded-date',
  imports: [InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bounded-date.html',
})
export class BoundedDateExample {
  readonly boundedDate = signal<Date | null>(null);

  readonly minDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  })();

  readonly maxDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  })();
}`;

  readonly disabledDateHtml = `<nxp-input-date
  [value]="singleDate()"
  [disabled]="true"
  placeholder="Disabled input"
/>`;

  readonly disabledDateTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-disabled-date',
  imports: [InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-date.html',
})
export class DisabledDateExample {
  readonly singleDate = signal<Date | null>(null);
}`;

  // ── nxp-input-date-range snippets ───────────────────────────────────────
  readonly rangeBasicHtml = `<nxp-input-date-range
  [value]="range()"
  (valueChange)="range.set($event)"
/>`;

  readonly rangeBasicTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-range-basic',
  imports: [InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './range-basic.html',
})
export class RangeBasicExample {
  readonly range = signal<[Date, Date] | null>(null);
}`;

  readonly rangePresetsHtml = `<nxp-input-date-range
  [value]="rangeWithPresets()"
  [items]="defaultPeriods"
  (valueChange)="rangeWithPresets.set($event)"
/>`;

  readonly rangePresetsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { createDefaultDateRangePeriods } from '@ngxpro/components/calendar-range';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-range-presets',
  imports: [InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './range-presets.html',
})
export class RangePresetsExample {
  readonly rangeWithPresets = signal<[Date, Date] | null>(null);
  readonly defaultPeriods = createDefaultDateRangePeriods();
}`;

  readonly rangeConstrainedHtml = `<nxp-input-date-range
  [value]="constrainedRange()"
  [minLength]="3"
  [maxLength]="14"
  (valueChange)="constrainedRange.set($event)"
/>`;

  readonly rangeConstrainedTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-range-constrained',
  imports: [InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './range-constrained.html',
})
export class RangeConstrainedExample {
  readonly constrainedRange = signal<[Date, Date] | null>(null);
}`;

  readonly rangeReactiveHtml = `<nxp-input-date-range [formControl]="rangeControl" />`;

  readonly rangeReactiveTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-range-reactive',
  imports: [ReactiveFormsModule, InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './range-reactive.html',
})
export class RangeReactiveExample {
  readonly rangeControl = new FormControl<[Date, Date] | null>(null);
}`;

  // ── nxp-input-month snippets ────────────────────────────────────────────
  readonly monthBasicHtml = `<nxp-input-month
  [value]="selectedMonth()"
  (valueChange)="selectedMonth.set($event)"
/>`;

  readonly monthBasicTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { MonthCoord } from '@ngxpro/components/calendar-month';
import { InputMonthComponent } from '@ngxpro/components/input-month';

@Component({
  selector: 'app-month-basic',
  imports: [InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './month-basic.html',
})
export class MonthBasicExample {
  readonly selectedMonth = signal<MonthCoord | null>(null);
}`;

  readonly monthNgModelHtml = `<nxp-input-month [(ngModel)]="month" />`;

  readonly monthNgModelTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { MonthCoord } from '@ngxpro/components/calendar-month';
import { InputMonthComponent } from '@ngxpro/components/input-month';

@Component({
  selector: 'app-month-ngmodel',
  imports: [FormsModule, InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './month-ngmodel.html',
})
export class MonthNgModelExample {
  month: MonthCoord | null = null;
}`;

  readonly monthBoundedHtml = `<nxp-input-month
  [value]="boundedMonth()"
  [min]="minMonth"
  [max]="maxMonth"
  (valueChange)="boundedMonth.set($event)"
/>`;

  readonly monthBoundedTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { MonthCoord } from '@ngxpro/components/calendar-month';
import { InputMonthComponent } from '@ngxpro/components/input-month';

@Component({
  selector: 'app-month-bounded',
  imports: [InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './month-bounded.html',
})
export class MonthBoundedExample {
  readonly boundedMonth = signal<MonthCoord | null>(null);

  readonly minMonth: MonthCoord = { year: 2024, month: 0 }; // Jan 2024
  readonly maxMonth: MonthCoord = { year: 2025, month: 11 }; // Dec 2025
}`;

  readonly monthDisabledHtml = `<nxp-input-month
  [value]="selectedMonth()"
  [disabled]="true"
  placeholder="Disabled"
/>`;

  readonly monthDisabledTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { MonthCoord } from '@ngxpro/components/calendar-month';
import { InputMonthComponent } from '@ngxpro/components/input-month';

@Component({
  selector: 'app-month-disabled',
  imports: [InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './month-disabled.html',
})
export class MonthDisabledExample {
  readonly selectedMonth = signal<MonthCoord | null>(null);
}`;
}
