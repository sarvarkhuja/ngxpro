# Dialog portal

Modal dialogs with template or component content. Pattern from Taiga UI `TuiDialogService` / `TuiDialog`.

## Pieces

- **`NxpDialogService`** – Opens dialogs. Uses `NxpModalService` (modal wrapper) and `NxpDialogComponent` (dialog UI).
- **`NxpDialogDirective`** – For template-based dialogs: `<ng-template nxpDialog [nxpDialog]="open" [nxpDialogOptions]="opts">content</ng-template>`.
- **`nxpDialog(Component)(data)`** – Factory to open a component as dialog with data.

## Usage

### 1. Template-based (directive)

```html
<ng-template #tpl nxpDialog [nxpDialog]="dialogOpen()" [nxpDialogOptions]="{ label: 'Confirm' }" (nxpDialogChange)="dialogOpen.set($event)">
  <p>Are you sure?</p>
</ng-template>
<button (click)="dialogOpen.set(true)">Open</button>
```

### 2. Programmatic (service)

```ts
// Simple string content
this.dialog.open('Hello!', { label: 'Info' }).subscribe();

// With result type
this.dialog.open<boolean>('Delete?', { data: 'Confirm' }).subscribe(ok => { ... });
```

### 3. Component dialog (factory)

```ts
@Component({ ... })
class ConfirmComponent {
  readonly context = injectContext<NxpDialogContext<boolean, { message: string }>>();
}

const openConfirm = nxpDialog<{ message: string }, boolean>(ConfirmComponent);
openConfirm({ message: 'Sure?' }).subscribe(result => { ... });
```

## Options

- **appearance** – `data-appearance` (e.g. `'default'`, `'fullscreen'`)
- **closable** – Show X button (default `true`)
- **dismissible** – Close on Esc or backdrop click (default `true`)
- **label** – Dialog title
- **required** – If true, dismissing throws (default `false`)
- **size** – `'s'` | `'m'` | `'l'`
- **data** – Passed to `context.data` (e.g. OK button text)

## Requirements

- `<nxp-root>` (or equivalent) with `<nxp-popups>` so `NxpPortalService` has a host.
