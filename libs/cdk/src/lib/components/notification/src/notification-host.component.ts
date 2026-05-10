import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NxpNotificationComponent } from './notification.component';
import {
  NxpNotificationService,
  type NxpNotification,
} from './notification.service';
import type { NxpNotificationOptions } from './notification.options';
import { NXP_TOAST_GAP } from '@ngxpro/cdk';
import { NXP_VISIBLE_TOASTS } from '@ngxpro/cdk';

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

  // z-[100] sits above page-level popups (z-50) without the magic-number tax
  // of z-[999999999]. Coordinate with dropdown/modal layers if those ever get
  // tokenized.
  const base = 'fixed z-[100] box-border p-0 m-0 list-none outline-none';
  const yClass = y === 'top' ? 'top-6' : 'bottom-6';

  let xClass: string;
  if (x === 'left') xClass = 'left-6';
  else if (x === 'right') xClass = 'right-6';
  else xClass = 'left-1/2 -translate-x-1/2';

  return `${base} ${yClass} ${xClass}`;
}

const ALL_POSITIONS = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
  'top-center',
  'bottom-center',
] as NxpNotificationOptions['position'][];

// Position parsing is pure and static — precompute once instead of recomputing
// per-CD via template-bound methods.
type PositionInfo = {
  readonly containerClass: string;
  readonly yPos: YPosition;
  readonly xPos: XPosition;
  readonly ariaLabel: string;
};

const POSITION_LABELS: Record<NxpNotificationOptions['position'], string> = {
  'top-right': 'top right',
  'top-left': 'top left',
  'top-center': 'top center',
  'bottom-right': 'bottom right',
  'bottom-left': 'bottom left',
  'bottom-center': 'bottom center',
};

const POSITION_INFO = ALL_POSITIONS.reduce(
  (acc, pos) => {
    acc[pos] = {
      containerClass: containerClasses(pos),
      yPos: parseY(pos),
      xPos: parseX(pos),
      ariaLabel: `Notifications, ${POSITION_LABELS[pos]}`,
    };
    return acc;
  },
  {} as Record<NxpNotificationOptions['position'], PositionInfo>,
);

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'nxp-notification-host',
  imports: [NxpNotificationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (pos of positions; track pos) {
      @let group = byPosition()[pos];
      @let info = positionInfo[pos];
      @if (group && group.length > 0) {
        <ol
          data-nxp-toaster
          role="region"
          aria-live="polite"
          [class]="info.containerClass"
          [attr.data-y-position]="info.yPos"
          [attr.data-x-position]="info.xPos"
          [attr.aria-label]="info.ariaLabel"
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

  /** Static position metadata (container class, axis labels, aria label). */
  protected readonly positionInfo = POSITION_INFO;

  /** Tracked heights per notification id. */
  private readonly heights = signal<Map<string, number>>(new Map());

  /** Notifications grouped by position. */
  protected readonly byPosition = computed(() => {
    const map: Partial<
      Record<NxpNotificationOptions['position'], NxpNotification[]>
    > = {};
    for (const n of this.service.notifications()) {
      const pos = n.options.position;
      (map[pos] ??= []).push(n);
    }
    return map;
  });

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
      yPos === 'bottom' ? ['down', 'left', 'right'] : ['up', 'left', 'right'];

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
