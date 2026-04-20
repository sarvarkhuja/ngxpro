import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NxpRadio,
  type NxpRadioSize,
  type NxpRadioColor,
} from '@nxp/cdk/components/radio';

interface Fruit {
  id: number;
  label: string;
}

@Component({
  selector: 'app-radio-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...NxpRadio,
  ],
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
            Radio
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Native radio input styled with Tailwind. Integrates with Angular
            Reactive Forms via the built-in
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >RadioControlValueAccessor</code
            >.
          </p>
        </div>

        <!-- ── Sizes ──────────────────────────────────────────────── -->
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
          <div class="flex items-center gap-8">
            @for (s of sizes; track s) {
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  nxpRadio
                  [size]="s"
                  name="size-demo"
                  [value]="s"
                  [(ngModel)]="selectedSize"
                />
                <span
                  class="text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >{{ s }}</span
                >
              </label>
            }
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500">
            Selected: {{ selectedSize() }}
          </p>
        </section>

        <!-- ── Colors ─────────────────────────────────────────────── -->
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
              <div class="space-y-2">
                <p
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  {{ color }}
                </p>
                <div class="space-y-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      nxpRadio
                      [color]="color"
                      [name]="'color-' + color"
                      value="option1"
                      checked
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Option 1 (checked)</span
                    >
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      nxpRadio
                      [color]="color"
                      [name]="'color-' + color"
                      value="option2"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Option 2</span
                    >
                  </label>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- ── Disabled State ─────────────────────────────────────── -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Disabled State
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Disabled radios show reduced opacity and a not-allowed cursor. Set
            via native <code>disabled</code> attribute or by disabling the
            <code>FormControl</code>.
          </p>
          <div class="flex flex-wrap gap-6">
            <label class="flex items-center gap-2 cursor-not-allowed">
              <input
                type="radio"
                nxpRadio
                name="disabled-demo"
                value="a"
                disabled
              />
              <span class="text-sm text-gray-400 dark:text-gray-500"
                >Disabled unchecked</span
              >
            </label>
            <label class="flex items-center gap-2 cursor-not-allowed">
              <input
                type="radio"
                nxpRadio
                name="disabled-demo"
                value="b"
                checked
                disabled
              />
              <span class="text-sm text-gray-400 dark:text-gray-500"
                >Disabled checked</span
              >
            </label>
            <label class="flex items-center gap-2 cursor-not-allowed">
              <input
                type="radio"
                nxpRadio
                color="danger"
                name="disabled-demo-2"
                value="c"
                disabled
              />
              <span class="text-sm text-gray-400 dark:text-gray-500"
                >Danger disabled</span
              >
            </label>
          </div>
        </section>

        <!-- ── Reactive Forms ─────────────────────────────────────── -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Reactive Forms
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Works out-of-the-box with Angular's <code>FormControl</code> via the
            native <code>RadioControlValueAccessor</code>.
          </p>
          <div class="space-y-3">
            @for (plan of plans; track plan) {
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  nxpRadio
                  [formControl]="planControl"
                  [value]="plan.value"
                  name="plan"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ plan.label }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ plan.description }}
                  </p>
                </div>
              </label>
            }
          </div>
          <div
            class="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-600 dark:text-gray-400"
          >
            planControl.value = <strong>{{ planControl.value | json }}</strong>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              (click)="planControl.disable()"
              class="px-3 py-1.5 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Disable control
            </button>
            <button
              type="button"
              (click)="planControl.enable()"
              class="px-3 py-1.5 text-xs rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Enable control
            </button>
            <button
              type="button"
              (click)="planControl.reset()"
              class="px-3 py-1.5 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </section>

        <!-- ── Identity Matcher (Object Values) ───────────────────── -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Identity Matcher (Object Values)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            When binding object values, Angular's default reference equality
            fails. Add <code>identityMatcher</code> to compare by a stable
            property (e.g., <code>id</code>).
          </p>
          <div class="space-y-3">
            @for (fruit of fruits; track fruit.id) {
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  nxpRadio
                  [identityMatcher]="fruitMatcher"
                  [formControl]="fruitControl"
                  [value]="fruit"
                  name="fruit"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{
                  fruit.label
                }}</span>
              </label>
            }
          </div>
          <div
            class="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-600 dark:text-gray-400"
          >
            fruitControl.value =
            <strong>{{ fruitControl.value | json }}</strong>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              (click)="setFruitById(2)"
              class="px-3 py-1.5 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Set to Banana (id=2) programmatically
            </button>
          </div>
        </section>

        <!-- ── Dark Mode Panel ─────────────────────────────────────── -->
        <section
          class="bg-gray-900 rounded-xl border border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-white">Dark Mode</h2>
          <p class="text-sm text-gray-400">
            All color variants rendered on a dark background. Each radio
            automatically adapts.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            @for (color of colors; track color) {
              <div class="space-y-2">
                <p
                  class="text-xs font-medium text-gray-400 uppercase tracking-wide"
                >
                  {{ color }}
                </p>
                <div class="space-y-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      nxpRadio
                      [color]="color"
                      [name]="'dark-' + color"
                      value="a"
                      checked
                    />
                    <span class="text-sm text-gray-300">Checked</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      nxpRadio
                      [color]="color"
                      [name]="'dark-' + color"
                      value="b"
                    />
                    <span class="text-sm text-gray-300">Unchecked</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-not-allowed">
                    <input
                      type="radio"
                      nxpRadio
                      [color]="color"
                      [name]="'dark-disabled-' + color"
                      value="c"
                      disabled
                    />
                    <span class="text-sm text-gray-500">Disabled</span>
                  </label>
                </div>
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
})
export class RadioDemoComponent {
  readonly sizes: NxpRadioSize[] = ['s', 'm', 'l'];
  readonly colors: NxpRadioColor[] = ['primary', 'secondary', 'danger'];

  readonly selectedSize = signal<NxpRadioSize>('m');

  readonly plans = [
    {
      value: 'free',
      label: 'Free',
      description: 'Up to 3 projects, 5 GB storage',
    },
    {
      value: 'pro',
      label: 'Pro',
      description: 'Unlimited projects, 100 GB storage',
    },
    {
      value: 'enterprise',
      label: 'Enterprise',
      description: 'Custom storage, SSO, audit logs',
    },
  ];

  readonly planControl = new FormControl<string>('pro');

  // Object-value demo
  readonly fruits: Fruit[] = [
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Banana' },
    { id: 3, label: 'Cherry' },
  ];

  readonly fruitControl = new FormControl<Fruit | null>(this.fruits[0]);

  /** Custom identity matcher that compares fruits by id. */
  readonly fruitMatcher = (a: Fruit, b: Fruit): boolean => a?.id === b?.id;

  setFruitById(id: number): void {
    // Simulate a new object reference (e.g., fetched from API) with the same id
    const found = this.fruits.find((f) => f.id === id);
    if (found) {
      // Pass a copy to demonstrate identity matcher working across different references
      this.fruitControl.setValue({ ...found });
    }
  }
}
