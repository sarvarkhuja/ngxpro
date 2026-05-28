import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the checkbox demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-checkbox-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the checkbox components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-checkbox</code
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
        [items]="sizeOptions"
        [(value)]="size"
      >
        Visual size of the checkbox box. Maps to
        <code>16px</code
        >,
        <code>18px</code>
        (default), and
        <code>22px</code>
        respectively.
      </tr>
      <tr
        nxpDocApiItem
        name="[color]"
        type="'primary' | 'secondary' | 'danger'"
        [items]="colorOptions"
        [(value)]="color"
      >
        Color variant. Controls border and checked-fill color across light /
        dark modes.
      </tr>
      <tr nxpDocApiItem name="[(checked)]" type="boolean" [(value)]="checked">
        Two-way bound checked state. Defaults to
        <code>false</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[(indeterminate)]"
        type="boolean"
        [(value)]="indeterminate"
      >
        Two-way bound indeterminate state. When
        <code>true</code
        >, shows a dash icon with the filled color variant — useful for
        select-all rows with partial selection.
      </tr>
      <tr nxpDocApiItem name="[disabled]" type="boolean" [(value)]="disabled">
        Disables the checkbox — reduced opacity, not-allowed cursor, and the
        underlying input is non-interactive. Also driven automatically when
        bound to a disabled
        <code>FormControl</code
        >.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="hostClass">
        Extra Tailwind classes merged onto the host element via
        <code>cx()</code
        >.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >input[type="checkbox"][nxpCheckbox]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      The directive form applies to a native
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&lt;input type="checkbox"&gt;</code
      >
      and is purely CSS-styled via <code>:checked</code> /
      <code>:indeterminate</code> pseudo-classes. It exposes the same
      <code>size</code> / <code>color</code> / <code>class</code> inputs as the
      wrapper component, plus a tri-state
      <code>ControlValueAccessor</code> (boolean <code>true</code> /
      <code>false</code> / <code>null</code> for indeterminate).
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'s' | 'm' | 'l'"
        [items]="sizeOptions"
        [(value)]="directiveSize"
      >
        Size of the checkbox. Defaults to the option value (<code>'m'</code>).
      </tr>
      <tr
        nxpDocApiItem
        name="[color]"
        type="'primary' | 'secondary' | 'danger'"
        [items]="colorOptions"
        [(value)]="directiveColor"
      >
        Color variant. Controls border and checked fill color.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="directiveClass">
        Additional CSS classes merged onto the host input.
      </tr>
    </table>
  `,
})
export class CheckboxApiComponent {
  readonly size = model<'s' | 'm' | 'l'>('m');
  readonly color = model<'primary' | 'secondary' | 'danger'>('primary');
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly disabled = model(false);
  readonly hostClass = model('');

  readonly directiveSize = model<'s' | 'm' | 'l'>('m');
  readonly directiveColor = model<'primary' | 'secondary' | 'danger'>(
    'primary',
  );
  readonly directiveClass = model('');

  readonly sizeOptions = ['s', 'm', 'l'] as const;
  readonly colorOptions = ['primary', 'secondary', 'danger'] as const;
}
