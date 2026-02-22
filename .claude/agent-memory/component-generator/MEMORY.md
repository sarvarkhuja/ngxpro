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

## Details: see `patterns.md`
