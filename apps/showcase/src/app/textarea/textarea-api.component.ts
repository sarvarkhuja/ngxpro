import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the textarea demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-textarea-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the textarea components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >textarea[nxpTextarea]</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[min]" type="number | null" [(value)]="min">
        Minimum number of rows (default
        <code>2</code>
        via
        <code>nxpTextareaOptionsProvider</code
        >). The textarea will not shrink below this height.
      </tr>
      <tr nxpDocApiItem name="[max]" type="number | null" [(value)]="max">
        Maximum number of rows (default
        <code>6</code>
        via
        <code>nxpTextareaOptionsProvider</code
        >). Content beyond this row count begins to scroll.
      </tr>
      <tr nxpDocApiItem name="[hasError]" type="boolean" [(value)]="hasError">
        Whether the textarea has a validation error (standalone mode only — when
        nested inside
        <code>nxp-textfield</code
        >, set
        <code>[hasError]</code>
        on the wrapper instead).
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Additional CSS classes merged into the host via
        <code>cx()</code
        >.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >textarea[nxpTextarea][limit]</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[limit]" type="number" [(value)]="limit">
        Maximum number of characters allowed.
        <strong>Required.</strong>
        Displays a live counter beneath the textarea and adds a
        <code>maxlength</code>
        validation error to the form control when exceeded.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-textarea-counter</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Internal helper component rendered automatically by
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NxpTextareaLimitDirective</code
      >
      to display the
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&#123;current&#125; / &#123;limit&#125;</code
      >
      character counter. Not intended to be used directly — no public inputs.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxpTextareaOptionsProvider</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Provide global defaults for all textareas in a component subtree —
      override the default
      <code>min: 2</code>
      and
      <code>max: 6</code>
      bounds.
    </p>
    <pre
      class="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 text-xs font-mono text-text-primary overflow-x-auto"
      >{{ providerSnippet }}</pre
    >
  `,
})
export class TextareaApiComponent {
  readonly min = model<number | null>(null);
  readonly max = model<number | null>(null);
  readonly hasError = model(false);
  readonly class = model('');
  readonly limit = model<number>(200);

  readonly providerSnippet =
    'providers: [nxpTextareaOptionsProvider({ min: 3, max: 8 })]';
}
