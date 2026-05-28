import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the calendar-month demo. Inputs are exposed as two-way
 * `model()`s so the parent demo can share playground state — editing a row
 * here updates the live preview, and values persist to the URL via
 * `nxpDocApiItem`.
 */
@Component({
  selector: 'app-calendar-month-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the calendar-month component. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-calendar-month</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[rangeMode]" type="boolean" [(value)]="rangeMode">
        Enable month-range selection mode. When
        <code>true</code
        >, the first click sets the range start and the second sets the end.
        Overrides the injected
        <code>CALENDAR_MONTH_OPTIONS.rangeMode</code>
        when provided.
      </tr>
      <tr nxpDocApiItem name="[minLength]" type="number" [(value)]="minLength">
        Minimum range length (inclusive) when in range-picking mode. A value of
        <code>2</code>
        prevents selecting a single-month range.
      </tr>
      <tr nxpDocApiItem name="[maxLength]" type="number" [(value)]="maxLength">
        Maximum range length (inclusive) when in range-picking mode. A value of
        <code>3</code>
        prevents selecting a range longer than 3 months.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Additional CSS classes for the container.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      Non-editable inputs
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      The following inputs accept structured values (objects, coordinates,
      functions) and are configured directly in the demo examples above rather
      than through the playground.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[year]" type="number">
        Overrides the initially-displayed year. Falls back to the selected
        value's year, then to today's year.
      </tr>
      <tr nxpDocApiItem name="[value]" type="CalendarMonthValue">
        Selected value — either a single
        <code>MonthCoord</code
        >, a
        <code>MonthRange</code
        >, or
        <code>null</code
        >. In
        <code>rangeMode</code>
        the component expects a
        <code>MonthRange</code>
        once both ends are chosen.
      </tr>
      <tr nxpDocApiItem name="[min]" type="MonthCoord | null">
        Optional lower bound (inclusive).
      </tr>
      <tr nxpDocApiItem name="[max]" type="MonthCoord | null">
        Optional upper bound (inclusive).
      </tr>
      <tr
        nxpDocApiItem
        name="[disabledHandler]"
        type="(m: MonthCoord) => boolean"
      >
        Returns
        <code>true</code>
        if the given month should be disabled.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">Outputs</h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="(monthClick)" type="MonthCoord">
        Emitted when the user clicks a non-disabled month cell.
      </tr>
      <tr nxpDocApiItem name="(hoveredItemChange)" type="MonthCoord | null">
        Emitted when the hovered month changes (for external range-preview
        logic).
      </tr>
      <tr nxpDocApiItem name="(yearChange)" type="number">
        Emitted when the user navigates to a different year.
      </tr>
    </table>
  `,
})
export class CalendarMonthApiComponent {
  readonly rangeMode = model<boolean>(false);
  readonly minLength = model<number | null>(null);
  readonly maxLength = model<number | null>(null);
  readonly class = model<string>('');
}
