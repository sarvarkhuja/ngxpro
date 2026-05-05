import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpDropdownDirective, NxpDropdownOpen } from '@nxp/cdk';
import { NxpInputDirective } from '@nxp/cdk/components/input';
import { NxpLabelDirective } from '@nxp/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldEndDirective,
  NxpTextfieldOptionsDirective,
} from '@nxp/cdk/components/textfield';
import { NxpTooltipDirective } from '@nxp/components/tooltip';

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
    NxpTextfieldEndDirective,
    NxpTextfieldOptionsDirective,
    NxpDropdownDirective,
    NxpDropdownOpen,
    NxpTooltipDirective,
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
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxp-textfield</code
            >
            with optional leading / trailing icons (Remix), a clear button, and
            full form support — built on
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxpInput</code
            >
            and
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxpLabel</code
            >.
          </p>
        </div>

        <!-- Icons -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Icons
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Pass <code>iconStart</code> / <code>iconEnd</code> to render a
              Remix icon class inside the field. Padding adjusts automatically.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <nxp-textfield iconStart="ri-search-line">
              <label nxpLabel for="icon-search">Search</label>
              <input
                nxpInput
                id="icon-search"
                type="search"
                placeholder="Search components…"
              />
            </nxp-textfield>
            <nxp-textfield iconEnd="ri-mail-line">
              <label nxpLabel for="icon-email">Email</label>
              <input
                nxpInput
                id="icon-email"
                type="email"
                placeholder="you@example.com"
              />
            </nxp-textfield>
            <nxp-textfield
              iconStart="ri-user-line"
              iconEnd="ri-information-line"
            >
              <label nxpLabel for="icon-user">Username</label>
              <input
                nxpInput
                id="icon-user"
                type="text"
                placeholder="@handle"
              />
            </nxp-textfield>
            <nxp-textfield iconStart="ri-lock-line">
              <label nxpLabel for="icon-pwd">Password</label>
              <input
                nxpInput
                id="icon-pwd"
                type="password"
                placeholder="••••••••"
              />
            </nxp-textfield>
          </div>
        </section>

        <!-- Clear button -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Clear button
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Add <code>nxpTextfieldCleaner</code> to surface a clear (×) button
              while the field has a value. Combine with
              <code>iconStart</code> for a search-style input.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <nxp-textfield nxpTextfieldCleaner>
              <label nxpLabel for="clear-plain">Plain</label>
              <input
                nxpInput
                id="clear-plain"
                type="text"
                placeholder="Type something…"
                [(ngModel)]="clearPlain"
              />
            </nxp-textfield>
            <nxp-textfield nxpTextfieldCleaner iconStart="ri-search-line">
              <label nxpLabel for="clear-search">Search with clear</label>
              <input
                nxpInput
                id="clear-search"
                type="search"
                placeholder="Search…"
                [(ngModel)]="clearSearch"
              />
            </nxp-textfield>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Plain value:
            <strong>{{ clearPlain() || '(empty)' }}</strong> · Search value:
            <strong>{{ clearSearch() || '(empty)' }}</strong>
          </p>
        </section>

        <!-- Trailing adornment: tooltip / dropdown / password toggle -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6"
        >
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Trailing adornments
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Project a button with <code>nxpTextfieldEnd</code> to attach a
              hint tooltip, a dropdown, or a password-visibility toggle —
              compose with <code>nxpTooltip</code>,
              <code>[nxpDropdown]</code>/<code>nxpDropdownAuto</code>, or a
              plain <code>(click)</code>.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <!-- Tooltip hint -->
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Hover hint
              </p>
              <nxp-textfield>
                <label nxpLabel for="end-info">API token</label>
                <input
                  nxpInput
                  id="end-info"
                  type="text"
                  placeholder="sk_…"
                />
                <button
                  nxpTextfieldEnd
                  type="button"
                  tabindex="-1"
                  [nxpTooltip]="'Generate one in Settings → Developers'"
                  nxpTooltipDirection="top"
                  aria-label="More info"
                  class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                  (pointerdown.prevent)="(0)"
                >
                  <i
                    class="ri-information-line text-base leading-none"
                    aria-hidden="true"
                  ></i>
                </button>
              </nxp-textfield>
            </div>

            <!-- Settings dropdown -->
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Settings dropdown
              </p>
              <nxp-textfield>
                <label nxpLabel for="end-settings">Search</label>
                <input
                  nxpInput
                  id="end-settings"
                  type="search"
                  placeholder="Search…"
                />
                <button
                  nxpTextfieldEnd
                  type="button"
                  tabindex="-1"
                  [nxpDropdown]="searchSettings"
                  nxpDropdownAuto
                  aria-label="Search settings"
                  class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                  (pointerdown.prevent)="(0)"
                  (click)="$event.stopPropagation()"
                >
                  <i
                    class="ri-settings-3-line text-base leading-none"
                    aria-hidden="true"
                  ></i>
                </button>
              </nxp-textfield>
              <ng-template #searchSettings>
                <div
                  class="p-2 w-48 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-md"
                >
                  <button
                    type="button"
                    class="block w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Match case
                  </button>
                  <button
                    type="button"
                    class="block w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Whole word
                  </button>
                  <button
                    type="button"
                    class="block w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Regex
                  </button>
                </div>
              </ng-template>
            </div>

            <!-- Password eye toggle -->
            <div class="sm:col-span-2">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Password toggle
              </p>
              <nxp-textfield iconStart="ri-lock-line">
                <label nxpLabel for="end-pwd">Password</label>
                <input
                  nxpInput
                  id="end-pwd"
                  [type]="pwdVisible() ? 'text' : 'password'"
                  placeholder="••••••••"
                  [(ngModel)]="pwdValue"
                />
                <button
                  nxpTextfieldEnd
                  type="button"
                  tabindex="-1"
                  [attr.aria-label]="
                    pwdVisible() ? 'Hide password' : 'Show password'
                  "
                  [attr.aria-pressed]="pwdVisible()"
                  class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                  (pointerdown.prevent)="(0)"
                  (click)="pwdVisible.set(!pwdVisible())"
                >
                  <i
                    [class]="
                      (pwdVisible() ? 'ri-eye-off-line' : 'ri-eye-line') +
                      ' text-base leading-none'
                    "
                    aria-hidden="true"
                  ></i>
                </button>
              </nxp-textfield>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Value: <strong>{{ pwdValue() || '(empty)' }}</strong>
              </p>
            </div>
          </div>
        </section>

        <!-- Sizes -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Sizes
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              <code>size</code> is <code>sm</code>, <code>md</code> (default),
              or <code>lg</code>. Shown without a label so the size applies to
              the box itself.
            </p>
          </div>
          <div class="space-y-3 max-w-md">
            <nxp-textfield size="sm" iconStart="ri-search-line">
              <input nxpInput type="text" placeholder="Small" />
            </nxp-textfield>
            <nxp-textfield size="md" iconStart="ri-search-line">
              <input nxpInput type="text" placeholder="Medium" />
            </nxp-textfield>
            <nxp-textfield size="lg" iconStart="ri-search-line">
              <input nxpInput type="text" placeholder="Large" />
            </nxp-textfield>
          </div>
        </section>

        <!-- States -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              States
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Disabled and error states keep icons visible.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <nxp-textfield iconStart="ri-user-line">
              <label nxpLabel for="state-disabled">Disabled</label>
              <input
                nxpInput
                id="state-disabled"
                type="text"
                placeholder="Disabled"
                disabled
              />
            </nxp-textfield>
            <nxp-textfield iconStart="ri-mail-line">
              <label nxpLabel for="state-error">Error</label>
              <input
                nxpInput
                id="state-error"
                type="email"
                [hasError]="true"
                placeholder="Invalid email"
              />
            </nxp-textfield>
          </div>
        </section>

        <!-- Plain text field -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Plain text field
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Default usage without icons or clear, including textarea support.
            </p>
          </div>
          <div class="space-y-4 max-w-md">
            <nxp-textfield>
              <label nxpLabel for="plain-default">Default</label>
              <input
                nxpInput
                type="text"
                placeholder="Enter text…"
                id="plain-default"
              />
            </nxp-textfield>
            <nxp-textfield>
              <label nxpLabel for="plain-textarea">Description</label>
              <textarea
                nxpInput
                id="plain-textarea"
                placeholder="Enter a longer description…"
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
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Reactive Forms
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Works with <code>formControl</code> and form validation. Add
              <code>nxpTextfieldCleaner</code> to allow quick reset.
            </p>
          </div>
          <div class="space-y-4 max-w-md">
            <div>
              <nxp-textfield
                nxpTextfieldCleaner
                iconStart="ri-account-circle-line"
              >
                <label nxpLabel for="rf-username">Username</label>
                <input
                  nxpInput
                  id="rf-username"
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
  readonly clearPlain = signal('');
  readonly clearSearch = signal('');
  readonly pwdVisible = signal(false);
  readonly pwdValue = signal('');

  readonly usernameCtrl = new FormControl<string>('', {
    validators: [Validators.required, Validators.minLength(3)],
  });
}
