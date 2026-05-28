import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import {
  NxpCheckbox,
  type NxpCheckboxColor,
  type NxpCheckboxSize,
} from '@ngxpro/cdk/components/checkbox';
import { CheckboxApiComponent } from './checkbox-api.component';

@Component({
  selector: 'app-checkbox-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    CheckboxApiComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    ...NxpCheckbox,
  ],
  template: `
    <nxp-doc-component-page
      header="Checkbox"
      package="cdk"
      type="component"
      path="cdk/checkbox"
    >
      <p class="text-base text-text-secondary mb-6">
        Animated checkbox component with stroke-dashoffset checkmark animation.
        Supports checked, unchecked, and indeterminate states. Integrates with
        Angular Reactive Forms via
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >ControlValueAccessor</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Live preview wired to the API tab — edit size or color in the API table to drive this preview."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="flex items-center gap-6">
            <nxp-checkbox [size]="size()" [color]="color()" [checked]="true">
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Checked
              </span>
            </nxp-checkbox>
            <nxp-checkbox [size]="size()" [color]="color()">
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Unchecked
              </span>
            </nxp-checkbox>
            <nxp-checkbox
              [size]="size()"
              [color]="color()"
              [indeterminate]="true"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Indeterminate
              </span>
            </nxp-checkbox>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="Use the [size] input: 's', 'm' (default), 'l'."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="space-y-4">
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
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Color variants"
          description="Use the [color] input: 'primary', 'secondary', 'danger'."
          [content]="{ HTML: colorsHtml, TypeScript: colorsTs }"
        >
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
        </nxp-doc-example>

        <nxp-doc-example
          heading="Indeterminate state"
          description='Set [indeterminate]="true" to show a dash icon with the filled color variant.'
          [content]="{ HTML: indeterminateHtml, TypeScript: indeterminateTs }"
        >
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
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled state"
          description="Disabled checkboxes show reduced opacity and a not-allowed cursor. Set via the [disabled] input or by disabling a FormControl."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
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
        </nxp-doc-example>

        <nxp-doc-example
          heading="Reactive Forms — Boolean control"
          description="Bind a FormControl<boolean> directly via ControlValueAccessor."
          [content]="{ HTML: reactiveHtml, TypeScript: reactiveTs }"
        >
          <div class="space-y-4">
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
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Select-all pattern"
          description='A "select all" checkbox uses the indeterminate state when some (but not all) items are selected.'
          [content]="{ HTML: selectAllHtml, TypeScript: selectAllTs }"
        >
          <div class="space-y-4">
            <div class="space-y-3">
              @for (feature of features; track feature.id) {
                <nxp-checkbox
                  size="m"
                  [formControl]="getFeatureControl(feature.id)"
                >
                  <div>
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
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
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Dark mode"
          description="All color variants and states rendered on a dark background."
          [content]="{ HTML: darkHtml, TypeScript: darkTs }"
        >
          <div
            class="bg-gray-900 rounded-xl border border-gray-700 p-6 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
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
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-checkbox-api [(size)]="size" [(color)]="color" />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class CheckboxDemoComponent {
  readonly sizes: NxpCheckboxSize[] = ['s', 'm', 'l'];
  readonly colors: NxpCheckboxColor[] = ['primary', 'secondary', 'danger'];

  // Shared playground state — two-way bound with <app-checkbox-api>.
  readonly size = signal<NxpCheckboxSize>('m');
  readonly color = signal<NxpCheckboxColor>('primary');

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

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly playgroundHtml = `<nxp-checkbox [size]="size()" [color]="color()" [checked]="true">
  <span>Checked</span>
</nxp-checkbox>
<nxp-checkbox [size]="size()" [color]="color()">
  <span>Unchecked</span>
</nxp-checkbox>
<nxp-checkbox [size]="size()" [color]="color()" [indeterminate]="true">
  <span>Indeterminate</span>
</nxp-checkbox>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NxpCheckbox,
  type NxpCheckboxColor,
  type NxpCheckboxSize,
} from '@ngxpro/cdk/components/checkbox';

