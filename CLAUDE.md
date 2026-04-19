# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

This repo contains the Nx workspace plus vendored reference sources:

- `ngxpro/` — **the actual Nx workspace** (Angular 21.1 + Nx 22.5 + Tailwind v4). All build/test/lint commands must be run from this directory.
- `taiga-family/` — vendored Taiga UI source, read-only. Used **only for studying architecture patterns** (CDK utilities, component composition, DI tokens). Do **not** import from it, do **not** copy its styling.
- `fluidfunctionalizm/` — vendored Next.js + Tailwind v4 + Framer Motion reference, read-only. Used **only for studying animation language and modern neutral aesthetic** — the three spring tiers (`fast`/`moderate`/`slow`), enter/exit asymmetry, CSS custom property palette, CVA-style variants. Patterns must be **reimplemented in Angular idioms** (Angular animations API, CSS transitions, `tailwind-variants`, signals). Do **not** import from it, do **not** copy its code.
- `.claude/` — project rules, agent specs, and the detailed project brief (`.claude/CLAUDE.md`). Read `.claude/CLAUDE.md` for the full mission/architecture doc; this file is the short operational companion.

## Commands

All commands run from `ngxpro/` (the Nx workspace root):

```bash
# Showcase app (dev server for manual testing)
npx nx serve showcase

# Build a single library (e.g. @nxp/components)
npx nx build components
npx nx build cdk
npx nx build core

# Build everything
npx nx run-many -t build

# Lint
npx nx lint components          # single project
npx nx run-many -t lint          # all projects

# Unit tests (vitest-angular)
npx nx test components                                    # all tests for a project
npx nx test components -- --test-name-pattern="accordion" # single test by name
npx nx test components -- path/to/file.spec.ts            # single file

# Formatting
npx nx format:write

# Reset Nx project graph (needed after adding a new library — daemon doesn't always pick it up)
npx nx reset
```

### npm install gotchas

- There is an npm cache permission issue — always install with `--legacy-peer-deps` and/or `--cache /tmp/npm-cache`.
- When generating additional libraries, pass `--skipPackageJson` to avoid triggering install, then run `npm install --legacy-peer-deps` once at the end.
- Library generator pattern:
  ```bash
  npx nx generate @nx/angular:library libs/<name> \
    --name=<name> --importPath=@nxp/<name> --publishable --buildable
  ```

## Architecture (Big Picture)

### Core principle
Building a UI library **from scratch**. Taiga UI = architecture patterns only. Tremor = Tailwind styling only. **Nothing imports from `@taiga-ui/*` except `@taiga-ui/polymorpheus`** (polymorphic templates). All styling is Tailwind classes — **no SCSS for components** (SCSS only for global tokens).

### Package graph (inside `ngxpro/libs/`)

```
@nxp/cdk          → low-level utils: cx, focus-styles, coercion, dom, math,
                    directives, injection tokens, observables
@nxp/core         → services: Theme, Breakpoint, Format; pipes; design tokens
@nxp/components   → base UI components (secondary entry points per component)
@nxp/blocks       → composed blocks (charts, kpi-cards, tables, forms, ...)
@nxp/fintech      → fintech-domain blocks & templates (placeholder)
```

Dependency direction is strict: `components` → `core` → `cdk`. Blocks build on components. Fintech builds on blocks. **Never introduce back-edges.**

### Secondary entry points

`@nxp/components` uses Angular secondary entry points (one `ng-package.json` per subdirectory). To consume accordion: `import { NxpAccordionComponent } from '@nxp/components/accordion'` — **not** from the root. When adding a component, create the subdirectory with its own `ng-package.json`, `src/`, and public `index.ts`; each entry point **must export at least one symbol** (ng-packagr fails on comments-only files).

### Textfield system (Taiga-inspired DI composition)

Three cooperating pieces in `@nxp/components/{textfield,label,input}` communicate via DI tokens rather than `@Input`/`@Output`. This is the canonical pattern to follow for other compound components:

