import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the menu demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-menu-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the menu components. Edit a value to see the playground
      above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-menu</code
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
        Two-way bound index of the currently selected menu item (radio-group
        style). Pass
        <code>null</code>
        to deselect.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpMenuItem]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Selectable item inside
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-menu</code
      >. Has no configurable inputs — the parent menu assigns its index and
      drives the
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >aria-checked</code
      >
      state. Emits
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >(nxpMenuItemSelect)</code
      >
      with its index on click; the parent listens and updates
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >checkedIndex</code
      >.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-nav</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Router-aware sidebar peer of
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-menu</code
      >
      sharing the same proximity-animation machinery. No configurable inputs —
      the active item is derived from
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >Router.isActive()</code
      >
      on each child
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >a[nxpNavItem]</code
      >, never set externally.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >a[nxpNavItem]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Router-aware item for
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-nav</code
      >. No configurable inputs — its
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >checked</code
      >
      state is driven by
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >Router.isActive()</code
      >
      against the companion
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >routerLink</code
      >.
    </p>
  `,
})
export class MenuApiComponent {
  readonly checkedIndex = model<number | null>(0);
}
