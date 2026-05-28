import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the calendar-range demo. Inputs are exposed as two-way
 * `model()`s so the parent demo can share playground state — editing a row
 * here updates the live preview, and values persist to the URL via
 * `nxpDocApiItem`.
 */
@Component({
  selector: 'app-calendar-range-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the calendar-range component. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-calendar-range</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[value]"
        type="[Date, Date] | null"
        [(value)]="value"
      >
        Currently selected date range as a
        <code>[from, to]</code>
        tuple, or
        <code>null</code>
        when nothing is picked.
      </tr>
      <tr nxpDocApiItem name="[min]" type="Date | null" [(value)]="min">
        Minimum selectable date. Days before this are rendered as disabled.
      </tr>
      <tr nxpDocApiItem name="[max]" type="Date | null" [(value)]="max">
        Maximum selectable date. Days after this are rendered as disabled.
      </tr>
      <tr
        nxpDocApiItem
        name="[minLength]"
        type="number | null"
        [(value)]="minLength"
      >
        Minimum range length in days (inclusive). e.g.
        <code>2</code>
        means the user must pick at least a 2-day range.
      </tr>
      <tr
        nxpDocApiItem
        name="[maxLength]"
        type="number | null"
        [(value)]="maxLength"
      >
        Maximum range length in days (inclusive). e.g.
        <code>7</code>
        means the user can pick at most a 7-day range.
      </tr>
      <tr nxpDocApiItem name="[disabledHandler]" type="DisabledHandler | null">
        Optional handler
        <code>(date: Date) =&gt; boolean</code>
        used to disable individual dates (e.g. weekends, holidays).
      </tr>
      <tr nxpDocApiItem name="[markerHandler]" type="MarkerHandler | null">
        Optional handler that returns dot-marker descriptors for individual
        dates (e.g. event indicators rendered inside the day cell).
      </tr>
      <tr nxpDocApiItem name="[items]" type="DateRangePeriod[]">
        Named preset periods shown in the sidebar
        <code>&lt;nxp-data-list&gt;</code
        >. When non-empty, the second calendar is replaced by the preset list.
      </tr>
      <tr
        nxpDocApiItem
        name="[showAdjacent]"
        type="boolean"
        [(value)]="showAdjacent"
      >
        Whether to show days from adjacent months in each calendar sheet.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Additional CSS classes appended to the container.
      </tr>
    </table>
  `,
})
export class CalendarRangeApiComponent {
  readonly value = model<[Date, Date] | null>(null);
  readonly min = model<Date | null>(null);
  readonly max = model<Date | null>(null);
  readonly minLength = model<number | null>(null);
  readonly maxLength = model<number | null>(null);
  readonly showAdjacent = model<boolean>(false);
  readonly class = model<string>('');
}
