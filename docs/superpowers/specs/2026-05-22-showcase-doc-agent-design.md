# Showcase Doc Agent — Design

**Status:** Draft
**Date:** 2026-05-22
**Owner:** Sarvarkhuja Murodov

## Problem

Showcase pages under `apps/showcase/src/app/` follow inconsistent patterns. The accordion demo uses the newer `<nxp-doc-component-page>` shell with Examples + API tabs; the input demo uses the older `<nxp-doc-page>` shell with stacked examples and no API tab. Migrating each of the ~40 components by hand is repetitive and error-prone.

## Goal

A Claude Code subagent — `showcase-doc` — that takes one component name and produces (or migrates) its showcase page to the accordion-style canonical pattern. One component per invocation. Reviewable PRs.

## Non-goals

- Multi-component batch processing
- Routing changes (`app.routes.ts`, `showcase-pages.ts`)
- Library code edits — agent reads `libs/` but never writes there
- Browser verification — the user runs `npx nx serve showcase` afterward
- Translating across UI libraries — agent only works inside this project

## Canonical pattern

Every generated page follows the accordion exemplar at `apps/showcase/src/app/accordion/`:

- `<name>-demo.component.ts` — wraps content in `<nxp-doc-component-page>` with two projected templates: `<ng-template nxpExamplesTab>` and `<ng-template nxpApiTab>`. The component-page renders the table of contents automatically when the Examples tab is active.
- `<name>-api.component.ts` — sibling component projected into the API tab. Renders one `<table nxpDocApi>` per exported component/directive, with `<tr nxpDocApiItem>` rows for each input. Two-way binding to the demo via `model()` keeps the playground in sync with the live preview.

## Agent contract

**File:** `.claude/agents/showcase-doc.md`

**Frontmatter:**

```yaml
---
name: showcase-doc
description: Generate or migrate a single showcase page (apps/showcase/src/app/<name>/) to the accordion-style canonical pattern — produces <name>-demo.component.ts and <name>-api.component.ts. Reads component sources from libs/components/<name>/ or libs/cdk/src/lib/components/<name>/.
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---
```

**Invocation:**

```ts
Agent({
  subagent_type: 'showcase-doc',
  prompt: 'tooltip', // or "Generate showcase docs for the select component"
});
```

The agent parses the component name from free-form prompts.

## Algorithm

The agent runs five phases sequentially.

### Phase 1 — Locate sources

Try in order:

1. `libs/components/<name>/src/index.ts`
2. `libs/cdk/src/lib/components/<name>/index.ts`

If neither exists, fail with `Component '<name>' not found in libs/components/ or libs/cdk/src/lib/components/. Available: <list>`.

Read `index.ts` to enumerate exports. For each exported `*Component` or `*Directive`, read its `.ts` file.

### Phase 2 — Inspect existing demo

Read `apps/showcase/src/app/<name>/<name>-demo.component.ts` if it exists.

Extract verbatim (this is the migration source — nothing may be lost):

- Every `<nxp-doc-example>` block: heading, description, projected DOM, `[content]` snippets
- Every `imports:` entry on the demo component
- Every state field: `signal(...)`, `model(...)`, `new FormControl(...)`, `readonly` properties, helper methods
- The page description paragraph at the top of the template

If no existing demo: scaffold one minimal `Basic` example.

### Phase 3 — Extract inputs

Walk every exported `*Component` / `*Directive` from Phase 1. For each, find every `input<T>(...)` and `model<T>(...)` call. For each, capture:

- Property name (LHS identifier)
- Generic type `<T>` — fall back to inferred type from the default if no explicit generic
- Default value (first argument to `input()` / `model()`)
- JSDoc comment block immediately above the property declaration, if present

Group inputs by their host class so each gets its own API table section.

**Exception (per CLAUDE.md):** directives that are `new`'d outside an injection context use `@Input()` decorators instead of `input()`. Treat `@Input()` properties identically to `input()` calls for extraction purposes. Before assuming `input()` everywhere, grep for `new <ClassName>(` patterns.

### Phase 4 — Emit files

