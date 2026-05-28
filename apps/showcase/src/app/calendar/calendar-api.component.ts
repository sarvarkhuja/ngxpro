import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the calendar demo. Inputs that drive the live playground are
 * exposed as two-way `model()`s so the parent demo can share state — editing a
 * row updates the live preview, and values are persisted to the URL via
 * `nxpDocApiItem`.
 */
@Component({
  selector: 'app-calendar-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the calendar components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-calendar</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[value]"
        type="Date | [Date, Date] | Date[] | null"
        [(value)]="value"
      >
        Selected value. Pass a single
        <code>Date</code>
        for single-date mode, a
        <code>[Date, Date]</code>
        tuple for a range, or a
        <code>Date[]</code>
        for multi-date selection. Defaults to
        <code>null</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[month]"
        type="number | undefined"
        [(value)]="month"
      >
        Override the initial viewed month (0–11). Defaults to the current month
        when
        <code>undefined</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[year]"
        type="number | undefined"
        [(value)]="year"
      >
        Override the initial viewed year. Defaults to the current year when
        <code>undefined</code
        >.
      </tr>
      <tr nxpDocApiItem name="[min]" type="Date | null" [(value)]="min">
        Minimum selectable date.
      </tr>
      <tr nxpDocApiItem name="[max]" type="Date | null" [(value)]="max">
        Maximum selectable date.
      </tr>
      <tr
        nxpDocApiItem
        name="[weekStart]"
        type="0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined"
        [items]="weekStartOptions"
        [(value)]="weekStart"
      >
        Override the week-start day (0 = Sun … 6 = Sat). Falls back to the value
        provided through
        <code>CALENDAR_OPTIONS</code>
        when
        <code>undefined</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[showAdjacent]"
        type="boolean"
        [(value)]="showAdjacent"
      >
        Whether days from adjacent months are shown in the grid.
      </tr>
      <tr nxpDocApiItem name="[rangeMode]" type="boolean" [(value)]="rangeMode">
        Whether the component is in range-selection mode.
      </tr>
      <tr
        nxpDocApiItem
        name="[disabledHandler]"
        type="DisabledHandler | null"
        [(value)]="disabledHandler"
      >
        Optional handler
        <code>(date: Date) =&gt; boolean</code>
        used to disable individual dates.
        <!-- TODO refine type -->
      </tr>
      <tr
        nxpDocApiItem
        name="[markerHandler]"
        type="MarkerHandler | null"
        [(value)]="markerHandler"
      >
        Optional handler
        <code>(date: Date) =&gt; [] | [string] | [string, string]</code>
        used to add dot markers to dates.
        <!-- TODO refine type -->
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Additional CSS classes for the container.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-calendar-header</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[month]"
        type="number (required)"
        [(value)]="headerMonth"
      >
        Month index (0–11) shown in the header label.
      </tr>
      <tr
        nxpDocApiItem
        name="[year]"
        type="number (required)"
        [(value)]="headerYear"
      >
        Year shown in the header label.
      </tr>
      <tr nxpDocApiItem name="[min]" type="Date | null" [(value)]="headerMin">
        Minimum selectable date — disables the previous-month arrow once
        reached.
      </tr>
      <tr nxpDocApiItem name="[max]" type="Date | null" [(value)]="headerMax">
        Maximum selectable date — disables the next-month arrow once reached.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-calendar-sheet</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[year]"
        type="number (required)"
        [(value)]="sheetYear"
      >
        Year of the month grid to render.
      </tr>
      <tr
        nxpDocApiItem
        name="[month]"
        type="number (required)"
        [(value)]="sheetMonth"
      >
        Month (0–11) of the grid to render.
      </tr>
      <tr
        nxpDocApiItem
        name="[value]"
        type="Date | [Date, Date] | Date[] | null"
        [(value)]="sheetValue"
      >
        Selected value passed through from the parent.
      </tr>
      <tr
        nxpDocApiItem
        name="[hoveredDay]"
        type="Date | null"
        [(value)]="sheetHoveredDay"
      >
        Day currently under the mouse — used for range-preview highlighting.
      </tr>
      <tr
        nxpDocApiItem
        name="[weekStart]"
        type="0 | 1 | 2 | 3 | 4 | 5 | 6"
        [items]="sheetWeekStartOptions"
        [(value)]="sheetWeekStart"
      >
        Day of the week the grid starts on (0 = Sun, 1 = Mon, …).
      </tr>
      <tr
        nxpDocApiItem
        name="[disabledHandler]"
        type="DisabledHandler | null"
        [(value)]="sheetDisabledHandler"
      >
        Handler that returns
        <code>true</code>
        when a date should be disabled.
        <!-- TODO refine type -->
      </tr>
      <tr
        nxpDocApiItem
        name="[markerHandler]"
        type="MarkerHandler | null"
        [(value)]="sheetMarkerHandler"
      >
        Handler that returns marker colors for a date.
        <!-- TODO refine type -->
      </tr>
      <tr
        nxpDocApiItem
        name="[showAdjacent]"
        type="boolean"
        [(value)]="sheetShowAdjacent"
      >
        Whether to render days that fall outside the viewed month.
      </tr>
      <tr
        nxpDocApiItem
        name="[rangeMode]"
        type="boolean"
        [(value)]="sheetRangeMode"
      >
        Whether to render range-selection highlights.
      </tr>
      <tr nxpDocApiItem name="[min]" type="Date | null" [(value)]="sheetMin">
        Minimum selectable date.
      </tr>
      <tr nxpDocApiItem name="[max]" type="Date | null" [(value)]="sheetMax">
        Maximum selectable date.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-calendar-year</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[currentYear]"
        type="number (required)"
        [(value)]="yearCurrentYear"
      >
        Year currently centered in the scrollable year picker.
      </tr>
      <tr
        nxpDocApiItem
        name="[selectedYear]"
        type="number | null"
        [(value)]="yearSelectedYear"
      >
        Highlighted year that matches the active selection.
      </tr>
      <tr nxpDocApiItem name="[min]" type="Date | null" [(value)]="yearMin">
        Minimum selectable date — years before this are disabled.
      </tr>
      <tr nxpDocApiItem name="[max]" type="Date | null" [(value)]="yearMax">
        Maximum selectable date — years after this are disabled.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >calendarSheet</code
      >
      pipe
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Pure pipe that turns
      <code>year | calendarSheet:month:weekStart</code>
      into a 6&times;7 grid of
      <code>Date</code>
      objects. Always renders 6 rows so the surrounding sheet height never
      shifts.
    </p>
  `,
})
export class CalendarApiComponent {
  // ── nxp-calendar inputs ────────────────────────────────────────────────
  readonly value = model<Date | [Date, Date] | Date[] | null>(null);
  readonly month = model<number | undefined>(undefined);
  readonly year = model<number | undefined>(undefined);
  readonly min = model<Date | null>(null);
  readonly max = model<Date | null>(null);
  readonly weekStart = model<0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined>(undefined);
  readonly showAdjacent = model(true);
  readonly rangeMode = model(false);
  readonly disabledHandler = model<((date: Date) => boolean) | null>(null);
  readonly markerHandler = model<
    ((date: Date) => [] | [string] | [string, string]) | null
  >(null);
  readonly class = model('');

  // ── nxp-calendar-header inputs ─────────────────────────────────────────
  readonly headerMonth = model<number>(new Date().getMonth());
  readonly headerYear = model<number>(new Date().getFullYear());
  readonly headerMin = model<Date | null>(null);
  readonly headerMax = model<Date | null>(null);

  // ── nxp-calendar-sheet inputs ──────────────────────────────────────────
  readonly sheetYear = model<number>(new Date().getFullYear());
  readonly sheetMonth = model<number>(new Date().getMonth());
  readonly sheetValue = model<Date | [Date, Date] | Date[] | null>(null);
  readonly sheetHoveredDay = model<Date | null>(null);
  readonly sheetWeekStart = model<0 | 1 | 2 | 3 | 4 | 5 | 6>(1);
  readonly sheetDisabledHandler = model<((date: Date) => boolean) | null>(null);
  readonly sheetMarkerHandler = model<
    ((date: Date) => [] | [string] | [string, string]) | null
  >(null);
  readonly sheetShowAdjacent = model(true);
  readonly sheetRangeMode = model(false);
  readonly sheetMin = model<Date | null>(null);
  readonly sheetMax = model<Date | null>(null);

  // ── nxp-calendar-year inputs ───────────────────────────────────────────
  readonly yearCurrentYear = model<number>(new Date().getFullYear());
  readonly yearSelectedYear = model<number | null>(null);
  readonly yearMin = model<Date | null>(null);
  readonly yearMax = model<Date | null>(null);

  // ── enum-like select options ───────────────────────────────────────────
  readonly weekStartOptions = [0, 1, 2, 3, 4, 5, 6] as const;
  readonly sheetWeekStartOptions = [0, 1, 2, 3, 4, 5, 6] as const;
}
