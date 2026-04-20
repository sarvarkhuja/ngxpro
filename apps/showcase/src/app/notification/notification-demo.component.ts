import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
  type NxpNotificationOptions,
} from 'libs/cdk/src/lib/components/notification/src';

@Component({
  selector: 'app-notification-demo',
  standalone: true,
  imports: [RouterModule, TitleCasePipe, NxpNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Portal host — renders all active toasts -->
    <nxp-notification-host />

    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto space-y-10">

        <!-- Header -->
        <div>
          <a routerLink="/" class="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
            &larr; Back to home
          </a>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Notification / Toast</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Programmatic toast notifications with auto-close (pauses on hover), appearance
            variants, positions, sizes, and optional close button.
          </p>
        </div>

        <!-- ── Appearance variants ──────────────────────────────── -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Appearance Variants</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Each appearance maps to a distinct colour palette (border, background, icon).
          </p>
          <div class="flex flex-wrap gap-3">
            @for (app of appearances; track app) {
              <button
                type="button"
                (click)="showAppearance(app)"
                [class]="appearanceBtnClass(app)"
              >
                {{ app | titlecase }}
              </button>
            }
          </div>
        </section>

        <!-- ── With label ───────────────────────────────────────── -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">With Label (title)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Provide a <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">label</code>
            for a bold title above the message body.
          </p>
          <div class="flex flex-wrap gap-3">
            @for (app of appearances; track app) {
              <button
                type="button"
                (click)="showWithLabel(app)"
                [class]="appearanceBtnClass(app)"
              >
                {{ app | titlecase }} + label
              </button>
            }
          </div>
        </section>

        <!-- ── Sizes ─────────────────────────────────────────────── -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Sizes</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Three sizes: <code>s</code>, <code>m</code> (default), <code>l</code>.
          </p>
          <div class="flex flex-wrap gap-3">
            @for (sz of sizes; track sz) {
              <button
                type="button"
                (click)="showSize(sz)"
                class="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Size {{ sz }}
              </button>
            }
          </div>
        </section>

        <!-- ── Auto-close timing ─────────────────────────────────── -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Auto-close Timing</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Hover over a notification to pause the auto-close timer. It resumes on mouse-leave.
          </p>
          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              (click)="showAutoClose(2000)"
              class="px-4 py-2 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              2 seconds
            </button>
            <button
              type="button"
              (click)="showAutoClose(10000)"
              class="px-4 py-2 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              10 seconds
            </button>
            <button
              type="button"
              (click)="showAutoClose(false)"
              class="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              No auto-close
            </button>
          </div>
        </section>

        <!-- ── Non-closable ──────────────────────────────────────── -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Non-closable</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Setting <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">closable: false</code>
            hides the close button. The notification still auto-closes after 5 s.
          </p>
          <button
            type="button"
            (click)="showNonClosable()"
            class="px-4 py-2 rounded-md text-sm font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
          >
            Non-closable warning
          </button>
        </section>

        <!-- ── Positions ─────────────────────────────────────────── -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Positions</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Notifications can appear at any of the six edge/center positions.
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            @for (pos of positions; track pos) {
              <button
                type="button"
                (click)="showPosition(pos)"
                class="px-3 py-2 rounded-md text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
              >
                {{ pos }}
              </button>
            }
          </div>
        </section>

        <!-- ── Dismiss all ────────────────────────────────────────── -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Dismiss All</h2>
          <div class="flex gap-3">
            <button
              type="button"
              (click)="showMultiple()"
              class="px-4 py-2 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            >
              Show 4 notifications
            </button>
            <button
              type="button"
              (click)="dismissAll()"
              class="px-4 py-2 rounded-md text-sm font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              Dismiss all
            </button>
          </div>
        </section>

      </div>
    </div>
  `,
})
export class NotificationDemoComponent {
  protected readonly service = inject(NxpNotificationService);

  protected readonly appearances: NxpNotificationOptions['appearance'][] = [
    'info',
    'success',
    'warning',
    'error',
    'neutral',
  ];

  protected readonly sizes: NxpNotificationOptions['size'][] = ['s', 'm', 'l'];

  protected readonly positions: NxpNotificationOptions['position'][] = [
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center',
  ];

  // ── Action handlers ─────────────────────────────────────────────────────────

  showAppearance(appearance: NxpNotificationOptions['appearance']): void {
    this.service.open(`This is a ${appearance} notification.`, { appearance });
  }

  showWithLabel(appearance: NxpNotificationOptions['appearance']): void {
    const labelMap: Record<NxpNotificationOptions['appearance'], string> = {
      info: 'Did you know?',
      success: 'All done!',
      warning: 'Heads up',
      error: 'Something went wrong',
      neutral: 'FYI',
    };
    this.service.open(`This is the body of a ${appearance} notification.`, {
      appearance,
      label: labelMap[appearance],
    });
  }

  showSize(size: NxpNotificationOptions['size']): void {
    this.service.open(`Size "${size}" notification — notice the padding and text scale.`, {
      appearance: 'info',
      size,
      label: `Size: ${size}`,
    });
  }

  showAutoClose(autoClose: number | false): void {
    const msg =
      autoClose === false
        ? 'This notification will not auto-close. Dismiss it manually.'
        : `This notification closes in ${autoClose / 1000} s. Hover to pause.`;
    this.service.open(msg, {
      appearance: 'info',
      label: autoClose === false ? 'Persistent' : `Auto-close: ${autoClose / 1000}s`,
      autoClose,
    });
  }

  showNonClosable(): void {
    this.service.open('This notification has no close button. It auto-closes in 5 s.', {
      appearance: 'warning',
      label: 'Non-closable',
      closable: false,
    });
  }

  showPosition(position: NxpNotificationOptions['position']): void {
    this.service.open(`Positioned at: ${position}`, {
      appearance: 'success',
      label: position,
      position,
    });
  }

  showMultiple(): void {
    this.service.open('First notification', { appearance: 'info', label: 'Info' });
    this.service.open('Second notification', { appearance: 'success', label: 'Success' });
    this.service.open('Third notification', { appearance: 'warning', label: 'Warning' });
    this.service.open('Fourth notification', { appearance: 'error', label: 'Error' });
  }

  dismissAll(): void {
    this.service.dismissAll();
  }

  // ── Button class helper ──────────────────────────────────────────────────────

  appearanceBtnClass(appearance: NxpNotificationOptions['appearance']): string {
    const map: Record<NxpNotificationOptions['appearance'], string> = {
      info: 'px-4 py-2 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors',
      success: 'px-4 py-2 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-colors',
      warning: 'px-4 py-2 rounded-md text-sm font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors',
      error: 'px-4 py-2 rounded-md text-sm font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition-colors',
      neutral: 'px-4 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors',
    };
    return map[appearance];
  }
}
