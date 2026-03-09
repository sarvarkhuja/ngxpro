import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpIconComponent } from '@nxp/cdk/components/icon';
import { NxpTabs, NxpTabsSize } from '@nxp/components/tabs';

@Component({
  selector: 'app-tabs-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, NxpTabs, NxpIconComponent],
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-3xl mx-auto">
        <!-- Back link -->
        <a
          routerLink="/"
          class="inline-flex items-center gap-1 mb-6 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Back to showcase
        </a>

        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tabs
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-10">
          Horizontal and vertical tab containers with an animated underline
          indicator. Use
          <code
            class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
            >[(activeItemIndex)]</code
          >
          for two-way binding on the active tab. Keyboard navigation (arrow
          keys) is supported.
        </p>

        <!-- Horizontal tabs  with underline -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Horizontal (default)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Horizontal tabs with animated underline indicator. Tab panels shown
            below.
          </p>
          <pre>{{ horizontalTab() | json }}</pre>
          <nxp-tabs
            [activeItemIndex]="horizontalTab()"
            (activeItemIndexChange)="horizontalTab.set($event)"
          >
            <button nxpTab class="px-4 py-3">Overview</button>
            <button nxpTab class="px-4 py-3">Analytics</button>
            <button nxpTab class="px-4 py-3">Settings</button>
          </nxp-tabs>
          <div
            class="mt-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300"
          >
            @switch (horizontalTab()) {
              @case (0) {
                <p>
                  <strong>Overview</strong> — Summary of your dashboard metrics
                  and recent activity.
                </p>
              }
              @case (1) {
                <p>
                  <strong>Analytics</strong> — Charts, trends, and data
                  visualizations.
                </p>
              }
              @case (2) {
                <p>
                  <strong>Settings</strong> — Configure your account and
                  preferences.
                </p>
              }
            }
          </div>
        </section>

        <!-- Horizontal without underline -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Without underline
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Set
            <code
              class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >[underline]="false"</code
            >
            to hide the animated indicator.
          </p>
          <nxp-tabs
            [underline]="false"
            [activeItemIndex]="plainTab()"
            (activeItemIndexChange)="plainTab.set($event)"
          >
            <button nxpTab class="px-4 py-3">Tab A</button>
            <button nxpTab class="px-4 py-3">Tab B</button>
            <button nxpTab class="px-4 py-3">Tab C</button>
          </nxp-tabs>
        </section>

        <!-- Size variants -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Sizes
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Three size variants: sm, md (default), lg.
          </p>
          <div class="space-y-6">
            @for (s of sizes; track s) {
              <div>
                <p
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2"
                >
                  {{ s }}
                </p>
                <nxp-tabs
                  [size]="s"
                  [activeItemIndex]="sizeTabs[s]()"
                  (activeItemIndexChange)="sizeTabs[s].set($event)"
                >
                  <button nxpTab class="px-4 py-3">First</button>
                  <button nxpTab class="px-4 py-3">Second</button>
                  <button nxpTab class="px-4 py-3">Third</button>
                </nxp-tabs>
              </div>
            }
          </div>
        </section>

        <!-- Vertical tabs -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Vertical
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Add the
            <code
              class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >vertical</code
            >
            attribute for a vertical tab list. Useful for settings or sidebar
            navigation.
          </p>
          <div
            class="flex gap-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800"
          >
            <nxp-tabs
              vertical
              [activeItemIndex]="verticalTab()"
              (activeItemIndexChange)="verticalTab.set($event)"
              class="min-w-[140px]"
            >
              <button nxpTab class="w-full justify-start px-4 py-2.5">
                Profile
              </button>
              <button nxpTab class="w-full justify-start px-4 py-2.5">
                Security
              </button>
              <button nxpTab class="w-full justify-start px-4 py-2.5">
                Notifications
              </button>
            </nxp-tabs>
            <div class="flex-1 p-6 text-sm text-gray-700 dark:text-gray-300">
              @switch (verticalTab()) {
                @case (0) {
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                    Profile
                  </h3>
                  <p>
                    Manage your profile information, avatar, and display
                    preferences.
                  </p>
                }
                @case (1) {
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                    Security
                  </h3>
                  <p>
                    Change password, enable 2FA, and manage connected devices.
                  </p>
                }
                @case (2) {
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                    Notifications
                  </h3>
                  <p>Configure email and push notification preferences.</p>
                }
              }
            </div>
          </div>
        </section>

        <!-- Tabs with icons -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            With icons
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Place
            <code
              class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxp-icon</code
            >
            inside any
            <code
              class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxpTab</code
            >
            button. The built-in
            <code
              class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >gap-2</code
            >
            spacing handles the icon–label gap automatically.
          </p>
          <nxp-tabs
            [activeItemIndex]="iconTab()"
            (activeItemIndexChange)="iconTab.set($event)"
          >
            <button nxpTab class="px-4 py-3">
              <nxp-icon icon="ri-home-4-line" size="sm" />
              Home
            </button>
            <button nxpTab class="px-4 py-3">
              <nxp-icon icon="ri-bar-chart-2-line" size="sm" />
              Analytics
            </button>
            <button nxpTab class="px-4 py-3">
              <nxp-icon icon="ri-settings-3-line" size="sm" />
              Settings
            </button>
            <button nxpTab class="px-4 py-3">
              <nxp-icon icon="ri-user-line" size="sm" />
              Profile
            </button>
          </nxp-tabs>
          <div
            class="mt-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300"
          >
            Active tab:
            <strong>{{
              ['Home', 'Analytics', 'Settings', 'Profile'][iconTab()]
            }}</strong>
          </div>
        </section>

        <!-- Icon-only tabs -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Icon only
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Omit the label text for compact icon-only tabs. Add a
            <code
              class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >title</code
            >
            attribute for accessibility.
          </p>
          <nxp-tabs
            [activeItemIndex]="iconOnlyTab()"
            (activeItemIndexChange)="iconOnlyTab.set($event)"
          >
            <button nxpTab class="px-4 py-3" title="Grid view">
              <nxp-icon icon="ri-layout-grid-line" size="md" />
            </button>
            <button nxpTab class="px-4 py-3" title="List view">
              <nxp-icon icon="ri-list-check" size="md" />
            </button>
            <button nxpTab class="px-4 py-3" title="Table view">
              <nxp-icon icon="ri-table-2" size="md" />
            </button>
          </nxp-tabs>
        </section>

        <!-- Vertical tabs with icons -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Vertical with icons
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Icons work the same way inside vertical tabs.
          </p>
          <div
            class="flex gap-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800"
          >
            <nxp-tabs
              vertical
              [activeItemIndex]="iconVerticalTab()"
              (activeItemIndexChange)="iconVerticalTab.set($event)"
              class="min-w-[160px]"
            >
              <button nxpTab class="w-full justify-start px-4 py-2.5">
                <nxp-icon icon="ri-user-line" size="sm" />
                Profile
              </button>
              <button nxpTab class="w-full justify-start px-4 py-2.5">
                <nxp-icon icon="ri-shield-keyhole-line" size="sm" />
                Security
              </button>
              <button nxpTab class="w-full justify-start px-4 py-2.5">
                <nxp-icon icon="ri-notification-3-line" size="sm" />
                Notifications
              </button>
              <button nxpTab class="w-full justify-start px-4 py-2.5">
                <nxp-icon icon="ri-palette-line" size="sm" />
                Appearance
              </button>
            </nxp-tabs>
            <div class="flex-1 p-6 text-sm text-gray-700 dark:text-gray-300">
              @switch (iconVerticalTab()) {
                @case (0) {
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                    Profile
                  </h3>
                  <p>
                    Manage your profile information, avatar, and display
                    preferences.
                  </p>
                }
                @case (1) {
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                    Security
                  </h3>
                  <p>
                    Change password, enable 2FA, and manage connected devices.
                  </p>
                }
                @case (2) {
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                    Notifications
                  </h3>
                  <p>Configure email and push notification preferences.</p>
                }
                @case (3) {
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                    Appearance
                  </h3>
                  <p>Choose your theme, accent color, and display density.</p>
                }
              }
            </div>
          </div>
        </section>

        <!-- Disabled tab -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Disabled tab
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Apply
            <code
              class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >[disabled]="true"</code
            >
            to a tab button to make it non-interactive.
          </p>
          <nxp-tabs
            [activeItemIndex]="disabledExampleTab()"
            (activeItemIndexChange)="disabledExampleTab.set($event)"
          >
            <button nxpTab class="px-4 py-3">Active</button>
            <button nxpTab [disabled]="true" class="px-4 py-3">
              Coming soon
            </button>
            <button nxpTab class="px-4 py-3">Another</button>
          </nxp-tabs>
        </section>
      </div>
    </div>
  `,
})
export class TabsDemoComponent {
  readonly horizontalTab = signal(0);
  readonly plainTab = signal(0);
  readonly verticalTab = signal(0);
  readonly disabledExampleTab = signal(0);
  readonly iconTab = signal(0);
  readonly iconOnlyTab = signal(0);
  readonly iconVerticalTab = signal(0);

  readonly sizes: NxpTabsSize[] = ['sm', 'md', 'lg'];
  readonly sizeTabs: Record<NxpTabsSize, ReturnType<typeof signal<number>>> = {
    sm: signal(0),
    md: signal(0),
    lg: signal(0),
  };
}
