import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the textfield demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-textfield-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the textfield components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-textfield</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'sm' | 'md' | 'lg' | null"
        [items]="sizeOptions"
        [(value)]="size"
      >
        Visual size of the field wrapper. When
        <code>null</code>
        the size is inherited from
        <code>NXP_TEXTFIELD_OPTIONS</code>
        (defaults to
        <code>md</code
        >).
      </tr>
      <tr nxpDocApiItem name="[hasError]" type="boolean" [(value)]="hasError">
        When
        <code>true</code
        >, applies the error chrome (red focus ring + shadow).
      </tr>
      <tr nxpDocApiItem name="[iconStart]" type="string" [(value)]="iconStart">
        Remix-icon class (e.g.
        <code>ri-search-line</code
        >) rendered at the start of the field.
      </tr>
      <tr nxpDocApiItem name="[iconEnd]" type="string" [(value)]="iconEnd">
        Remix-icon class (e.g.
        <code>ri-settings-line</code
        >) rendered at the end of the field. Hidden when the cleaner is visible.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string">
        Additional Tailwind classes merged into the host element via
        <code>cx()</code
        >.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpTextfieldSize], [nxpTextfieldCleaner]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Options directive that overrides
      <code>NXP_TEXTFIELD_OPTIONS</code>
      for the field it is applied to.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[nxpTextfieldSize]"
        type="'sm' | 'md' | 'lg'"
        [items]="sizeNonNullOptions"
        [(value)]="nxpTextfieldSize"
      >
        Overrides the inherited textfield size for this field.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpTextfieldCleaner]"
        type="boolean"
        [(value)]="cleaner"
      >
        When
        <code>true</code
        >, surfaces a clear (×) button while the field has a value.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpTextfieldEnd]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Marker directive for projecting an interactive trailing element into
      <code>&lt;nxp-textfield&gt;</code>
      (tooltip hint, dropdown trigger, password toggle). Compose with sibling
      directives —
      <code>nxpTooltip</code>, <code>[nxpDropdown]</code>, or a
      <code>(click)</code>
      handler — on the same element. No configurable inputs on this directive.
    </p>
  `,
})
export class TextfieldApiComponent {
  readonly size = model<'sm' | 'md' | 'lg' | null>('md');
  readonly hasError = model(false);
  readonly iconStart = model('ri-user-line');
  readonly iconEnd = model('');
  readonly cleaner = model(false);
  readonly nxpTextfieldSize = model<'sm' | 'md' | 'lg'>('md');

  readonly sizeOptions = ['sm', 'md', 'lg'] as const;
  readonly sizeNonNullOptions = ['sm', 'md', 'lg'] as const;
}
