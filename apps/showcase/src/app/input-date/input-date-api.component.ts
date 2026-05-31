import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the input-date demo. Inputs that drive the live playground are
 * exposed as two-way `model()`s so the parent demo can share state — editing a
 * row updates the live preview, and values are persisted to the URL via
 * `nxpDocApiItem`.
 */
@Component({
  selector: 'app-input-date-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-input-date</code
      >
      component. Edit a value to see the playground above react — values are
      persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-input-date</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[(value)]" type="Date | null" [(value)]="value">
        Currently selected date. Two-way bindable model; reactive forms set this
        via
        <code>writeValue()</code
        >.
      </tr>
      <tr nxpDocApiItem name="[min]" type="Date | null" [(value)]="min">
        Minimum selectable date. Dates before this bound are disabled in the
        calendar dropdown, and a typed date before it snaps up to this bound on
        blur.
      </tr>
      <tr nxpDocApiItem name="[max]" type="Date | null" [(value)]="max">
        Maximum selectable date. Dates after this bound are disabled in the
        calendar dropdown, and a typed date after it snaps down to this bound on
        blur.
      </tr>
      <tr
        nxpDocApiItem
        name="[placeholder]"
        type="string"
        [(value)]="placeholder"
      >
        Placeholder text shown when the input is empty. Defaults to
        <code>'DD/MM/YYYY'</code
        >.
      </tr>
      <tr nxpDocApiItem name="[(disabled)]" type="boolean" [(value)]="disabled">
        When
        <code>true</code
        >, the input is non-interactive. Also kept in sync by Angular forms via
        <code>setDisabledState()</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[weekStart]"
        type="0 | 1 | 2 | 3 | 4 | 5 | 6"
        [items]="weekStartOptions"
        [(value)]="weekStart"
      >
        First day of the week in the calendar dropdown (<code>0</code>
        = Sunday …
        <code>6</code>
        = Saturday). Defaults to
        <code>1</code>
        (Monday).
      </tr>
      <tr
        nxpDocApiItem
        name="[disabledHandler]"
        type="DisabledHandler | null"
        [(value)]="disabledHandler"
      >
        Optional handler
        <code>(date: Date) =&gt; boolean</code>
        used to disable individual dates in the dropdown.
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
        used to add coloured dot markers to dates.
        <!-- TODO refine type -->
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Additional CSS classes merged into the inner
        <code>&lt;input&gt;</code>
        via
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
        Reference to a labelling element by
        <code>id</code
        >; takes precedence over
        <code>ariaLabel</code
        >.
      </tr>
      <tr nxpDocApiItem name="[hasError]" type="boolean" [(value)]="hasError">
        Marks the input as invalid (sets
        <code>aria-invalid</code
        >); style hook for callers wiring form validity.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">Outputs</h2>
    <p class="text-sm text-text-secondary mb-2">
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >valueChange</code
      >
      emits a
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >Date | null</code
      >
      whenever the user selects a day from the dropdown or types a valid date
      and blurs the input. Use
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[(value)]</code
      >
      for two-way binding.
    </p>
  `,
})
export class InputDateApiComponent {
  readonly value = model<Date | null>(null);
  readonly min = model<Date | null>(null);
  readonly max = model<Date | null>(null);
  readonly placeholder = model<string>('DD/MM/YYYY');
  readonly disabled = model<boolean>(false);
  readonly weekStart = model<0 | 1 | 2 | 3 | 4 | 5 | 6>(1);
  readonly disabledHandler = model<((date: Date) => boolean) | null>(null);
  readonly markerHandler = model<
    ((date: Date) => [] | [string] | [string, string]) | null
  >(null);
  readonly class = model<string>('');
  readonly inputId = model<string>('');
  readonly ariaLabel = model<string | null>(null);
  readonly ariaLabelledBy = model<string | null>(null);
  readonly hasError = model<boolean>(false);

  // ── enum-like select options ───────────────────────────────────────────
  readonly weekStartOptions = [0, 1, 2, 3, 4, 5, 6] as const;
}