**`<name>-demo.component.ts`:**

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
// ... imports detected from preserved state + examples
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
        <!-- description: preserved from existing demo, else stubbed from main component JSDoc -->
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
  // Preserved signals + state. Fields shared with the API tab stay as signal()
  // here and are model() in the API component.
}
```

**`<name>-api.component.ts`:**

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

    <!-- repeated per exported component/directive: -->
    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded">nxp-<name></code>
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <!-- repeated per input. For enum-like unions add [items]="propNameOptions": -->
      <tr nxpDocApiItem name="[propName]" type="..." [items]="propNameOptions" [(value)]="propName">
        <!-- Hint cell: see "Hint extraction" below -->
      </tr>
    </table>
  `,
})
export class <Name>ApiComponent {
  readonly prop1 = model<T1>(default1);
  readonly prop2 = model<T2>(default2);

  // For enum-like union inputs (`type="single" | "multiple"`), declare the
  // option array so nxpDocApiItem renders a <select>:
  readonly propNameOptions = ['single', 'multiple'] as const;
}
```

**Hint extraction:** For each input row, the agent emits the cell body by, in order:

1. If the input has a JSDoc block immediately above it, transfer it as-is (stripping `/**` `*/` `*` characters and preserving inline markdown). Wrap `code` references in `<code>` tags.
2. Else, emit a stub like `Set <code>propName</code>. <!-- TODO describe -->` so a lint check would visibly flag it during review.

**Enum-like union detection:** A generic of the form `'a' | 'b' | 'c'` (string literals separated by `|`) generates an `[items]` array named `<propName>Options` with the literal values. Anything else (`string`, `boolean`, `number`, `T | null`, complex unions) does not get an items array — the API row falls back to the appropriate primitive editor.

### Phase 5 — Validate

Run `npx nx lint showcase --files=apps/showcase/src/app/<name>/<name>-demo.component.ts apps/showcase/src/app/<name>/<name>-api.component.ts`.

Self-checks before claiming done:

1. Every example present in the original demo (if any) appears in the new file.
2. Every exported `*Component` / `*Directive` has an `<h2>` section in the API table.
3. Lint passes — or failures are reported explicitly.

Output a final summary: files written, examples migrated count, inputs detected per component, lint result.

## Migration rules

**Preserve from existing demo:**

- All `<nxp-doc-example>` blocks verbatim
- All state fields and helper methods
- All imports the demo uses
- Page description paragraph

**Reshape rules:**

- Existing `<nxp-doc-page>` shell → unwrap, drop manual `<nxp-doc-toc />`, wrap in `<nxp-doc-component-page>` with `nxpExamplesTab` template.
- No existing demo → scaffold a minimal `Basic` example matching one straightforward use of the component. For its `[content]` map, emit `HTML` (template stringified) and `TypeScript` (component stub with the right imports — based on the standalone component pattern). Mirror the structure of existing `xxxHtml` / `xxxTs` constants seen in `accordion-demo.component.ts`.
- State fields shared with the API tab: demo keeps `signal()`, API component declares `model()`, bind via `[(field)]="field"`.

**Edge cases:**

- **Zero inputs:** emit API table with a single note row reading "No configurable inputs on this component." Do not skip the API tab.
- **CDK component:** `package="cdk"`, `path="cdk/<name>"`, import from `@ngxpro/cdk/components/<name>`.
- **Directive-only entry point:** `type="directive"`, group rows by directive selector.
- **Complex types** (function signatures, constrained generics) the agent can't reduce to a clean `type=` string: emit the raw type plus a `// TODO refine type` comment so the user can polish.
- **`@Input()` instead of `input()`:** treat identically to `input()`. The exception is documented in CLAUDE.md — directives `new`'d programmatically (e.g., `NxpDynamicTemplate`) keep `@Input()`. Don't try to convert; just extract.

**Never touched:**

- `apps/showcase/src/app/app.routes.ts`
- `apps/showcase/src/app/showcase-pages.ts`
- `apps/showcase/src/app/doc/`
- Anything under `libs/`

## Reference exemplars

The agent embeds these two files in its prompt as canonical examples:

- `apps/showcase/src/app/accordion/accordion-demo.component.ts`
- `apps/showcase/src/app/accordion/accordion-api.component.ts`

For the older input-style pattern (so the agent recognizes what it's migrating away from):

- `apps/showcase/src/app/input/input-demo.component.ts`

## Verification by the user

After the agent reports done:

1. `npx nx serve showcase`
2. Navigate to the page (route registration is the user's job)
3. Visually confirm: Examples tab renders, API tab renders, two-way binding works (changing an API table value updates the live preview)

## Open questions

None at this point. Implementation plan to follow via `superpowers:writing-plans`.
