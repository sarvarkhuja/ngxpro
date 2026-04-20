# Alert portal

Portal for stacking alerts (e.g. push notifications, toasts) with concurrency limit and queue. Pattern from Taiga UI `TuiAlertService` / `TuiAlertDirective`.

## Pieces

- **`NxpAlertService<T, K>`** – Abstract base. Extend it with your component type and options (including `NxpPositionOptions`). Uses `NxpPortalService` (e.g. `NxpPopupService`) to attach to `<nxp-popups>`.
- **`NxpAlertDirective`** – Host directive for the alert **component**. Injects `NxpPositionOptions` and applies Tailwind positioning (`data-block`, `data-inline`).

## Usage

1. **Root** must include `<nxp-popups>` (e.g. via `<nxp-root>`), so `NxpPortalService` has a host.

2. **Create an alert component** that uses `NxpAlertDirective` and `injectContext<NxpPortalContext<YourOptions>>()` to read options and content:

```ts
@Component({
  selector: 'nxp-push-alert',
  hostDirectives: [NxpAlertDirective],
  // ...
})
export class NxpPushAlertComponent {
  protected readonly context = injectContext<NxpPortalContext<NxpPositionOptions, string>>();
  // Render context.content via PolymorpheusOutlet
}
```

3. **Create a concrete service** that extends `NxpAlertService` and provide it (e.g. in a feature or in root):

```ts
@Injectable({ providedIn: 'root' })
export class NxpPushService extends NxpAlertService<NxpPositionOptions, string> {
  protected readonly component = NxpPushAlertComponent;
  protected readonly options: NxpPositionOptions = { block: 'start', inline: 'end' };

  constructor() {
    super(3); // concurrency 3
  }
}
```

4. **Open alerts** via the service; subscribe to the returned observable for the result:

```ts
this.pushService.open('Message', { inline: 'center' }).subscribe((result) => { ... });
```

## Position options

- **`block`**: `'start'` | `'end'` – vertical alignment (top / bottom).
- **`inline`**: `'start'` | `'center'` | `'end'` – horizontal alignment.

Alert layout is implemented with Tailwind in `NxpAlertDirective` (grid, place-self, justify-self, self-end).
