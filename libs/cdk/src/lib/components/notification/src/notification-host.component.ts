import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NxpNotificationComponent } from './notification.component';
import { NxpNotificationService, type NxpNotification } from './notification.service';
import type { NxpNotificationOptions } from './notification.options';
import { NXP_TOAST_GAP, NXP_VISIBLE_TOASTS } from '../../../constants/motion';

// ── Position parsing helpers ─────────────────────────────────────────────────

type YPosition = 'top' | 'bottom';
type XPosition = 'left' | 'right' | 'center';

function parseY(pos: NxpNotificationOptions['position']): YPosition {
  return pos.startsWith('bottom') ? 'bottom' : 'top';
}

function parseX(pos: NxpNotificationOptions['position']): XPosition {
  if (pos.endsWith('left')) return 'left';
  if (pos.endsWith('right')) return 'right';
  return 'center';
}

// ── Container position classes (Sonner-style fixed toaster) ─────────────────

function containerClasses(pos: NxpNotificationOptions['position']): string {
  const y = parseY(pos);
  const x = parseX(pos);

  const base = 'fixed z-[999999999] box-border p-0 m-0 list-none outline-none';
  const yClass = y === 'top' ? 'top-6' : 'bottom-6';

  let xClass: string;
  if (x === 'left') xClass = 'left-6';
  else if (x === 'right') xClass = 'right-6';
  else xClass = 'left-1/2 -translate-x-1/2';

  return `${base} ${yClass} ${xClass}`;
}

const ALL_POSITIONS = [
  'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center',
] as NxpNotificationOptions['position'][];

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
        <ol
          data-nxp-toaster
          [class]="containerClass(pos)"
          [attr.data-y-position]="yPosition(pos)"
          [attr.data-x-position]="xPosition(pos)"
          [attr.aria-label]="'Notifications ' + pos"
          [style.--width.px]="356"
          [style.--gap.px]="gap"
          [style.--front-toast-height]="frontHeight(pos)"
          [style.width.px]="356"
          (mouseenter)="service.expanded.set(true)"
          (mousemove)="service.expanded.set(true)"
          (mouseleave)="onMouseLeave()"
          (pointerdown)="interacting = true"
          (pointerup)="interacting = false"
        >
          @for (notification of group; track notification.id; let i = $index) {
            @let ctx = toastContext(group, i, pos);
            <nxp-notification
              [notificationId]="notification.id"
              [appearance]="notification.options.appearance"
              [label]="notification.options.label"
              [content]="notification.options.content"
              [icon]="notification.options.icon"
              [size]="notification.options.size"
              [closable]="notification.options.closable"
              [autoClose]="notification.options.autoClose"
              [toastIndex]="ctx.index"
              [toastsBefore]="ctx.toastsBefore"
              [isFront]="ctx.isFront"
              [isVisible]="ctx.isVisible"
              [expanded]="service.expanded()"
              [toastOffset]="ctx.offset"
              [yPosition]="ctx.yPosition"
              [xPosition]="ctx.xPosition"
              [notificationState]="notification.state"
              [swipeDirections]="ctx.swipeDirections"
              (dismissed)="notification.dismiss()"
              (heightMeasured)="onHeightMeasured(notification.id, $event)"
            />
          }
        </ol>
      }
    }
  `,
})
export class NxpNotificationHostComponent {
  protected readonly service = inject(NxpNotificationService);
  protected readonly gap = NXP_TOAST_GAP;
  protected interacting = false;

  /** All position keys — iterated in template. */
  protected readonly positions = ALL_POSITIONS;

  /** Tracked heights per notification id. */
  private readonly heights = signal<Map<string, number>>(new Map());

  /** Notifications grouped by position. */
  protected readonly byPosition = computed(() => {
    const map: Partial<Record<NxpNotificationOptions['position'], NxpNotification[]>> = {};
    for (const n of this.service.notifications()) {
      const pos = n.options.position;
      (map[pos] ??= []).push(n);
    }
    return map;
  });

  protected containerClass(pos: NxpNotificationOptions['position']): string {
    return containerClasses(pos);
  }

  protected yPosition(pos: NxpNotificationOptions['position']): YPosition {
    return parseY(pos);
  }

  protected xPosition(pos: NxpNotificationOptions['position']): XPosition {
    return parseX(pos);
  }

  /** Get front toast height CSS value for a position group. */
  protected frontHeight(pos: NxpNotificationOptions['position']): string {
    const group = this.byPosition()[pos];
    if (!group?.length) return 'auto';
    // Front toast = last in array (newest)
    const h = this.heights().get(group[group.length - 1].id);
    return h ? `${h}px` : 'auto';
  }

  /** Compute context values for a toast at index i in its position group. */
  protected toastContext(
    group: NxpNotification[],
    i: number,
    pos: NxpNotificationOptions['position'],
  ) {
    const total = group.length;
    // Sonner: index 0 = front (newest), but our array has newest last
    // So invert: invertedIndex 0 = front = last in array
    const invertedIndex = total - 1 - i;
    const isFront = invertedIndex === 0;
    const isVisible = invertedIndex < NXP_VISIBLE_TOASTS;

    const yPos = parseY(pos);
    const xPos = parseX(pos);

    // Calculate offset: sum of heights of toasts in front + gaps
    const heightMap = this.heights();
    let offset = 0;
    for (let j = i + 1; j < total; j++) {
      const h = heightMap.get(group[j].id) ?? 0;
      offset += h + NXP_TOAST_GAP;
    }

    // Swipe directions based on y-position
    const swipeDirections: ('left' | 'right' | 'up' | 'down')[] =
      yPos === 'bottom'
        ? ['down', 'left', 'right']
        : ['up', 'left', 'right'];

    return {
      index: invertedIndex,
      toastsBefore: invertedIndex,
      isFront,
      isVisible,
      yPosition: yPos,
      xPosition: xPos,
      offset,
      swipeDirections,
    };
  }

  /** Called when a notification measures its height. */
  protected onHeightMeasured(id: string, height: number): void {
    this.heights.update((map) => {
      const next = new Map(map);
      next.set(id, height);
      return next;
    });
  }

  /** Collapse stack unless user is actively swiping. */
  protected onMouseLeave(): void {
    if (!this.interacting) {
      this.service.expanded.set(false);
    }
  }
}
