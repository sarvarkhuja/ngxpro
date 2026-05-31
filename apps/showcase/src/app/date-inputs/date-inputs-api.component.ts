import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the date-inputs demo. The simple playground knobs
 * (`placeholder`, `disabled`, `weekStart`, `rangeMode`, etc.) are exposed as
 * two-way `model()`s so the parent demo can share state — editing a row here
 * updates the live preview, and values persist to the URL via `nxpDocApiItem`.
 *
 * Complex-typed inputs (`Date | null`, `MonthCoord | null`, `DateRangePeriod[]`,
 * function handlers) are documented as pure rows — no editor — since they
 * cannot be edited inline from a query-string playground.
 */
@Component({
  selector: 'app-date-inputs-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the date-input components. Edit a primitive value
      (boolean, string, enum) to see the playground above react — values are
      persisted to the URL query string.
    </p>

    <!-- ──────────────────────────── nxp-input-date ────────────────────────── -->
    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-input-date</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>

      <tr nxpDocApiItem name="[(value)]" type="Date | null">
        Selected date. Two-way bindable — implements
        <code>ControlValueAccessor</code>
        so it also works with
        <code>[(ngModel)]</code>
        and
        <code>[formControl]</code
        >.
      </tr>
      <tr nxpDocApiItem name="[min]" type="Date | null">
        Earliest selectable date. Days before this are rendered as disabled.
      </tr>
      <tr nxpDocApiItem name="[max]" type="Date | null">
        Latest selectable date. Days after this are rendered as disabled.
      </tr>
      <tr
        nxpDocApiItem
        name="[placeholder]"
        type="string"
        [(value)]="dateInputPlaceholder"
      >
        Placeholder shown when the input is empty. Defaults to
        <code>DD/MM/YYYY</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[(disabled)]"
        type="boolean"
        [(value)]="dateInputDisabled"
      >
        When
        <code>true</code
        >, the input is non-interactive and the calendar cannot be opened. Also
        driven by
        <code>setDisabledState()</code>
        from the
        <code>ControlValueAccessor</code>
        contract.
      </tr>
      <tr
        nxpDocApiItem
        name="[weekStart]"
        type="0 | 1 | 2 | 3 | 4 | 5 | 6"
        [items]="weekStartOptions"
        [(value)]="dateInputWeekStart"
      >
        First day of the week in the calendar grid.
        <code>0</code>
        is Sunday,
        <code>1</code>
        is Monday (default), etc.
      </tr>
      <tr nxpDocApiItem name="[disabledHandler]" type="DisabledHandler | null">
        Predicate
        <code>(day: Date) =&gt; boolean</code>
        called per day; return
        <code>true</code>
        to mark the day disabled.
      </tr>
      <tr nxpDocApiItem name="[markerHandler]" type="MarkerHandler | null">
        Predicate
        <code>(day: Date) =&gt; string | null</code>
        called per day; return a CSS color token to render a marker dot.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="dateInputClass">
        Extra Tailwind classes merged onto the inner
        <code>&lt;input&gt;</code>
        via
        <code>cx()</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[inputId]"
        type="string"
        [(value)]="dateInputInputId"
      >
        Forwards an
        <code>id</code>
        to the inner input so consumers can pair a
        <code>&lt;label for="..."&gt;</code
        >.
      </tr>
      <tr nxpDocApiItem name="[ariaLabel]" type="string | null">
        Accessible name override; falls back to
        <code>placeholder</code>
        when not set.
      </tr>
      <tr nxpDocApiItem name="[ariaLabelledBy]" type="string | null">
        Reference to a labelling element by id; takes precedence over
        <code>ariaLabel</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[hasError]"
        type="boolean"
        [(value)]="dateInputHasError"
      >
        Marks the input as invalid (sets
        <code>aria-invalid</code
        >); style hook for callers wiring form validity.
      </tr>
    </table>

    <!-- ─────────────────────────── nxp-input-date-range ───────────────────── -->
    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-input-date-range</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>

      <tr nxpDocApiItem name="[(value)]" type="[Date, Date] | null">
        Selected range as a
        <code>[start, end]</code>
        tuple. Implements
        <code>ControlValueAccessor</code>
        so it also works with
        <code>[(ngModel)]</code>
        and
        <code>[formControl]</code
        >.
      </tr>
      <tr nxpDocApiItem name="[min]" type="Date | null">
        Earliest selectable date in either side of the range.
      </tr>
      <tr nxpDocApiItem name="[max]" type="Date | null">
        Latest selectable date in either side of the range.
      </tr>
      <tr
        nxpDocApiItem
        name="[minLength]"
        type="number | null"
        [(value)]="rangeMinLength"
      >
        Minimum number of days the range must span. Use
        <code>null</code>
        for no lower bound.
      </tr>
      <tr
        nxpDocApiItem
        name="[maxLength]"
        type="number | null"
        [(value)]="rangeMaxLength"
      >
        Maximum number of days the range may span. Use
        <code>null</code>
        for no upper bound.
      </tr>
      <tr
        nxpDocApiItem
        name="[placeholder]"
        type="string"
        [(value)]="rangePlaceholder"
      >
        Placeholder shown when the input is empty. Defaults to
        <code>DD/MM/YYYY – DD/MM/YYYY</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[(disabled)]"
        type="boolean"
        [(value)]="rangeDisabled"
      >
        When
        <code>true</code
        >, the input is non-interactive and the calendar cannot be opened.
      </tr>
      <tr nxpDocApiItem name="[disabledHandler]" type="DisabledHandler | null">
        Predicate
        <code>(day: Date) =&gt; boolean</code>
        for marking individual days disabled.
      </tr>
      <tr nxpDocApiItem name="[markerHandler]" type="MarkerHandler | null">
        Predicate
        <code>(day: Date) =&gt; string | null</code>
        for rendering per-day marker dots.
      </tr>
      <tr nxpDocApiItem name="[items]" type="DateRangePeriod[]">
        Preset period chips shown in a sidebar — clicking one fills the range
        immediately. Use
        <code>createDefaultDateRangePeriods()</code>
        for a sensible default set.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="rangeClass">
        Extra Tailwind classes merged onto the inner
        <code>&lt;input&gt;</code
        >.
      </tr>
      <tr nxpDocApiItem name="[inputId]" type="string" [(value)]="rangeInputId">
        Forwards an
        <code>id</code>
        to the inner input so consumers can pair a
        <code>&lt;label for="..."&gt;</code
        >.
      </tr>
      <tr nxpDocApiItem name="[ariaLabel]" type="string | null">
        Accessible name override; falls back to
        <code>placeholder</code>
        when not set.
      </tr>
      <tr nxpDocApiItem name="[ariaLabelledBy]" type="string | null">
        Reference to a labelling element by id; takes precedence over
        <code>ariaLabel</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[hasError]"
        type="boolean"
        [(value)]="rangeHasError"
      >
        Marks the input as invalid (sets
        <code>aria-invalid</code
        >); style hook for callers wiring form validity.
      </tr>
    </table>

    <!-- ──────────────────────────── nxp-input-month ───────────────────────── -->
    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-input-month</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>

      <tr nxpDocApiItem name="[(value)]" type="MonthCoord | null">
        Selected month as
        <code>&#123; year, month &#125;</code>
        (zero-indexed
        <code>month</code
        >). Implements
        <code>ControlValueAccessor</code>
        for
        <code>[(ngModel)]</code>
        /
        <code>[formControl]</code
        >.
      </tr>
      <tr nxpDocApiItem name="[min]" type="MonthCoord | null">
        Earliest selectable month. Months before this are rendered as disabled.
      </tr>
      <tr nxpDocApiItem name="[max]" type="MonthCoord | null">
        Latest selectable month. Months after this are rendered as disabled.
      </tr>
      <tr
        nxpDocApiItem
        name="[placeholder]"
        type="string"
        [(value)]="monthPlaceholder"
      >
        Placeholder shown when the input is empty. Defaults to
        <code>Month YYYY</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[(disabled)]"
        type="boolean"
        [(value)]="monthDisabled"
      >
        When
        <code>true</code
        >, the input is non-interactive and the month grid cannot be opened.
      </tr>
      <tr
        nxpDocApiItem
        name="[rangeMode]"
        type="boolean"
        [(value)]="monthRangeMode"
      >
        When
        <code>true</code
        >, the inner
        <code>nxp-calendar-month</code>
        renders in range-selection mode.
      </tr>
      <tr
        nxpDocApiItem
        name="[disabledHandler]"
        type="((m: MonthCoord) => boolean) | null"
      >
        Predicate called per month; return
        <code>true</code>
        to mark the month disabled.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="monthClass">
        Extra Tailwind classes merged onto the inner
        <code>&lt;input&gt;</code
        >.
      </tr>
      <tr nxpDocApiItem name="[inputId]" type="string" [(value)]="monthInputId">
        Forwards an
        <code>id</code>
        to the inner input so consumers can pair a
        <code>&lt;label for="..."&gt;</code
        >.
      </tr>
      <tr nxpDocApiItem name="[ariaLabel]" type="string | null">
        Accessible name override; falls back to
        <code>placeholder</code>
        when not set.
      </tr>
      <tr nxpDocApiItem name="[ariaLabelledBy]" type="string | null">
        Reference to a labelling element by id; takes precedence over
        <code>ariaLabel</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[hasError]"
        type="boolean"
        [(value)]="monthHasError"
      >
        Marks the input as invalid (sets
        <code>aria-invalid</code
        >); style hook for callers wiring form validity.
      </tr>
    </table>
  `,
})
export class DateInputsApiComponent {
  // ── nxp-input-date knobs ────────────────────────────────────────────────
  readonly dateInputPlaceholder = model<string>('DD/MM/YYYY');
  readonly dateInputDisabled = model<boolean>(false);
  readonly dateInputWeekStart = model<0 | 1 | 2 | 3 | 4 | 5 | 6>(1);
  readonly dateInputClass = model<string>('');
  readonly dateInputInputId = model<string>('');
  readonly dateInputHasError = model<boolean>(false);

  // ── nxp-input-date-range knobs ──────────────────────────────────────────
  readonly rangeMinLength = model<number | null>(null);
  readonly rangeMaxLength = model<number | null>(null);
  readonly rangePlaceholder = model<string>('DD/MM/YYYY – DD/MM/YYYY');
  readonly rangeDisabled = model<boolean>(false);
  readonly rangeClass = model<string>('');
  readonly rangeInputId = model<string>('');
  readonly rangeHasError = model<boolean>(false);

  // ── nxp-input-month knobs ───────────────────────────────────────────────
  readonly monthPlaceholder = model<string>('Month YYYY');
  readonly monthDisabled = model<boolean>(false);
  readonly monthRangeMode = model<boolean>(false);
  readonly monthClass = model<string>('');
  readonly monthInputId = model<string>('');
  readonly monthHasError = model<boolean>(false);

  // ── Enum-like option arrays for <select> editors ────────────────────────
  readonly weekStartOptions = [0, 1, 2, 3, 4, 5, 6] as const;
}
