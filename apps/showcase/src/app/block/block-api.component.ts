import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type {
  NxpBlockAppearance,
  NxpBlockSize,
} from '@ngxpro/components/block';

/**
 * API table for the block demo. Inputs are exposed as two-way `model()`s so
 * the parent demo can share playground state — editing a row here updates the
 * live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-block-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the block components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-bg-neutral-1 dark:bg-bg-neutral-2 px-1 rounded"
        >nxpBlock</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'s' | 'm' | 'l'"
        [items]="sizes"
        [(value)]="size"
      >
        Padding + typography scale. Defaults to
        <code>l</code>
        (overridable via
        <code>nxpBlockOptionsProvider</code
        >).
      </tr>
      <tr
        nxpDocApiItem
        name="[appearance]"
        type="'outline' | 'filled' | 'primary' | 'success' | 'danger'"
        [items]="appearances"
        [(value)]="appearance"
      >
        Visual style. Inside a
        <code>nxp-block-group</code>
        backgrounds become transparent so the group's animated overlays show
        through.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="extraClass">
        Additional CSS classes merged via
        <code>cx()</code
        >.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-bg-neutral-1 dark:bg-bg-neutral-2 px-1 rounded"
        >nxp-block-group</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[(checkedIndex)]"
        type="number | null"
        [(value)]="checkedIndex"
      >
        Two-way bound index of the active block (radio-group style). The group
        animates a sliding pill to the selected item and tracks hover / focus on
        the others.
      </tr>
    </table>
  `,
})
export class BlockApiComponent {
  readonly size = model<NxpBlockSize>('m');
  readonly appearance = model<NxpBlockAppearance>('outline');
  readonly extraClass = model<string>('');
  readonly checkedIndex = model<number | null>(0);

  readonly sizes = ['s', 'm', 'l'] as const;
  readonly appearances = [
    'outline',
    'filled',
    'primary',
    'success',
    'danger',
  ] as const;
}
