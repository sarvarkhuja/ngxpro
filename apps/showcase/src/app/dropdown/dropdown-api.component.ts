import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type { NxpDropdownAlign, NxpDropdownWidth } from '@ngxpro/cdk';

type DropdownDirection = 'top' | 'bottom' | null;

/**
 * API table for the dropdown demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 *
 * Several upstream directives (notably `NxpDropdownOptionsDirective`) still
 * use the legacy `@Input()` decorator because they participate in DI chains
 * that don't sit inside an injection context — see `.claude/CLAUDE.md` for
 * the rationale. They are surfaced here identically to signal inputs.
 */
@Component({
  selector: 'app-dropdown-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the dropdown directives. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpDropdown]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Core directive — attach to any element to make it a dropdown host. The
      <code>nxpDropdown</code> input accepts a <code>TemplateRef</code> or
      <code>NxpDynamicContent</code> to render inside the portal. No scalar
      configuration of its own; control opening via
      <code>[(nxpDropdownOpen)]</code> or <code>[nxpDropdownManual]</code>.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpDropdownOpen] / [nxpDropdownAuto]</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[enabled]" type="boolean" [(value)]="openEnabled">
        Whether the auto open/close behaviour is active. Set
        <code>false</code>
        to freeze the trigger without unmounting the dropdown wiring.
      </tr>
      <tr nxpDocApiItem name="[(open)]" type="boolean" [(value)]="open">
        Two-way binding for the dropdown's open state. Use the banana-box form
        to drive opening programmatically while still allowing the trigger to
        react to clicks and arrow keys.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpDropdownManual]</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[nxpDropdownManual]"
        type="boolean"
        [(value)]="nxpDropdownManual"
      >
        Manually control the dropdown's open state via a boolean. Useful when
        you want to drive visibility from external state — for example, from a
        form value or a parent-managed flag.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpDropdownHover]</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[nxpDropdownShowDelay]"
        type="number"
        [(value)]="hoverShowDelay"
      >
        Milliseconds to wait before opening when the host or trigger is hovered.
        Helps avoid flicker when the pointer transits the trigger.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpDropdownHideDelay]"
        type="number"
        [(value)]="hoverHideDelay"
      >
        Milliseconds to wait after the pointer leaves before closing. A longer
        hide delay gives users time to move into the panel.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpDropdownAlign] / [nxpDropdownDirection] / …</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Options directive — sets dropdown positioning and sizing via attribute
      inputs. Uses the legacy <code>&#64;Input()</code> decorator because the
      class is consumed via DI provider factories.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[nxpDropdownAlign]"
        type="'start' | 'center' | 'end'"
        [items]="alignOptions"
        [(value)]="align"
      >
        Horizontal alignment of the dropdown relative to its trigger. Defaults
        to
        <code>start</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpDropdownAppearance]"
        type="string"
        [(value)]="appearance"
      >
        Optional appearance variant — surfaced on the rendered
        <code>nxp-dropdown</code>
        as
        <code>data-appearance</code>
        for styling hooks.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpDropdownDirection]"
        type="'top' | 'bottom' | null"
        [items]="directionOptions"
        [(value)]="direction"
      >
        Preferred vertical direction. Pass
        <code>null</code>
        to let the positioner choose based on available viewport space.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpDropdownLimitWidth]"
        type="'auto' | 'fixed' | 'min'"
        [items]="widthOptions"
        [(value)]="limitWidth"
      >
        Width strategy:
        <code>auto</code>
        sizes to content,
        <code>fixed</code>
        matches the trigger exactly,
        <code>min</code>
        uses the trigger width as a minimum.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpDropdownMinHeight]"
        type="number"
        [(value)]="minHeight"
      >
        Minimum panel height in pixels. Used by the position calculator when
        deciding whether to flip to the opposite side.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpDropdownMaxHeight]"
        type="number"
        [(value)]="maxHeight"
      >
        Maximum panel height in pixels. The inner scroll panel takes over once
        content exceeds this value.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpDropdownOffset]"
        type="number"
        [(value)]="offset"
      >
        Gap in pixels between the trigger and the dropdown panel.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpDropdownSided]</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[nxpDropdownSided]"
        type="boolean"
        [(value)]="sided"
      >
        When
        <code>true</code
        >, opens the panel to the side of the trigger instead of below or above.
        Falls back to vertical positioning when side space is unavailable.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpDropdownSidedOffset]"
        type="number"
        [(value)]="sidedOffset"
      >
        Vertical offset in pixels applied when the panel is opened to the side —
        controls how much the panel slides above or below the trigger row.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpDropdownSelection]</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[nxpDropdownSelection]"
        type="string"
        [(value)]="selectionHandler"
      >
        Whether the dropdown should open in response to text selection. Accepts
        a boolean handler
        <code>(range: Range) =&gt; boolean</code>
        or a string for declarative use.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpDropdownSelectionPosition]"
        type="'selection' | 'tag' | 'word'"
        [items]="selectionPositionOptions"
        [(value)]="selectionPosition"
      >
        How to anchor the panel against the selection:
        <code>selection</code>
        uses the exact range,
        <code>tag</code>
        the enclosing element,
        <code>word</code>
        the nearest word boundary.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpDropdownContext]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Context-menu trigger — replaces the browser's native right-click menu with
      a custom dropdown anchored at the pointer. No configurable inputs of its
      own.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&lt;ng-template nxpDropdown&gt;</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Content directive — applied to an <code>ng-template</code> to register its
      <code>TemplateRef</code> as the dropdown's content. No inputs of its own.
    </p>
  `,
})
export class DropdownApiComponent {
  readonly openEnabled = model(true);
  readonly open = model(false);

  readonly nxpDropdownManual = model(false);

  readonly hoverShowDelay = model(150);
  readonly hoverHideDelay = model(150);

  readonly align = model<NxpDropdownAlign>('start');
  readonly appearance = model('');
  readonly direction = model<DropdownDirection>(null);
  readonly limitWidth = model<NxpDropdownWidth>('auto');
  readonly minHeight = model(80);
  readonly maxHeight = model(320);
  readonly offset = model(4);

  readonly sided = model(false);
  readonly sidedOffset = model(4);

  readonly selectionHandler = model('');
  readonly selectionPosition = model<'selection' | 'tag' | 'word'>('selection');

  readonly alignOptions = ['start', 'center', 'end'] as const;
  readonly widthOptions = ['auto', 'fixed', 'min'] as const;
  readonly directionOptions = [null, 'top', 'bottom'] as const;
  readonly selectionPositionOptions = ['selection', 'tag', 'word'] as const;
}
