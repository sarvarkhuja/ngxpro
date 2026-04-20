import { InjectionToken } from '@angular/core';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';

export interface NxpNotificationOptions {
  /** Visual appearance / severity level. */
  appearance: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  /**
   * Icon to display.  Either a Remix Icon class name string (e.g. `ri-info-line`)
   * or a function that receives the appearance and returns a class name.
   */
  icon: string | ((appearance: string) => string);
  /** Size of the notification card. */
  size: 's' | 'm' | 'l';
  /**
   * Auto-dismiss delay in milliseconds.
   * Set to `false` to disable auto-dismissal.
   */
  autoClose: number | false;
  /** Whether to render a close (×) button. */
  closable: boolean;
  /** Optional bold title above the message content. */
  label: PolymorpheusContent;
  /** Default message body content (can be overridden at call-site). */
  content: PolymorpheusContent;
  /** Position of the notification stack on screen. */
  position:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
}

// ── Default icon map (Remix Icons) ──────────────────────────────────────────

const ICONS: Record<string, string> = {
  info: 'ri-information-line',
  success: 'ri-checkbox-circle-line',
  warning: 'ri-alert-line',
  error: 'ri-close-circle-line',
  neutral: 'ri-notification-line',
};

// ── Default options ──────────────────────────────────────────────────────────

export const NXP_NOTIFICATION_DEFAULT_OPTIONS: NxpNotificationOptions = {
  appearance: 'info',
  icon: (appearance: string) => ICONS[appearance] ?? '',
  size: 'm',
  autoClose: 5000,
  closable: true,
  label: '',
  content: '',
  position: 'top-right',
};

// ── InjectionToken ───────────────────────────────────────────────────────────

export const NXP_NOTIFICATION_OPTIONS =
  new InjectionToken<NxpNotificationOptions>('NXP_NOTIFICATION_OPTIONS', {
    factory: () => NXP_NOTIFICATION_DEFAULT_OPTIONS,
  });

// ── Provider helper ──────────────────────────────────────────────────────────

export function nxpNotificationOptionsProvider(
  options: Partial<NxpNotificationOptions>,
): { provide: typeof NXP_NOTIFICATION_OPTIONS; useValue: NxpNotificationOptions } {
  return {
    provide: NXP_NOTIFICATION_OPTIONS,
    useValue: { ...NXP_NOTIFICATION_DEFAULT_OPTIONS, ...options },
  };
}
