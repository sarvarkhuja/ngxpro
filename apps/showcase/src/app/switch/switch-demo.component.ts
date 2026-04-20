import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NxpSwitch,
  type NxpSwitchColor,
  type NxpSwitchSize,
} from '@nxp/components/switch';

@Component({
  selector: 'app-switch-demo',
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...NxpSwitch,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
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
            Switch
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Toggle switch with spring animations, thumb morphing, and drag
            support. Use
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >&lt;nxp-switch&gt;</code
            >.
          </p>
        </div>

        <!-- Sizes -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Sizes
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Use the
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">size</code>
            input: <code>s</code>, <code>m</code> (default), <code>l</code>.
          </p>
          <div class="flex flex-wrap items-center gap-8">
            @for (s of sizes; track s) {
              <nxp-switch [size]="s" [checked]="true">
                <span
                  class="text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >{{ s }}</span
                >
              </nxp-switch>
            }
          </div>
          <div class="flex flex-wrap items-center gap-8">
            @for (s of sizes; track s) {
              <nxp-switch [size]="s">
                <span
                  class="text-sm text-gray-500 dark:text-gray-400 capitalize"
                  >{{ s }} (unchecked)</span
                >
              </nxp-switch>
            }
          </div>
        </section>

        <!-- Color variants -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Color variants
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Use the
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">color</code>
            input: <code>primary</code>, <code>secondary</code>,
            <code>danger</code>.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            @for (color of colors; track color) {
              <div class="space-y-3">
                <p
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  {{ color }}
                </p>
                <nxp-switch [color]="color" [checked]="true">
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >On</span
                  >
                </nxp-switch>
                <nxp-switch [color]="color">
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Off</span
                  >
                </nxp-switch>
              </div>
            }
          </div>
        </section>

        <!-- Disabled -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Disabled
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Use the
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded"
              >disabled</code
            >
            input.
          </p>
          <div class="flex flex-wrap items-center gap-8">
            <nxp-switch [disabled]="true" [checked]="true">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >On (disabled)</span
              >
            </nxp-switch>
            <nxp-switch [disabled]="true">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Off (disabled)</span
              >
            </nxp-switch>
          </div>
        </section>

        <!-- Reactive forms -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Reactive forms
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Bind with
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded"
              >[formControl]</code
            >
            or
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded"
              >[(checked)]</code
            >.
          </p>
          <div class="flex flex-wrap items-center gap-6">
            <nxp-switch [formControl]="notificationsCtrl">
              <span class="text-sm text-gray-700 dark:text-gray-300"
                >Notifications</span
              >
            </nxp-switch>
            <nxp-switch [formControl]="darkModeCtrl">
              <span class="text-sm text-gray-700 dark:text-gray-300"
                >Dark mode</span
              >
            </nxp-switch>
          </div>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Value: notifications={{ notificationsCtrl.value | json }},
            darkMode={{ darkModeCtrl.value | json }}
          </p>
        </section>

        <!-- Two-way binding -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Two-way binding
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Use
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded"
              >[(checked)]</code
            >
            for simple two-way binding with signals.
          </p>
          <div class="flex flex-wrap items-center gap-6">
            <nxp-switch [(checked)]="twoWayValue" size="l">
              <span class="text-sm text-gray-700 dark:text-gray-300"
                >Large toggle</span
              >
            </nxp-switch>
          </div>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Signal value: {{ twoWayValue() }}
          </p>
        </section>

        <!-- Drag interaction -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Drag interaction
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Click to toggle, or drag the thumb across the track.
            Hover for pill shape, press for squish.
          </p>
          <div class="flex flex-wrap items-center gap-8">
            @for (s of sizes; track s) {
              <nxp-switch [size]="s" color="primary">
                <span
                  class="text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >Drag me ({{ s }})</span
                >
              </nxp-switch>
            }
          </div>
        </section>
      </div>
    </div>
  `,
})
export class SwitchDemoComponent {
  readonly sizes: readonly NxpSwitchSize[] = ['s', 'm', 'l'];
  readonly colors: readonly NxpSwitchColor[] = [
    'primary',
    'secondary',
    'danger',
  ];

  readonly notificationsCtrl = new FormControl<boolean>(true);
  readonly darkModeCtrl = new FormControl<boolean>(false);
  readonly twoWayValue = signal(false);
}
