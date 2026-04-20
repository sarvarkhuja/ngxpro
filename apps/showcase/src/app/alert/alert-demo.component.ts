import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
  type NxpNotificationOptions,
} from 'libs/cdk/src/lib/components/notification/src';

@Component({
  selector: 'app-alert-demo',
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
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Alert Portal</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Sonner-style toast alerts with slide-in/out, compressed stack, hover-expand, swipe-to-dismiss.
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

        <!-- ── Positions ─────────────────────────────────────────── -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Positions</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Alerts can appear at any of the six edge/center positions.
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

        <!-- ── Stack demo ────────────────────────────────────────── -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Stack (Sonner-style)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Rapidly open multiple alerts — they compress into a stack.
            Hover to expand, swipe or click close to dismiss.
          </p>
          <div class="flex gap-3">
            <button
              type="button"
              (click)="showStack()"
              class="px-4 py-2 rounded-md text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            >
              Stack 5 alerts
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

        <!-- ── Auto-close timing ─────────────────────────────────── -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Auto-close Timing</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Hover over an alert to pause the auto-close timer. It resumes on mouse-leave.
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

      </div>
    </div>
  `,
})
export class AlertDemoComponent {
  protected readonly service = inject(NxpNotificationService);
  private counter = 0;

  protected readonly appearances: NxpNotificationOptions['appearance'][] = [
    'info', 'success', 'warning', 'error', 'neutral',
  ];

  protected readonly positions: NxpNotificationOptions['position'][] = [
    'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center',
  ];

  showAppearance(appearance: NxpNotificationOptions['appearance']): void {
    this.counter++;
    const labelMap: Record<NxpNotificationOptions['appearance'], string> = {
      info: 'Information',
      success: 'All done!',
      warning: 'Heads up',
      error: 'Something went wrong',
      neutral: 'Notice',
    };
    this.service.open(`Alert #${this.counter} — this is a ${appearance} alert.`, {
      appearance,
      label: labelMap[appearance],
    });
  }

  showPosition(position: NxpNotificationOptions['position']): void {
    this.counter++;
    this.service.open(`Alert #${this.counter} at ${position}`, {
      appearance: 'info',
      label: position,
      position,
    });
  }

  showStack(): void {
    const appearances = ['info', 'success', 'warning', 'error', 'neutral'] as const;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.counter++;
        this.service.open(`Stack item #${this.counter} — hover to expand`, {
          appearance: appearances[i],
          label: `Alert ${i + 1}`,
          autoClose: 10000,
        });
      }, i * 150);
    }
  }

  showAutoClose(autoClose: number | false): void {
    this.counter++;
    const msg = autoClose === false
      ? 'This alert will not auto-close. Dismiss it manually.'
      : `This alert closes in ${autoClose / 1000}s. Hover to pause.`;
    this.service.open(msg, {
      appearance: 'info',
      label: autoClose === false ? 'Persistent' : `Auto-close: ${autoClose / 1000}s`,
      autoClose,
    });
  }

  dismissAll(): void {
    this.service.dismissAll();
  }

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
