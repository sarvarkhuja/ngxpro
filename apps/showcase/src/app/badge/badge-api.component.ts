import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import {
  NXP_BADGE_COLORS,
  type NxpBadgeColor,
  type NxpBadgeSize,
  type NxpBadgeVariant,
} from '@ngxpro/components/badge';

/**
 * API table for the badge demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-badge-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the badge components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-badge</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      The
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-badge</code
      >
      component composes
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NxpBadgeDirective</code
      >
      as a host directive and forwards all of the directive's inputs. The same
      inputs are available on the
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpBadge]</code
      >
      directive when applied to an arbitrary inline element.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[variant]"
        type="'solid' | 'dot'"
        [items]="variantOptions"
        [(value)]="variant"
      >
        Visual style:
        <code>solid</code>
        uses a tinted background;
        <code>dot</code>
        shows a colored indicator with a subtle border.
      </tr>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'sm' | 'md' | 'lg'"
        [items]="sizeOptions"
        [(value)]="size"
      >
        Size of the badge. Controls height, padding, font size, and (for the
        <code>dot</code>
        variant) the indicator diameter.
      </tr>
      <tr
        nxpDocApiItem
        name="[color]"
        type="NxpBadgeColor"
        [items]="colorOptions"
        [(value)]="color"
      >
        Color from the Tailwind palette — one of the 17 keys in
        <code>NXP_BADGE_COLORS</code
        >.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Additional CSS classes merged via
        <code>cx()</code
        >.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpBadge]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Directive form of the badge — apply to any inline element to style it as a
      badge without introducing the
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-badge</code
      >
      host element. Accepts the same
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >variant</code
      >,
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">size</code
      >,
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >color</code
      >, and
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >class</code
      >
      inputs as the component above. The
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">dot</code>
      variant renders the indicator only when the directive is paired with the
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-badge</code
      >
      component template.
    </p>
  `,
})
export class BadgeApiComponent {
  readonly variant = model<NxpBadgeVariant>('solid');
  readonly size = model<NxpBadgeSize>('md');
  readonly color = model<NxpBadgeColor>('gray');
  readonly class = model<string>('');

  readonly variantOptions = ['solid', 'dot'] as const;
  readonly sizeOptions = ['sm', 'md', 'lg'] as const;
  readonly colorOptions = Object.keys(NXP_BADGE_COLORS) as NxpBadgeColor[];
}
