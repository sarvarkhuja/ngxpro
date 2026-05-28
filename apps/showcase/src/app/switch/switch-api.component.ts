import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type { NxpSwitchColor, NxpSwitchSize } from '@ngxpro/components/switch';

/**
 * API table for the switch demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-switch-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the switch component. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-switch</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[(checked)]" type="boolean" [(value)]="checked">
        Two-way bound checked state. When
        <code>true</code>
        the switch is on. Defaults to
        <code>false</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'s' | 'm' | 'l'"
        [items]="sizeOptions"
        [(value)]="size"
      >
        Track + thumb dimensions. Defaults to
        <code>m</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[color]"
        type="'primary' | 'secondary' | 'danger'"
        [items]="colorOptions"
        [(value)]="color"
      >
        ON-state color token. Defaults to
        <code>primary</code
        >.
      </tr>
      <tr nxpDocApiItem name="[disabled]" type="boolean" [(value)]="disabled">
        When
        <code>true</code
        >, the switch becomes non-interactive and renders at 50% opacity.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Extra Tailwind classes merged onto the host element via
        <code>cx()</code
        >.
      </tr>
    </table>
  `,
})
export class SwitchApiComponent {
  readonly checked = model(false);
  readonly size = model<NxpSwitchSize>('m');
  readonly color = model<NxpSwitchColor>('primary');
  readonly disabled = model(false);
  readonly class = model('');

  readonly sizeOptions = ['s', 'm', 'l'] as const;
  readonly colorOptions = ['primary', 'secondary', 'danger'] as const;
}
