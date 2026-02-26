# Component Generator Agent Memory

## Key Patterns (confirmed across multiple components)

- Secondary entry points: `libs/components/[name]/ng-package.json` + `libs/components/[name]/src/index.ts`
- Path mapping goes in `ngxpro/tsconfig.base.json` under `"paths"`
- `libs/components/src/index.ts` is a comment-only barrel — add a comment when adding a new entry point
- Package import: `@ngxpro/components/[name]` (prefix is `@ngxpro`, NOT `@nxp` — both exist in codebase, check tsconfig)
- Build command: `npx nx build components` from `/Users/aki/Documents/GitHub/ngxpro/ngxpro/`

## Provider / Token Pattern
- Injection token with `providedIn: 'root'` factory = sensible defaults without explicit setup
- `provideCalendarOptions(partial)` pattern for scoped overrides (see `calendar.providers.ts`)
- Interface in a separate file (`calendar-options.interface.ts`) to avoid circular imports with `calendar.providers.ts`

## Model vs Signal for Two-Way State
- `model<T>()` can be used for parent-bindable two-way state; `signal<T>()` for internal state only
- `hoveredDay` on CalendarSheetComponent uses `model<Date | null>` so parent can bind to it

## Pipe in Standalone Component
- `CalendarSheetPipe` (pure, standalone) is imported directly into `CalendarSheetComponent.imports`
- The `year | calendarSheet:month():weekStart()` pipe syntax works with signal calls in templates

## Type-Only Imports
- Use `import type { … }` for types that cross entry-point boundaries to avoid circular bundles

## ng-packagr Secondary Entry Point: Cross-Package Import Rules
- Importing `@nxp/cdk` in secondary entries of `@nxp/components` works fine
- Importing `@nxp/core` in secondary entries of `@nxp/components` causes a TypeScript internal crash during partial compilation (ng-packagr TS bug: "Cannot destructure property 'pos' of 'file.referencedFiles[index]'")
- Root cause: `@nxp/core` imports `@nxp/cdk` internally; the cross-dep chain triggers a TS diagnostic format crash
- Solution: Tokens needed by `@nxp/components` secondary entries must live in `@nxp/cdk` or be defined locally in the entry point itself
- See `libs/components/root/src/root.tokens.ts` for the pattern of local token definitions

## viewChild with `read` Option
- In Angular 21 / ng-packagr partial compilation, `viewChild.required<T>('ref', { read: ViewContainerRef })` fails with TS2353 error
- Instead, use `inject(ViewContainerRef)` directly inside a component/directive to get its own VCR

## Directives: no changeDetection property
- `@Directive` does NOT accept a `changeDetection` property — that is `@Component`-only
- For attribute directives, just omit `changeDetection` entirely; signals are reactive by default

## Details: see `patterns.md`
