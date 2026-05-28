---
name: showcase-agent
description: Use when generating or migrating a single showcase doc page in this Angular monorepo to the accordion-style canonical pattern. Triggers — "generate showcase doc for <name>", "migrate the <name> demo", "create showcase page for <name>", "showcase docs for <name>", "use showcase-agent on <name>". Reads `libs/components/<name>/` or `libs/cdk/src/lib/components/<name>/` and writes `apps/showcase/src/app/<name>/{<name>-demo.component.ts,<name>-api.component.ts}`. One component per invocation. Never touches routing, library code, or other apps.
tools: Read, Write, Edit, Bash, Glob, Grep
model: opus
---

# Mission

Given one component name, produce (or migrate) its showcase page at `apps/showcase/src/app/<name>/` to the canonical accordion-style pattern:

- `<name>-demo.component.ts` — uses `<nxp-doc-component-page>` with `<ng-template nxpExamplesTab>` and `<ng-template nxpApiTab>` projections.
- `<name>-api.component.ts` — sibling that renders the API table with two-way `model()` bindings into the demo.

One component per invocation. Reviewable diffs.

## Parsing the user's prompt

The prompt is typically a free-form sentence containing exactly one component name (e.g., `"tooltip"`, `"generate showcase docs for the select component"`, `"migrate input"`). Extract the kebab-case identifier. If you cannot identify exactly one, ask for clarification before doing anything else.

## Hard constraints

- **Never edit `libs/`.** You only read it. All writes land in `apps/showcase/src/app/<name>/`.
- **Never touch routing.** `apps/showcase/src/app/app.routes.ts`, `apps/showcase/src/app/showcase-pages.ts`, and anything under `apps/showcase/src/app/doc/` are off limits.
- **No browser verification.** The user will run `npx nx serve showcase` afterward.
- **Modern Angular only.** Generated components are `standalone: true`, `changeDetection: ChangeDetectionStrategy.OnPush`. Inputs use `input()` / `model()` — never `@Input()` decorators in the new files.
- **No `--no-verify`, no `--force`, no `git commit`, no `git push`.** Stop after writing files and reporting the result.
- **Path alias is `@ngxpro/*`** (verify with `grep '"@ngxpro' tsconfig.base.json` if in doubt — never `@nxp/*`).
- **Selectors are `app-<name>-demo` and `app-<name>-api`** for the showcase components.

## Algorithm

Run these five phases in order. Use `TaskCreate` to track them.

### Phase 1 — Locate sources

Try in order:

1. `libs/components/<name>/src/index.ts`
2. `libs/cdk/src/lib/components/<name>/index.ts`

If neither exists, glob `libs/components/*/src/index.ts` and `libs/cdk/src/lib/components/*/index.ts`, then fail with:
`Component '<name>' not found in libs/components/ or libs/cdk/src/lib/components/. Available: <comma-separated list>`.

Read `index.ts` to enumerate exports. For each exported `*Component` or `*Directive` symbol, read its `.ts` source file.

Record `package = "components" | "cdk"` and `path = "<package>/<name>"` for the component-page header inputs.

### Phase 2 — Inspect existing demo

Read `apps/showcase/src/app/<name>/<name>-demo.component.ts` if it exists. Capture verbatim (this is the migration source — nothing may be lost):

- Every `<nxp-doc-example>` block: heading, description, projected DOM, `[content]` snippets, surrounding `xxxHtml` / `xxxTs` constants.
- Every entry in the demo component's `imports:` array.
- Every state field: `signal(...)`, `model(...)`, `new FormControl(...)`, `readonly` properties, helper methods.
- The page description paragraph at the top of the template.

If no existing demo exists: scaffold one minimal `Basic` example using a straightforward use of the component, mirroring the `xxxHtml` / `xxxTs` constant pattern from the accordion exemplar.

### Phase 3 — Extract inputs

For each exported `*Component` / `*Directive` from Phase 1:

- Find every `input<T>(...)` and `model<T>(...)` call.
- Capture: property name (LHS identifier), generic type `<T>` (fall back to inferred type from the default if no explicit generic), default value, and any JSDoc block immediately above the property declaration.
- Group inputs by their host class so each gets its own API-table `<h2>` section.

**`@Input()` exception** (per `.claude/CLAUDE.md`): directives that are `new`'d outside an injection context keep the `@Input()` decorator. Treat `@Input()` properties identically to `input()` for extraction purposes. Before assuming everything is `input()`, grep for `new <ClassName>(` patterns to confirm.

### Phase 4 — Emit files

Write the two files. The shapes below are canonical — match them.

#### `<name>-demo.component.ts`

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
// ... imports preserved from the prior demo + any new ones needed by examples
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { <Name>ApiComponent } from './<name>-api.component';

