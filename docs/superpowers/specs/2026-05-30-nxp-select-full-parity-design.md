# Design: `<nxp-select>` full parity + 100%-component demos

**Date:** 2026-05-30
**Status:** Approved for planning

## Problem

`apps/showcase`'s `select` and `combo-box` demos still showcase the **directive** form
(`input[nxpSelect]` + hand-assembled `<nxp-textfield>` + `<ng-template nxpDropdown>`). The new
self-contained components (`<nxp-select>` / `<nxp-combo-box>`) were added _additively_ on top, so the
demos show both forms and feel half-migrated.

Three `select` demo examples could **not** be expressed with `<nxp-select>` because the component is
deliberately items-only:

| Example                | Missing component capability             |
| ---------------------- | ---------------------------------------- |
| Disabled items         | `[disabledItem]` predicate input         |
| Filterable + grouped   | in-panel search + `nxpOptGroup` grouping |
| Default value + create | search + `(create)` affordance           |

## Goal

1. Extend `<nxp-select>` to **full parity** with the directive: per-item disabling, in-panel filtering,
   grouping, and create-on-no-match.
2. Rewrite **both** demos to be **100% component** — drop **all** directive examples.

Non-goal: removing or changing `NxpSelectDirective`, `NxpComboBoxDirective`, `NxpSelectFilterComponent`,
or `nxpOptGroup`. They stay as the engine + power-user escape hatch; they're simply no longer demoed.

## Approach — compose, don't reimplement

