import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the `<nxp-select>` component. Generic over the item type `T`.
 *
 * For fully custom dropdown content beyond what these inputs cover, the
 * `input[nxpSelect]` directive remains available as the power-user escape hatch.
 */
@Component({
  selector: 'app-select-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      The self-contained
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&lt;nxp-select&gt;</code
      >
      component — one element +
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[formControl]</code
      >, no
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-textfield</code
      >
      assembly. Generic over the item type
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">T</code>.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&lt;nxp-select&gt;</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[30%]">Type</th>
      <th class="w-[45%]">Description</th>
      <tr nxpDocApiItem name="[items]" type="readonly T[]">
        The options to display in the dropdown list.
      </tr>
      <tr nxpDocApiItem name="[placeholder]" type="string" default="Select...">
        Text shown in the trigger when nothing is selected.
      </tr>
      <tr nxpDocApiItem name="[emptyLabel]" type="string" default="No options">
        Text shown in the dropdown when no items are available or match.
      </tr>
      <tr nxpDocApiItem name="[clearable]" type="boolean" default="false">
        Show a clear button when a value is selected.
      </tr>
      <tr nxpDocApiItem name="[textField]" type="string">
        Property name used as the display text for object items.
      </tr>
      <tr nxpDocApiItem name="[valueField]" type="string">
        Property name used for identity matching of object items.
      </tr>
      <tr nxpDocApiItem name="[disabledItem]" type="(item: T) => boolean">
        Predicate marking individual items non-selectable — they render dimmed
        with
        <code>aria-disabled</code>
        and are skipped by keyboard navigation.
      </tr>
      <tr nxpDocApiItem name="[filterable]" type="boolean" default="false">
        Show an in-panel search box that filters the options as you type.
      </tr>
      <tr nxpDocApiItem name="[matcher]" type="NxpStringMatcher<T>">
        Custom filter matcher. Defaults to
        <code>NXP_DEFAULT_MATCHER</code>
        (case-insensitive substring).
      </tr>
      <tr
        nxpDocApiItem
        name="[filterPlaceholder]"
        type="string"
        default="Search…"
      >
        Placeholder for the in-panel search input.
      </tr>
      <tr nxpDocApiItem name="[groupBy]" type="string">
        Property name used to bucket options into labelled groups.
      </tr>
      <tr nxpDocApiItem name="[creatable]" type="boolean" default="false">
        Show a "Create …" row when the search matches nothing (implies a search
        box).
      </tr>
      <tr nxpDocApiItem name="[createLabel]" type="string" default="Create">
        Label prefix shown on the create row.
      </tr>
      <tr nxpDocApiItem name="(create)" type="EventEmitter<string>">
        Emits the trimmed search text when the create row is chosen.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string">
        Extra CSS classes merged onto the host element.
      </tr>
    </table>
  `,
})
export class SelectApiComponent {}
