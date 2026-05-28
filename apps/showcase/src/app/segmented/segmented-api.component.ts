import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type {
  NxpSegmentedOrientation,
  NxpSegmentedSize,
} from '@ngxpro/components/segmented';

/**
 * API table for the segmented demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-segmented-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the segmented components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-segmented</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'sm' | 'md' | 'lg'"
        [items]="sizeOptions"
        [(value)]="size"
      >
        Size variant —
        <code>sm</code>
        (h-8),
        <code>md</code>
        (h-10),
        <code>lg</code>
        (h-12). Matches the button component heights.
      </tr>
      <tr
        nxpDocApiItem
        name="[orientation]"
        type="'horizontal' | 'vertical'"
        [items]="orientationOptions"
        [(value)]="orientation"
      >
        Layout direction —
        <code>horizontal</code>
        (default) or
        <code>vertical</code>
        (stacked, full-width items).
      </tr>
      <tr
        nxpDocApiItem
        name="[(activeItemIndex)]"
        type="number"
        [(value)]="activeItemIndex"
      >
        Index of the currently active segment. Supports two-way binding.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-segment</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Item component for
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-segmented</code
      >. Adds icon slots and per-item disabled state. Plain
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >button</code
      >,
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">a</code>,
      or
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >label</code
      >
      children continue to work without it — use
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-segment</code
      >
      when you need icons or per-item disabling.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[disabled]" type="boolean">
        Whether this segment is disabled. Blocks clicks and applies muted
        styling. Native
        <code>&lt;button disabled&gt;</code>
        already blocks clicks;
        <code>&lt;a&gt;</code>
        /
        <code>&lt;label&gt;</code>
        rely on the parent directive's
        <code>closest('[disabled]')</code>
        guard.
      </tr>
      <tr nxpDocApiItem name="[iconStart]" type="string">
        Icon to display before the label. Accepts a raw SVG string — same
        pattern as the button component's
        <code>iconStart</code>
        input.
      </tr>
      <tr nxpDocApiItem name="[iconEnd]" type="string">
        Icon to display after the label. Accepts a raw SVG string.
      </tr>
    </table>
  `,
})
export class SegmentedApiComponent {
  readonly size = model<NxpSegmentedSize>('md');
  readonly orientation = model<NxpSegmentedOrientation>('horizontal');
  readonly activeItemIndex = model(0);

  readonly sizeOptions = ['sm', 'md', 'lg'] as const;
  readonly orientationOptions = ['horizontal', 'vertical'] as const;
}