The directive world already ships tested `nxp-select-filter` (search + create) and `nxpOptGroup`
(grouping). `<nxp-select>` will **render those inside its own dropdown** rather than copy their logic.
This keeps one implementation of filter/create/group (the plan's prior work already flagged the
combo-box logic copy as a "divergence risk" — we don't want a second one).

This works because `<nxp-select>` already provides the exact DI tokens those pieces resolve from:

- `NXP_ITEMS_HANDLERS` (stringify / identity / `disabledItemHandler`) — `useExisting: NxpSelectComponent`
- `NXP_TEXTFIELD_ACCESSOR` — options read `value()` for the selected check
- `NXP_DATA_LIST_HOST` — option clicks route to `handleOption()`
- `NxpDropdownOpen` (host directive) — `nxp-select-filter` closes the panel on create/pick

A projected `<nxp-select-filter>` therefore inherits the component's stringify, routes picks through the
existing `handleOption()`, and closes correctly — **no new plumbing**. `nxp-select-filter`'s
`afterNextRender` auto-focus already solves portal focus (it's re-created each time the panel mounts),
so we inherit that for free.

> Rejected alternative: inline-port the filter/create signals into `select.component.ts`. More
> self-contained, but a second copy of that logic to keep in sync. Compose wins.

## API additions — `NxpSelectComponent`

| Member              | Type                                                                     | Notes                                                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disabledItem`      | `input<NxpBooleanHandler<T>>(NEVER_DISABLED, { alias: 'disabledItem' })` | **Convert** the existing `disabledItemHandler` _signal_ to an aliased input — identical to `select.directive.ts:136`. Options already consume it via `NXP_ITEMS_HANDLERS` for `aria-disabled` + keyboard-skip. |
| `filterable`        | `input(false)`                                                           | Shows the in-panel search box (renders `<nxp-select-filter>`).                                                                                                                                                 |
| `matcher`           | `input<NxpStringMatcher<T>>(NXP_DEFAULT_MATCHER)`                        | Filter matcher, mirrors combo-box / select-filter.                                                                                                                                                             |
| `filterPlaceholder` | `input('Search…')`                                                       | Placeholder for the search input.                                                                                                                                                                              |
| `groupBy`           | `input<string \| undefined>(undefined)`                                  | Property name to bucket items by — consistent with `textField` / `valueField`. When set, options render under `nxpOptGroup` headers.                                                                           |
| `creatable`         | `input(false)`                                                           | Enables the "Create 'x'" row. Implies the search panel (create only makes sense with a filter).                                                                                                                |
| `createLabel`       | `input('Create')`                                                        | Passed through to `nxp-select-filter`.                                                                                                                                                                         |
| `create`            | `output<string>()`                                                       | Re-emits `nxp-select-filter`'s `(create)`.                                                                                                                                                                     |

Existing inputs (`items`, `placeholder`, `emptyLabel`, `clearable`, `textField`, `valueField`, `class`)
are unchanged.

## Template / data flow

The dropdown body branches; a shared inner `<ng-template>` renders options either flat or grouped so the
two branches don't duplicate the option loop.

```
<ng-template nxpDropdown>
  @if (filterable() || creatable()) {
    <nxp-select-filter
      [items]="items()" [matcher]="matcher()" [placeholder]="filterPlaceholder()"
      [createLabel]="createLabel()" (create)="create.emit($event)">
      <ng-template let-list>
        <ng-container *ngTemplateOutlet="optionList; context: { $implicit: list }" />
      </ng-template>
    </nxp-select-filter>
  } @else {
    <nxp-data-list [id]="listboxId" role="listbox" [emptyLabel]="emptyLabel()">
      <ng-container *ngTemplateOutlet="optionList; context: { $implicit: items() }" />
    </nxp-data-list>
  }
</ng-template>

<ng-template #optionList let-list>
  @if (groupBy()) {
    @for (g of toGroups(list); track g.label) {
      <div nxpOptGroup [label]="g.label">
        @for (item of g.items; track $index) { <nxp-select-option [value]="item" /> }
      </div>
    }
  } @else {
    @for (item of list; track $index) { <nxp-select-option [value]="item" /> }
  }
</ng-template>
```

- `toGroups(list)` buckets by `item[groupBy()]` preserving first-seen order (same shape as the demo's
  current `groupContinents`), moved into the component as a `protected` method.
- New imports on the component: `NxpSelectFilterComponent` (relative, same package),
  `OptGroupDirective` (`@ngxpro/components/data-list`), `NgTemplateOutlet` (`@angular/common`).
- No package cycle: `select.component.ts` and `select-filter.component.ts` share the
  `@ngxpro/components/select` entry point; `nxpOptGroup` is a pre-existing cross-package dep.

## Showcase demos — 100% component

### `select-demo.component.ts` (all `<nxp-select>`)

1. Basic string + `[clearable]`
2. Object items (`textField` / `valueField`)
3. Disabled (disabled `FormControl`)
4. Disabled items (`[disabledItem]`)
5. Filterable + grouped (`[filterable]` + `[groupBy]="'continent'"`)
6. Create on no-match (`[creatable]` + `(create)`)

### `combo-box-demo.component.ts` (all `<nxp-combo-box>`) — no component change needed

1. Basic string (recommended)
2. Primitive value (`valuePrimitive`)
3. Non-strict (`[strict]="false"`)
4. Disabled
5. Object dataset (full object)

Remove every directive example, its `*Html` / `*Ts` snippet strings, and the now-unused imports
(`NxpSelectDirective`, `NxpComboBoxDirective`, `NxpSelectFilterComponent`, `NxpTextfield*`,
`NxpLabelDirective`, `NxpInputDirective`, `NxpDropdownContent`, `OptGroupDirective`, etc. — whatever the
component examples no longer reference). Each retained example keeps its `[content]="{ HTML, TypeScript }"`
snippet, rewritten to the component form.

Update `<nxp-doc-component-page type="directive">` → `type="component"` in both demos, and update
`select-api.component.ts` / `combo-box-api.component.ts` to document the component inputs (incl. the new
`<nxp-select>` ones) instead of the directive surface.

## Tests

Extend `libs/components/select/src/select.component.spec.ts` (Vitest + TestBed, `NXP_IS_BROWSER:false`
jsdom guard, no-op portal host per the existing setup):

- `disabledItem` → matching option gets `aria-disabled` and is skipped by keyboard nav.
- `filterable` → typing in the search input narrows rendered options.
- `groupBy` → renders one `nxpOptGroup` per distinct field value with the right headers.
- `creatable` → with no match, the create row emits `(create)` with the trimmed search text.

No new combo-box spec needed (no component change); the demo rewrite is covered by existing build/lint.

## Verification

- `npx nx lint components` — clean.
- `npx nx test components` — existing + new select specs green.
- `npx nx build components` — `@ngxpro/components/select` builds.
- `npx tsc -p apps/showcase/tsconfig.app.json --noEmit` — demos typecheck (note: pre-existing unrelated
  breakages — `libs/cdk/components/switch/` stray `ng-package.json`, `@ngxpro/components/tabs` &
  `/stepper` missing — are tracked separately and out of scope here).

## Out of scope

Directive/`nxp-select-filter`/`nxpOptGroup` changes; `<nxp-multi-select>` gaining the same inputs;
fixing the pre-existing switch / tabs / stepper build breakages.
