import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the input-month demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-input-month-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the input-month component. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-input-month</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[placeholder]"
        type="string"
        [(value)]="placeholder"
      >
        Placeholder text shown when no month is selected. Defaults to
        <code>Month YYYY</code
        >.
      </tr>
      <tr nxpDocApiItem name="[disabled]" type="boolean" [(value)]="disabled">
        When
        <code>true</code>
        the input is non-interactive and the dropdown cannot be opened.
      </tr>
      <tr nxpDocApiItem name="[rangeMode]" type="boolean" [(value)]="rangeMode">
        Enable month-range selection in the calendar-month dropdown.
      </tr>
      <tr nxpDocApiItem name="[hasError]" type="boolean" [(value)]="hasError">
        Marks the input as invalid (sets
        <code>aria-invalid</code
        >); style hook for callers wiring form validity.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="className">
        Extra class names merged onto the inner
        <code>input</code>
        element.
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
      <tr nxpDocApiItem name="[value]" type="MonthCoord | null">
        Currently selected month (<code>{{ '{' }} year, month {{ '}' }}</code
        >). Bound via
        <code>[value]</code
        >,
        <code>[(ngModel)]</code
        >, or
        <code>[formControl]</code>
        in the live examples — see the Examples tab.
      </tr>
      <tr nxpDocApiItem name="[min]" type="MonthCoord | null">
        Minimum selectable month (inclusive). Months earlier than this are
        greyed out in the dropdown.
      </tr>
      <tr nxpDocApiItem name="[max]" type="MonthCoord | null">
        Maximum selectable month (inclusive). Months later than this are greyed
        out in the dropdown.
      </tr>
      <tr
        nxpDocApiItem
        name="[disabledHandler]"
        type="(m: MonthCoord) => boolean | null"
      >
        Callback to disable individual months in the dropdown — returns
        <code>true</code>
        to disable a given month.
      </tr>
    </table>
  `,
})
export class InputMonthApiComponent {
  readonly placeholder = model<string>('Month YYYY');
  readonly disabled = model<boolean>(false);
  readonly rangeMode = model<boolean>(false);
  readonly hasError = model<boolean>(false);
  readonly className = model<string>('');
  readonly inputId = model<string>('');
  readonly ariaLabel = model<string | null>(null);
  readonly ariaLabelledBy = model<string | null>(null);
}
