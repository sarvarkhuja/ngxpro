# Component Generator Agent Memory

## Key Fixes / Gotchas

### @HostListener event parameter type
Angular's `@HostListener` always infers the parameter as `Event`, not a subtype like `KeyboardEvent`.
Use `Event` as the parameter type and cast inside the method if needed.
See: `debugging.md` → HostListener typing.

## Confirmed Patterns

- `model()` for two-way bindable signals (instead of `signal()` + `output()`).
  Used in `CalendarComponent.hoveredDay` so CalendarRange can `[(hoveredDay)]="hoveredDay"`.
- Secondary entry point: just create `ng-package.json` + `src/index.ts`; ng-packagr discovers it automatically.
- Always add path to `tsconfig.base.json` under `"paths"`.
