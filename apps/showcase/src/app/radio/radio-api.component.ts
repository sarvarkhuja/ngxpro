import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type { NxpRadioColor, NxpRadioSize } from '@ngxpro/cdk/components/radio';

/**
 * API table for the radio demo. Inputs are exposed as two-way `model()`s so
 * the parent demo can share playground state — editing a row here updates the
 * live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-radio-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the radio components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >input[type="radio"][nxpRadio]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Radio input directive — applies to native
      <code>&lt;input type="radio"&gt;</code> elements. State is read by the
      browser via <code>:checked</code> / <code>:disabled</code>
      pseudo-classes. Integrates with Angular Reactive Forms via the built-in
      <code>RadioControlValueAccessor</code>.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'s' | 'm' | 'l'"
        [items]="radioSizes"
        [(value)]="size"
      >
        Size of the radio input. Defaults to option value (<code>m</code>).
      </tr>
      <tr
        nxpDocApiItem
        name="[color]"
        type="'primary' | 'secondary' | 'danger'"
        [items]="radioColors"
        [(value)]="color"
      >
        Color variant. Controls border and checked fill color.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Additional CSS classes.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >input[type="radio"][nxpRadio][identityMatcher]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Identity matcher directive — patches Angular's
      <code>RadioControlValueAccessor</code> to support custom equality for
      object values. Without it, Angular uses reference equality
      (<code>===</code>) to match the form control value against each radio's
      <code>value</code> attribute. Must be used together with
      <code>nxpRadio</code> on <code>input[type="radio"]</code> elements.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[identityMatcher]" type="(a: T, b: T) => boolean">
        Custom equality function for comparing form control value against each
        radio option's value. Defaults to strict reference equality.
        <!-- TODO refine type — function input, not editable via the playground -->
      </tr>
    </table>
  `,
})
export class RadioApiComponent {
  readonly size = model<NxpRadioSize>('m');
  readonly color = model<NxpRadioColor>('primary');
  readonly class = model<string>('');

  readonly radioSizes = ['s', 'm', 'l'] as const;
  readonly radioColors = ['primary', 'secondary', 'danger'] as const;
}
