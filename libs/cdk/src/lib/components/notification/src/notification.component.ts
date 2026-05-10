import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  outputToObservable,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';
import {
  EMPTY,
  fromEvent,
  merge,
  of,
  repeat,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';
import { cx } from '@ngxpro/cdk';
import { NxpDynamicOutlet } from '@ngxpro/cdk/dynamic';
import type { NxpDynamicContent } from '@ngxpro/cdk/dynamic';
import type { NxpNotificationOptions } from './notification.options';
import {
  NxpNotificationService,
  type NxpNotificationState,
} from './notification.service';
import { NxpSwipeDismiss } from '@ngxpro/cdk';

// ── Size helpers ─────────────────────────────────────────────────────────────

const sizeClasses: Record<NxpNotificationOptions['size'], string> = {
  s: 'p-3 gap-2 text-xs min-w-[280px] max-w-xs',
  m: 'p-4 gap-3 text-sm min-w-[320px] max-w-sm',
  l: 'p-5 gap-3 text-base min-w-[360px] max-w-md',
};

const iconSizeMap: Record<NxpNotificationOptions['size'], string> = {
  s: 'text-base',
  m: 'text-xl',
  l: 'text-2xl',
};

// ── Appearance color helpers ──────────────────────────────────────────────────

const appearanceHostClasses: Record<
  NxpNotificationOptions['appearance'],
  string
> = {
  info: 'border-status-info/30 bg-status-info-pale',
  success: 'border-status-positive/30 bg-status-positive-pale',
  warning: 'border-status-warning/30 bg-status-warning-pale',
  error: 'border-status-negative/30 bg-status-negative-pale',
  neutral: 'border-border-normal bg-bg-base',
};

const appearanceIconClasses: Record<
  NxpNotificationOptions['appearance'],
  string
> = {
  info: 'text-status-info',
  success: 'text-status-positive',
  warning: 'text-status-warning',
  error: 'text-status-negative',
  neutral: 'text-text-tertiary',
};

const ICON_MAP: Record<string, string> = {
  info: 'ri-information-line',
  success: 'ri-checkbox-circle-line',
  warning: 'ri-alert-line',
  error: 'ri-close-circle-line',
  neutral: 'ri-notification-line',
};

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'nxp-notification',
  imports: [NxpDynamicOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NxpSwipeDismiss,
      inputs: ['swipeDirections', 'swipeThreshold'],
      outputs: ['swipeDismissed'],
    },
  ],
  host: {
    // role/aria-live differ by appearance: error/warning interrupt assertively,
    // routine info/success/neutral toasts announce politely.
    '[attr.role]': 'ariaRole()',
    '[attr.aria-live]': 'ariaLive()',
    'data-nxp-toast': '',
    'data-swipe-out': 'false',
    '[class]': 'hostClasses()',
    // Sonner data attributes — drive CSS animations
    '[attr.data-mounted]': 'isMountedOrRemoving()',
    '[attr.data-removed]': 'notificationState() === "removing"',
    '[attr.data-front]': 'isFront()',
    '[attr.data-visible]': 'isVisible()',
    '[attr.data-expanded]': 'expanded()',
    '[attr.data-y-position]': 'yPosition()',
    '[attr.data-x-position]': 'xPosition()',
    '[attr.data-index]': 'toastIndex()',
    // CSS custom properties — drive layout calculations
    '[style.--index]': 'toastIndex()',
    '[style.--toasts-before]': 'toastsBefore()',
    '[style.--z-index]': '1000 - toastIndex()',
    '[style.z-index]': '1000 - toastIndex()',
    '[style.--offset]': 'toastOffset() + "px"',
    '[style.--initial-height]': 'initialHeight + "px"',
  },
  template: `
    <!-- Icon column -->
    @if (resolvedIcon()) {
      <i
        [class]="
          resolvedIcon() + ' ' + resolvedIconSize() + ' ' + iconClasses()
        "
        aria-hidden="true"
      ></i>
    }

    <!-- Text column -->
    <div class="flex-1 min-w-0">
      @if (label()) {
        <p [class]="labelClasses()">
          <ng-container *nxpDynamicOutlet="label() as text">{{
            text
          }}</ng-container>
        </p>
      }
      @if (content()) {
        <p [class]="contentClasses()">
          <ng-container *nxpDynamicOutlet="content() as text">{{
            text
          }}</ng-container>
        </p>
      }
    </div>

    <!-- Close button -->
    @if (closable()) {
      <button
        type="button"
        (click)="dismissed.emit()"
        aria-label="Dismiss notification"
        [class]="closeClasses()"
      >
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
    }
  `,
})
export class NxpNotificationComponent implements OnInit {
  // ── Inputs ──────────────────────────────────────────────────────────────────

  readonly appearance = input<NxpNotificationOptions['appearance']>('info');
  readonly label = input<NxpDynamicContent>('');
  readonly content = input<NxpDynamicContent>('');
  readonly icon = input<string | ((appearance: string) => string)>('');
  readonly size = input<NxpNotificationOptions['size']>('m');
  readonly closable = input<boolean>(true);
  readonly autoClose = input<number | false>(5000);