@Component({
  selector: 'app-playground',
  imports: [...NxpCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class CheckboxPlaygroundExample {
  readonly size = signal<NxpCheckboxSize>('m');
  readonly color = signal<NxpCheckboxColor>('primary');
}`;

  readonly sizesHtml = `<div class="flex flex-wrap items-center gap-8">
  @for (s of sizes; track s) {
    <nxp-checkbox [size]="s" [checked]="true">
      <span class="capitalize">{{ s }}</span>
    </nxp-checkbox>
  }
</div>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpCheckbox,
  type NxpCheckboxSize,
} from '@ngxpro/cdk/components/checkbox';

@Component({
  selector: 'app-sizes',
  imports: [...NxpCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes.html',
})
export class SizesCheckboxExample {
  readonly sizes: NxpCheckboxSize[] = ['s', 'm', 'l'];
}`;

  readonly colorsHtml = `<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
  @for (color of colors; track color) {
    <div class="space-y-3">
      <p class="text-xs font-medium uppercase tracking-wide">{{ color }}</p>
      <nxp-checkbox [color]="color" [checked]="true">
        <span>Checked</span>
      </nxp-checkbox>
      <nxp-checkbox [color]="color">
        <span>Unchecked</span>
      </nxp-checkbox>
    </div>
  }
</div>`;

  readonly colorsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpCheckbox,
  type NxpCheckboxColor,
} from '@ngxpro/cdk/components/checkbox';

@Component({
  selector: 'app-colors',
  imports: [...NxpCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './colors.html',
})
export class ColorsCheckboxExample {
  readonly colors: NxpCheckboxColor[] = ['primary', 'secondary', 'danger'];
}`;

  readonly indeterminateHtml = `<div class="flex flex-wrap gap-8">
  @for (color of colors; track color) {
    <nxp-checkbox [color]="color" [indeterminate]="true">
      <span class="capitalize">{{ color }} indeterminate</span>
    </nxp-checkbox>
  }
</div>`;

  readonly indeterminateTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpCheckbox,
  type NxpCheckboxColor,
} from '@ngxpro/cdk/components/checkbox';

@Component({
  selector: 'app-indeterminate',
  imports: [...NxpCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './indeterminate.html',
})
export class IndeterminateCheckboxExample {
  readonly colors: NxpCheckboxColor[] = ['primary', 'secondary', 'danger'];
}`;

  readonly disabledHtml = `<div class="flex flex-wrap gap-6">
  <nxp-checkbox [disabled]="true">
    <span>Disabled unchecked</span>
  </nxp-checkbox>
  <nxp-checkbox [disabled]="true" [checked]="true">
    <span>Disabled checked</span>
  </nxp-checkbox>
  <nxp-checkbox color="danger" [disabled]="true" [checked]="true">
    <span>Danger disabled checked</span>
  </nxp-checkbox>
  <nxp-checkbox color="secondary" [disabled]="true">
    <span>Secondary disabled</span>
  </nxp-checkbox>
</div>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpCheckbox } from '@ngxpro/cdk/components/checkbox';

@Component({
  selector: 'app-disabled',
  imports: [...NxpCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled.html',
})
export class DisabledCheckboxExample {}`;

  readonly reactiveHtml = `<nxp-checkbox [formControl]="agreedCtrl">
  <span>
    I agree to the
    <a href="#">terms and conditions</a>
  </span>
</nxp-checkbox>

<div>agreedCtrl.value = <strong>{{ agreedCtrl.value }}</strong></div>

<button type="button" (click)="agreedCtrl.disable()">Disable</button>
<button type="button" (click)="agreedCtrl.enable()">Enable</button>
<button type="button" (click)="agreedCtrl.reset(false)">Reset</button>`;

  readonly reactiveTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpCheckbox } from '@ngxpro/cdk/components/checkbox';

@Component({
  selector: 'app-reactive',
  imports: [ReactiveFormsModule, ...NxpCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reactive.html',
})
export class ReactiveCheckboxExample {
  readonly agreedCtrl = new FormControl<boolean>(false, { nonNullable: true });
}`;

  readonly selectAllHtml = `<div class="space-y-3">
  @for (feature of features; track feature.id) {
    <nxp-checkbox size="m" [formControl]="getFeatureControl(feature.id)">
      <div>
        <p class="text-sm font-medium">{{ feature.label }}</p>
        <p class="text-xs">{{ feature.description }}</p>
      </div>
    </nxp-checkbox>
  }
</div>

<div>featuresForm.value = <strong>{{ featuresForm.value | json }}</strong></div>`;

  readonly selectAllTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NxpCheckbox } from '@ngxpro/cdk/components/checkbox';

interface Feature {
  id: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-select-all',
  imports: [JsonPipe, ReactiveFormsModule, ...NxpCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select-all.html',
})
export class SelectAllCheckboxExample {
  readonly features: Feature[] = [
    { id: 'analytics', label: 'Analytics', description: 'Track user behaviour' },
    { id: 'notifications', label: 'Push Notifications', description: 'Send alerts' },
    { id: 'darkMode', label: 'Dark Mode', description: 'Switch themes' },
    { id: 'twoFactor', label: '2FA', description: 'Require OTP' },
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
      const values = Object.values(this.featuresForm.value) as boolean[];
      const count = values.filter(Boolean).length;
      this.checkedCount.set(count);
      this.allChecked.set(count === this.features.length);
      this.someChecked.set(count > 0 && count < this.features.length);
    });
  }

  getFeatureControl(id: string): FormControl<boolean> {
    return this.featuresForm.get(id) as FormControl<boolean>;
  }
}`;

  readonly darkHtml = `<div class="bg-gray-900 rounded-xl border border-gray-700 p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
  @for (color of colors; track color) {
    <div class="space-y-3">
      <p class="text-xs font-medium text-gray-400 uppercase">{{ color }}</p>
      <nxp-checkbox [color]="color" [checked]="true">
        <span class="text-sm text-gray-300">Checked</span>
      </nxp-checkbox>
      <nxp-checkbox [color]="color">
        <span class="text-sm text-gray-300">Unchecked</span>
      </nxp-checkbox>
      <nxp-checkbox [color]="color" [checked]="true" [disabled]="true">
        <span class="text-sm text-gray-500">Disabled checked</span>
      </nxp-checkbox>
      <nxp-checkbox [color]="color" [disabled]="true">
        <span class="text-sm text-gray-500">Disabled</span>
      </nxp-checkbox>
    </div>
  }
</div>`;

  readonly darkTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpCheckbox,
  type NxpCheckboxColor,
} from '@ngxpro/cdk/components/checkbox';

@Component({
  selector: 'app-dark',
  imports: [...NxpCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dark.html',
})
export class DarkCheckboxExample {
  readonly colors: NxpCheckboxColor[] = ['primary', 'secondary', 'danger'];
}`;
}
