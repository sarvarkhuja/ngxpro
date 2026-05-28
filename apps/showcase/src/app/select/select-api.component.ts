import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the select demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-select-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the select directive. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >input[nxpSelect]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      The directive itself takes no host inputs — it derives behaviour from the
      bound
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >FormControl</code
      >
      and the surrounding
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-textfield</code
      >. The inputs below are inherited from the shared
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NxpControl</code
      >
      base class and apply to every form-bound directive in the library.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[readOnly]" type="boolean" [(value)]="readOnly">
        When
        <code>true</code>
        the input is non-interactive: keyboard shortcuts are ignored and the
        dropdown will not open. Combine with a populated form value to show a
        locked selection.
      </tr>
      <tr
        nxpDocApiItem
        name="[pseudoInvalid]"
        type="boolean | null"
        [(value)]="pseudoInvalid"
      >
        Force the invalid visual state regardless of the form control's actual
        validity. Use
        <code>null</code>
        (the default) to defer to the bound control's own
        <code>status</code>
        and
        <code>touched</code>
        flags.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NxpSelect</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Convenience
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >const</code
      >
      array re-exported from
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&#64;ngxpro/components/select</code
      >. Spread it into a component's
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >imports</code
      >
      to bring in the directive together with the textfield, label, input,
      data-list, option and dropdown pieces it composes with. No configurable
      inputs of its own.
    </p>
  `,
})
export class SelectApiComponent {
  readonly readOnly = model(false);
  readonly pseudoInvalid = model<boolean | null>(null);
}
