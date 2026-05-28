import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the data-list demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-data-list-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the data-list components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-data-list</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[label]" type="string" [(value)]="label">
        Accessible label for the listbox (<code>aria-label</code>).
      </tr>
      <tr
        nxpDocApiItem
        name="[emptyLabel]"
        type="string"
        [(value)]="emptyLabel"
      >
        Text shown when no
        <code>[nxpOption]</code>
        children are present. The empty state is hidden when at least one option
        exists.
      </tr>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'sm' | 'md' | 'lg'"
        [items]="sizeOptions"
        [(value)]="size"
      >
        Size variant — readable by child
        <code>[nxpOption]</code>
        elements via direct parent injection (<code
          >inject(DataListComponent, &#123; optional: true &#125;)</code
        >).
        <code>sm</code>
        is compact,
        <code>md</code>
        is the default,
        <code>lg</code>
        is spacious.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Additional CSS classes merged onto the host element.
      </tr>
      <tr
        nxpDocApiItem
        name="[(selectedIndex)]"
        type="number | null"
        [(value)]="selectedIndex"
      >
        Index of the currently selected option (two-way bindable).
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >button[nxpOption]</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[selected]"
        type="boolean"
        [(value)]="optionSelected"
      >
        Whether the option is currently selected. Sets
        <code>aria-selected</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[disabled]"
        type="boolean"
        [(value)]="optionDisabled"
      >
        Whether the option is disabled. Sets
        <code>aria-disabled</code>
        and the native
        <code>disabled</code>
        attribute.
      </tr>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'sm' | 'md' | 'lg'"
        [items]="optionSizeOptions"
        [(value)]="optionSize"
      >
        Size variant — overrides the parent
        <code>nxp-data-list</code>
        size if provided. Falls back to the parent's
        <code>size()</code>
        or
        <code>'md'</code
        >.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpOptGroup]</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[label]" type="string" [(value)]="optGroupLabel">
        Label displayed above the group (also used as
        <code>aria-label</code
        >).
      </tr>
    </table>
  `,
})
export class DataListApiComponent {
  // ── nxp-data-list inputs ─────────────────────────────────────────────────
  readonly label = model<string>('Playground list');
  readonly emptyLabel = model<string>('No options');
  readonly size = model<'sm' | 'md' | 'lg'>('md');
  readonly class = model<string>('');
  readonly selectedIndex = model<number | null>(null);

  readonly sizeOptions = ['sm', 'md', 'lg'] as const;

  // ── button[nxpOption] inputs ─────────────────────────────────────────────
  readonly optionSelected = model<boolean>(false);
  readonly optionDisabled = model<boolean>(false);
  readonly optionSize = model<'sm' | 'md' | 'lg' | undefined>(undefined);

  readonly optionSizeOptions = ['sm', 'md', 'lg'] as const;

  // ── [nxpOptGroup] inputs ─────────────────────────────────────────────────
  readonly optGroupLabel = model<string>('');
}