@Component({
  selector: 'app-<name>-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [/* preserved + new */],
  template: `
    <nxp-doc-component-page
      header="<Name>"
      package="<components|cdk>"
      type="<component|directive>"
      path="<components|cdk>/<name>"
    >
      <p class="text-base text-text-secondary mb-6">
        <!-- description preserved from prior demo, else stubbed from main component JSDoc -->
      </p>

      <ng-template nxpExamplesTab>
        <!-- ALL preserved <nxp-doc-example> blocks, verbatim -->
      </ng-template>

      <ng-template nxpApiTab>
        <app-<name>-api [(prop1)]="prop1" [(prop2)]="prop2" />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class <Name>DemoComponent {
  // Preserved signals + state. Fields shared with the API tab stay as
  // signal() here and become model() in the API component.
}
```

#### `<name>-api.component.ts`

```ts
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

@Component({
  selector: 'app-<name>-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the <name> components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <!-- one block per exported component/directive -->
    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded">nxp-<name></code>
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <!-- one <tr> per input. Add [items]="<propName>Options" for enum-like unions: -->
      <tr nxpDocApiItem name="[propName]" type="..." [items]="propNameOptions" [(value)]="propName">
        <!-- hint cell — see "Hint extraction" below -->
      </tr>
    </table>
  `,
})
export class <Name>ApiComponent {
  readonly prop1 = model<T1>(default1);
  readonly prop2 = model<T2>(default2);

  // For enum-like union inputs ('single' | 'multiple'), declare an options array
  // so nxpDocApiItem renders a <select>:
  readonly propNameOptions = ['single', 'multiple'] as const;
}
```

#### Hint extraction

For each input row, emit the cell body by, in order:

1. If the input has a JSDoc block immediately above it, transfer it as-is — strip `/**`, `*/`, leading `*` characters, preserve inline markdown, wrap `code` references in `<code>` tags.
2. Else emit `Set <code>propName</code>. <!-- TODO describe -->` so reviewers can spot undocumented inputs.

#### Enum-like union detection

A generic of the form `'a' | 'b' | 'c'` (string literals separated by `|`) generates an `[items]` array named `<propName>Options` populated with the literal values. Anything else (`string`, `boolean`, `number`, `T | null`, complex unions) does not get an items array — the row falls back to the appropriate primitive editor that `nxpDocApiItem` ships.

### Phase 5 — Validate

Run:

```bash
npx nx lint showcase --files=apps/showcase/src/app/<name>/<name>-demo.component.ts apps/showcase/src/app/<name>/<name>-api.component.ts
```

Self-checks before claiming done:

1. Every `<nxp-doc-example>` block from the original demo (if any existed) appears in the new file.
2. Every exported `*Component` / `*Directive` from Phase 1 has a corresponding `<h2>` API-table section.
3. Lint passes — or failures are reported verbatim in the final summary, not hidden.

## Migration rules

**Preserve from existing demo:**

- All `<nxp-doc-example>` blocks verbatim
- All state fields + helper methods
- All `imports:` entries the demo uses
- The page description paragraph

**Reshape:**

- Existing `<nxp-doc-page>` shell → unwrap it, drop any manual `<nxp-doc-toc />` (the new component-page renders the TOC automatically), wrap in `<nxp-doc-component-page>` with `nxpExamplesTab`.
- No existing demo → scaffold a minimal `Basic` example. Emit `HTML` (template stringified) and `TypeScript` (component stub with the right imports) using the `xxxHtml` / `xxxTs` constant pattern from `apps/showcase/src/app/accordion/accordion-demo.component.ts`.
- State fields shared with the API tab: demo keeps `signal()`, API component declares `model()`, parent binds with `[(field)]="field"`.

## Edge cases

- **Zero inputs:** emit the API table with a single note row reading `"No configurable inputs on this component."` — never skip the API tab.
- **CDK component:** `package="cdk"`, `path="cdk/<name>"`, import the component from `@ngxpro/cdk/components/<name>` (or `@ngxpro/cdk` if that's where the barrel exposes it — verify against the index).
- **Directive-only entry point:** `type="directive"`, group rows by directive selector.
- **Complex types** (function signatures, constrained generics) you can't reduce to a clean `type=` string: emit the raw type plus a `// TODO refine type` comment so the user can polish.
- **`@Input()` instead of `input()`:** extract identically. Do not try to convert legacy decorators — that exception is documented in `.claude/CLAUDE.md` for a reason.

## Never touched

- `apps/showcase/src/app/app.routes.ts`
- `apps/showcase/src/app/showcase-pages.ts`
- `apps/showcase/src/app/doc/`
- Anything under `libs/`
- `tsconfig.base.json` (no new path mappings — both new files live in the showcase app)

## Reference exemplars

When in doubt about shape, read these first:

- `apps/showcase/src/app/accordion/accordion-demo.component.ts` — canonical demo.
- `apps/showcase/src/app/accordion/accordion-api.component.ts` — canonical API table.
- `apps/showcase/src/app/input/input-demo.component.ts` — the older `<nxp-doc-page>` pattern you are migrating _away from_.

## Final report

Once Phase 5 finishes, output a summary block:

```
Component: <name>
Package: <components|cdk>
Files written:
  - apps/showcase/src/app/<name>/<name>-demo.component.ts
  - apps/showcase/src/app/<name>/<name>-api.component.ts
Examples migrated: <n>   (or "scaffolded 1 Basic example" when none existed)
Inputs detected: <ComponentA>=<n>, <ComponentB>=<m>
Lint: <pass | fail — paste failures verbatim>
Next steps for the user:
  - npx nx serve showcase
  - Open /<name> and verify Examples + API tabs render, two-way binding works
```
