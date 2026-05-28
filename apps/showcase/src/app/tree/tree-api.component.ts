import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API tables for the tree demo. All exported inputs are generic, template, or
 * function references, so rows render as documentation only — no playground
 * editor binds back to the live preview.
 */
@Component({
  selector: 'app-tree-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs and outputs accepted by the tree components and directives. Types
      involving generics, function signatures, and
      <code>TemplateRef</code>
      are documented here without an inline editor.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-tree</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[value]" type="T">
        The data item this tree node represents. Generic — flows to
        <code>childrenHandler</code>
        and the
        <code>$implicit</code>
        slot of the content template.
      </tr>
      <tr nxpDocApiItem name="[childrenHandler]" type="NxpTreeHandler<T>">
        Function that returns the children of a given data item. Defaults to
        treating arrays as children lists.
      </tr>
      <tr
        nxpDocApiItem
        name="[content]"
        type="TemplateRef<NxpTreeItemContext<T>> | null"
      >
        Optional template for rendering each node's content. Template context is
        <code>NxpTreeItemContext&lt;T&gt;</code>
        (<code>$implicit = value</code
        >). If omitted, the value is rendered as text.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-tree-item</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Node wrapper for a single tree item — handles expandability detection and
      tracks expanded state through the injected
      <code>NXP_TREE_CONTROLLER</code>. No configurable inputs; nesting depth is
      injected via <code>NXP_TREE_LEVEL</code>.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-tree-item-content</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Default renderer for a tree node's visible row — displays the chevron
      toggle and projects content alongside. No configurable inputs.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpTreeNode]</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[nxpTreeNode]" type="T">
        Required. The data value associated with this tree item. Registers the
        host
        <code>nxp-tree-item</code>
        with the
        <code>NxpTreeAccessor</code>
        so the controller can map component instances to data values.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpTreeController][map]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Map-backed controller — tracks expansion in a
      <code>Map&lt;T, boolean&gt;</code>
      keyed by data value. Applied when the host carries both
      <code>nxpTreeController</code>
      and
      <code>map</code>
      attributes.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="(toggled)" type="EventEmitter<T>">
        Emits the data value of the item that was toggled.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpTreeController]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Simple fallback controller — tracks expansion per component instance via a
      <code>WeakMap</code>. Applied when
      <code>nxpTreeController</code>
      is present without
      <code>map</code>. No configurable inputs.
    </p>
  `,
})
export class TreeApiComponent {}
