import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the input-pin demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-input-pin-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the input-pin component. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-input-pin</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[length]" type="number" [(value)]="length">
        Number of PIN cells to render.
      </tr>
      <tr
        nxpDocApiItem
        name="[type]"
        type="'numeric' | 'alphanumeric'"
        [items]="typeOptions"
        [(value)]="type"
      >
        Whether to restrict input to digits only. Use
        <code>alphanumeric</code>
        to allow letters as well.
      </tr>
      <tr
        nxpDocApiItem
        name="[mask]"
        type="'password' | 'text'"
        [items]="maskOptions"
        [(value)]="mask"
      >
        Whether filled cells show the actual character or a bullet
        (<code>●</code>). Defaults to
        <code>password</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[placeholder]"
        type="string"
        [(value)]="placeholder"
      >
        Placeholder character shown in empty cells.
      </tr>
      <tr nxpDocApiItem name="[disabled]" type="boolean" [(value)]="disabled">
        Whether the input is disabled.
      </tr>
      <tr nxpDocApiItem name="[invalid]" type="boolean" [(value)]="invalid">
        Whether the input is in an error state.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="class">
        Additional CSS classes on the container element.
      </tr>
    </table>
  `,
})
export class InputPinApiComponent {
  readonly length = model<number>(6);
  readonly type = model<'numeric' | 'alphanumeric'>('numeric');
  readonly mask = model<'password' | 'text'>('password');
  readonly placeholder = model<string>('·');
  readonly disabled = model<boolean>(false);
  readonly invalid = model<boolean>(false);
  readonly class = model<string>('');

  readonly typeOptions = ['numeric', 'alphanumeric'] as const;
  readonly maskOptions = ['password', 'text'] as const;
}
