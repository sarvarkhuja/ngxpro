import { inject, Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import {
  NXP_NOTIFICATION_OPTIONS,
  type NxpNotificationOptions,
} from './notification.options';
import { NXP_TIME_BEFORE_UNMOUNT } from '../../../constants/motion';

// ── Notification state ──────────────────────────────────────────────────────

export type NxpNotificationState = 'mounting' | 'mounted' | 'removing';

// ── Notification item shape ──────────────────────────────────────────────────

export interface NxpNotification<T = unknown> {
  /** Unique identifier for this notification. */
  readonly id: string;
  /** Resolved options (merged with defaults). */
  readonly options: NxpNotificationOptions & { data?: T; content: PolymorpheusContent };
  /** Call this to programmatically dismiss the notification. */
  readonly dismiss: () => void;
  /** Animation lifecycle state. */
  readonly state: NxpNotificationState;
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class NxpNotificationService {
  private readonly defaultOptions = inject(NXP_NOTIFICATION_OPTIONS);
  private _counter = 0;

  /** Live list of active notifications (signal). */
  readonly notifications = signal<NxpNotification[]>([]);

  /** Whether the notification stack is expanded (e.g. on hover). */
  readonly expanded = signal(false);

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
      state: 'mounting',
    };

    this.notifications.update((list) => [...list, notification]);

    // Return observable that completes when dismissed.
    subject$.subscribe({ complete: () => this.dismiss(id) });
    return subject$.asObservable();
  }

  /** Mark a notification as mounted (enter animation complete). */
  setMounted(id: string): void {
    this.notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, state: 'mounted' as const } : n)),
    );
  }

  /** Dismiss a single notification by id with exit animation delay. */
  dismiss(id: string): void {
    const list = this.notifications();
    const target = list.find((n) => n.id === id);

    if (!target || target.state === 'removing') return;

    // Set state to 'removing' to trigger exit animation
    this.notifications.update((l) =>
      l.map((n) => (n.id === id ? { ...n, state: 'removing' as const } : n)),
    );

    // After exit animation duration, actually remove from list
    setTimeout(() => {
      this.notifications.update((l) => l.filter((n) => n.id !== id));
    }, NXP_TIME_BEFORE_UNMOUNT);
  }

  /** Dismiss all active notifications. */
  dismissAll(): void {
    this.notifications.set([]);
  }
}
