import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type { NxpRadioColor, NxpRadioSize } from '@ngxpro/cdk/components/radio';

/**
 * API table for the radio demo. The size and color inputs are exposed as
 * two-way `model()`s so the parent demo can share state — editing a row
 * updates the live preview above, and values persist to the URL.
 */
@Component({
  selector: 'app-radio-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      The
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-radio</code
      >
      component wraps a native
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&lt;input type="radio"&gt;</code
      >
      and accepts these inputs.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">Inputs</h2>
    <table nxpDocApi>
      <th class="w-[20%]">Name</th>
      <th class="w-[25%]">Type</th>
      <th class="w-[55%]">Description</th>
      <tr nxpDocApiItem name="[size]" type="NxpRadioSize" [(value)]="size">
        Size of the radio:
        <code>'s'</code
        >,
        <code>'m'</code>
        (default),
        <code>'l'</code
        >.
      </tr>
      <tr nxpDocApiItem name="[color]" type="NxpRadioColor" [(value)]="color">
        Color variant:
        <code>'primary'</code>
        (default),
        <code>'secondary'</code
        >,
        <code>'danger'</code
        >.
      </tr>
    </table>

    <p class="text-sm text-text-secondary mt-4">
      Other inputs:
      <code>name</code>
      (native group name — radios sharing a name are mutually exclusive),
      <code>value</code>, <code>[(checked)]</code>, <code>disabled</code>, and
      <code>class</code>. The label is projected as content:
      <code>&lt;nxp-radio&gt;Label&lt;/nxp-radio&gt;</code>.
    </p>

    <p class="text-sm text-text-secondary mt-4">
      Implements
      <code>ControlValueAccessor</code>, so it works with
      <code>[(ngModel)]</code>
      and
      <code>[formControl]</code>
      out of the box — bind the same control to several
      <code>nxp-radio</code>
      elements and they stay mutually exclusive.
    </p>

    <p class="text-sm text-text-secondary mt-4">
      For object values, pass
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[compareWith]</code
      >
      — a
      <code>(a, b) =&gt; boolean</code>
      equality function — to match the form value against each radio's
      <code>value</code>
      by a stable property instead of reference identity.
    </p>
  `,
})
export class RadioApiComponent {
  readonly size = model<NxpRadioSize>('m');
  readonly color = model<NxpRadioColor>('primary');
}
