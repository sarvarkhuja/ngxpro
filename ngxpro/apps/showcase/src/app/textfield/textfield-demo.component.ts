import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpInputDirective } from '@nxp/cdk/components/input';
import { NxpLabelDirective } from '@nxp/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldOptionsDirective,
} from '@nxp/cdk/components/textfield';

@Component({
  selector: 'app-textfield-demo',
  standalone: true,
  imports: [
    JsonPipe,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NxpTextfieldComponent,
    NxpTextfieldOptionsDirective,
    NxpLabelDirective,
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
            Textfield
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxp-textfield</code
            >
            wraps <code>label[nxpLabel]</code> and
            <code>input[nxpInput]</code> for floating labels, optional cleaner,
            sizes, and error state.
          </p>
        </div>

        <!-- Basic with floating label -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Floating label
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Place <code>label[nxpLabel]</code> and
            <code>input[nxpInput]</code> inside <code>nxp-textfield</code>. Use
            <code>placeholder=" "</code> (space) so the label floats on
            focus/value.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <nxp-textfield>
              <label nxpLabel for="first-name">First name</label>
              <input
                nxpInput
                id="first-name"
                type="text"
                placeholder=" "
                [(ngModel)]="firstName"
              />
            </nxp-textfield>
            <nxp-textfield>
              <label nxpLabel for="last-name">Last name</label>
              <input
                nxpInput
                id="last-name"
                type="text"
                placeholder=" "
                [(ngModel)]="lastName"
              />
            </nxp-textfield>
          </div>
        </section>

        <!-- Sizes -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Sizes
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Use <code>size</code> (or <code>nxpTextfieldSize</code>):
            <code>sm</code>, <code>md</code> (default), <code>lg</code>.
          </p>
          <div class="flex flex-wrap items-end gap-6">
            <nxp-textfield size="sm" class="w-48">
              <label nxpLabel for="size-sm">Small</label>
              <input nxpInput id="size-sm" type="text" placeholder=" " />
            </nxp-textfield>
            <nxp-textfield size="md" class="w-48">
              <label nxpLabel for="size-md">Medium</label>
              <input nxpInput id="size-md" type="text" placeholder=" " />
            </nxp-textfield>
            <nxp-textfield size="lg" class="w-48">
              <label nxpLabel for="size-lg">Large</label>
              <input nxpInput id="size-lg" type="text" placeholder=" " />
            </nxp-textfield>
          </div>
        </section>

        <!-- Cleaner -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Cleaner
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Enable the clear button with <code>cleaner</code> (or
            <code>nxpTextfieldCleaner</code>). Shown when the field has a value.
          </p>
          <div class="max-w-md">
            <nxp-textfield [nxpTextfieldCleaner]="true" class="w-full">
              <label nxpLabel for="search-input">Search</label>
              <input
                nxpInput
                id="search-input"
                type="text"
                placeholder=" "
                [(ngModel)]="searchQuery"
              />
            </nxp-textfield>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Value: {{ searchQuery || '(empty)' }}
            </p>
          </div>
        </section>

        <!-- Error state -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Error state
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Set <code>[hasError]="true"</code> on <code>nxp-textfield</code> for
            validation styling.
          </p>
          <div class="max-w-md">
            <nxp-textfield [hasError]="true" class="w-full">
              <label nxpLabel for="email-error">Email</label>
              <input
                nxpInput
                id="email-error"
                type="email"
                placeholder=" "
                value="invalid-email"
              />
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
            Bind <code>formControl</code> and use <code>[hasError]</code> from
            form validation.
          </p>
          <div class="space-y-4 max-w-md">
            <nxp-textfield
              [hasError]="emailCtrl.invalid && emailCtrl.touched"
              class="w-full"
            >
              <label nxpLabel for="email-reactive">Email</label>
              <input
                nxpInput
                id="email-reactive"
                type="email"
                placeholder=" "
                [formControl]="emailCtrl"
              />
            </nxp-textfield>
            @if (emailCtrl.invalid && emailCtrl.touched) {
              <p class="text-xs text-red-600 dark:text-red-400">
                Please enter a valid email
              </p>
            }
            <div
              class="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-600 dark:text-gray-400"
            >
              emailCtrl.value = <strong>{{ emailCtrl.value | json }}</strong>
            </div>
          </div>
        </section>

        <!-- Without label (no floating) -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Without label
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            You can use <code>nxp-textfield</code> without a label; the input
            still gets focus ring and cleaner if enabled.
          </p>
          <div class="max-w-md">
            <nxp-textfield [nxpTextfieldCleaner]="true" class="w-full">
              <input
                nxpInput
                type="text"
                placeholder="Placeholder only"
                [(ngModel)]="noLabelValue"
              />
            </nxp-textfield>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class TextfieldDemoComponent {
  firstName = '';
  lastName = '';
  searchQuery = '';
  noLabelValue = '';

  readonly emailCtrl = new FormControl<string>('', {
    validators: [Validators.required, Validators.email],
  });
}
