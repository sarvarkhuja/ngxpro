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
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';
import { InputApiComponent } from './input-api.component';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    NxpDocComponentPage,
    NxpDocExampleComponent,
    InputApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Input"
      package="cdk"
      type="component"
      path="cdk/input"
    >
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

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Live preview bound to the API tab — edit any row over there (or this row's values via the URL query string) to see the textfield react."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="max-w-md">
            <nxp-textfield
              [size]="playgroundSize() ?? 'md'"
              [iconStart]="playgroundIconStart()"
              [iconEnd]="playgroundIconEnd()"
              [hasError]="playgroundHasError()"
            >
              <label nxpLabel for="playground-input">Field</label>
              <input
                nxpInput
                id="playground-input"
                type="text"
                placeholder="Edit me…"
                [(ngModel)]="playgroundValue"
              />
            </nxp-textfield>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Value: <strong>{{ playgroundValue() || '(empty)' }}</strong>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Icons"
          description="Pass iconStart / iconEnd to render a Remix icon class inside the field. Padding adjusts automatically."
          [content]="{ HTML: iconsHtml, TypeScript: iconsTs }"
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
        </nxp-doc-example>

        <nxp-doc-example
          heading="Clear button"
          description="Add nxpTextfieldCleaner to surface a clear (×) button while the field has a value. Combine with iconStart for a search-style input."
          [content]="{ HTML: clearHtml, TypeScript: clearTs }"
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
          [content]="{ HTML: endHtml, TypeScript: endTs }"
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
          [content]="{ HTML: copyHtml, TypeScript: copyTs }"
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
                <label nxpLabel for="copy-readonly"
                  >Personal access token</label
                >
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
            <nxp-copy
              >npm install ngxpro/components --legacy-peer-deps</nxp-copy
            >
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="size is sm, md (default), or lg. Shown without a label so the size applies to the box itself."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
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
          [content]="{ HTML: statesHtml, TypeScript: statesTs }"
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
          [content]="{ HTML: plainHtml, TypeScript: plainTs }"
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
          [content]="{ HTML: formsHtml, TypeScript: formsTs }"
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
      </ng-template>

      <ng-template nxpApiTab>
        <app-input-api
          [(size)]="playgroundSize"
          [(iconStart)]="playgroundIconStart"
          [(iconEnd)]="playgroundIconEnd"
          [(hasError)]="playgroundHasError"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class InputDemoComponent {
  readonly clearPlain = signal('');
  readonly clearSearch = signal('');
  readonly pwdVisible = signal(false);
  readonly pwdValue = signal('');
  readonly copyToken = signal('');

  // Playground state shared with the API tab.
  readonly playgroundSize = signal<'sm' | 'md' | 'lg' | null>('md');
  readonly playgroundIconStart = signal<string>('ri-search-line');
  readonly playgroundIconEnd = signal<string>('');
  readonly playgroundHasError = signal(false);
  readonly playgroundValue = signal('');

  readonly usernameCtrl = new FormControl<string>('', {
    validators: [Validators.required, Validators.minLength(3)],
  });

  protected readonly playgroundHtml = `<nxp-textfield
  [size]="size() ?? 'md'"
  [iconStart]="iconStart()"
  [iconEnd]="iconEnd()"
  [hasError]="hasError()"
>
  <label nxpLabel for="playground">Field</label>
  <input
    nxpInput
    id="playground"
    type="text"
    placeholder="Edit me…"
    [(ngModel)]="value"
  />
</nxp-textfield>`;

  protected readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';

@Component({
  selector: 'app-input-playground',
  standalone: true,
  imports: [
    FormsModule,
    NxpInputDirective,
    NxpLabelDirective,
    NxpTextfieldComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-playground.component.html',
})
export class InputPlaygroundComponent {
  readonly size = signal<'sm' | 'md' | 'lg' | null>('md');
  readonly iconStart = signal('ri-search-line');
  readonly iconEnd = signal('');
  readonly hasError = signal(false);
  readonly value = signal('');
}`;

  protected readonly iconsHtml = `<nxp-textfield iconStart="ri-search-line">
  <label nxpLabel for="search">Search</label>
  <input nxpInput id="search" type="search" placeholder="Search components…" />
</nxp-textfield>

<nxp-textfield iconEnd="ri-mail-line">
  <label nxpLabel for="email">Email</label>
  <input nxpInput id="email" type="email" placeholder="you@example.com" />
</nxp-textfield>

<nxp-textfield iconStart="ri-user-line" iconEnd="ri-information-line">
  <label nxpLabel for="user">Username</label>
  <input nxpInput id="user" type="text" placeholder="@handle" />
</nxp-textfield>

<nxp-textfield iconStart="ri-lock-line">
  <label nxpLabel for="pwd">Password</label>
  <input nxpInput id="pwd" type="password" placeholder="••••••••" />
</nxp-textfield>`;

  protected readonly iconsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';

@Component({
  selector: 'app-input-icons',
  standalone: true,
  imports: [NxpInputDirective, NxpLabelDirective, NxpTextfieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-icons.component.html',
})
export class InputIconsComponent {}`;

  protected readonly clearHtml = `<nxp-textfield nxpTextfieldCleaner>
  <label nxpLabel for="plain">Plain</label>
  <input
    nxpInput
    id="plain"
    type="text"
    placeholder="Type something…"
    [(ngModel)]="clearPlain"
  />
</nxp-textfield>

<nxp-textfield nxpTextfieldCleaner iconStart="ri-search-line">
  <label nxpLabel for="search">Search with clear</label>
  <input
    nxpInput
    id="search"
    type="search"
    placeholder="Search…"
    [(ngModel)]="clearSearch"
  />
</nxp-textfield>`;

  protected readonly clearTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldOptionsDirective,
} from '@ngxpro/cdk/components/textfield';

@Component({
  selector: 'app-input-clear',
  standalone: true,
  imports: [
    FormsModule,
    NxpInputDirective,
    NxpLabelDirective,
    NxpTextfieldComponent,
    NxpTextfieldOptionsDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-clear.component.html',
})
export class InputClearComponent {
  readonly clearPlain = signal('');
  readonly clearSearch = signal('');
}`;

  protected readonly endHtml = `<!-- Hover hint -->
<nxp-textfield>
  <label nxpLabel for="info">API token</label>
  <input nxpInput id="info" type="text" placeholder="sk_…" />
  <button
    nxpTextfieldEnd
    type="button"
    tabindex="-1"
    [nxpTooltip]="'Generate one in Settings → Developers'"
    nxpTooltipDirection="top"
    aria-label="More info"
  >
    <i class="ri-information-line text-base leading-none" aria-hidden="true"></i>
  </button>
</nxp-textfield>

<!-- Settings dropdown -->
<nxp-textfield>
  <label nxpLabel for="settings">Search</label>
  <input nxpInput id="settings" type="search" placeholder="Search…" />
  <button
    nxpTextfieldEnd
    type="button"
    tabindex="-1"
    [nxpDropdown]="searchSettings"
    nxpDropdownAuto
    aria-label="Search settings"
  >
    <i class="ri-settings-3-line text-base leading-none" aria-hidden="true"></i>
  </button>
</nxp-textfield>
<ng-template #searchSettings>
  <div class="p-2 w-48 text-sm bg-white border rounded-md shadow-md">
    <button type="button">Match case</button>
    <button type="button">Whole word</button>
    <button type="button">Regex</button>
  </div>
</ng-template>

<!-- Password toggle -->
<nxp-textfield iconStart="ri-lock-line">
  <label nxpLabel for="pwd">Password</label>
  <input
    nxpInput
    id="pwd"
    [type]="pwdVisible() ? 'text' : 'password'"
    placeholder="••••••••"
    [(ngModel)]="pwdValue"
  />
  <button
    nxpTextfieldEnd
    type="button"
    tabindex="-1"
    [attr.aria-label]="pwdVisible() ? 'Hide password' : 'Show password'"
    [attr.aria-pressed]="pwdVisible()"
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
</nxp-textfield>`;

  protected readonly endTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDropdownDirective, NxpDropdownOpen } from '@ngxpro/cdk';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldEndDirective,
} from '@ngxpro/cdk/components/textfield';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';

@Component({
  selector: 'app-input-end',
  standalone: true,
  imports: [
    FormsModule,
    NxpDropdownDirective,
    NxpDropdownOpen,
    NxpInputDirective,
    NxpLabelDirective,
    NxpTextfieldComponent,
    NxpTextfieldEndDirective,
    NxpTooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-end.component.html',
})
export class InputEndComponent {
  readonly pwdVisible = signal(false);
  readonly pwdValue = signal('');
}`;

  protected readonly copyHtml = `<!-- Editable field with copy in trailing slot -->
<nxp-textfield iconStart="ri-key-2-line">
  <label nxpLabel for="token">API key</label>
  <input
    nxpInput
    id="token"
    type="text"
    placeholder="Type a value to enable copy"
    [(ngModel)]="copyToken"
  />
  <nxp-icon nxpCopy nxpTextfieldEnd icon="ri-file-copy-line" />
</nxp-textfield>

<!-- Read-only token -->
<nxp-textfield iconStart="ri-shield-keyhole-line">
  <label nxpLabel for="readonly">Personal access token</label>
  <input nxpInput id="readonly" type="text" readonly value="ghp_aBC123xyzREADONLYtok" />
  <nxp-icon nxpCopy nxpTextfieldEnd icon="ri-file-copy-line" />
</nxp-textfield>

<!-- Standalone copy pill -->
<nxp-copy>npm install ngxpro/components --legacy-peer-deps</nxp-copy>`;

  protected readonly copyTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpCopyComponent, NxpCopyDirective } from '@ngxpro/cdk/components/copy';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldEndDirective,
} from '@ngxpro/cdk/components/textfield';

@Component({
  selector: 'app-input-copy',
  standalone: true,
  imports: [
    FormsModule,
    NxpCopyComponent,
    NxpCopyDirective,
    NxpIconComponent,
    NxpInputDirective,
    NxpLabelDirective,
    NxpTextfieldComponent,
    NxpTextfieldEndDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-copy.component.html',
})
export class InputCopyComponent {
  readonly copyToken = signal('');
}`;

  protected readonly sizesHtml = `<nxp-textfield size="sm" iconStart="ri-search-line">
  <input nxpInput type="text" placeholder="Small" />
</nxp-textfield>

<nxp-textfield size="md" iconStart="ri-search-line">
  <input nxpInput type="text" placeholder="Medium" />
</nxp-textfield>

<nxp-textfield size="lg" iconStart="ri-search-line">
  <input nxpInput type="text" placeholder="Large" />
</nxp-textfield>`;

  protected readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';

@Component({
  selector: 'app-input-sizes',
  standalone: true,
  imports: [NxpInputDirective, NxpTextfieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-sizes.component.html',
})
export class InputSizesComponent {}`;

  protected readonly statesHtml = `<nxp-textfield iconStart="ri-user-line">
  <label nxpLabel for="disabled">Disabled</label>
  <input nxpInput id="disabled" type="text" placeholder="Disabled" disabled />
</nxp-textfield>

<nxp-textfield iconStart="ri-mail-line">
  <label nxpLabel for="error">Error</label>
  <input
    nxpInput
    id="error"
    type="email"
    [hasError]="true"
    placeholder="Invalid email"
  />
</nxp-textfield>`;

  protected readonly statesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';

@Component({
  selector: 'app-input-states',
  standalone: true,
  imports: [NxpInputDirective, NxpLabelDirective, NxpTextfieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-states.component.html',
})
export class InputStatesComponent {}`;

  protected readonly plainHtml = `<nxp-textfield>
  <label nxpLabel for="default">Default</label>
  <input nxpInput type="text" placeholder="Enter text…" id="default" />
</nxp-textfield>

<nxp-textfield>
  <label nxpLabel for="description">Description</label>
  <textarea
    nxpInput
    id="description"
    placeholder="Enter a longer description…"
    rows="4"
    class="resize-y min-h-[80px]"
  ></textarea>
</nxp-textfield>`;

  protected readonly plainTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';

@Component({
  selector: 'app-input-plain',
  standalone: true,
  imports: [NxpInputDirective, NxpLabelDirective, NxpTextfieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-plain.component.html',
})
export class InputPlainComponent {}`;

  protected readonly formsHtml = `<nxp-textfield nxpTextfieldCleaner iconStart="ri-account-circle-line">
  <label nxpLabel for="username">Username</label>
  <input
    nxpInput
    id="username"
    type="text"
    [formControl]="usernameCtrl"
    placeholder="Username"
    [hasError]="usernameCtrl.invalid && usernameCtrl.touched"
  />
</nxp-textfield>
@if (usernameCtrl.invalid && usernameCtrl.touched) {
  <p class="mt-1 text-xs text-red-600">Required, min 3 characters</p>
}

<div class="font-mono text-xs">
  usernameCtrl.value = <strong>{{ usernameCtrl.value | json }}</strong>
</div>`;

  protected readonly formsTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldOptionsDirective,
} from '@ngxpro/cdk/components/textfield';

@Component({
  selector: 'app-input-forms',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NxpInputDirective,
    NxpLabelDirective,
    NxpTextfieldComponent,
    NxpTextfieldOptionsDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-forms.component.html',
})
export class InputFormsComponent {
  readonly usernameCtrl = new FormControl<string>('', {
    validators: [Validators.required, Validators.minLength(3)],
  });
}`;
}
