import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldEndDirective,
  NxpTextfieldOptionsDirective,
} from '@ngxpro/cdk/components/textfield';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { TextfieldApiComponent } from './textfield-api.component';

@Component({
  selector: 'app-textfield-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    NxpLabelDirective,
    NxpInputDirective,
    NxpTextfieldComponent,
    NxpTextfieldEndDirective,
    NxpTextfieldOptionsDirective,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    TextfieldApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Textfield"
      package="cdk"
      type="component"
      path="cdk/textfield"
    >
      <p class="text-base text-text-secondary mb-6">
        Three-part composition for form fields — a
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-textfield</code
        >
        wrapper that owns the border, focus, and error chrome, a
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxpLabel</code
        >
        directive for the floating label, and a
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxpInput</code
        >
        directive that exposes the native input through
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >NXP_TEXTFIELD_ACCESSOR</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Label &amp; Input"
          description="Standalone usage — pair a nxpLabel with a nxpInput. Each pair builds a complete labeled control without the nxp-textfield wrapper."
          [content]="{ HTML: labelInputHtml, TypeScript: labelInputTs }"
        >
          <div class="w-full max-w-lg mx-auto space-y-8">
            <!-- Search -->
            <div class="mx-auto max-w-xs space-y-2">
              <label nxpLabel for="search">Search</label>
              <input
                nxpInput
                placeholder="Search addresses"
                id="search"
                name="search"
                type="search"
              />
            </div>

            <!-- Email -->
            <div class="mx-auto max-w-xs space-y-2">
              <label nxpLabel for="email">Email address</label>
              <input
                nxpInput
                placeholder="you@example.com"
                id="email"
                name="email"
                type="email"
              />
            </div>

            <!-- Password -->
            <div class="mx-auto max-w-xs space-y-2">
              <label nxpLabel for="password">Password</label>
              <input
                nxpInput
                placeholder="••••••••"
                id="password"
                name="password"
                type="password"
              />
            </div>

            <!-- Disabled -->
            <div class="mx-auto max-w-xs space-y-2">
              <label nxpLabel [disabled]="true" for="disabled">Disabled</label>
              <input
                nxpInput
                id="disabled"
                name="disabled"
                type="text"
                value="john.doe"
                disabled
              />
            </div>

            <!-- Error -->
            <div class="mx-auto max-w-xs space-y-2">
              <label nxpLabel for="error">Email (error)</label>
              <input
                nxpInput
                id="error"
                name="error"
                type="email"
                value="not-an-email"
                [hasError]="true"
              />
              <p class="text-xs text-red-600 dark:text-red-400">
                Please enter a valid email address.
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Playground"
          description="Wrap a nxpLabel + nxpInput pair in nxp-textfield to share size, error, icon, and cleaner state. Bound to the API tab below."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="w-full max-w-md mx-auto">
            <nxp-textfield
              [size]="size()"
              [hasError]="hasError()"
              [iconStart]="iconStart()"
              [iconEnd]="iconEnd()"
              [nxpTextfieldCleaner]="cleaner()"
            >
              <label nxpLabel for="playground">Username</label>
              <input
                nxpInput
                id="playground"
                type="text"
                placeholder="@handle"
              />
            </nxp-textfield>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-textfield-api
          [(size)]="size"
          [(hasError)]="hasError"
          [(iconStart)]="iconStart"
          [(iconEnd)]="iconEnd"
          [(cleaner)]="cleaner"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class TextfieldDemoComponent {
  // Playground state shared with the API tab via two-way model bindings.
  readonly size = signal<'sm' | 'md' | 'lg' | null>('md');
  readonly hasError = signal(false);
  readonly iconStart = signal('ri-user-line');
  readonly iconEnd = signal('');
  readonly cleaner = signal(false);

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly labelInputHtml = `<!-- Search -->
<div class="space-y-2">
  <label nxpLabel for="search">Search</label>
  <input
    nxpInput
    placeholder="Search addresses"
    id="search"
    name="search"
    type="search"
  />
</div>

<!-- Email -->
<div class="space-y-2">
  <label nxpLabel for="email">Email address</label>
  <input
    nxpInput
    placeholder="you@example.com"
    id="email"
    name="email"
    type="email"
  />
</div>

<!-- Password -->
<div class="space-y-2">
  <label nxpLabel for="password">Password</label>
  <input
    nxpInput
    placeholder="••••••••"
    id="password"
    name="password"
    type="password"
  />
</div>

<!-- Disabled -->
<div class="space-y-2">
  <label nxpLabel [disabled]="true" for="disabled">Disabled</label>
  <input
    nxpInput
    id="disabled"
    name="disabled"
    type="text"
    value="john.doe"
    disabled
  />
</div>

<!-- Error -->
<div class="space-y-2">
  <label nxpLabel for="error">Email (error)</label>
  <input
    nxpInput
    id="error"
    name="error"
    type="email"
    value="not-an-email"
    [hasError]="true"
  />
  <p class="text-xs text-red-600">Please enter a valid email address.</p>
</div>`;

  readonly labelInputTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';

@Component({
  selector: 'app-label-input',
  standalone: true,
  imports: [NxpLabelDirective, NxpInputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './label-input.html',
})
export class LabelInputExample {}`;

  readonly playgroundHtml = `<nxp-textfield
  [size]="size()"
  [hasError]="hasError()"
  [iconStart]="iconStart()"
  [iconEnd]="iconEnd()"
  [nxpTextfieldCleaner]="cleaner()"
>
  <label nxpLabel for="playground">Username</label>
  <input nxpInput id="playground" type="text" placeholder="@handle" />
</nxp-textfield>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTextfieldComponent,
  NxpTextfieldOptionsDirective,
} from '@ngxpro/cdk/components/textfield';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [
    NxpLabelDirective,
    NxpInputDirective,
    NxpTextfieldComponent,
    NxpTextfieldOptionsDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundTextfieldExample {
  readonly size = signal<'sm' | 'md' | 'lg' | null>('md');
  readonly hasError = signal(false);
  readonly iconStart = signal('ri-user-line');
  readonly iconEnd = signal('');
  readonly cleaner = signal(false);
}`;
}
