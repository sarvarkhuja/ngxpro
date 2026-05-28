import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the range demo. Inputs are exposed as two-way `model()`s so
 * the parent demo can share playground state — editing a row here updates the
 * live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-range-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the range components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-range</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[min]" type="number" [(value)]="min">
        Lower bound of the slider's domain. Defaults to
        <code>0</code
        >.
      </tr>
      <tr nxpDocApiItem name="[max]" type="number" [(value)]="max">
        Upper bound of the slider's domain. Defaults to
        <code>100</code
        >.
      </tr>
      <tr nxpDocApiItem name="[step]" type="number" [(value)]="step">
        Increment between selectable values. Set
        <code>0</code>
        for a continuous slider. Defaults to
        <code>1</code
        >.
      </tr>
      <tr nxpDocApiItem name="[margin]" type="number" [(value)]="margin">
        Minimum allowed distance between the two thumbs. Defaults to
        <code>0</code
        >.
      </tr>
      <tr nxpDocApiItem name="[limit]" type="number" [(value)]="limit">
        Maximum allowed distance between the two thumbs. Defaults to
        <code>Infinity</code
        >.
      </tr>
      <tr nxpDocApiItem name="[showSteps]" type="boolean" [(value)]="showSteps">
        When
        <code>true</code
        >, renders evenly-spaced dots along the track based on
        <code>step</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[themeColor]"
        type="boolean"
        [(value)]="themeColor"
      >
        When
        <code>true</code
        >, switches the fill, thumb, and focus ring to the primary theme color.
      </tr>
      <tr
        nxpDocApiItem
        name="[label]"
        type="string | undefined"
        [(value)]="label"
      >
        Accessible label prefix for the underlying native inputs. Defaults to
        <code>'Range'</code
        >.
      </tr>
      <tr nxpDocApiItem name="[(disabled)]" type="boolean" [(value)]="disabled">
        Two-way model. When
        <code>true</code
        >, dims the slider and disables interaction.
      </tr>
      <tr
        nxpDocApiItem
        name="[keySteps]"
        type="NxpKeySteps | undefined"
        [(value)]="keyStepsLabel"
      >
        Optional non-linear mapping from percentage positions to real domain
        values. Pass an array like
        <code>[[0, 50_000], [50, 1_000_000], [100, 30_000_000]]</code>
        for logarithmic-style scales.
      </tr>
      <tr
        nxpDocApiItem
        name="[(value)]"
        type="[number, number]"
        [(value)]="valueLabel"
      >
        Two-way model holding the current
        <code>[start, end]</code>
        tuple. Also bindable via
        <code>[(ngModel)]</code>
        or
        <code>[formControl]</code
        >.
      </tr>
    </table>
  `,
})
export class RangeApiComponent {
  readonly min = model(0);
  readonly max = model(100);
  readonly step = model(1);
  readonly margin = model(0);
  readonly limit = model(Infinity);
  readonly showSteps = model(false);
  readonly themeColor = model(false);
  readonly label = model<string | undefined>(undefined);
  readonly disabled = model(false);

  // Read-only display rows — these inputs are best configured per-example in
  // the playground, not via the API table editor.
  readonly keyStepsLabel = model<string>('see Key Steps example');
  readonly valueLabel = model<string>('see live examples');
}
