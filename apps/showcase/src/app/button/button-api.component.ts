import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type { ButtonSize, ButtonVariant } from '@ngxpro/components/button';

/**
 * API table for the button demo. `variant`, `size`, `loading` and `disabled`
 * are exposed as two-way `model()`s so the parent demo shares state — editing a
 * row drives the live Playground on the Examples tab, and every value persists
 * to the URL query string for deep-linking.
 */
@Component({
  selector: 'app-button-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      The button is an attribute directive — apply
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxpButton</code
      >
      to a native
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&lt;button&gt;</code
      >
      or
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&lt;a&gt;</code
      >. Edit the rows below to drive the live
      <strong class="font-medium text-text-primary">Playground</strong>
      on the Examples tab — values persist to the URL.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">Inputs</h2>
    <table nxpDocApi>
      <th class="w-[20%]">Name</th>
      <th class="w-[30%]">Type</th>
      <th class="w-[50%]">Description</th>

      <tr
        nxpDocApiItem
        name="[variant]"
        type="ButtonVariant"
        [(value)]="variant"
        [items]="variants"
      >
        Visual intent:
        <code>'primary'</code>
        (default),
        <code>'secondary'</code
        >,
        <code>'tertiary'</code
        >,
        <code>'ghost'</code
        >,
        <code>'destructive'</code
        >.
      </tr>

      <tr
        nxpDocApiItem
        name="[size]"
        type="ButtonSize"
        [(value)]="size"
        [items]="sizes"
      >
        Height &amp; padding:
        <code>'sm'</code
        >,
        <code>'md'</code>
        (default),
        <code>'lg'</code>
        — plus square icon-only sizes
        <code>'icon-sm'</code
        >,
        <code>'icon'</code
        >,
        <code>'icon-lg'</code
        >.
      </tr>

      <tr nxpDocApiItem name="[loading]" type="boolean" [(value)]="loading">
        Swaps the label for the figure-8 spinner and blocks interaction (also
        sets
        <code>aria-busy</code>
        and
        <code>disabled</code
        >).
      </tr>

      <tr nxpDocApiItem name="[disabled]" type="boolean" [(value)]="disabled">
        Native
        <code>disabled</code>
        attribute — dims to 50% and removes pointer events.
      </tr>
    </table>

    <p class="text-sm text-text-secondary mt-4">
      Icon slots:
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[iconStart]</code
      >
      and
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[iconEnd]</code
      >
      take an HTML/SVG string rendered before/after the label (hidden for
      icon-only sizes). Inner
      <code>&lt;svg&gt;</code>
      inherits
      <code>currentColor</code>
      and animates stroke
      <code>1.5 → 2</code>
      on hover.
    </p>

    <p class="text-sm text-text-secondary mt-4">
      The
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[class]</code
      >
      input is merged through
      <code>cx()</code>
      (<code>twMerge</code>), so per-instance classes win conflicts — e.g.
      <code>class="bg-accent-ship text-white"</code>
      re-skins a single CTA without touching the variant.
    </p>

    <p class="text-sm text-text-secondary mt-4">
      There are no custom outputs — it renders a real
      <code>&lt;button&gt;</code>
      or
      <code>&lt;a&gt;</code>, so use <code>(click)</code>,
      <code>routerLink</code>, <code>type="submit"</code>
      and the rest of the native API directly. The label is projected content:
      <code>&lt;button nxpButton&gt;Label&lt;/button&gt;</code>.
    </p>
  `,
})
export class ButtonApiComponent {
  // Two-way bound to the demo's Playground state.
  readonly variant = model<ButtonVariant>('primary');
  readonly size = model<ButtonSize>('md');
  readonly loading = model<boolean>(false);
  readonly disabled = model<boolean>(false);

  // Option lists drive the `<select>` editors for the enum inputs.
  readonly variants: ButtonVariant[] = [
    'primary',
    'secondary',
    'tertiary',
    'ghost',
    'destructive',
  ];
  readonly sizes: ButtonSize[] = [
    'sm',
    'md',
    'lg',
    'icon-sm',
    'icon',
    'icon-lg',
  ];
}
