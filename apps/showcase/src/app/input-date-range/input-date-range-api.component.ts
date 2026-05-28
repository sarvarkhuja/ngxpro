import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the input-date-range demo. Inputs are exposed as two-way
 * `model()`s so the parent demo can share playground state — editing a row
 * here updates the live preview, and values persist to the URL via
 * `nxpDocApiItem`.
 */
@Component({
  selector: 'app-input-date-range-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the input-date-range component. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-input-date-range</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[(value)]"
        type="[Date, Date] | null"
        [(value)]="value"
      >
        Currently selected date range. Two-way bindable — also writeable via
        <code>ControlValueAccessor</code>
        when used with
        <code>ngModel</code>
        or
        <code>formControl</code
        >.
      </tr>
      <tr nxpDocApiItem name="[min]" type="Date | null" [(value)]="min">
        Minimum selectable date. Dates earlier than this are greyed out in the
        calendar.
      </tr>
      <tr nxpDocApiItem name="[max]" type="Date | null" [(value)]="max">
        Maximum selectable date. Dates later than this are greyed out in the
        calendar.
      </tr>
      <tr
        nxpDocApiItem
        name="[minLength]"
        type="number | null"
        [(value)]="minLength"
      >
        Minimum range length in days (inclusive). Days that would produce a
        shorter range from the chosen start are disabled.
      </tr>
      <tr
        nxpDocApiItem
        name="[maxLength]"
        type="number | null"
        [(value)]="maxLength"
      >
        Maximum range length in days (inclusive). Days that would produce a
        longer range from the chosen start are disabled.
      </tr>
      <tr
        nxpDocApiItem
        name="[placeholder]"
        type="string"
        [(value)]="placeholder"
      >
        Placeholder text shown when the input is empty.
      </tr>
      <tr nxpDocApiItem name="[(disabled)]" type="boolean" [(value)]="disabled">
        Whether the input is non-interactive. Also updated via
        <code>setDisabledState()</code>
        when the component participates in a disabled
        <code>FormGroup</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[disabledHandler]"
        type="DisabledHandler | null"
        [(value)]="disabledHandler"
      >
        Per-date callback used to disable individual days (e.g. weekends,
        holidays). Receives a
        <code>Date</code>
        and returns a
        <code>boolean</code
        >.
        <!-- TODO refine type -->
      </tr>
      <tr
        nxpDocApiItem
        name="[markerHandler]"
        type="MarkerHandler | null"
        [(value)]="markerHandler"
      >
        Per-date callback that returns up to two CSS color strings used to
        render coloured dot markers under the day cell.
        <!-- TODO refine type -->
      </tr>
      <tr
        nxpDocApiItem
        name="[items]"
        type="DateRangePeriod[]"
        [(value)]="items"
      >
        Named preset periods shown in a sidebar alongside the calendar (e.g.
        Today, Last 7 days). Use
        <code>createDefaultDateRangePeriods()</code>
        for a sensible default set.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Extra Tailwind classes merged onto the inner
        <code>&lt;input&gt;</code>
        element via
        <code>cx()</code
        >.
      </tr>
      <tr nxpDocApiItem name="[inputId]" type="string" [(value)]="inputId">
        Forwards an
        <code>id</code>
        to the inner input so consumers can pair a
        <code>&lt;label for="..."&gt;</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[ariaLabel]"
        type="string | null"
        [(value)]="ariaLabel"
      >
        Accessible name override; falls back to
        <code>placeholder</code>
        when not set.
      </tr>
      <tr
        nxpDocApiItem
        name="[ariaLabelledBy]"
        type="string | null"
        [(value)]="ariaLabelledBy"
      >
        Reference to a labelling element by id; takes precedence over
        <code>ariaLabel</code
        >.
      </tr>
      <tr nxpDocApiItem name="[hasError]" type="boolean" [(value)]="hasError">
        Marks the input as invalid (sets
        <code>aria-invalid</code
        >); style hook for callers wiring form validity.
      </tr>
    </table>
  `,
})
export class InputDateRangeApiComponent {
  readonly value = model<[Date, Date] | null>(null);
  readonly min = model<Date | null>(null);
  readonly max = model<Date | null>(null);
  readonly minLength = model<number | null>(null);
  readonly maxLength = model<number | null>(null);
  readonly placeholder = model<string>('MM/DD/YYYY – MM/DD/YYYY');
  readonly disabled = model<boolean>(false);
  readonly disabledHandler = model<unknown>(null);
  readonly markerHandler = model<unknown>(null);
  readonly items = model<unknown[]>([]);
  readonly class = model<string>('');
  readonly inputId = model<string>('');
  readonly ariaLabel = model<string | null>(null);
  readonly ariaLabelledBy = model<string | null>(null);
  readonly hasError = model<boolean>(false);
}
