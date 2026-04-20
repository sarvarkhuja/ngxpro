import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NxpLabelDirective } from '@nxp/cdk/components/label';
import { NxpTextfieldComponent } from '@nxp/cdk/components/textfield';
import { NxpTextareaComponent } from 'libs/components/textarea/src/textarea.component';
import { NxpTextareaLimitDirective } from 'libs/components/textarea/src/textarea.directive';

@Component({
  selector: 'app-textarea-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NxpTextareaComponent,
    NxpTextareaLimitDirective,
    NxpLabelDirective,
    NxpTextfieldComponent,
  ],
  template: `
    <!-- Sticky header -->
    <div
      class="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800
             bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm
             px-6 py-4 flex items-center gap-4"
    >
      <a
        routerLink="/"
        class="text-sm font-medium text-gray-500 dark:text-gray-400
               hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        &larr; Home
      </a>
      <span class="text-gray-300 dark:text-gray-700 select-none">|</span>
      <h1 class="text-sm font-semibold text-gray-900 dark:text-white">
        Textarea
      </h1>
    </div>

    <!-- Page body -->
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-4xl mx-auto px-6 py-12 space-y-16">

        <!-- Hero -->
        <section class="space-y-4">
          <span
            class="inline-block text-xs font-mono font-medium px-2.5 py-1 rounded-full
                   bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400
                   border border-blue-200 dark:border-blue-800"
          >
            @nxp/components/textarea
          </span>
          <h2 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Textarea
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            An auto-resizing textarea that grows between a configurable minimum
            and maximum number of rows. Demos use
            <code class="font-mono text-sm">nxp-textfield</code> with
            <code class="font-mono text-sm">class="h-auto"</code> so the wrapper
            grows with the control, plus
            <code class="font-mono text-sm">label[nxpLabel]</code>. Supports
            character limits, error states, disabled state, and Angular forms.
          </p>
        </section>

        <!-- Section: Basic usage -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
              Basic usage
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <code class="font-mono text-xs">textarea[nxpTextarea]</code> inside
              <code class="font-mono text-xs">nxp-textfield</code> auto-resizes
              between 2 and 6 rows by default.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Basic -->
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-800
                     bg-white dark:bg-gray-950 p-6 space-y-4"
            >
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                  Basic
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Auto-resizes as you type. Scrolls after 6 rows.
                </p>
              </div>
              <nxp-textfield class="h-auto">
                <label nxpLabel for="textarea-basic">Message</label>
                <textarea
                  nxpTextarea
                  id="textarea-basic"
                  placeholder="Start typing..."
                  [(ngModel)]="basicValue"
                ></textarea>
              </nxp-textfield>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Length: {{ basicValue.length }} chars
              </p>
            </div>

            <!-- With custom row limits -->
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-800
                     bg-white dark:bg-gray-950 p-6 space-y-4"
            >
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                  Custom rows
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <code class="font-mono text-xs">[min]="3" [max]="10"</code>
                  — at least 3 rows, scrolls after 10.
                </p>
              </div>
              <nxp-textfield class="h-auto">
                <label nxpLabel for="textarea-custom-rows">Long form</label>
                <textarea
                  nxpTextarea
                  id="textarea-custom-rows"
                  [min]="3"
                  [max]="10"
                  placeholder="More room to write..."
                  [(ngModel)]="customRowsValue"
                ></textarea>
              </nxp-textfield>
            </div>

          </div>
        </section>

        <!-- Section: Floating label & error -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
              Floating label &amp; error
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Use <code class="font-mono text-xs">placeholder=" "</code> with
              <code class="font-mono text-xs">nxp-textfield</code> for a floating
              label treatment. Set
              <code class="font-mono text-xs">[hasError]</code> on the textfield
              for the error ring.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Floating label -->
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-800
                     bg-white dark:bg-gray-950 p-6 space-y-4"
            >
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                  Floating label
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  The label floats to the border edge when the textarea is
                  focused or has content.
                </p>
              </div>
              <nxp-textfield class="h-auto">
                <label nxpLabel for="description">Description</label>
                <textarea
                  nxpTextarea
                  id="description"
                  placeholder=" "
                  [(ngModel)]="floatingValue"
                ></textarea>
              </nxp-textfield>
            </div>

            <!-- Error state inside textfield -->
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-800
                     bg-white dark:bg-gray-950 p-6 space-y-4"
            >
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                  Error state
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Pass <code class="font-mono text-xs">[hasError]="true"</code>
                  to <code class="font-mono text-xs">nxp-textfield</code> to
                  show the error ring and red label.
                </p>
              </div>
              <nxp-textfield class="h-auto" [hasError]="true">
                <label nxpLabel for="notes">Notes</label>
                <textarea nxpTextarea id="notes" placeholder=" " [(ngModel)]="errorValue"></textarea>
              </nxp-textfield>
              <p class="text-xs text-red-500">This field is required.</p>
            </div>

          </div>
        </section>

        <!-- Section: Character limit -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
              Character limit
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add the
              <code class="font-mono text-xs">[limit]</code> input to display a
              live character counter and apply form validation. The counter turns
              red when the limit is exceeded.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- 200 char limit -->
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-800
                     bg-white dark:bg-gray-950 p-6 space-y-4"
            >
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                  200 character limit
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  A counter appears below the textarea. Validation error is set
                  when limit is exceeded.
                </p>
              </div>
              <nxp-textfield class="h-auto">
                <label nxpLabel for="textarea-limit-200">Message</label>
                <textarea
                  nxpTextarea
                  id="textarea-limit-200"
                  [limit]="200"
                  placeholder="Type a message (max 200 chars)..."
                  [(ngModel)]="limitValue"
                ></textarea>
              </nxp-textfield>
            </div>

            <!-- Short 50 char limit -->
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-800
                     bg-white dark:bg-gray-950 p-6 space-y-4"
            >
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                  Short limit (50 chars)
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  With a tight limit the counter turns red immediately when you
                  go over.
                </p>
              </div>
              <nxp-textfield class="h-auto">
                <label nxpLabel for="textarea-limit-50">Short message</label>
                <textarea
                  nxpTextarea
                  id="textarea-limit-50"
                  [limit]="50"
                  placeholder="Short message..."
                  [(ngModel)]="shortLimitValue"
                ></textarea>
              </nxp-textfield>
            </div>

          </div>
        </section>

        <!-- Section: States -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
              States
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Error and disabled states.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Error -->
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-800
                     bg-white dark:bg-gray-950 p-6 space-y-4"
            >
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                  Error state
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Use <code class="font-mono text-xs">[hasError]="true"</code> on
                  <code class="font-mono text-xs">nxp-textfield</code>.
                </p>
              </div>
              <nxp-textfield class="h-auto" [hasError]="true">
                <label nxpLabel for="textarea-state-error">Message</label>
                <textarea
                  nxpTextarea
                  id="textarea-state-error"
                  placeholder="Something went wrong..."
                ></textarea>
              </nxp-textfield>
              <p class="text-xs text-red-500 mt-1">This field has an error.</p>
            </div>

            <!-- Disabled -->
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-800
                     bg-white dark:bg-gray-950 p-6 space-y-4"
            >
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                  Disabled
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Native
                  <code class="font-mono text-xs">disabled</code> attribute
                  applies the disabled styling.
                </p>
              </div>
              <nxp-textfield class="h-auto">
                <label nxpLabel for="textarea-disabled">Read-only note</label>
                <textarea
                  nxpTextarea
                  id="textarea-disabled"
                  disabled
                  placeholder="This textarea is disabled..."
                >This content cannot be edited.</textarea>
              </nxp-textfield>
            </div>

          </div>
        </section>

        <!-- Section: Reactive forms -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
              Reactive forms
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Works with
              <code class="font-mono text-xs">FormControl</code> and
              <code class="font-mono text-xs">[(ngModel)]</code>.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- FormControl -->
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-800
                     bg-white dark:bg-gray-950 p-6 space-y-4"
            >
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                  Reactive FormControl
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Bind with
                  <code class="font-mono text-xs">[formControl]="ctrl"</code>.
                </p>
              </div>
              <nxp-textfield class="h-auto">
                <label nxpLabel for="textarea-comments">Comments</label>
                <textarea
                  nxpTextarea
                  id="textarea-comments"
                  [formControl]="formCtrl"
                  placeholder="Write your comments..."
                ></textarea>
              </nxp-textfield>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value: <code class="font-mono">{{ formCtrl.value | json }}</code>
              </p>
            </div>

            <!-- ngModel -->
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-800
                     bg-white dark:bg-gray-950 p-6 space-y-4"
            >
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                  Two-way [(ngModel)]
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Template-driven binding.
                </p>
              </div>
              <nxp-textfield class="h-auto">
                <label nxpLabel for="feedback">Feedback</label>
                <textarea nxpTextarea id="feedback" placeholder=" " [(ngModel)]="ngModelValue"></textarea>
              </nxp-textfield>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value: <code class="font-mono break-all">{{ ngModelValue }}</code>
              </p>
            </div>

          </div>
        </section>

        <!-- Section: API reference -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
              API reference
            </h2>
          </div>

          <!-- NxpTextareaComponent -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
              NxpTextareaComponent <code class="font-mono text-sm text-gray-500">textarea[nxpTextarea]</code>
            </h3>
            <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th class="px-4 py-3">Input</th>
                    <th class="px-4 py-3">Type</th>
                    <th class="px-4 py-3">Default</th>
                    <th class="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-950">
                  <tr>
                    <td class="px-4 py-3 font-mono text-xs">min</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">number | null</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">2 (from options)</td>
                    <td class="px-4 py-3">Minimum number of visible rows</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 font-mono text-xs">max</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">number | null</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">6 (from options)</td>
                    <td class="px-4 py-3">Maximum rows before scrolling begins</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 font-mono text-xs">hasError</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">boolean</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">false</td>
                    <td class="px-4 py-3">Applies error border/ring (standalone only; use nxp-textfield [hasError] otherwise)</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 font-mono text-xs">class</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">string</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">''</td>
                    <td class="px-4 py-3">Extra Tailwind classes merged via cx()</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- NxpTextareaLimitDirective -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
              NxpTextareaLimitDirective <code class="font-mono text-sm text-gray-500">textarea[nxpTextarea][limit]</code>
            </h3>
            <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th class="px-4 py-3">Input</th>
                    <th class="px-4 py-3">Type</th>
                    <th class="px-4 py-3">Default</th>
                    <th class="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-950">
                  <tr>
                    <td class="px-4 py-3 font-mono text-xs">limit</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">number</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">required</td>
                    <td class="px-4 py-3">Maximum character count. Displays a counter and adds maxlength validation to the form control.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- nxpTextareaOptionsProvider -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
              nxpTextareaOptionsProvider
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Provide global defaults for all textareas in a component subtree:
            </p>
            <pre class="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">providers: [nxpTextareaOptionsProvider(&#123; min: 3, max: 8 &#125;)]</pre>
          </div>

        </section>

      </div>
    </div>
  `,
})
export class TextareaDemoComponent {
  // Basic
  basicValue = '';
  customRowsValue = '';

  // Inside textfield
  floatingValue = '';
  errorValue = '';

  // Character limit
  limitValue = '';
  shortLimitValue = '';

  // Reactive forms
  readonly formCtrl = new FormControl('');
  ngModelValue = '';
}
