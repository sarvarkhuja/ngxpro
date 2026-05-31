import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type { NxpNotificationOptions } from '@ngxpro/cdk/components/notification';

type Appearance = NxpNotificationOptions['appearance'];
type Size = NxpNotificationOptions['size'];
type Position = NxpNotificationOptions['position'];

/**
 * API table for the alert demo. Inputs are exposed as two-way `model()`s so
 * the parent demo can share playground state — editing a row here updates the
 * live preview, and values persist to the URL via `nxpDocApiItem`.
 *
 * Styling is 100% Vercel/Geist semantic tokens (`text-text-*`, `bg-bg-*`,
 * `font-mono`) that auto-flip in dark mode — no `dark:` variants needed.
 */
@Component({
  selector: 'app-alert-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  templateUrl: './alert-api.component.html',
})
export class AlertApiComponent {
  readonly appearance = model<Appearance>('info');
  readonly size = model<Size>('m');
  readonly position = model<Position>('top-right');
  readonly label = model('');
  readonly content = model('');
  readonly icon = model('');
  readonly closable = model(true);
  // Note: the underlying input accepts `number | false`. The API row falls
  // back to a number editor here for simplicity — toggle the "No auto-close"
  // checkbox in the playground to flip the boolean side of the union.
  readonly autoClose = model<number | false>(5000);

  readonly appearanceOptions = [
    'info',
    'success',
    'warning',
    'error',
    'neutral',
  ] as const;
  readonly sizeOptions = ['s', 'm', 'l'] as const;
  readonly positionOptions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ] as const;

  // Vercel/Geist token-based class vocabulary. `code`/`codeLg` use Geist Mono
  // on a neutral surface; everything auto-flips in dark mode.
  protected readonly cls = {
    lede: 'text-base text-text-secondary mb-6',
    h2: 'text-xl font-semibold tracking-card text-text-primary mt-10 mb-2',
    sub: 'text-sm text-text-secondary mb-2',
    code: 'font-mono text-[0.8em] px-1.5 py-0.5 rounded-sm bg-bg-neutral-1 text-text-secondary',
    codeLg:
      'font-mono text-base px-1.5 py-0.5 rounded-sm bg-bg-neutral-1 text-text-primary',
  } as const;
}
