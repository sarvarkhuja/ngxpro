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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EMPTY,
  fromEvent,
  of,
  repeat,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';
import { cx } from '../../../utils';
import { PolymorpheusOutlet } from '@taiga-ui/polymorpheus';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import type { NxpNotificationOptions } from './notification.options';
import { NxpNotificationService, type NxpNotificationState } from './notification.service';
import { NxpSwipeDismiss } from '../../../directives/swipe-dismiss.directive';

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

const appearanceHostClasses: Record<NxpNotificationOptions['appearance'], string> = {
  info: [
    'border-blue-200 bg-blue-50',
    'dark:border-blue-800 dark:bg-blue-950',
  ].join(' '),
  success: [
    'border-green-200 bg-green-50',
    'dark:border-green-800 dark:bg-green-950',
  ].join(' '),
  warning: [
    'border-amber-200 bg-amber-50',
    'dark:border-amber-800 dark:bg-amber-950',
  ].join(' '),
  error: [
    'border-red-200 bg-red-50',
    'dark:border-red-800 dark:bg-red-950',
  ].join(' '),
  neutral: [
    'border-gray-200 bg-white',
    'dark:border-gray-700 dark:bg-gray-900',
  ].join(' '),
};

const appearanceIconClasses: Record<NxpNotificationOptions['appearance'], string> = {
  info: 'text-blue-500 dark:text-blue-400',
  success: 'text-green-500 dark:text-green-400',
  warning: 'text-amber-500 dark:text-amber-400',
  error: 'text-red-500 dark:text-red-400',
  neutral: 'text-gray-500 dark:text-gray-400',
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
  standalone: true,
  imports: [PolymorpheusOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NxpSwipeDismiss,
      inputs: ['swipeDirections', 'swipeThreshold'],
      outputs: ['swipeDismissed'],
    },
  ],
  host: {
    'role': 'alert',
    'aria-live': 'polite',
    // Static attributes — set once, not re-evaluated on CD
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
        [class]="resolvedIcon() + ' ' + resolvedIconSize() + ' ' + iconClasses()"
        aria-hidden="true"
      ></i>
    }

    <!-- Text column -->
    <div class="flex-1 min-w-0">
      @if (label()) {
        <p [class]="labelClasses()">
          <ng-container *polymorpheusOutlet="label() as text">{{ text }}</ng-container>
        </p>
      }
      @if (content()) {
        <p [class]="contentClasses()">
          <ng-container *polymorpheusOutlet="content() as text">{{ text }}</ng-container>
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
  readonly label = input<PolymorpheusContent>('');
  readonly content = input<PolymorpheusContent>('');
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

  // ── Computed: icon resolution ─────────────────────────────────────────────

  readonly resolvedIcon = computed<string>(() => {
    const ic = this.icon();
    if (!ic) return ICON_MAP[this.appearance()] ?? '';
    if (typeof ic === 'function') return ic(this.appearance());
    return ic;
  });

  readonly resolvedIconSize = computed<string>(
    () => iconSizeMap[this.size()],
  );

  // ── Computed: classes ────────────────────────────────────────────────────────

  readonly hostClasses = computed(() =>
    cx(
      // layout
      'relative flex items-start rounded-lg border shadow-lg',
      // width to fill container
      'w-[var(--width,356px)]',
      // size
      sizeClasses[this.size()],
      // appearance
      appearanceHostClasses[this.appearance()],
    ),
  );

  readonly iconClasses = computed(() =>
    cx('shrink-0 mt-0.5', appearanceIconClasses[this.appearance()]),
  );

  readonly labelClasses = computed(() =>
    cx(
      'font-semibold leading-snug text-gray-900 dark:text-gray-50',
      this.size() === 's' && 'text-xs',
      this.size() === 'm' && 'text-sm',
      this.size() === 'l' && 'text-base',
    ),
  );

  readonly contentClasses = computed(() =>
    cx(
      'leading-snug text-gray-700 dark:text-gray-300',
      this.label() && 'mt-0.5',
      this.size() === 's' && 'text-xs',
      this.size() === 'm' && 'text-sm',
      this.size() === 'l' && 'text-base',
    ),
  );

  readonly closeClasses = computed(() =>
    cx(
      'shrink-0 -mt-0.5 -mr-1 inline-flex items-center justify-center rounded',
      'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300',
      'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500',
      'transition-colors',
      this.size() === 's' && 'h-4 w-4 text-xs',
      this.size() === 'm' && 'h-5 w-5 text-sm',
      this.size() === 'l' && 'h-6 w-6 text-base',
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

    // Wire swipe-dismiss to dismissed output
    const swipeDismiss = inject(NxpSwipeDismiss);
    swipeDismiss.swipeDismissed.subscribe(() => this.dismissed.emit());
  }

  // ── Auto-close (Taiga pattern: pause on mouseenter, resume on mouseleave) ───

  ngOnInit(): void {
    const el = this.el.nativeElement;

    of(this.autoClose())
      .pipe(
        switchMap((ms) => (ms ? timer(ms) : EMPTY)),
        takeUntil(fromEvent(el, 'mouseenter')),
        repeat({ delay: () => fromEvent(el, 'mouseleave') }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.dismissed.emit());
  }
}
