import {
  Directive,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';

export type NxpSwipeDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Reusable swipe-to-dismiss directive.
 *
 * Tracks pointer-based swiping on the host element, sets CSS custom properties
 * (`--swipe-amount-x`, `--swipe-amount-y`) and data attributes (`data-swiping`,
 * `data-swipe-out`, `data-swipe-direction`) for CSS-driven animations.
 *
 * Uses `setPointerCapture` for reliable tracking and implements Sonner's
 * dampening formula for resistance when swiping against valid directions.
 */
@Directive({
  selector: '[nxpSwipeDismiss]',
  standalone: true,
  exportAs: 'nxpSwipeDismiss',
})
export class NxpSwipeDismiss implements OnInit, OnDestroy {
  /** Allowed swipe directions. */
  readonly swipeDirections = input<NxpSwipeDirection[]>(['up', 'down']);

  /** Minimum distance in px to trigger dismiss. */
  readonly swipeThreshold = input(45);

  /** Minimum velocity (px/ms) to trigger dismiss. */
  readonly velocityThreshold = input(0.11);

  /** Emits the direction when the user swipes past threshold. */
  readonly swipeDismissed = output<NxpSwipeDirection>();

  private readonly el = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly zone = inject(NgZone);

  private startX = 0;
  private startY = 0;
  private startTime = 0;
  private lockedAxis: 'x' | 'y' | null = null;
  private swiping = false;

  // Bound handlers for cleanup
  private onPointerDownBound = this.onPointerDown.bind(this);
  private onPointerMoveBound = this.onPointerMove.bind(this);
  private onPointerUpBound = this.onPointerUp.bind(this);

  ngOnInit(): void {
    // Run outside zone for performance — pointer events fire frequently
    this.zone.runOutsideAngular(() => {
      this.el.addEventListener('pointerdown', this.onPointerDownBound);
    });
  }

  ngOnDestroy(): void {
    this.el.removeEventListener('pointerdown', this.onPointerDownBound);
    this.el.removeEventListener('pointermove', this.onPointerMoveBound);
    this.el.removeEventListener('pointerup', this.onPointerUpBound);
  }

  private onPointerDown(e: PointerEvent): void {
    if (e.button !== 0) return; // left button only

    // Don't capture pointer when user interacts with interactive elements
    // (buttons, links, inputs) — capturing would prevent their click events.
    const target = e.target as Element | null;
    if (target?.closest('button, a, input, select, textarea, [role="button"]')) {
      return;
    }

    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startTime = Date.now();
    this.lockedAxis = null;
    this.swiping = false;

    this.el.setPointerCapture(e.pointerId);
    this.el.addEventListener('pointermove', this.onPointerMoveBound);
    this.el.addEventListener('pointerup', this.onPointerUpBound);
  }

  private onPointerMove(e: PointerEvent): void {
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    // Lock axis after first meaningful movement (1px threshold)
    if (!this.lockedAxis) {
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        this.lockedAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      } else {
        return;
      }
    }

    const dirs = this.swipeDirections();
    let swipeX = 0;
    let swipeY = 0;

    if (this.lockedAxis === 'x') {
      const allowed =
        (dx < 0 && dirs.includes('left')) ||
        (dx > 0 && dirs.includes('right'));
      swipeX = allowed ? dx : dx * this.dampen(dx);
    } else {
      const allowed =
        (dy < 0 && dirs.includes('up')) ||
        (dy > 0 && dirs.includes('down'));
      swipeY = allowed ? dy : dy * this.dampen(dy);
    }

    this.swiping = true;
    this.el.style.setProperty('--swipe-amount-x', `${swipeX}px`);
    this.el.style.setProperty('--swipe-amount-y', `${swipeY}px`);
    this.el.setAttribute('data-swiping', 'true');
  }

  private onPointerUp(e: PointerEvent): void {
    this.el.removeEventListener('pointermove', this.onPointerMoveBound);
    this.el.removeEventListener('pointerup', this.onPointerUpBound);

    if (!this.swiping) {
      this.cleanup();
      return;
    }

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const elapsed = Date.now() - this.startTime || 1;
    const dirs = this.swipeDirections();
    const threshold = this.swipeThreshold();
    const velThreshold = this.velocityThreshold();

    let dismissed = false;
    let direction: NxpSwipeDirection | null = null;

    if (this.lockedAxis === 'x') {
      const vel = Math.abs(dx) / elapsed;
      if (dx < -threshold || (dx < 0 && vel > velThreshold)) {
        if (dirs.includes('left')) { direction = 'left'; dismissed = true; }
      } else if (dx > threshold || (dx > 0 && vel > velThreshold)) {
        if (dirs.includes('right')) { direction = 'right'; dismissed = true; }
      }
    } else {
      const vel = Math.abs(dy) / elapsed;
      if (dy < -threshold || (dy < 0 && vel > velThreshold)) {
        if (dirs.includes('up')) { direction = 'up'; dismissed = true; }
      } else if (dy > threshold || (dy > 0 && vel > velThreshold)) {
        if (dirs.includes('down')) { direction = 'down'; dismissed = true; }
      }
    }

    if (dismissed && direction) {
      this.el.setAttribute('data-swipe-out', 'true');
      this.el.setAttribute('data-swipe-direction', direction);
      this.zone.run(() => this.swipeDismissed.emit(direction as NxpSwipeDirection));
    } else {
      this.cleanup();
    }
  }

  /** Sonner-style dampening: resistance when swiping against allowed directions. */
  private dampen(delta: number): number {
    return 1 / (1.5 + Math.abs(delta) / 20);
  }

  private cleanup(): void {
    this.swiping = false;
    this.el.style.removeProperty('--swipe-amount-x');
    this.el.style.removeProperty('--swipe-amount-y');
    this.el.removeAttribute('data-swiping');
    this.el.removeAttribute('data-swipe-out');
    this.el.removeAttribute('data-swipe-direction');
  }
}
