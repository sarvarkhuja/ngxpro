import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpInputDirective } from 'libs/cdk/src/lib/components/input/src';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [
    JsonPipe,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NxpInputDirective,
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
            Input
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Native
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >input</code
            >
            and
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >textarea</code
            >
            styled with
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxpInput</code
            >. Use standalone for a full bordered field, or inside
            <code>nxp-textfield</code> for floating labels and cleaner.
          </p>
        </div>

        <!-- Standalone inputs -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Standalone
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Apply <code>nxpInput</code> to <code>input</code> or
            <code>textarea</code> without a wrapper.
          </p>
          <div class="space-y-4 max-w-md">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >Default</label
              >
              <input
                nxpInput
                type="text"
                placeholder="Enter text..."
                class="w-full"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >With value (ngModel)</label
              >
              <input
                nxpInput
                type="text"
                [(ngModel)]="standaloneValue"
                placeholder="Type here..."
                class="w-full"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Value: {{ standaloneValue || '(empty)' }}
              </p>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >Disabled</label
              >
              <input
                nxpInput
                type="text"
                placeholder="Disabled"
                disabled
                class="w-full"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >Error state</label
              >
              <input
                nxpInput
                type="text"
                [hasError]="true"
                placeholder="Invalid value"
                class="w-full"
              />
            </div>
          </div>
        </section>

        <!-- Input types -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Input types
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >Email</label
              >
              <input
                nxpInput
                type="email"
                placeholder="you&#64;example.com"
                class="w-full"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >Password</label
              >
              <input
                nxpInput
                type="password"
                placeholder="••••••••"
                class="w-full"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >Number</label
              >
              <input nxpInput type="number" placeholder="0" class="w-full" />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >Search</label
              >
              <input
                nxpInput
                type="search"
                placeholder="Search..."
                class="w-full"
              />
            </div>
          </div>
        </section>

        <!-- Textarea -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Textarea
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <code>nxpInput</code> also applies to <code>textarea</code>.
          </p>
          <div class="max-w-md">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >Description</label
            >
            <textarea
              nxpInput
              placeholder="Enter a longer description..."
              rows="4"
              class="w-full resize-y min-h-[80px]"
            ></textarea>
          </div>
        </section>

        <!-- Reactive Forms -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Reactive Forms
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Works with <code>formControl</code> / <code>formControlName</code>.
            Use <code>[hasError]</code> from form validation.
          </p>
          <div class="space-y-4 max-w-md">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >Username</label
              >
              <input
                nxpInput
                type="text"
                [formControl]="usernameCtrl"
                placeholder="Username"
                class="w-full"
                [hasError]="usernameCtrl.invalid && usernameCtrl.touched"
              />
              @if (usernameCtrl.invalid && usernameCtrl.touched) {
                <p class="mt-1 text-xs text-red-600 dark:text-red-400">
                  Required, min 3 characters
                </p>
              }
            </div>
            <div
              class="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-600 dark:text-gray-400"
            >
              usernameCtrl.value =
              <strong>{{ usernameCtrl.value | json }}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class InputDemoComponent {
  standaloneValue = '';

  readonly usernameCtrl = new FormControl<string>('', {
    validators: [Validators.required, Validators.minLength(3)],
  });
}
