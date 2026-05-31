# `<nxp-select>` Full Parity + 100%-Component Demos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `<nxp-select>` parity with the `nxpSelect` directive (per-item disable, in-panel filter, grouping, create-on-no-match) by composing the existing `nxp-select-filter` + `nxpOptGroup`, then rewrite the `select` and `combo-box` showcase demos to be 100% component (drop all directive examples).

**Architecture:** `<nxp-select>` already provides the DI tokens (`NXP_ITEMS_HANDLERS`, `NXP_TEXTFIELD_ACCESSOR`, `NXP_DATA_LIST_HOST`, host `NxpDropdownOpen`) that `nxp-select-filter` and `nxp-select-option` resolve from. So filtering/create are added by _rendering `<nxp-select-filter>` inside the component's own dropdown_ (single source of truth — no logic copy), and grouping by fanning options through `nxpOptGroup`. `disabledItem` is just the existing `disabledItemHandler` flipped from a `signal` to an aliased `input`, exactly like the directive.

**Tech Stack:** Angular 21 (standalone, signals, OnPush), Tailwind v4, Vitest + TestBed, Nx 22.

> **Git note:** Commit steps follow the TDD cadence below, but the repo owner's policy is "commit only when asked" — and the working tree starts dirty on `main`. During execution, leave changes uncommitted and offer a feature branch (`feat/nxp-select-full-parity`) + per-task commits at the end, unless told otherwise. The `git add` lines below name exact paths so commits stay scoped when they do happen.

---

## File Structure

| File                                                          | Responsibility                                                               | Action  |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------- |
| `libs/components/select/src/select.component.ts`              | the component — gains 7 inputs + 1 output + `toGroups()` + composed dropdown | Modify  |
| `libs/components/select/src/select.component.spec.ts`         | unit tests for owned logic (`disabledItem`, `toGroups`)                      | Modify  |
| `apps/showcase/src/app/select/select-demo.component.ts`       | 6 `<nxp-select>` examples, no directive                                      | Rewrite |
| `apps/showcase/src/app/select/select-api.component.ts`        | document `<nxp-select>` inputs only                                          | Rewrite |
| `apps/showcase/src/app/combo-box/combo-box-demo.component.ts` | 5 `<nxp-combo-box>` examples, no directive                                   | Rewrite |
| `apps/showcase/src/app/combo-box/combo-box-api.component.ts`  | document `<nxp-combo-box>` inputs only                                       | Rewrite |

Filtering/create behavior is **not** re-tested in `select.component.spec.ts`: that logic lives in
`NxpSelectFilterComponent` (covered by `select-filter.component.spec.ts`). The compose wiring is verified
by lint + `tsc` + the demo build.

---

## Task 1: Add `[disabledItem]` input

**Files:**

- Modify: `libs/components/select/src/select.component.ts`
- Test: `libs/components/select/src/select.component.spec.ts`

- [ ] **Step 1: Write the failing test**

Add to `select.component.spec.ts`. First extend the test host (`SelectHost`) to bind `disabledItem`:

```ts
// In SelectHost template, add the binding:
//   [disabledItem]="disabledItem()"
// In SelectHost class, add:
readonly disabledItem = signal<(item: unknown) => boolean>(() => false);
```

Then the test:

```ts
it('exposes disabledItem as the disabledItemHandler', () => {
  const { fixture, cmp } = setup();
  fixture.componentInstance.disabledItem.set((item) => item === 'Banana');
  fixture.detectChanges();
  expect(cmp.disabledItemHandler()('Banana')).toBe(true);
  expect(cmp.disabledItemHandler()('Apple')).toBe(false);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx nx test components --skip-nx-cache -- --testPathPattern select.component.spec`
Expected: FAIL — `disabledItem` is not an input yet (no binding effect; handler stays `NEVER_DISABLED` so `('Banana')` returns `false`).

- [ ] **Step 3: Implement — flip the signal to an aliased input**

In `select.component.ts`, replace:

```ts
readonly disabledItemHandler = signal(NEVER_DISABLED as NxpBooleanHandler<T>);
```

with:

