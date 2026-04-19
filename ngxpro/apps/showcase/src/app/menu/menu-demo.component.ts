import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpDropdown } from '@nxp/cdk';
import { NxpMenu } from '@nxp/components/menu';

@Component({
  selector: 'app-menu-demo',
  standalone: true,
  imports: [RouterModule, ...NxpDropdown, ...NxpMenu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-3xl mx-auto space-y-10">
        <div>
          <a
            routerLink="/"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            &larr; Back to home
          </a>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Menu</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Animated menu surface with proximity-hover tracking. Three layered
            indicators (selected, hover, focus ring) animate over menu items
            using the shared
            <code class="font-mono text-xs">NxpAnimatedProximityBase</code>
            from <code class="font-mono text-xs">&#64;nxp/cdk</code>.
          </p>
        </div>

        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Inside a dropdown
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Click the trigger to open; use arrow keys to move focus and notice
              the blue focus ring.
            </p>
          </header>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            [nxpDropdown]="panel"
            nxpDropdownAuto
          >
            Open menu
            <span
              class="inline-flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300"
            >
              {{ labels[selected() ?? 0] }}
            </span>
          </button>

          <ng-template #panel>
            <nxp-menu
              class="w-56"
              [checkedIndex]="selected()"
              (checkedIndexChange)="selected.set($event)"
            >
              @for (label of labels; track label; let i = $index) {
                <button nxpMenuItem>{{ label }}</button>
              }
            </nxp-menu>
          </ng-template>
        </section>

        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Standalone
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Rendered directly in the page — hover items to see the proximity
              tracking, and click to change the selected row.
            </p>
          </header>

          <nxp-menu
            class="w-72"
            [checkedIndex]="inlineSelected()"
            (checkedIndexChange)="inlineSelected.set($event)"
          >
            @for (label of inlineLabels; track label) {
              <button nxpMenuItem>{{ label }}</button>
            }
          </nxp-menu>

          <p class="text-xs text-gray-500 dark:text-gray-400">
            Selected: <strong>{{ inlineLabels[inlineSelected() ?? 0] }}</strong>
          </p>
        </section>
      </div>
    </div>
  `,
})
export class MenuDemoComponent {
  readonly labels = ['Profile', 'Billing', 'Team', 'Sign out'];
  readonly inlineLabels = [
    'Overview',
    'Analytics',
    'Reports',
    'Notifications',
    'Integrations',
  ];

  readonly selected = signal<number | null>(0);
  readonly inlineSelected = signal<number | null>(1);
}
