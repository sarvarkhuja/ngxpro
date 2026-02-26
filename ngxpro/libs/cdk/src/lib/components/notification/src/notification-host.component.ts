import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { NxpNotificationComponent } from './notification.component';
import { NxpNotificationService, type NxpNotification } from './notification.service';
import type { NxpNotificationOptions } from './notification.options';

// ── Position → Tailwind class map ─────────────────────────────────────────────

const positionClasses: Record<NxpNotificationOptions['position'], string> = {
  'top-right': 'fixed top-4 right-4 z-50 flex flex-col gap-2',
  'top-left': 'fixed top-4 left-4 z-50 flex flex-col gap-2',
  'bottom-right': 'fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2',
  'bottom-left': 'fixed bottom-4 left-4 z-50 flex flex-col-reverse gap-2',
  'top-center':
    'fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2',
  'bottom-center':
    'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2',
};

const ALL_POSITIONS = Object.keys(positionClasses) as NxpNotificationOptions['position'][];

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'nxp-notification-host',
  standalone: true,
  imports: [NxpNotificationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (pos of positions; track pos) {
      @let group = byPosition()[pos];
      @if (group && group.length > 0) {
        <div [class]="posClass(pos)" [attr.aria-label]="'Notifications ' + pos">
          @for (notification of group; track notification.id) {
            <nxp-notification
              [appearance]="notification.options.appearance"
              [label]="notification.options.label"
              [content]="notification.options.content"
              [icon]="notification.options.icon"
              [size]="notification.options.size"
              [closable]="notification.options.closable"
              [autoClose]="notification.options.autoClose"
              (dismissed)="notification.dismiss()"
            />
          }
        </div>
      }
    }
  `,
})
export class NxpNotificationHostComponent {
  protected readonly service = inject(NxpNotificationService);

  /** All position keys — iterated in template. */
  protected readonly positions = ALL_POSITIONS;

  /** Notifications grouped by position. */
  protected readonly byPosition = computed(() => {
    const map: Partial<Record<NxpNotificationOptions['position'], NxpNotification[]>> = {};
    for (const n of this.service.notifications()) {
      const pos = n.options.position;
      (map[pos] ??= []).push(n);
    }
    return map;
  });

  /** Resolve position class string (pure helper for template). */
  protected posClass(pos: NxpNotificationOptions['position']): string {
    return positionClasses[pos];
  }
}
