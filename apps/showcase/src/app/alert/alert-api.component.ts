import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type { NxpNotificationOptions } from '@ngxpro/cdk/components/notification';

type Appearance = NxpNotificationOptions['appearance'];
type Size = NxpNotificationOptions['size'];

/**
 * API table for the alert demo. Inputs are exposed as two-way `model()`s so
 * the parent demo can share playground state — editing a row here updates the
 * live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-alert-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the alert components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-notification</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Single-toast component. Normally rendered for you by
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-notification-host</code
      >
      when you call
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NxpNotificationService.open()</code
      >. The inputs below correspond to the second-argument options object on
      that call.
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
        Visual appearance / severity level. Drives the surface color, the
        default icon, and the
        <code>role</code>
        /
        <code>aria-live</code>
        ARIA hooks —
        <code>error</code>
        /
        <code>warning</code>
        interrupt assertively, everything else announces politely.
      </tr>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'s' | 'm' | 'l'"
        [items]="sizeOptions"
        [(value)]="size"
      >
        Size of the toast card. Controls padding, gap, icon size, and font
        scale.
      </tr>
      <tr nxpDocApiItem name="[label]" type="string" [(value)]="label">
        Optional bold title rendered above the message content. Accepts an
        <code>NxpDynamicContent</code>
        — a string,
        <code>TemplateRef</code
        >, or component class.
      </tr>
      <tr nxpDocApiItem name="[content]" type="string" [(value)]="content">
        Default message body content. Accepts an
        <code>NxpDynamicContent</code>
        — a string,
        <code>TemplateRef</code
        >, or component class. The call-site
        <code>open(message, …)</code>
        argument overrides this.
      </tr>
      <tr nxpDocApiItem name="[icon]" type="string" [(value)]="icon">
        Either a Remix Icon class name (e.g.
        <code>ri-info-line</code
        >) or a function that receives the appearance and returns a class name.
        Empty string falls back to the default icon for the current
        <code>appearance</code
        >.
      </tr>
      <tr nxpDocApiItem name="[closable]" type="boolean" [(value)]="closable">
        Whether to render a close (×) button on the toast.
      </tr>
      <tr nxpDocApiItem name="[autoClose]" type="number" [(value)]="autoClose">
        Auto-dismiss delay in milliseconds. Set to
        <code>false</code>
        to disable auto-dismissal — the toast stays until the user closes it or
        <code>NxpNotificationService.dismissAll()</code>
        is called.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-notification-host</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Stack container. Render once at the root of your app — it subscribes to
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NxpNotificationService</code
      >
      and positions / animates toasts as they come and go. No user-facing inputs
      of its own; configure defaults via
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxpNotificationOptionsProvider()</code
      >.
    </p>
  `,
})
export class AlertApiComponent {
  readonly appearance = model<Appearance>('info');
  readonly size = model<Size>('m');
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
}
