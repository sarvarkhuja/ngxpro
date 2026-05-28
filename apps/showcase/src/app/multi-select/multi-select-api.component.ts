import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type { NxpChipSize } from '@ngxpro/components/chip';

@Component({
  selector: 'app-multi-select-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6 tracking-tight">
      Inputs accepted by the
      <code [class]="cls.code">nxp-multi-select</code> family. Edit a value to
      drive the live playground above — changes persist to the URL query string
      so the configuration survives a refresh.
    </p>

    <h2 [class]="cls.h2">
      <code [class]="cls.code">nxp-multi-select</code>
    </h2>
    <p [class]="cls.lede">
      Chip-based wrapper that owns the selection, the trigger input, and the
      shadow-bordered chrome. Implements
      <code>ControlValueAccessor</code> so it drops into Reactive Forms with
      <code>[formControl]</code> or template-driven <code>[(ngModel)]</code>
      bindings. Selected values render as
      <code [class]="cls.code">nxp-input-chip-item</code> pills.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[items]" type="readonly T[]">
        The pool of selectable items rendered in the dropdown listbox. Each
        value passes through
        <code>NXP_ITEMS_HANDLERS.stringify</code>
        for its chip label.
      </tr>
      <tr
        nxpDocApiItem
        name="[placeholder]"
        type="string"
        [(value)]="placeholder"
      >
        Hint shown inside the trigger input when nothing is selected. Hides
        automatically as soon as a chip lands.
      </tr>
      <tr
        nxpDocApiItem
        name="[emptyLabel]"
        type="string"
        [(value)]="emptyLabel"
      >
        Placeholder text rendered inside the dropdown when
        <code>items</code>
        is empty.
      </tr>
      <tr
        nxpDocApiItem
        name="[chipSize]"
        type="'sm' | 'md' | 'lg'"
        [items]="chipSizeOptions"
        [(value)]="chipSize"
      >
        Density variant forwarded to every rendered chip — matches the
        <code [class]="cls.code">nxp-input-chip-item</code>
        contract. Defaults to
        <code>sm</code
        >.
      </tr>
      <tr nxpDocApiItem name="[textField]" type="string | undefined">
        Property name on each item used as the chip / option label. Takes
        precedence over any injected
        <code>NXP_ITEMS_HANDLERS.stringify</code
        >. Example:
        <code>textField="name"</code>
        with items like
        <code>&#123; code: 'FR', name: 'France' &#125;</code
        >.
      </tr>
      <tr nxpDocApiItem name="[valueField]" type="string | undefined">
        Property name used for identity matching. When set, items compare by
        <code>item[valueField]</code>
        instead of
        <code>===</code
        >. Pair with
        <code>textField</code>
        to drive the whole multi-select from one set of property names — no DI
        provider required.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string">
        Tailwind classes merged onto the host element via
        <code>cx()</code>
        — useful for constraining min-width or overriding the default
        <code>rounded-m</code
        >.
      </tr>
    </table>

    <h2 [class]="cls.h2">
      <code [class]="cls.code">input[nxpMultiSelect]</code>
      <span [class]="cls.kicker">directive</span>
    </h2>
    <p [class]="cls.lede">
      Chip-less variant. Apply to an <code>&lt;input&gt;</code> inside
      <code [class]="cls.code">nxp-textfield</code> for a textfield-shaped
      multi-select that displays the selection as comma-separated text. Mirrors
      the <code [class]="cls.code">nxpComboBox</code>
      architecture and reuses the same
      <code [class]="cls.code">NXP_TEXTFIELD_ACCESSOR</code> /
      <code [class]="cls.code">NXP_DATA_LIST_HOST</code> plumbing.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[items]" type="readonly T[]">
        The pool of selectable items rendered in the dropdown listbox.
      </tr>
      <tr nxpDocApiItem name="[textField]" type="string | undefined">
        Property name on each item used as the display text. When set, overrides
        any inherited
        <code>NXP_ITEMS_HANDLERS.stringify</code
        >. Example:
        <code>textField="text"</code>
        for items shaped like
        <code>&#123; text: 'Medium', value: 2 &#125;</code
        >.
      </tr>
      <tr nxpDocApiItem name="[valueField]" type="string | undefined">
        Property name used for identity matching. When set, items compare by
        <code>item[valueField]</code>
        instead of
        <code>===</code
        >.
      </tr>
      <tr nxpDocApiItem name="[separator]" type="string">
        Joiner used to assemble the comma-separated display string shown in the
        read-only input. Defaults to
        <code>", "</code
        >.
      </tr>
    </table>

    <h2 [class]="cls.h2">
      <code [class]="cls.code">nxp-multi-select-option</code>
    </h2>
    <p [class]="cls.lede">
      Option row projected into the dropdown listbox. Clicks call
      <code>NXP_DATA_LIST_HOST.handleOption(value)</code>, which toggles
      membership in the parent's selection array.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[value]" type="T (required)">
        The item this row represents.
      </tr>
    </table>

    <h2 [class]="cls.h2">
      <code [class]="cls.code">nxp-multi-select-group</code>
    </h2>
    <p [class]="cls.lede">
      Optional group header with a "Select All / Deselect All" toggle. Reads
      <code>NXP_MULTI_SELECT_TEXTS</code> for i18n — override the token to
      change the button copy.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[label]" type="string">
        Heading text rendered above the group's options.
      </tr>
    </table>

    <h2 [class]="cls.h2">Outputs</h2>
    <p [class]="cls.lede">
      The component is a <code>ControlValueAccessor</code> — the full
      <code>readonly T[]</code> flows through the bound form control. There are
      no additional output emitters on the wrapper; per-item remove signals live
      on
      <code [class]="cls.code">nxp-input-chip-item</code>
      (<code>(remove)</code>) and are wired internally.
    </p>
  `,
})
export class MultiSelectApiComponent {
  readonly placeholder = model('Pick fruits…');
  readonly emptyLabel = model('No options');
  readonly chipSize = model<NxpChipSize>('sm');

  readonly chipSizeOptions = ['sm', 'md', 'lg'] as const;

  protected readonly cls = {
    h2:
      'text-xl font-semibold text-text-primary tracking-tight mt-10 mb-2 ' +
      'first-of-type:mt-8',
    lede: 'text-sm text-text-secondary mb-2',
    kicker: 'ml-2 text-xs font-mono uppercase text-text-tertiary',
    code:
      'font-mono text-[12px] px-1.5 py-0.5 rounded bg-[#fafafa] text-text-primary ' +
      'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] dark:bg-white/[0.04] ' +
      'dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]',
  } as const;
}