  // ── Stack context inputs (from host) ──────────────────────────────────────

  readonly toastIndex = input(0);
  readonly toastsBefore = input(0);
  readonly isFront = input(true);
  readonly isVisible = input(true);
  readonly expanded = input(false);
  readonly toastOffset = input(0);
  readonly yPosition = input<'top' | 'bottom'>('top');
  readonly xPosition = input<'left' | 'right' | 'center'>('right');
  readonly notificationState = input<NxpNotificationState>('mounting');
  readonly notificationId = input('');

  // ── Outputs ─────────────────────────────────────────────────────────────────

  readonly dismissed = output<void>();
  readonly heightMeasured = output<number>();

  // ── Infrastructure ───────────────────────────────────────────────────────────

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NxpNotificationService);

  /** Measured height (set after first render). */
  initialHeight = 0;

  // ── Computed helpers ──────────────────────────────────────────────────────

  /** data-mounted is true once mounted OR when removing (so exit animation works). */
  readonly isMountedOrRemoving = computed(() => {
    const state = this.notificationState();
    return state === 'mounted' || state === 'removing';
  });

  /** error/warning are alerts; everything else is a polite status. */
  readonly ariaRole = computed(() => {
    const a = this.appearance();
    return a === 'error' || a === 'warning' ? 'alert' : 'status';
  });

  readonly ariaLive = computed(() => {
    const a = this.appearance();
    return a === 'error' || a === 'warning' ? 'assertive' : 'polite';
  });

  // ── Computed: icon resolution ─────────────────────────────────────────────

  readonly resolvedIcon = computed<string>(() => {
    const ic = this.icon();
    if (!ic) return ICON_MAP[this.appearance()] ?? '';
    if (typeof ic === 'function') return ic(this.appearance());
    return ic;
  });

  readonly resolvedIconSize = computed<string>(() => iconSizeMap[this.size()]);

  // ── Computed: classes ────────────────────────────────────────────────────────

  readonly hostClasses = computed(() =>
    cx(
      'relative flex items-start rounded-m border shadow-lg',
      'w-[var(--width,356px)]',
      sizeClasses[this.size()],
      appearanceHostClasses[this.appearance()],
    ),
  );

  readonly iconClasses = computed(() =>
    cx('shrink-0 mt-0.5', appearanceIconClasses[this.appearance()]),
  );

  readonly labelClasses = computed(() =>
    cx(
      'font-semibold leading-snug text-text-primary',
      this.size() === 's' && 'text-xs',
      this.size() === 'm' && 'text-sm',
      this.size() === 'l' && 'text-base',
    ),
  );

  readonly contentClasses = computed(() =>
    cx(
      'leading-snug text-text-secondary',
      this.label() && 'mt-0.5',
      this.size() === 's' && 'text-xs',
      this.size() === 'm' && 'text-sm',
      this.size() === 'l' && 'text-base',
    ),
  );

  readonly closeClasses = computed(() =>
    cx(
      'shrink-0 -mt-0.5 -mr-1 inline-flex items-center justify-center rounded-xs',
      // WCAG 2.5.8: 24×24 minimum hit target across all sizes; icon font-size still scales.
      'min-h-6 min-w-6',
      'text-text-tertiary hover:text-text-primary',
      'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus',
      'transition-colors',
      this.size() === 's' && 'text-xs',
      this.size() === 'm' && 'text-sm',
      this.size() === 'l' && 'text-base',
    ),
  );

  constructor() {
    // Measure height after first render, emit to host, and mark as mounted
    afterNextRender(() => {
      const rect = this.el.nativeElement.getBoundingClientRect();
      this.initialHeight = rect.height;
      this.heightMeasured.emit(rect.height);
      // Mark as mounted to trigger enter animation
      const id = this.notificationId();
      if (id) {
        this.notificationService.setMounted(id);
      }
    });

    // Wire swipe-dismiss to dismissed output. `swipeDismissed` is an
    // `OutputEmitterRef`; convert to Observable so we can compose teardown.
    const swipeDismiss = inject(NxpSwipeDismiss);
    outputToObservable(swipeDismiss.swipeDismissed)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.dismissed.emit());
  }

  // ── Auto-close: pause when toast has focus (keyboard) or pointer hover ──

  ngOnInit(): void {
    const el = this.el.nativeElement;
    const pause$ = merge(fromEvent(el, 'mouseenter'), fromEvent(el, 'focusin'));
    const resume$ = merge(
      fromEvent(el, 'mouseleave'),
      fromEvent(el, 'focusout'),
    );

    of(this.autoClose())
      .pipe(
        switchMap((ms) => (ms ? timer(ms) : EMPTY)),
        takeUntil(pause$),
        repeat({ delay: () => resume$ }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.dismissed.emit());
  }
}
