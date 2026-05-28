import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type { LinkSize, LinkVariant } from '@ngxpro/cdk/components/link';

/**
 * API table for the link demo. Inputs are exposed as two-way `model()`s so
 * the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-link-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxpLink</code
      >. Edit a value to see the playground above react — values are persisted
      to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxpLink</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[variant]"
        type="'default' | 'muted' | 'brand' | 'danger'"
        [items]="variantOptions"
        [(value)]="variant"
      >
        Visual color variant. Defaults to the
        <code>variant</code>
        from
        <code>NXP_LINK_OPTIONS</code>
        (initially
        <code>brand</code
        >).
      </tr>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'sm' | 'md' | 'lg'"
        [items]="sizeOptions"
        [(value)]="size"
      >
        Text size variant. Defaults to
        <code>md</code
        >.
      </tr>
      <tr nxpDocApiItem name="[underline]" type="boolean" [(value)]="underline">
        Whether to show underline decoration. Defaults to the
        <code>underline</code>
        from
        <code>NXP_LINK_OPTIONS</code>
        (initially
        <code>true</code
        >).
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Additional CSS classes (merged via
        <code>cx</code
        >).
      </tr>
    </table>
  `,
})
export class LinkApiComponent {
  readonly variant = model<LinkVariant>('brand');
  readonly size = model<LinkSize>('md');
  readonly underline = model<boolean>(true);
  readonly class = model<string>('');

  readonly variantOptions = ['default', 'muted', 'brand', 'danger'] as const;
  readonly sizeOptions = ['sm', 'md', 'lg'] as const;
}
