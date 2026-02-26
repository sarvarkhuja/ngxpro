import { inject, Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import {
  NXP_NOTIFICATION_OPTIONS,
  type NxpNotificationOptions,
} from './notification.options';

// ── Notification item shape ──────────────────────────────────────────────────

export interface NxpNotification<T = unknown> {
  /** Unique identifier for this notification. */
  id: string;
  /** Resolved options (merged with defaults). */
  options: NxpNotificationOptions & { data?: T; content: PolymorpheusContent };
  /** Call this to programmatically dismiss the notification. */
  dismiss: () => void;
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class NxpNotificationService {
  private readonly defaultOptions = inject(NXP_NOTIFICATION_OPTIONS);
  private _counter = 0;

  /** Live list of active notifications (signal). */
  readonly notifications = signal<NxpNotification[]>([]);

  /**
   * Shows a notification.
   *
   * @param content  The message body text.
   * @param options  Partial options that override the injected defaults.
   * @returns        An Observable that completes when the notification is dismissed.
   */
  open<T = unknown>(
    content: PolymorpheusContent,
    options?: Partial<NxpNotificationOptions & { data?: T }>,
  ): Observable<void> {
    const id = `nxp-notif-${++this._counter}`;
    const resolved: NxpNotificationOptions & { data?: T; content: PolymorpheusContent } = {
      ...this.defaultOptions,
      ...options,
      content,
    };

    const subject$ = new Subject<void>();

    const notification: NxpNotification<T> = {
      id,
      options: resolved,
      dismiss: () => this.dismiss(id),
    };

    this.notifications.update((list) => [...list, notification]);

    // Return observable that completes when dismissed.
    subject$.subscribe({ complete: () => this.dismiss(id) });
    return subject$.asObservable();
  }

  /** Dismiss a single notification by id. */
  dismiss(id: string): void {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }

  /** Dismiss all active notifications. */
  dismissAll(): void {
    this.notifications.set([]);
  }
}
