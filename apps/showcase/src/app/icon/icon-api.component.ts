import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the icon demo. Inputs are exposed as two-way `model()`s so the
 * parent demo can share playground state — editing a row here updates the live
 * preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-icon-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the icon component. Edit a value to see the playground
      above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-icon</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[icon]" type="string" [(value)]="icon">
        Icon name: Remix class (e.g.
        <code>ri-search-line</code>
        ) or raw SVG string.
      </tr>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'"
        [items]="sizeOptions"
        [(value)]="size"
      >
        Size override. Falls back to the injected
        <code>NXP_ICON_OPTIONS</code>
        default (<code>md</code>).
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Additional CSS classes (merged via
        <code>cx</code>
        ). Use Tailwind text colors here to recolor the glyph — icons inherit
        <code>currentColor</code>
        .
      </tr>
    </table>
  `,
})
export class IconApiComponent {
  readonly icon = model<string>('ri-home-line');
  readonly size = model<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | undefined>(
    'lg',
  );
  readonly class = model<string>('text-gray-700 dark:text-gray-200');

  readonly sizeOptions = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
}