- `NxpTextfieldComponent` (`nxp-textfield`) — wrapper; provides `NXP_TEXTFIELD`; reads `NXP_TEXTFIELD_ACCESSOR` + `NXP_LABEL` via `contentChild`.
- `NxpLabelDirective` (`label[nxpLabel]`) — floats when inside a textfield (reads `textfield.hasValueOrFocused()`); provides `NXP_LABEL`.
- `NxpInputDirective` (`input[nxpInput]`) — implements `NxpTextfieldAccessor`; transparent when projected into a textfield, full styling when standalone; provides `NXP_TEXTFIELD_ACCESSOR`.

Dependency order is `textfield ← label, input` with no circulars. Tokens (`NXP_TEXTFIELD`, `NXP_LABEL`, `NXP_TEXTFIELD_ACCESSOR`) are all re-exported from `@nxp/components/textfield`.

### Icon system

- `NxpIconComponent` (`nxp-icon`) renders registry-resolved SVG via `DomSanitizer`.
- Register icons at app bootstrap via `nxpIconsProvider({ 'ri-search-line': '<svg>...</svg>' })` — backed by `NXP_ICON_REGISTRY` + `NXP_ICON_RESOLVER`.
- Raw SVG bypass: if the `icon` input starts with `<`, it is used verbatim.
- Color via Tailwind (`class="text-blue-500"`) — SVGs use `fill="currentColor"`.

### Styling conventions

- `cx()` (`@nxp/cdk`) = `twMerge(clsx(...))` — always use for merging class lists with conflict resolution.
- Variants via `tailwind-variants` (`tv()`).
- Dark mode is **class-based** (`dark:` prefix), not media.
- Shared focus/error class constants live in `@nxp/cdk` (`focusRing`, `focusInput`, `hasErrorInput`) — reuse rather than duplicate.
- Tailwind v4 syntax: `@use 'tailwindcss'` in SCSS (**not** `@tailwind base/components/utilities`); PostCSS config is `.postcssrc.json` using `@tailwindcss/postcss`.

### Angular conventions

- **Standalone + OnPush, always.** No NgModules in library code.
- Signals-first: `input()`, `model()`, `signal()`, `computed()`, `effect()`. Avoid `@Input`/`@Output` in new code.
- Composition via `hostDirectives` and `contentChildren`.
- Options provider pattern (Taiga-style): define a token + `provide<Component>Options()` factory function for per-instance configuration.
- Barrel exports (`index.ts`) for each entry point's public API.

## Agent roles

When doing significant multi-file work, adopt the role matching the area (see `AGENTS.md` and `.claude/rules/*.md` for full specs). Short mapping:

| Area | Role |
|---|---|
| Nx workspace, Tailwind, CI/CD, build | Architecture |
| `libs/cdk` utilities | CDK |
| `libs/core` services/tokens | Core |
| `libs/components/*` UI components | Component Generator |
| `libs/blocks/*` composed blocks | Block Generator |
| `libs/fintech` | Fintech |
| Tests, coverage, a11y | Testing |
| README, Storybook, showcase | Documentation |

## Quality gates (per component/block)

- Standalone + OnPush + signal inputs
- Tailwind classes only (no component-level SCSS); dark mode variants present
- ≥80% unit test coverage, 0 axe-core violations
- Responsive at sm/md/lg
- Gzipped bundle <50 KB
- **Zero imports from `@taiga-ui/*`** (polymorpheus is the sole exception)

## Additional references

- `.claude/CLAUDE.md` — full project mission, phases, detailed architecture
- `.claude/POLYMORPHEUS_GUIDE.md` — polymorphic templates
- `.claude/BLOCK_CATALOG.md` — the ~300 block catalogue organized by category
- `.claude/rules/*.md` — per-role detailed instructions
- `AGENTS.md` — role selection matrix
