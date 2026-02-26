import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import type { NxpPositionOptions } from '@nxp/cdk';
import { AlertPushService } from './alert-push.service';

@Component({
  selector: 'app-alert-demo',
  standalone: true,
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto space-y-10">
        <!-- Header -->
        <div>
          <a
            routerLink="/"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            &larr; Back to home
          </a>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Alert Portal
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Portal-based alerts with concurrency limit (3) and queue.
            Uses <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">NxpAlertService</code>,
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">NxpAlertDirective</code>,
            and <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">NxpPositionOptions</code>.
          </p>
        </div>

        <!-- Position: block + inline -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Positions
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Alerts stack with concurrency 3. Extra alerts wait in queue.
          </p>
          <div class="flex flex-wrap gap-3">
            @for (pos of positions; track pos.key) {
              <button
                type="button"
                (click)="showAt(pos)"
                class="px-4 py-2 rounded-md text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
              >
                {{ pos.label }}
              </button>
            }
          </div>
        </section>

        <!-- Queue demo -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Queue (concurrency 3)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Rapidly open 6 alerts — only 3 show at once; the rest queue and appear as others close.
          </p>
          <button
            type="button"
            (click)="showMany()"
            class="px-4 py-2 rounded-md text-sm font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
          >
            Show 6 alerts
          </button>
        </section>

        <!-- Simple message -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Simple message
          </h2>
          <button
            type="button"
            (click)="showSimple()"
            class="px-4 py-2 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
          >
            Show alert
          </button>
        </section>
      </div>
    </div>
  `,
})
export class AlertDemoComponent {
  protected readonly service = inject(AlertPushService);

  protected readonly positions: { key: Partial<NxpPositionOptions>; label: string }[] = [
    { key: { block: 'start', inline: 'end' }, label: 'Top right' },
    { key: { block: 'start', inline: 'start' }, label: 'Top left' },
    { key: { block: 'start', inline: 'center' }, label: 'Top center' },
    { key: { block: 'end', inline: 'end' }, label: 'Bottom right' },
    { key: { block: 'end', inline: 'start' }, label: 'Bottom left' },
    { key: { block: 'end', inline: 'center' }, label: 'Bottom center' },
  ];

  showAt(pos: { key: Partial<NxpPositionOptions>; label: string }): void {
    this.service
      .open(`Alert at ${pos.label}`, pos.key)
      .subscribe();
  }

  showMany(): void {
    for (let i = 1; i <= 6; i++) {
      this.service
        .open(`Alert #${i} — closes in a few seconds`, {
          block: 'start',
          inline: 'end',
        })
        .subscribe();
    }
  }

  showSimple(): void {
    this.service.open('Hello from the alert portal!').subscribe();
  }
}
