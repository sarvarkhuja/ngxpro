import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the accordion demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-accordion-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the accordion components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-accordion</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[type]"
        type="'single' | 'multiple'"
        [items]="accordionTypes"
        [(value)]="type"
      >
        Set
        <code>single</code>
        to enforce only one open section at a time. Defaults to
        <code>multiple</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[closeOthers]"
        type="boolean"
        [(value)]="closeOthers"
      >
        When
        <code>true</code
        >, opening any item closes the others regardless of
        <code>type</code
        >.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-expand</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Content panel that animates its height when toggled by the sibling
      trigger. Imported from
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&#64;ngxpro/cdk</code
      >. No inputs of its own — the parent accordion drives the open/closed
      state via DOM siblings.
    </p>
  `,
})
export class AccordionApiComponent {
  readonly type = model<'single' | 'multiple'>('multiple');
  readonly closeOthers = model(false);

  readonly accordionTypes = ['single', 'multiple'] as const;
}
