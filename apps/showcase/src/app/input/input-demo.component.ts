import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NxpDropdownDirective, NxpDropdownOpen } from '@ngxpro/cdk';
import {
  NxpCopyComponent,
  NxpCopyDirective,
} from '@ngxpro/cdk/components/copy';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldEndDirective,
  NxpTextfieldOptionsDirective,
} from '@ngxpro/cdk/components/textfield';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { NxpDocPageComponent } from '@ngxpro/addon-doc-lib/page';
import { NxpDocTocComponent } from '@ngxpro/addon-doc-lib/toc';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [
    JsonPipe,
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
    NxpIconComponent,
    NxpCopyDirective,
    NxpCopyComponent,
    NxpDocExampleComponent,
    NxpDocPageComponent,
    NxpDocTocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nxp-doc-page
      header="Input"
      package="cdk"
      type="component"
      path="components/input"
    >
      <nxp-doc-toc />

      <p class="text-base text-text-secondary mb-6">
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-textfield</code
        >
        with optional leading / trailing icons (Remix), a clear button, and full
        form support — built on
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxpInput</code
        >
        and
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxpLabel</code
        >.
      </p>

      <nxp-doc-example
        heading="Icons"
        description="Pass iconStart / iconEnd to render a Remix icon class inside the field. Padding adjusts automatically."
      >
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
          <nxp-textfield iconStart="ri-user-line" iconEnd="ri-information-line">
            <label nxpLabel for="icon-user">Username</label>
            <input nxpInput id="icon-user" type="text" placeholder="@handle" />
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
      </nxp-doc-example>

      <nxp-doc-example
        heading="Clear button"
        description="Add nxpTextfieldCleaner to surface a clear (×) button while the field has a value. Combine with iconStart for a search-style input."
      >
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
        <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Plain value:
          <strong>{{ clearPlain() || '(empty)' }}</strong> · Search value:
          <strong>{{ clearSearch() || '(empty)' }}</strong>
        </p>
      </nxp-doc-example>

      <nxp-doc-example
        heading="Trailing adornments"
        description="Project a button with nxpTextfieldEnd to attach a hint tooltip, a dropdown, or a password-visibility toggle — compose with nxpTooltip, nxpDropdown / nxpDropdownAuto, or a plain click handler."
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <p
              class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
            >
              Hover hint
            </p>
            <nxp-textfield>
              <label nxpLabel for="end-info">API token</label>
              <input nxpInput id="end-info" type="text" placeholder="sk_…" />
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

          <div>
            <p
              class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
            >
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

          <div class="sm:col-span-2">
            <p
              class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
            >
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
      </nxp-doc-example>

      <nxp-doc-example
        heading="Copy to clipboard"
        description="Drop nxpCopy + nxpTextfieldEnd into the trailing slot to copy the field value. The icon dims when empty and flips its aria-label to “Copied” for ~3s after a successful copy. Standalone nxp-copy works for inline read-only values."
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <p
              class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
            >
              Editable field
            </p>
            <nxp-textfield iconStart="ri-key-2-line">
              <label nxpLabel for="copy-token">API key</label>
              <input
                nxpInput
                id="copy-token"
                type="text"
                placeholder="Type a value to enable copy"
                [(ngModel)]="copyToken"
              />
              <nxp-icon
                nxpCopy
                nxpTextfieldEnd
                icon="ri-file-copy-line"
                class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                (pointerdown.prevent)="(0)"
              />
            </nxp-textfield>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Value: <strong>{{ copyToken() || '(empty)' }}</strong>
            </p>
          </div>

          <div>
            <p
              class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
            >
              Read-only token
            </p>
            <nxp-textfield iconStart="ri-shield-keyhole-line">
              <label nxpLabel for="copy-readonly">Personal access token</label>
              <input
                nxpInput
                id="copy-readonly"
                type="text"
                readonly
                value="ghp_aBC123xyzREADONLYtok"
              />
              <nxp-icon
                nxpCopy
                nxpTextfieldEnd
                icon="ri-file-copy-line"
                class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                (pointerdown.prevent)="(0)"
              />
            </nxp-textfield>
          </div>
        </div>

        <div class="mt-6">
          <p
            class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
          >
            Standalone copy pill
          </p>
          <nxp-copy>npm install ngxpro/components --legacy-peer-deps</nxp-copy>
        </div>
      </nxp-doc-example>

      <nxp-doc-example
        heading="Sizes"
        description="size is sm, md (default), or lg. Shown without a label so the size applies to the box itself."
      >
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
      </nxp-doc-example>

      <nxp-doc-example
        heading="States"
        description="Disabled and error states keep icons visible."
      >
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
      </nxp-doc-example>

      <nxp-doc-example
        heading="Plain text field"
        description="Default usage without icons or clear, including textarea support."
      >
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
      </nxp-doc-example>

      <nxp-doc-example
        heading="Reactive Forms"
        description="Works with formControl and form validation. Add nxpTextfieldCleaner to allow quick reset."
      >
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
      </nxp-doc-example>
    </nxp-doc-page>
  `,
})
export class InputDemoComponent {
  readonly clearPlain = signal('');
  readonly clearSearch = signal('');
  readonly pwdVisible = signal(false);
  readonly pwdValue = signal('');
  readonly copyToken = signal('');

  readonly usernameCtrl = new FormControl<string>('', {
    validators: [Validators.required, Validators.minLength(3)],
  });
}
