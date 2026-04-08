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
import { NxpLabelDirective } from 'libs/cdk/src/lib/components/label/src';
import { NxpTextfieldComponent } from 'libs/cdk/src/lib/components/textfield/src';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [
    JsonPipe,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NxpInputDirective,
    NxpLabelDirective,
    NxpTextfieldComponent,
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
            with
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxpInput</code
            >
            /
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxpLabel</code
            >
            inside
            <code>nxp-textfield</code>
            for a consistent form-field layout.
          </p>
        </div>

        <!-- Text field (nxp-textfield) -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Text field
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Each example uses <code>nxp-textfield</code> with
            <code>label[nxpLabel]</code> and <code>input[nxpInput]</code> or
            <code>textarea[nxpInput]</code>.
          </p>
          <div class="space-y-4 max-w-md">
            <nxp-textfield>
              <label nxpLabel for="default">Default</label>
              <input
                nxpInput
                type="text"
                placeholder="Enter text..."
                id="default"
              />
            </nxp-textfield>
            <div>
              <nxp-textfield>
                <label nxpLabel for="with-value">With value (ngModel)</label>
                <input
                  nxpInput
                  id="with-value"
                  type="text"
                  [(ngModel)]="standaloneValue"
                  placeholder="Type here..."
                />
              </nxp-textfield>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Value: {{ standaloneValue || '(empty)' }}
              </p>
            </div>
            <nxp-textfield>
              <label nxpLabel for="disabled-demo">Disabled</label>
              <input
                nxpInput
                id="disabled-demo"
                type="text"
                placeholder="Disabled"
                disabled
              />
            </nxp-textfield>
            <nxp-textfield>
              <label nxpLabel for="error-demo">Error state</label>
              <input
                nxpInput
                id="error-demo"
                type="text"
                [hasError]="true"
                placeholder="Invalid value"
              />
            </nxp-textfield>
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
            <nxp-textfield>
              <label nxpLabel for="demo-email">Email</label>
              <input
                nxpInput
                id="demo-email"
                type="email"
                placeholder="you&#64;example.com"
              />
            </nxp-textfield>
            <nxp-textfield>
              <label nxpLabel for="demo-password">Password</label>
              <input
                nxpInput
                id="demo-password"
                type="password"
                placeholder="••••••••"
              />
            </nxp-textfield>
            <nxp-textfield>
              <label nxpLabel for="demo-number">Number</label>
              <input
                nxpInput
                id="demo-number"
                type="number"
                placeholder="0"
              />
            </nxp-textfield>
            <nxp-textfield>
              <label nxpLabel for="demo-search">Search</label>
              <input
                nxpInput
                id="demo-search"
                type="search"
                placeholder="Search..."
              />
            </nxp-textfield>
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
            <code>textarea[nxpInput]</code> inside <code>nxp-textfield</code>.
          </p>
          <div class="max-w-md">
            <nxp-textfield>
              <label nxpLabel for="demo-description">Description</label>
              <textarea
                nxpInput
                id="demo-description"
                placeholder="Enter a longer description..."
                rows="4"
                class="resize-y min-h-[80px]"
              ></textarea>
            </nxp-textfield>
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
              <nxp-textfield>
                <label nxpLabel for="demo-username">Username</label>
                <input
                  nxpInput
                  id="demo-username"
                  type="text"
                  [formControl]="usernameCtrl"
                  placeholder="Username"
                  [hasError]="usernameCtrl.invalid && usernameCtrl.touched"
                />
              </nxp-textfield>
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
