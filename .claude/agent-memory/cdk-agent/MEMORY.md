# CDK Agent Memory

## Build Command
Run from `/Users/aki/Documents/GitHub/ngxpro/ngxpro/`:
```
npx nx build cdk
```

## Key Patterns

### No @angular/cdk — use inline helpers instead
The project does NOT have `@angular/cdk`. Replace `coerceArray()` with a local helper:
```typescript
function toArray<T>(value: T | T[] | null): T[] {
  if (value === null) return [];
  return Array.isArray(value) ? value : [value];
}
```

### Host binding type errors
Angular strict mode rejects `$event` type mismatches in host bindings. Use `$any()`:
```typescript
host: {
  '(click)': 'onClick($any($event.target))',
  '(keydown.arrowDown)': 'onArrow($any($event), false)',
}
```

### Circular dependency: dropdown.providers.ts
Do NOT use `require()` in the token factory for NXP_DROPDOWN_COMPONENT — it breaks ng-packagr.
Instead, declare the token without a factory and provide NxpDropdownComponent via the assembly file (dropdown.ts / ng providers).

### Token factory imports
NXP_SELECTION_STREAM token uses `nxpTypedFromEvent` — import from `'../observables/typed-from-event'` (relative), not from the barrel `index.ts`, to avoid circular imports.

## CDK Structure (as of 2026-02-24)
```
libs/cdk/src/lib/
├── utils/          → cx, focusRing, focusInput, coercion, dom, math,
│                     set-signal, directive-binding, px, inject-element,
│                     is-string, provide, provide-options, create-options,
│                     override-options, editing-key, check-fixed-position, get-word-range
├── constants/      → EMPTY_CLIENT_RECT, CHAR_ZERO_WIDTH_SPACE, CHAR_NO_BREAK_SPACE,
│                     NXP_TRUE_HANDLER, NXP_FALSE_HANDLER
├── types/          → NgxproSize, NgxproStatus, NgxproAppearance, NxpBooleanHandler,
│                     NxpContext, NxpPoint, NxpVerticalDirection
├── directives/     → AutoFocusDirective, ClickOutsideDirective, NxpActiveZone,
│                     NxpObscured, NxpAnimated, ...
├── observables/    → nxpIfMap, fromResizeObserver, fromIntersectionObserver,
│                     nxpCloseWatcher, nxpStopPropagation, nxpPreventDefault,
│                     nxpZonefree, nxpZonefull, nxpZoneOptimized, nxpZonefreeScheduler,
│                     nxpTypedFromEvent
├── tokens/         → NXP_DOCUMENT, NXP_WINDOW, NXP_IS_BROWSER, NXP_VIEWPORT,
│                     NXP_SELECTION_STREAM
├── classes/        → NxpAccessor, NxpPositionAccessor, NxpRectAccessor,
│                     NxpDriver, NxpDriverDirective, NxpVehicle + helpers
├── services/       → NxpPositionService, NxpVisualViewportService
└── portals/
    ├── portal.service.ts, portals.directive.ts, portal.ts, portal.directive.ts
    ├── alert/, modal/, dialog/
    ├── popup/      → NxpPopupService, NxpPopups
    └── dropdown/   → Full dropdown system (13 files)
```

## Dropdown System Architecture
- NxpDropdownDirective — core vehicle (creates/destroys component ref)
- NxpDropdownDriver — BehaviorSubject<boolean> that emits open state
- NxpDriverDirective — wires drivers to vehicles
- NxpDropdownPosition — calculates x,y from DOMRect (NxpPositionAccessor)
- NxpPositionService — Observable<NxpPoint> using animationFrames()
- NxpDropdownComponent — rendered panel, consumes NxpPositionService
- NxpDropdownOpen — click-to-toggle + keyboard navigation
- NxpDropdownClose — Escape/blur/obscure close triggers
- NxpPopupService + NxpPopups — portal host that renders the dropdown component
