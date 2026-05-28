import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the notification demo. Inputs are exposed as two-way
 * `model()`s so the parent demo can share playground state — editing a row
 * here updates the live preview, and values persist to the URL via
 * `nxpDocApiItem`.
 */
@Component({
  selector: 'app-notification-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the notification components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-notification</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Inputs on the underlying notification card. In practice you don't render
      <code>&lt;nxp-notification&gt;</code> directly — you call
      <code>NxpNotificationService.open(content, options)</code> and the host
      forwards these as <code>NxpNotificationOptions</code>.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[appearance]"
        type="'info' | 'success' | 'warning' | 'error' | 'neutral'"
        [items]="appearanceOptions"
        [(value)]="appearance"
      >
        Visual appearance / severity level. Drives the colour palette, default
        icon, and ARIA
        <code>role</code>
        /
        <code>aria-live</code>
        pairing (<code>error</code>/<code>warning</code>
        are assertive alerts, the rest are polite statuses).
      </tr>
      <tr
        nxpDocApiItem
        name="[label]"
        type="NxpDynamicContent"
        [(value)]="label"
      >
        Optional bold title above the message content. Accepts a string,
        <code>TemplateRef</code
        >, or
        <code>NxpDynamicComponent</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[content]"
        type="NxpDynamicContent"
        [(value)]="content"
      >
        Default message body content (can be overridden at the
        <code>service.open()</code>
        call site). Accepts a string,
        <code>TemplateRef</code
        >, or
        <code>NxpDynamicComponent</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[icon]"
        type="string | ((appearance: string) => string)"
        [(value)]="icon"
      >
        Icon to display. Either a Remix Icon class name (e.g.
        <code>ri-info-line</code
        >) or a function that receives the appearance and returns a class name.
        Empty string falls back to the appearance's default icon.
      </tr>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'s' | 'm' | 'l'"
        [items]="sizeOptions"
        [(value)]="size"
      >
        Size of the notification card — drives padding, gap, and text scale.
      </tr>
      <tr nxpDocApiItem name="[closable]" type="boolean" [(value)]="closable">
        Whether to render a close (×) button. When
        <code>false</code
        >, the toast can still be dismissed by swipe or auto-close.
      </tr>
      <tr
        nxpDocApiItem
        name="[autoClose]"
        type="number | false"
        [(value)]="autoClose"
      >
        Auto-dismiss delay in milliseconds. Set to
        <code>false</code>
        to make the toast sticky. Pauses on hover / focus, resumes on leave.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NxpNotificationOptions</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Extra option fields exposed through the service that don't live on the
      card itself.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="position"
        type="'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'"
        [items]="positionOptions"
        [(value)]="position"
      >
        Position of the notification stack on screen. Each anchor point gets its
        own Sonner-style stacked column rendered by
        <code>nxp-notification-host</code
        >.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-notification-host</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      The host component renders the toast columns and consumes the
      <code>NxpNotificationService</code> signal. It has no configurable inputs
      — drop it once near the root of your app and trigger toasts via
      <code>service.open(...)</code>.
    </p>
  `,
})
export class NotificationApiComponent {
  readonly appearance = model<
    'info' | 'success' | 'warning' | 'error' | 'neutral'
  >('info');
  readonly label = model<string>('');
  readonly content = model<string>('');
  readonly icon = model<string>('');
  readonly size = model<'s' | 'm' | 'l'>('m');
  readonly closable = model<boolean>(true);
  readonly autoClose = model<number | false>(5000);
  readonly position = model<
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
  >('top-right');

  readonly appearanceOptions = [
    'info',
    'success',
    'warning',
    'error',
    'neutral',
  ] as const;
  readonly sizeOptions = ['s', 'm', 'l'] as const;
  readonly positionOptions = [
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center',
  ] as const;
}
