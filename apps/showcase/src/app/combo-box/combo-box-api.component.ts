import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

@Component({
  selector: 'app-combo-box-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the combo-box components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >input[nxpComboBox]</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[items]" type="readonly T[]" [(value)]="items">
        Set
        <code>items</code
        >.
        <!-- TODO describe -->
      </tr>
      <tr nxpDocApiItem name="[strict]" type="boolean" [(value)]="strict">
        Whether the combo-box requires the user to select an existing option.
        When
        <code>true</code>
        (default), free-text input is rejected on blur if no exact match. When
        <code>false</code
        >, any typed string is accepted as the value.
      </tr>
      <tr
        nxpDocApiItem
        name="[matcher]"
        type="NxpStringMatcher<T>"
        [(value)]="matcher"
      >
        Custom matcher used when filtering items. Defaults to
        <code>NXP_DEFAULT_MATCHER</code>
        (substring match, case-insensitive).
        <!-- TODO refine type -->
      </tr>
      <tr
        nxpDocApiItem
        name="[textField]"
        type="string | undefined"
        [(value)]="textField"
      >
        Property name on each item used as the display text. When set, overrides
        any inherited
        <code>NXP_ITEMS_HANDLERS.stringify</code
        >. Example:
        <code>textField="text"</code>
        with items like
        <code>&#123; text: 'Medium', value: 2 &#125;</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[valueField]"
        type="string | undefined"
        [(value)]="valueField"
      >
        Property name used for identity matching and primitive extraction. When
        set, items compare by
        <code>item[valueField]</code>
        instead of
        <code>===</code
        >. Required when
        <code>valuePrimitive</code>
        is
        <code>true</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[valuePrimitive]"
        type="boolean"
        [(value)]="valuePrimitive"
      >
        When
        <code>true</code
        >, the form control receives
        <code>item[valueField]</code>
        (a primitive) instead of the full item object. Requires
        <code>valueField</code>
        to be set.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-select-option</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[value]"
        type="T (required)"
        [(value)]="optionValue"
      >
        Set
        <code>value</code
        >.
        <!-- TODO describe -->
      </tr>
    </table>
  `,
})
export class ComboBoxApiComponent {
  readonly items = model<readonly unknown[]>([]);
  readonly strict = model(true);
  readonly matcher = model<unknown>();
  readonly textField = model<string | undefined>();
  readonly valueField = model<string | undefined>();
  readonly valuePrimitive = model(false);
  readonly optionValue = model<unknown>();
}
