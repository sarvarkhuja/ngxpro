import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type {
  NxpTooltipDirection,
  NxpTooltipSize,
} from '@ngxpro/components/tooltip';

/**
 * API table for the tooltip demo. Inputs are exposed as two-way `model()`s so
 * the parent demo can share playground state — editing a row here updates the
 * live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-tooltip-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the tooltip directive and convenience icon component.
      Edit a value to see the playground above react — values are persisted to
      the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpTooltip]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Main directive — attach to any element to give it a tooltip. The same
      inputs are forwarded by
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-tooltip-icon</code
      >
      via
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >hostDirectives</code
      >.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[nxpTooltip]"
        type="string"
        [(value)]="nxpTooltip"
      >
        The tooltip content — string,
        <code>TemplateRef</code
        >, or
        <code>NxpDynamicComponent</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpTooltipDirection]"
        type="'top' | 'bottom' | 'left' | 'right'"
        [items]="directionOptions"
        [(value)]="nxpTooltipDirection"
      >
        Preferred opening direction. Falls back to the options default
        (<code>top</code>). Auto-flips to the opposite side when the panel would
        overflow the viewport.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpTooltipAlign]"
        type="'start' | 'center' | 'end'"
        [items]="alignOptions"
        [(value)]="nxpTooltipAlign"
      >
        Alignment along the cross-axis. Falls back to the options default
        (<code>center</code>).
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpTooltipAppearance]"
        type="'dark' | 'light'"
        [items]="appearanceOptions"
        [(value)]="nxpTooltipAppearance"
      >
        Visual appearance. Falls back to the options default
        (<code>dark</code>). Both styles auto-flip in dark mode.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpTooltipSize]"
        type="'sm' | 'md' | 'lg'"
        [items]="sizeOptions"
        [(value)]="nxpTooltipSize"
      >
        Panel size — adjusts text size and padding.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpTooltipShowDelay]"
        type="number"
        [(value)]="nxpTooltipShowDelay"
      >
        Show delay in ms before the tooltip opens. Falls back to the options
        default (<code>300</code>).
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpTooltipHideDelay]"
        type="number"
        [(value)]="nxpTooltipHideDelay"
      >
        Hide delay in ms before the tooltip closes. Falls back to the options
        default (<code>100</code>).
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpTooltipDisabled]"
        type="boolean"
        [(value)]="nxpTooltipDisabled"
      >
        When
        <code>true</code
        >, the tooltip will not show — useful for conditionally suppressing the
        popup without removing the directive.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpTooltipDescribe]"
        type="string"
        [(value)]="nxpTooltipDescribe"
      >
        Sets
        <code>aria-describedby</code>
        on the host element. Leave empty for no attribute.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-tooltip-icon</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Convenience component that renders a small info icon and applies the
      tooltip directive to itself via
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >hostDirectives</code
      >. Accepts all of the
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpTooltip]</code
      >
      inputs above — no inputs of its own. The icon glyph is sourced from
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NXP_TOOLTIP_OPTIONS.icon</code
      >.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-tooltip</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      The rendered popup panel — created dynamically by the directive through
      the portal system. Not used directly. It reads its host trigger via
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NXP_TOOLTIP_HOST</code
      >
      and has no configurable inputs of its own.
    </p>
  `,
})
export class TooltipApiComponent {
  readonly nxpTooltip = model<string>('Tooltip content goes here');
  readonly nxpTooltipDirection = model<NxpTooltipDirection>('top');
  readonly nxpTooltipAlign = model<'start' | 'center' | 'end'>('center');
  readonly nxpTooltipAppearance = model<string>('dark');
  readonly nxpTooltipSize = model<NxpTooltipSize>('md');
  readonly nxpTooltipShowDelay = model<number>(300);
  readonly nxpTooltipHideDelay = model<number>(100);
  readonly nxpTooltipDisabled = model<boolean>(false);
  readonly nxpTooltipDescribe = model<string>('');

  readonly directionOptions = ['top', 'bottom', 'left', 'right'] as const;
  readonly alignOptions = ['start', 'center', 'end'] as const;
  readonly appearanceOptions = ['dark', 'light'] as const;
  readonly sizeOptions = ['sm', 'md', 'lg'] as const;
}
