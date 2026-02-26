import {
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
import { cx } from '@nxp/cdk';
import { NxpIconComponent } from '@nxp/cdk/components/icon';
import { PolymorpheusOutlet } from '@taiga-ui/polymorpheus';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import type { NxpNotificationOptions } from './notification.options';
import type { NxpIconOptions } from '@nxp/cdk/components/icon';

// ── Size helpers ─────────────────────────────────────────────────────────────

const sizeClasses: Record<NxpNotificationOptions['size'], string> = {
  s: 'p-3 gap-2 text-xs min-w-[280px] max-w-xs',
  m: 'p-4 gap-3 text-sm min-w-[320px] max-w-sm',
  l: 'p-5 gap-3 text-base min-w-[360px] max-w-md',
};

const iconSizeMap: Record<NxpNotificationOptions['size'], NxpIconOptions['size']> = {
  s: 'sm',
  m: 'md',
  l: 'lg',
};

// ── Appearance color helpers (Tailwind data-attribute selectors) ──────────────
// Applied on the host so every child can inherit focus/border colouring.

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
  imports: [NxpIconComponent, PolymorpheusOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'alert',
    'aria-live': 'polite',
    '[class]': 'hostClasses()',
  },
  template: `
    <!-- Icon column -->
    @if (resolvedIcon()) {
      <nxp-icon
        [icon]="resolvedIcon()"
        [size]="resolvedIconSize()"
        [class]="iconClasses()"
        aria-hidden="true"
      />
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

  // ── Outputs ─────────────────────────────────────────────────────────────────

  readonly dismissed = output<void>();

  // ── Infrastructure ───────────────────────────────────────────────────────────

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  // ── Computed: icon resolution ─────────────────────────────────────────────

  readonly resolvedIcon = computed<string>(() => {
    const ic = this.icon();
    if (!ic) return ICON_MAP[this.appearance()] ?? '';
    if (typeof ic === 'function') return ic(this.appearance());
    return ic;
  });

  readonly resolvedIconSize = computed<NxpIconOptions['size']>(
    () => iconSizeMap[this.size()],
  );

  // ── Computed: classes ────────────────────────────────────────────────────────

  readonly hostClasses = computed(() =>
    cx(
      // layout
      'relative flex items-start rounded-lg border shadow-lg',
      // transitions
      'transition-all duration-200',
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
