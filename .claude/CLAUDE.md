# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular UI component library (`@nxp/*`) built from scratch. Architecture patterns from Taiga UI, styling from Tremor via Tailwind CSS. **NOT built on top of Taiga UI** — Taiga is reference-only for architecture. All styling is 100% Tailwind.

- **Nx 22.5** monorepo, **Angular 21.1**, **Tailwind CSS v4**, **TypeScript 5.9**
- Test runner: **Vitest** (via `@angular/build:unit-test` and `@nx/angular:unit-test`)
- Package manager: **npm** (requires `--legacy-peer-deps` for installs)

## Common Commands

```bash
# Build all libraries
npx nx run-many -t build --parallel=3

# Build a specific library
npx nx build components
npx nx build cdk
npx nx build core

# Lint
npx nx run-many -t lint --parallel=3
npx nx lint components

# Test
npx nx run-many -t test --parallel=3
npx nx test components
npx nx test cdk

# Serve showcase app (dev server)
npx nx serve showcase

# Install dependencies (always use --legacy-peer-deps)
npm install --legacy-peer-deps

# Generate a new library
npx nx generate @nx/angular:library libs/[name] --name=[name] --importPath=@nxp/[name] --publishable --buildable

# Reset Nx daemon (if it doesn't detect new projects)
npx nx reset
```

## Package Architecture

Four library packages under `libs/`, each built with `ng-packagr`:

| Package | Import | Purpose |
|---------|--------|---------|
| `@nxp/cdk` | `libs/cdk/` | Low-level utilities, directives, tokens, observables, portals (dropdown, dialog, modal, popup), classes (control, driver, vehicle) |
| `@nxp/core` | `libs/core/` | Foundation services (ThemeService, BreakpointService, FormatService), pipes (amount, currency, number, relative-time), tokens |
| `@nxp/components` | `libs/components/` | 30+ UI components via **secondary entry points** (e.g., `@nxp/components/accordion`) |
| `@nxp/blocks` | `libs/blocks/` | Higher-level composed blocks (charts, kpi-cards, tables) |
| `@nxp/fintech` | `libs/fintech/` | Fintech domain blocks (placeholder) |

**Showcase app** at `apps/showcase/` — Angular app with lazy-loaded demo pages for each component.

### Dependency order
`cdk` ← `core` ← `components` ← `blocks` ← `fintech`

### Secondary Entry Points
Components use secondary entry points via `ng-package.json` files in subdirectories. Each component lives in `libs/components/[name]/` with its own `ng-package.json` and `src/index.ts`. Import as `@nxp/components/accordion`, not from the barrel.

CDK also has secondary entry points under `libs/cdk/src/lib/components/` (icon, copy, link, checkbox, radio, textfield, label, input, calendar, root, notification, dropdown).

When adding a new secondary entry point, also add the path mapping in `tsconfig.base.json`.

## Component Patterns

All components follow these conventions:

- **Standalone** components with `OnPush` change detection
- **Signals** for all inputs: `input()`, `model()`, `signal()`, `computed()` — never `@Input()`
- **Tailwind classes** for all styling — no component-level SCSS
- **`cx()` utility** (`twMerge(clsx(...))`) for class merging with conflict resolution
- **`tailwind-variants` (`tv()`)** for variant management
- **Options provider pattern**: `createOptions()` → DI token + `provideOptions()` function
- **Host directives** (`hostDirectives`) for composition
- **`contentChildren`** for content projection
- **Prefix**: all selectors use `nxp` prefix

### Textfield System
Three-part composition using DI tokens (`NXP_TEXTFIELD`, `NXP_LABEL`, `NXP_TEXTFIELD_ACCESSOR`):
- `NxpTextfieldComponent` — wrapper with border/focus/error states
- `NxpLabelDirective` — floating label when inside textfield
- `NxpInputDirective` — transparent input inside textfield

### Portal System (CDK)
Dropdown, dialog, modal, and popup portals live in `libs/cdk/src/lib/portals/`. These handle overlay positioning, focus trapping, close-on-escape, and click-outside behavior.

## Styling

- **Tailwind v4** — uses `@use 'tailwindcss'` syntax (not v3's `@tailwind` directives)
- PostCSS configured via `.postcssrc.json` with `@tailwindcss/postcss`
- Dark mode: class-based (`dark:` prefix)
- Focus styles: reusable constants `focusRing`, `focusInput`, `hasErrorInput` from `@nxp/cdk`
- SVG loader configured in showcase: `"loader": { ".svg": "text" }`

## CI

GitHub Actions (`.github/workflows/ci.yml`): lint → test → build, all with `--parallel=3`. Uses Node 22, `npm ci --legacy-peer-deps`.

## Known Gotchas

- `ng-packagr` requires at least one exported symbol per entry point (comments-only `index.ts` files fail the build)
- Nx daemon sometimes doesn't detect new projects — run `npx nx reset`
- npm has peer dependency conflicts — always use `--legacy-peer-deps`
- When generating additional libraries after the first, use `--skipPackageJson` to avoid npm install issues