```ts
/**
 * Per-item disable predicate. Aliased as `disabledItem` for ergonomic binding:
 * `[disabledItem]="(item) => item.locked"`. Consumed by `<nxp-select-option>`
 * via `NXP_ITEMS_HANDLERS` for `aria-disabled` + keyboard-skip.
 */
readonly disabledItemHandler = input<NxpBooleanHandler<T>>(
  NEVER_DISABLED as NxpBooleanHandler<T>,
  { alias: 'disabledItem' },
);
```

(`input` is already imported; `signal` stays used by `selected`/`focused`/`disabled`.)

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx nx test components --skip-nx-cache -- --testPathPattern select.component.spec`
Expected: PASS — all prior tests plus the new one (7 total).

- [ ] **Step 5: Commit**

```bash
git add libs/components/select/src/select.component.ts libs/components/select/src/select.component.spec.ts
git commit -m "feat(select): add [disabledItem] input to <nxp-select>"
```

---

## Task 2: Add grouping (`groupBy` + `toGroups`) and the shared option template

**Files:**

- Modify: `libs/components/select/src/select.component.ts`
- Test: `libs/components/select/src/select.component.spec.ts`

- [ ] **Step 1: Write the failing test**

Extend `SelectHost`: add `[groupBy]="groupBy()"` to the template and
`readonly groupBy = signal<string | undefined>(undefined);` to the class. Then add the test:

```ts
it('groups items by the groupBy field, preserving first-seen order', () => {
  const { fixture, cmp } = setup();
  const data = [
    { name: 'France', continent: 'Europe' },
    { name: 'Japan', continent: 'Asia' },
    { name: 'Germany', continent: 'Europe' },
  ];
  fixture.componentInstance.items.set(data);
  fixture.componentInstance.groupBy.set('continent');
  fixture.detectChanges();
  const groups = cmp.toGroups(data as never);
  expect(groups.map((g) => g.label)).toEqual(['Europe', 'Asia']);
  expect(groups[0].items).toEqual([data[0], data[2]]);
  expect(groups[1].items).toEqual([data[1]]);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx nx test components --skip-nx-cache -- --testPathPattern select.component.spec`
Expected: FAIL — `cmp.toGroups` is not a function / `groupBy` is not an input.

- [ ] **Step 3: Implement — add `groupBy` input, `toGroups()`, and the shared option template**

Add imports at the top of `select.component.ts`:

```ts
import { NgTemplateOutlet } from '@angular/common';
import { OptGroupDirective } from '@ngxpro/components/data-list';
```

Add to the `imports` array of the `@Component`:

```ts
imports: [
  NgTemplateOutlet,
  DataListComponent,
  NxpSelectOptionComponent,
  NxpDropdownContent,
  OptGroupDirective,
],
```

Add the input (in the inputs section, near `valueField`):

```ts
/**
 * Property name used to bucket items into labelled groups. When set, options
 * render under `nxpOptGroup` headers. Consistent with `textField`/`valueField`.
 */
readonly groupBy = input<string | undefined>(undefined);
```

Add the public helper (near the other public API methods):

```ts
/** Bucket a list by the `groupBy` field, preserving first-seen order. */
toGroups(list: readonly T[]): { label: string; items: T[] }[] {
  const field = this.groupBy();
  const map = new Map<string, T[]>();
  for (const item of list) {
    const label = field ? String(readField(item, field) ?? '') : '';
    const bucket = map.get(label);
    if (bucket) bucket.push(item);
    else map.set(label, [item]);
  }
  return Array.from(map, ([label, items]) => ({ label, items }));
}
```

Replace the existing dropdown block in the template:

```html
<ng-template nxpDropdown>
  <nxp-data-list [id]="listboxId" role="listbox" [emptyLabel]="emptyLabel()">
    @for (item of items(); track $index) {
    <nxp-select-option [value]="item" />
    }
  </nxp-data-list>
</ng-template>
```

with (flat list now routed through the shared `#optionList`; filter branch is added in Task 3):

```html
<ng-template nxpDropdown>
  <nxp-data-list [id]="listboxId" role="listbox" [emptyLabel]="emptyLabel()">
    <ng-container *ngTemplateOutlet="optionList; context: { $implicit: items() }" />
  </nxp-data-list>
</ng-template>

<ng-template #optionList let-list>
  @if (groupBy()) { @for (group of toGroups(list); track group.label) {
  <div nxpOptGroup [label]="group.label">
    @for (item of group.items; track $index) {
    <nxp-select-option [value]="item" />
    }
  </div>
  } } @else { @for (item of list; track $index) {
  <nxp-select-option [value]="item" />
  } }
</ng-template>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx nx test components --skip-nx-cache -- --testPathPattern select.component.spec`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add libs/components/select/src/select.component.ts libs/components/select/src/select.component.spec.ts
git commit -m "feat(select): add [groupBy] grouping to <nxp-select>"
```

---

## Task 3: Add filtering + create (compose `nxp-select-filter`)

**Files:**

- Modify: `libs/components/select/src/select.component.ts`

No new unit test (the filter/create logic is owned and tested by `NxpSelectFilterComponent`; the
portal-stubbed `select.component.spec` cannot render the projected panel). Verified by lint + `tsc`.

- [ ] **Step 1: Add inputs + output**

Add imports:

```ts
// add `output` to the @angular/core import
import { /* …, */ output } from '@angular/core';
// add to the @ngxpro/cdk import
import { /* …, */ NXP_DEFAULT_MATCHER, type NxpStringMatcher } from '@ngxpro/cdk';
// same-package relative import
import { NxpSelectFilterComponent } from './select-filter.component';
```

Add `NxpSelectFilterComponent` to the `imports` array.

Add inputs/output (inputs section):

```ts
/** Show an in-panel search box that filters the options as you type. */
readonly filterable = input(false);

/** Matcher used when filtering. Defaults to case-insensitive substring. */
readonly matcher = input<NxpStringMatcher<T>>(NXP_DEFAULT_MATCHER);

/** Placeholder for the in-panel search input. */
readonly filterPlaceholder = input('Search…');

/** Show a "Create …" row when the search matches nothing. Implies a search box. */
readonly creatable = input(false);

/** Label prefix for the create row. */
readonly createLabel = input('Create');

/** Emits the trimmed search text when the create row is chosen. */
readonly create = output<string>();
```

- [ ] **Step 2: Branch the dropdown to render `<nxp-select-filter>` when filtering/creating**

Replace the `<ng-template nxpDropdown>` block from Task 2 with:

```html
<ng-template nxpDropdown>
  @if (filterable() || creatable()) {
  <nxp-select-filter [items]="items()" [matcher]="matcher()" [placeholder]="filterPlaceholder()" [emptyLabel]="emptyLabel()" [createLabel]="createLabel()" (create)="create.emit($event)">
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
```

(`#optionList` from Task 2 is unchanged and reused by both branches. `nxp-select-filter` resolves the
component's `NXP_ITEMS_HANDLERS` for stringify/filtering, and closes the panel on create via the host
`NxpDropdownOpen`.)

- [ ] **Step 3: Verify lint + build + full component test suite**

Run: `npx nx lint components --skip-nx-cache`
Expected: "All files pass linting".
Run: `npx nx test components --skip-nx-cache`
Expected: all green (8 select.component tests + existing suites).
Run: `npx nx build components --skip-nx-cache`
Expected: builds `@ngxpro/components/select` (and dependents) with no errors.

> If `nx build components` fails only on the pre-existing `@ngxpro/components/switch` /
> `libs/cdk/components/switch/` breakage (unrelated), record it and continue — the `select` entry point
> itself must compile. Confirm by `npx nx build components 2>&1 | grep -i select` showing no select errors.

- [ ] **Step 4: Commit**

```bash
git add libs/components/select/src/select.component.ts
git commit -m "feat(select): add [filterable]/[creatable] via composed nxp-select-filter"
```

---

## Task 4: Rewrite the select demo to 100% component

**Files:**

- Rewrite: `apps/showcase/src/app/select/select-demo.component.ts`
- Rewrite: `apps/showcase/src/app/select/select-api.component.ts`

- [ ] **Step 1: Rewrite `select-demo.component.ts`**

Final example set (all `<nxp-select>`), each inside `<nxp-doc-example [content]="{ HTML, TypeScript }">`:

1. **Basic** — `[items]="fruits"` `placeholder` `[clearable]="true"` _(keep existing component example)_
2. **Object items** — `[items]="countries"` `textField="name"` `valueField="code"` `[clearable]="true"` _(keep existing)_
3. **Disabled** — `[formControl]` is a disabled control:
   ```html
   <nxp-select [formControl]="disabledCtrl" [items]="fruits" placeholder="Select a fruit" />
   ```
4. **Disabled items** — new:
   ```html
   <nxp-select [formControl]="disabledItemsCtrl" [items]="fruits" [disabledItem]="isFruitDisabled" placeholder="Select a fruit" />
   ```
5. **Filterable + grouped** — new:
   ```html
   <nxp-select [formControl]="groupedCountryCtrl" [items]="groupedCountries" textField="name" valueField="code" groupBy="continent" [filterable]="true" filterPlaceholder="Search countries…" placeholder="Select a country" />
   ```
6. **Create on no-match** — new:
   ```html
   <nxp-select [formControl]="tagCtrl" [items]="tags()" [creatable]="true" createLabel="Create" filterPlaceholder="Search or create…" (create)="addTag($event)" placeholder="Pick a tag" />
   ```

Remove every directive example (`<nxp-textfield>` + `<input nxpSelect>` + `<ng-template nxpDropdown>`),
every `*Html`/`*Ts` snippet string tied to a removed example, and now-unused imports. Keep the class
members the kept/new examples need (`fruits`, `countries`, `groupedCountries`, `disabledCtrl`,
`disabledItemsCtrl`, `groupedCountryCtrl`, `tags`, `tagCtrl`, `isFruitDisabled`, `addTag`, the
`component*` controls). Drop `readOnly`/`pseudoInvalid` (directive-only) and the `groupContinents`
helper (grouping is now the component's job).

Resulting `imports` array:

```ts
imports: [
  JsonPipe,
  ReactiveFormsModule,
  NxpSelectComponent,
  NxpDocComponentPage,
  NxpDocExampleComponent,
  SelectApiComponent,
],
```

Change the page header binding `type="directive"` → `type="component"`. Provide a fresh `[content]`
snippet (HTML + TypeScript strings) for each of the 6 examples showing the `<nxp-select>` form (mirror
the style of the existing `componentHtml`/`componentTs` strings already in the file).

- [ ] **Step 2: Rewrite `select-api.component.ts`**

Drop the `input[nxpSelect]` and `NxpSelect` sections and the `readOnly`/`pseudoInvalid` `model()`s.
Keep only the `<nxp-select>` table and extend it with the new inputs:

```html
<tr nxpDocApiItem name="[disabledItem]" type="(item: T) => boolean">
  Predicate marking individual items non-selectable (dimmed, aria-disabled, skipped by keyboard nav).
</tr>
<tr nxpDocApiItem name="[filterable]" type="boolean" default="false">
  Show an in-panel search box that filters options as you type.
</tr>
<tr nxpDocApiItem name="[matcher]" type="NxpStringMatcher<T>">
  Custom filter matcher. Defaults to case-insensitive substring.
</tr>
<tr nxpDocApiItem name="[filterPlaceholder]" type="string" default="Search…">
  Placeholder for the in-panel search input.
</tr>
<tr nxpDocApiItem name="[groupBy]" type="string">
  Property name used to bucket options into labelled groups.
</tr>
<tr nxpDocApiItem name="[creatable]" type="boolean" default="false">
  Show a "Create …" row when the search matches nothing (implies a search box).
</tr>
<tr nxpDocApiItem name="[createLabel]" type="string" default="Create">
  Label prefix for the create row.
</tr>
<tr nxpDocApiItem name="(create)" type="EventEmitter<string>">
  Emits the trimmed search text when the create row is chosen.
</tr>
```

The class body becomes empty (`export class SelectApiComponent {}`). Since the demo no longer passes
`[(readOnly)]`/`[(pseudoInvalid)]`, update the demo's `<app-select-api />` usage to drop those bindings.

- [ ] **Step 3: Verify the demos typecheck (ignoring pre-existing unrelated breakages)**

Run: `npx tsc -p apps/showcase/tsconfig.app.json --noEmit 2>&1 | grep -E "select|combo-box" || echo "NO select/combo-box errors"`
Expected: `NO select/combo-box errors`.

> The full `tsc` run will still report the pre-existing `@ngxpro/components/tabs` / `/stepper` / switch
> errors — those are out of scope. Only select/combo-box files must be clean.

- [ ] **Step 4: Commit**

```bash
git add apps/showcase/src/app/select/select-demo.component.ts apps/showcase/src/app/select/select-api.component.ts
git commit -m "docs(showcase): make select demo 100% <nxp-select>"
```

---

## Task 5: Rewrite the combo-box demo to 100% component

**Files:**

- Rewrite: `apps/showcase/src/app/combo-box/combo-box-demo.component.ts`
- Rewrite: `apps/showcase/src/app/combo-box/combo-box-api.component.ts`

No library change — `<nxp-combo-box>` already supports every behavior below.

- [ ] **Step 1: Rewrite `combo-box-demo.component.ts`**

Final example set (all `<nxp-combo-box>`):

1. **Basic** — `[items]="countries"` `placeholder` _(keep existing recommended example)_
2. **Primitive value** — `textField` `valueField` `[valuePrimitive]="true"` _(keep existing)_
3. **Non-strict** — new:
   ```html
   <nxp-combo-box [formControl]="fruitCtrl" [items]="fruits" [strict]="false" placeholder="Pick or type a fruit" />
   ```
4. **Disabled** — new (disabled control):
   ```html
   <nxp-combo-box [formControl]="disabledCountryCtrl" [items]="countries" placeholder="Select a country" />
   ```
5. **Object dataset (full object)** — new:
   ```html
   <nxp-combo-box [formControl]="priorityCtrl" [items]="priorities" textField="text" valueField="value" placeholder="Pick a priority" />
   ```

Remove every directive example, its snippet strings, and now-unused imports. Resulting `imports`:

```ts
imports: [
  JsonPipe,
  ReactiveFormsModule,
  NxpComboBoxComponent,
  NxpDocComponentPage,
  NxpDocExampleComponent,
  ComboBoxApiComponent,
],
```

Keep the class members the examples use (`countries`, `fruits`, `priorities`, `componentCtrl`,
`componentPrimitiveCtrl`, `fruitCtrl`, `disabledCountryCtrl`, `priorityCtrl`, `priorityPrimitiveCtrl`).
Change page header `type="directive"` → `type="component"`. Provide fresh `[content]` HTML+TS snippets
for the 3 new examples (mirror existing `componentHtml`/`componentTs` style).

- [ ] **Step 2: Rewrite `combo-box-api.component.ts`**

Retitle the directive table to `<nxp-combo-box>`, remove the "shared with directive" framing and the
`nxp-select-option` table, fix the two `<!-- TODO describe -->` placeholders, and add the rows for
`[placeholder]`, `[emptyLabel]`, `[class]`. Keep the `model()`s that back live rows (`items`, `strict`,
`matcher`, `textField`, `valueField`, `valuePrimitive`); drop `optionValue`.

```html
<tr nxpDocApiItem name="[items]" type="readonly T[]" [(value)]="items">
  The options shown in (and filtered within) the dropdown list.
</tr>
<!-- keep [strict], [matcher], [textField], [valueField], [valuePrimitive] rows -->
<tr nxpDocApiItem name="[placeholder]" type="string" default="Select...">
  Text shown in the trigger when the input is empty.
</tr>
<tr nxpDocApiItem name="[emptyLabel]" type="string" default="No options">
  Text shown in the dropdown when no items match.
</tr>
<tr nxpDocApiItem name="[class]" type="string">
  Extra CSS classes merged onto the host element.
</tr>
```

- [ ] **Step 3: Verify**

Run: `npx tsc -p apps/showcase/tsconfig.app.json --noEmit 2>&1 | grep -E "select|combo-box" || echo "NO select/combo-box errors"`
Expected: `NO select/combo-box errors`.

- [ ] **Step 4: Commit**

```bash
git add apps/showcase/src/app/combo-box/combo-box-demo.component.ts apps/showcase/src/app/combo-box/combo-box-api.component.ts
git commit -m "docs(showcase): make combo-box demo 100% <nxp-combo-box>"
```

---

## Final verification

- [ ] `npx nx lint components` → clean
- [ ] `npx nx test components` → all green (incl. 8 select.component tests)
- [ ] `npx nx build components` → `@ngxpro/components/select` builds (ignore unrelated switch breakage)
- [ ] `npx tsc -p apps/showcase/tsconfig.app.json --noEmit 2>&1 | grep -E "select|combo-box"` → no output
- [ ] Manual smoke (optional, blocked by pre-existing showcase build breakages): `/select` shows
      disabled-items, filter+group, and create working via `<nxp-select>`.
