import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type { NxpChipSize } from '@ngxpro/components/chip';

@Component({
  selector: 'app-input-chip-api',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6 tracking-tight">
      Inputs accepted by the <code [class]="cls.code">nxp-input-chip</code>
      family. Edit a value to drive the live playground above — every change is
      persisted to the URL query string so the configuration survives a refresh.
    </p>

    <h2 [class]="cls.h2">
      <code [class]="cls.code">nxp-input-chip</code>
    </h2>
    <p [class]="cls.lede">
      Wrapper that owns the chip collection, the inline input, and the
      shadow-bordered chrome. Implements <code>ControlValueAccessor</code> so it
      drops into Reactive Forms with <code>[formControl]</code> or
      template-driven <code>[(ngModel)]</code> bindings.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[separator]"
        type="RegExp | string"
        [(value)]="separator"
      >
        Token that splits typed text into multiple chips. A single character
        (default
        <code>,</code
        >) commits on that character; pass a
        <code>RegExp</code>
        like
        <code>/[\\s,#]+/</code>
        to commit on whitespace, commas, or hashes in one shot.
      </tr>
      <tr nxpDocApiItem name="[unique]" type="boolean" [(value)]="unique">
        Drop duplicate values. When
        <code>true</code>
        (default), repeat entries are silently skipped — set to
        <code>false</code>
        for shopping lists or queues where order matters more than identity.
      </tr>
      <tr
        nxpDocApiItem
        name="[placeholder]"
        type="string"
        [(value)]="placeholder"
      >
        Placeholder shown inside the inline input when no chips exist. Hides
        automatically as soon as the first chip lands.
      </tr>
      <tr
        nxpDocApiItem
        name="[chipSize]"
        type="'sm' | 'md' | 'lg'"
        [items]="chipSizeOptions"
        [(value)]="chipSize"
      >
        Density variant forwarded to every rendered chip. Defaults to
        <code>md</code
        >.
      </tr>
      <tr nxpDocApiItem name="[class]" type="string">
        Tailwind classes merged onto the host element via
        <code>cx()</code>
        — useful for overriding the default
        <code>rounded-m</code>
        or constraining the min-width.
      </tr>
    </table>

    <h2 [class]="cls.h2">
      <code [class]="cls.code">nxp-input-chip-item</code>
    </h2>
    <p [class]="cls.lede">
      Internal pill rendered for each value. Forwarded automatically from
      <code [class]="cls.code">nxp-input-chip</code> — you only instantiate it
      directly when composing a custom chip layout.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[item]" type="unknown">
        The raw chip value passed through the
        <code>NXP_ITEMS_HANDLERS</code>
        stringifier. Required.
      </tr>
      <tr nxpDocApiItem name="[text]" type="string">
        Display text rendered inside the chip body. Required.
      </tr>
      <tr nxpDocApiItem name="[editable]" type="boolean">
        Enable double-click (or Enter when focused) to edit the chip in place.
        Defaults to
        <code>true</code
        >.
      </tr>
      <tr nxpDocApiItem name="[interactive]" type="boolean">
        When
        <code>false</code
        >, hides the remove (×) button and ignores keyboard shortcuts. Mirrors
        the parent's disabled state. Defaults to
        <code>true</code
        >.
      </tr>
      <tr nxpDocApiItem name="[chipDisabled]" type="boolean">
        Individually dims a single chip via
        <code>opacity-50</code>
        regardless of the parent state. Defaults to
        <code>false</code
        >.
      </tr>
      <tr nxpDocApiItem name="[size]" type="'sm' | 'md' | 'lg'">
        Per-chip size override. Normally forwarded from
        <code>nxp-input-chip</code
        >'s
        <code>chipSize</code>
        input.
      </tr>
    </table>

    <h2 [class]="cls.h2">Outputs</h2>
    <p [class]="cls.lede">
      The component is a <code>ControlValueAccessor</code> — the full chip array
      flows through the bound form control. There are no additional output
      emitters on the wrapper; per-item edit / remove signals live on
      <code [class]="cls.code">nxp-input-chip-item</code>
      (<code>(remove)</code>, <code>(edited)</code>) and are wired internally.
    </p>
  `,
})
export class InputChipApiComponent {
  readonly separator = model<RegExp | string>(',');
  readonly unique = model(true);
  readonly placeholder = model('Add tags…');
  readonly chipSize = model<NxpChipSize>('md');

  readonly chipSizeOptions = ['sm', 'md', 'lg'] as const;

  protected readonly cls = {
    h2: 'text-xl font-semibold text-text-primary tracking-tight mt-10 mb-2 first-of-type:mt-8',
    lede: 'text-sm text-text-secondary mb-2',
    code:
      'font-mono text-[12px] px-1.5 py-0.5 rounded bg-[#fafafa] text-text-primary ' +
      'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] dark:bg-white/[0.04] ' +
      'dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]',
  } as const;
}
