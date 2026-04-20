import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NxpCheckbox,
  type NxpCheckboxColor,
  type NxpCheckboxSize,
} from '@nxp/cdk/components/checkbox';

@Component({
  selector: 'app-checkbox-demo',
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...NxpCheckbox,
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
            Checkbox
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Animated checkbox component with stroke-dashoffset checkmark
            animation. Supports checked, unchecked, and indeterminate states.
            Integrates with Angular Reactive Forms via
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >ControlValueAccessor</code
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
              <nxp-checkbox [size]="s" [checked]="true">
                <span
                  class="text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >{{ s }}</span
                >
              </nxp-checkbox>
            }
          </div>
          <div class="flex flex-wrap items-center gap-8">
            @for (s of sizes; track s) {
              <nxp-checkbox [size]="s">
                <span
                  class="text-sm text-gray-500 dark:text-gray-400 capitalize"
                  >{{ s }} (unchecked)</span
                >
              </nxp-checkbox>
            }
          </div>
        </section>

        <!-- Color Variants -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Color Variants
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
                <nxp-checkbox [color]="color" [checked]="true">
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Checked</span
                  >
                </nxp-checkbox>
                <nxp-checkbox [color]="color">
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Unchecked</span
                  >
                </nxp-checkbox>
              </div>
            }
          </div>
        </section>

        <!-- Indeterminate State -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Indeterminate State
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Set
            <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded"
              >[indeterminate]="true"</code
            >
            to show a dash icon with the filled color variant.
          </p>
          <div class="flex flex-wrap gap-8">
            @for (color of colors; track color) {
              <nxp-checkbox [color]="color" [indeterminate]="true">
                <span
                  class="text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >{{ color }} indeterminate</span
                >
              </nxp-checkbox>
            }
          </div>
        </section>

        <!-- Disabled State -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Disabled State
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Disabled checkboxes show reduced opacity and a not-allowed cursor.
            Set via the <code>disabled</code> input or by disabling a
            <code>FormControl</code>.
          </p>
          <div class="flex flex-wrap gap-6">
            <nxp-checkbox [disabled]="true">
              <span class="text-sm text-gray-400 dark:text-gray-500"
                >Disabled unchecked</span
              >
            </nxp-checkbox>
            <nxp-checkbox [disabled]="true" [checked]="true">
              <span class="text-sm text-gray-400 dark:text-gray-500"
                >Disabled checked</span
              >
            </nxp-checkbox>
            <nxp-checkbox color="danger" [disabled]="true" [checked]="true">
              <span class="text-sm text-gray-400 dark:text-gray-500"
                >Danger disabled checked</span
              >
            </nxp-checkbox>
            <nxp-checkbox color="secondary" [disabled]="true">
              <span class="text-sm text-gray-400 dark:text-gray-500"
                >Secondary disabled</span
              >
            </nxp-checkbox>
          </div>
        </section>

        <!-- Reactive Forms — Single Boolean -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Reactive Forms — Boolean Control
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Bind a <code>FormControl&lt;boolean&gt;</code> directly via
            <code>ControlValueAccessor</code>.
          </p>
          <nxp-checkbox [formControl]="agreedCtrl">
            <span class="text-sm text-gray-700 dark:text-gray-300">
              I agree to the
              <a
                href="#"
                class="text-blue-600 dark:text-blue-400 hover:underline"
                >terms and conditions</a
              >
            </span>
          </nxp-checkbox>
          <div
            class="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-600 dark:text-gray-400"
          >
            agreedCtrl.value = <strong>{{ agreedCtrl.value }}</strong>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              (click)="agreedCtrl.disable()"
              class="px-3 py-1.5 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Disable
            </button>
            <button
              type="button"
              (click)="agreedCtrl.enable()"
              class="px-3 py-1.5 text-xs rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Enable
            </button>
            <button
              type="button"
              (click)="agreedCtrl.reset(false)"
              class="px-3 py-1.5 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </section>

        <!-- Select-All Pattern -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Select-All Pattern
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            A "select all" checkbox uses the indeterminate state when some (but
            not all) items are selected.
          </p>

          <!-- Individual items -->
          <div class="space-y-3">
            @for (feature of features; track feature.id) {
              <nxp-checkbox
                size="m"
                [formControl]="getFeatureControl(feature.id)"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ feature.label }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ feature.description }}
                  </p>
                </div>
              </nxp-checkbox>
            }
          </div>

          <div
            class="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-600 dark:text-gray-400"
          >
            featuresForm.value =
            <strong>{{ featuresForm.value | json }}</strong>
          </div>
        </section>

        <!-- Dark Mode Panel -->
        <section
          class="bg-gray-900 rounded-xl border border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-white">Dark Mode</h2>
          <p class="text-sm text-gray-400">
            All color variants and states rendered on a dark background.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            @for (color of colors; track color) {
              <div class="space-y-3">
                <p
                  class="text-xs font-medium text-gray-400 uppercase tracking-wide"
                >
                  {{ color }}
                </p>
                <nxp-checkbox [color]="color" [checked]="true">
                  <span class="text-sm text-gray-300">Checked</span>
                </nxp-checkbox>
                <nxp-checkbox [color]="color">
                  <span class="text-sm text-gray-300">Unchecked</span>
                </nxp-checkbox>
                <nxp-checkbox
                  [color]="color"
                  [checked]="true"
                  [disabled]="true"
                >
                  <span class="text-sm text-gray-500">Disabled checked</span>
                </nxp-checkbox>
                <nxp-checkbox [color]="color" [disabled]="true">
                  <span class="text-sm text-gray-500">Disabled</span>
                </nxp-checkbox>
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
})
export class CheckboxDemoComponent {
  readonly sizes: NxpCheckboxSize[] = ['s', 'm', 'l'];
  readonly colors: NxpCheckboxColor[] = ['primary', 'secondary', 'danger'];

  // Single boolean control
  readonly agreedCtrl = new FormControl<boolean>(false, { nonNullable: true });

  // Features group for select-all demo
  readonly features = [
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Track user behaviour and conversion funnels',
    },
    {
      id: 'notifications',
      label: 'Push Notifications',
      description: 'Send real-time alerts to subscribed users',
    },
    {
      id: 'darkMode',
      label: 'Dark Mode',
      description: 'Automatically switch between light and dark themes',
    },
    {
      id: 'twoFactor',
      label: 'Two-Factor Authentication',
      description: 'Require OTP on every sign-in',
    },
  ];

  readonly featuresForm = new FormGroup(
    Object.fromEntries(
      this.features.map((f) => [
        f.id,
        new FormControl<boolean>(false, { nonNullable: true }),
      ]),
    ),
  );

  readonly checkedCount = signal(0);
  readonly allChecked = signal(false);
  readonly someChecked = signal(false);

  constructor() {
    this.featuresForm.valueChanges.subscribe(() => {
      this.updateSelectAllState();
    });
  }

  getFeatureControl(id: string): FormControl<boolean> {
    return this.featuresForm.get(id) as FormControl<boolean>;
  }

  private updateSelectAllState(): void {
    const values = Object.values(this.featuresForm.value) as boolean[];
    const count = values.filter(Boolean).length;
    this.checkedCount.set(count);
    this.allChecked.set(count === this.features.length);
    this.someChecked.set(count > 0 && count < this.features.length);
  }
}
