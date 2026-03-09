import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DrawerComponent } from '@nxp/components/drawer';

@Component({
  selector: 'app-drawer-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, DrawerComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div class="max-w-4xl mx-auto space-y-16">
        <!-- Page header -->
        <div>
          <a routerLink="/" class="text-sm text-blue-500 hover:underline"
            >← Back to home</a
          >
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Drawer
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Slide-in panel anchored to the viewport edge with sticky header,
            scrollable body, and sticky footer. Supports
            <code class="font-mono text-xs">start</code> /
            <code class="font-mono text-xs">end</code> direction and an
            optional overlay backdrop.
          </p>
        </div>

        <!-- Section: Basic -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Basic usage
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <!-- End (default) -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                End (default)
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Slides in from the right edge.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                (click)="endOpen.set(true)"
              >
                Open end drawer
              </button>
            </div>

            <!-- Start -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Start
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Slides in from the left edge.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                (click)="startOpen.set(true)"
              >
                Open start drawer
              </button>
            </div>

            <!-- Overlay -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                With overlay
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Full-height with a semi-transparent backdrop.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                (click)="overlayOpen.set(true)"
              >
                Open overlay drawer
              </button>
            </div>
          </div>
        </section>

        <!-- Section: With header, content & footer -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Header, content & footer
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Full layout
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Uses
                <code class="font-mono text-xs">&lt;header&gt;</code>,
                default content, and
                <code class="font-mono text-xs">&lt;footer&gt;</code> slots.
                The header and footer are sticky; the body scrolls.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                (click)="fullOpen.set(true)"
              >
                Open full drawer
              </button>
            </div>

            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Navigation sidebar
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Start-direction drawer styled as a nav menu, with overlay
                backdrop.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                (click)="navOpen.set(true)"
              >
                Open navigation drawer
              </button>
            </div>
          </div>
        </section>

        <!-- Section: API reference -->
        <section class="space-y-6">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            API reference
          </h2>

          <h3 class="text-base font-medium text-gray-900 dark:text-white">
            Inputs
          </h3>
          <div class="overflow-x-auto">
            <table
              class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300"
            >
              <thead
                class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <tr>
                  <th class="px-4 py-2">Input</th>
                  <th class="px-4 py-2">Type</th>
                  <th class="px-4 py-2">Default</th>
                  <th class="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-2 font-mono">direction</td>
                  <td class="px-4 py-2 font-mono">'start' | 'end'</td>
                  <td class="px-4 py-2 font-mono">'end'</td>
                  <td class="px-4 py-2">
                    Which edge the drawer slides in from
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">overlay</td>
                  <td class="px-4 py-2 font-mono">boolean</td>
                  <td class="px-4 py-2 font-mono">false</td>
                  <td class="px-4 py-2">
                    Show full-height drawer with a semi-transparent backdrop
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3
            class="text-base font-medium text-gray-900 dark:text-white mt-6"
          >
            Content projection slots
          </h3>
          <div class="overflow-x-auto">
            <table
              class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300"
            >
              <thead
                class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <tr>
                  <th class="px-4 py-2">Slot</th>
                  <th class="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-2 font-mono">&lt;header&gt;</td>
                  <td class="px-4 py-2">
                    Sticky header at the top of the drawer
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2">(default)</td>
                  <td class="px-4 py-2">
                    Scrollable body content
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">&lt;footer&gt;</td>
                  <td class="px-4 py-2">
                    Sticky footer pinned to the bottom
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- Drawer instances (rendered when their signal is true)        -->
    <!-- ============================================================ -->

    @if (endOpen()) {
      <nxp-drawer>
        <header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              End Drawer
            </h3>
            <button
              type="button"
              class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              (click)="endOpen.set(false)"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </header>
        <p class="text-gray-600 dark:text-gray-400">
          This is a basic end-side drawer with just a header and body content.
        </p>
      </nxp-drawer>
    }

    @if (startOpen()) {
      <nxp-drawer direction="start">
        <header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Start Drawer
            </h3>
            <button
              type="button"
              class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              (click)="startOpen.set(false)"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </header>
        <p class="text-gray-600 dark:text-gray-400">
          This drawer slides in from the start (left) edge.
        </p>
      </nxp-drawer>
    }

    @if (overlayOpen()) {
      <nxp-drawer [overlay]="true" (click)="onOverlayClick($event)">
        <header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Overlay Drawer
            </h3>
            <button
              type="button"
              class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              (click)="overlayOpen.set(false)"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </header>
        <p class="text-gray-600 dark:text-gray-400">
          Full-height drawer with a dark backdrop. Click the backdrop to close.
        </p>
      </nxp-drawer>
    }

    @if (fullOpen()) {
      <nxp-drawer [overlay]="true" (click)="onFullClick($event)">
        <header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              User Settings
            </h3>
            <button
              type="button"
              class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              (click)="fullOpen.set(false)"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Manage your account preferences
          </p>
        </header>

        <div class="space-y-6">
          @for (section of settingsSections; track section.title) {
            <div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                {{ section.title }}
              </h4>
              <div class="space-y-3">
                @for (item of section.items; track item) {
                  <div
                    class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ item }}</span>
                    <div
                      class="w-9 h-5 rounded-full bg-gray-200 dark:bg-gray-700 relative cursor-pointer"
                    >
                      <div
                        class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                      ></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <footer>
          <button
            type="button"
            class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
            (click)="fullOpen.set(false)"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            (click)="fullOpen.set(false)"
          >
            Save changes
          </button>
        </footer>
      </nxp-drawer>
    }

    @if (navOpen()) {
      <nxp-drawer direction="start" [overlay]="true" (click)="onNavClick($event)">
        <header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-bold text-blue-600 dark:text-blue-400">nxp</span>
            <button
              type="button"
              class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              (click)="navOpen.set(false)"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </header>

        <nav class="space-y-1">
          @for (link of navLinks; track link.label) {
            <a
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              [class.bg-blue-50]="link.active"
              [class.dark:bg-blue-900/20]="link.active"
              [class.text-blue-700]="link.active"
              [class.dark:text-blue-400]="link.active"
              (click)="navOpen.set(false)"
            >
              <svg class="h-5 w-5 shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path [attr.d]="link.icon" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ link.label }}
            </a>
          }
        </nav>

        <footer>
          <div class="flex items-center gap-3 w-full">
            <div
              class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-semibold text-blue-700 dark:text-blue-300"
            >
              A
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                Admin User
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                admin&#64;example.com
              </p>
            </div>
          </div>
        </footer>
      </nxp-drawer>
    }
  `,
})
export class DrawerDemoComponent {
  readonly endOpen = signal(false);
  readonly startOpen = signal(false);
  readonly overlayOpen = signal(false);
  readonly fullOpen = signal(false);
  readonly navOpen = signal(false);

  readonly settingsSections = [
    {
      title: 'Notifications',
      items: ['Email notifications', 'Push notifications', 'Weekly digest'],
    },
    {
      title: 'Privacy',
      items: ['Public profile', 'Show activity status', 'Allow data collection'],
    },
    {
      title: 'Appearance',
      items: ['Dark mode', 'Compact layout', 'Reduce motion'],
    },
  ];

  readonly navLinks = [
    { label: 'Dashboard', active: true, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
    { label: 'Analytics', active: false, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: 'Transactions', active: false, icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { label: 'Customers', active: false, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Settings', active: false, icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('nxp-modal-backdrop') ||
        (event.target as HTMLElement).classList.contains('nxp-drawer--overlay') ||
        (event.target as HTMLElement).tagName === 'NXP-DRAWER') {
      this.overlayOpen.set(false);
    }
  }

  onFullClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === 'NXP-DRAWER') {
      this.fullOpen.set(false);
    }
  }

  onNavClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === 'NXP-DRAWER') {
      this.navOpen.set(false);
    }
  }
}
