import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the input demo. Inputs are exposed as two-way `model()`s so the
 * parent demo can share playground state — editing a row here updates the live
 * preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-input-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the input / textfield / label family. Edit a value to
      see the playground above react — values are persisted to the URL query
      string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-textfield</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'sm' | 'md' | 'lg' | null"
        [items]="textfieldSizes"
        [(value)]="size"
      >
        Wrapper height — one of
        <code>sm</code>
        ,
        <code>md</code>
        (default), or
        <code>lg</code>
        . Pass
        <code>null</code>
        to inherit from
        <code>NXP_TEXTFIELD_OPTIONS</code>
        .
      </tr>
      <tr nxpDocApiItem name="[iconStart]" type="string" [(value)]="iconStart">
        Remix-icon class (e.g.
        <code>ri-search-line</code>
        ) rendered at the start of the field.
      </tr>
      <tr nxpDocApiItem name="[iconEnd]" type="string" [(value)]="iconEnd">
        Remix-icon class (e.g.
        <code>ri-settings-line</code>
        ) rendered at the end of the field. Hidden when the cleaner is visible
        or a
        <code>[nxpTextfieldEnd]</code>
        element is projected.
      </tr>
      <tr nxpDocApiItem name="[hasError]" type="boolean" [(value)]="hasError">
        Toggles the red error ring on the wrapper.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="textfieldClass">
        Extra Tailwind classes merged onto the host element.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxpInput</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Directive applied to native
      <code>&lt;input&gt;</code>
      and
      <code>&lt;textarea&gt;</code>
      elements. Adopts the surrounding
      <code>nxp-textfield</code>
      chrome (and its adornment padding) when nested, or wears the full
      Tremor-style input chrome standalone.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[hasError]"
        type="boolean"
        [(value)]="inputHasError"
      >
        Adds the error ring directly on the
        <code>nxpInput</code>
        host (use when the input is standalone, outside a
        <code>nxp-textfield</code>
        wrapper).
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="inputClass">
        Extra Tailwind classes merged onto the native input/textarea host.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxpLabel</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Directive applied to
      <code>&lt;label&gt;</code>
      elements. When nested inside
      <code>nxp-textfield</code>
      it switches the wrapper into form-field mode (label stacks above the
      input).
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[disabled]"
        type="boolean"
        [(value)]="labelDisabled"
      >
        Dims the label text to the tertiary color and sets
        <code>aria-disabled</code>
        .
      </tr>
      <tr nxpDocApiItem name="[class]" type="string" [(value)]="labelClass">
        Extra Tailwind classes merged onto the label host.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpTextfieldSize], [nxpTextfieldCleaner]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Marker directive
      <code>NxpTextfieldOptionsDirective</code>
      — re-provides
      <code>NXP_TEXTFIELD_OPTIONS</code>
      so a child
      <code>nxp-textfield</code>
      picks up the value without an explicit binding.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[nxpTextfieldSize]"
        type="'sm' | 'md' | 'lg'"
        [items]="textfieldOptionSizes"
        [(value)]="optionsSize"
      >
        Overrides the default size for any
        <code>nxp-textfield</code>
        in scope.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpTextfieldCleaner]"
        type="boolean"
        [(value)]="optionsCleaner"
      >
        When
        <code>true</code>
        , descendant textfields show a clear (×) button while their value is
        non-empty.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpTextfieldEnd]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Marker directive
      <code>NxpTextfieldEndDirective</code>
      — projects an interactive trailing element into
      <code>nxp-textfield</code>
      (tooltip hint, dropdown trigger, password-visibility toggle, copy icon).
      When present, it replaces the built-in cleaner and the string
      <code>iconEnd</code>
      . No configurable inputs of its own.
    </p>
  `,
})
export class InputApiComponent {
  // nxp-textfield
  readonly size = model<'sm' | 'md' | 'lg' | null>('md');
  readonly iconStart = model<string>('ri-search-line');
  readonly iconEnd = model<string>('');
  readonly hasError = model(false);
  readonly textfieldClass = model<string>('');

  // nxpInput
  readonly inputHasError = model(false);
  readonly inputClass = model<string>('');

  // nxpLabel
  readonly labelDisabled = model(false);
  readonly labelClass = model<string>('');

  // [nxpTextfieldSize], [nxpTextfieldCleaner]
  readonly optionsSize = model<'sm' | 'md' | 'lg'>('md');
  readonly optionsCleaner = model(false);

  // Enum-like option arrays
  readonly textfieldSizes = ['sm', 'md', 'lg'] as const;
  readonly textfieldOptionSizes = ['sm', 'md', 'lg'] as const;
}
