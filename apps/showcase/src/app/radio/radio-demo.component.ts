import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import {
  NxpRadio,
  type NxpRadioColor,
  type NxpRadioSize,
} from '@ngxpro/cdk/components/radio';
import { RadioApiComponent } from './radio-api.component';

interface Fruit {
  id: number;
  label: string;
}

@Component({
  selector: 'app-radio-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    RadioApiComponent,
    ...NxpRadio,
  ],
  template: `
    <nxp-doc-component-page
      header="Radio"
      package="cdk"
      type="component"
      path="cdk/radio"
    >
      <p class="text-base text-text-secondary mb-6">
        Native radio input wrapped in a styled
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-radio</code
        >
        component. Implements
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >ControlValueAccessor</code
        >, so it works with
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >[(ngModel)]</code
        >
        and
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >[formControl]</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Drive the radio with the size and color controls from the API tab."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <nxp-radio
            [size]="size()"
            [color]="color()"
            name="playground"
            value="a"
            [checked]="true"
          >
            <span class="text-sm text-text-secondary"
              >size = {{ size() }}, color = {{ color() }}</span
            >
          </nxp-radio>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="Use the size input: s, m (default), l."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="flex items-center gap-8">
            @for (s of sizes; track s) {
              <nxp-radio
                [size]="s"
                name="size-demo"
                [value]="s"
                [(ngModel)]="selectedSize"
              >
                <span
                  class="text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >{{ s }}</span
                >
              </nxp-radio>
            }
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Selected: {{ selectedSize() }}
          </p>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Color Variants"
          description="Use the color input: primary, secondary, danger."
          [content]="{ HTML: colorsHtml, TypeScript: colorsTs }"
        >
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            @for (color of colors; track color) {
              <div class="space-y-2">
                <p
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  {{ color }}
                </p>
                <div class="space-y-2">
                  <nxp-radio
                    [color]="color"
                    [name]="'color-' + color"
                    value="option1"
                    [checked]="true"
                  >
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Option 1 (checked)</span
                    >
                  </nxp-radio>
                  <nxp-radio
                    [color]="color"
                    [name]="'color-' + color"
                    value="option2"
                  >
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Option 2</span
                    >
                  </nxp-radio>
                </div>
              </div>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled State"
          description="Disabled radios show reduced opacity and a not-allowed cursor. Set via the disabled input or by disabling the FormControl."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <div class="flex flex-wrap gap-6">
            <nxp-radio name="disabled-demo" value="a" [disabled]="true">
              <span class="text-sm text-gray-400 dark:text-gray-500"
                >Disabled unchecked</span
              >
            </nxp-radio>
            <nxp-radio
              name="disabled-demo"
              value="b"
              [checked]="true"
              [disabled]="true"
            >
              <span class="text-sm text-gray-400 dark:text-gray-500"
                >Disabled checked</span
              >
            </nxp-radio>
            <nxp-radio
              color="danger"
              name="disabled-demo-2"
              value="c"
              [disabled]="true"
            >
              <span class="text-sm text-gray-400 dark:text-gray-500"
                >Danger disabled</span
              >
            </nxp-radio>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Reactive Forms"
          description="Works with Angular's FormControl via the component's ControlValueAccessor."
          [content]="{ HTML: reactiveFormsHtml, TypeScript: reactiveFormsTs }"
        >
          <div class="space-y-3">
            @for (plan of plans; track plan) {
              <nxp-radio
                [formControl]="planControl"
                [value]="plan.value"
                name="plan"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ plan.label }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ plan.description }}
                  </p>
                </div>
              </nxp-radio>
            }
          </div>
          <div
            class="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-600 dark:text-gray-400"
          >
            planControl.value = <strong>{{ planControl.value | json }}</strong>
          </div>
          <div class="flex gap-2 mt-3">
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
        </nxp-doc-example>

        <nxp-doc-example
          heading="Compare With (Object Values)"
          description="When binding object values, Angular's default reference equality fails. Pass compareWith to compare by a stable property (e.g., id)."
          [content]="{ HTML: compareHtml, TypeScript: compareTs }"
        >
          <div class="space-y-3">
            @for (fruit of fruits; track fruit.id) {
              <nxp-radio
                [compareWith]="fruitMatcher"
                [formControl]="fruitControl"
                [value]="fruit"
                name="fruit"
              >
                <span class="text-sm text-gray-700 dark:text-gray-300">{{
                  fruit.label
                }}</span>
              </nxp-radio>
            }
          </div>
          <div
            class="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-600 dark:text-gray-400"
          >
            fruitControl.value =
            <strong>{{ fruitControl.value | json }}</strong>
          </div>
          <div class="flex gap-2 mt-3">
            <button
              type="button"
              (click)="setFruitById(2)"
              class="px-3 py-1.5 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Set to Banana (id=2) programmatically
            </button>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Dark Mode"
          description="All color variants rendered on a dark background. Each radio automatically adapts."
          [content]="{ HTML: darkHtml, TypeScript: darkTs }"
        >
          <div
            class="bg-gray-900 rounded-xl border border-gray-700 p-6 space-y-4"
          >
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              @for (color of colors; track color) {
                <div class="space-y-2">
                  <p
                    class="text-xs font-medium text-gray-400 uppercase tracking-wide"
                  >
                    {{ color }}
                  </p>
                  <div class="space-y-2">
                    <nxp-radio
                      [color]="color"
                      [name]="'dark-' + color"
                      value="a"
                      [checked]="true"
                    >
                      <span class="text-sm text-gray-300">Checked</span>
                    </nxp-radio>
                    <nxp-radio
                      [color]="color"
                      [name]="'dark-' + color"
                      value="b"
                    >
                      <span class="text-sm text-gray-300">Unchecked</span>
                    </nxp-radio>
                    <nxp-radio
                      [color]="color"
                      [name]="'dark-disabled-' + color"
                      value="c"
                      [disabled]="true"
                    >
                      <span class="text-sm text-gray-500">Disabled</span>
                    </nxp-radio>
                  </div>
                </div>
              }
            </div>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-radio-api [(size)]="size" [(color)]="color" />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class RadioDemoComponent {
  // ── Playground state — shared with the API tab via two-way bindings ─────
  readonly size = signal<NxpRadioSize>('m');
  readonly color = signal<NxpRadioColor>('primary');

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

  /** Custom equality that compares fruits by id. */
  readonly fruitMatcher = (a: Fruit, b: Fruit): boolean => a?.id === b?.id;

  setFruitById(id: number): void {
    // Simulate a new object reference (e.g., fetched from API) with the same id
    const found = this.fruits.find((f) => f.id === id);
    if (found) {
      // Pass a copy to demonstrate compareWith working across different references
      this.fruitControl.setValue({ ...found });
    }
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly playgroundHtml = `<nxp-radio
  [size]="size()"
  [color]="color()"
  name="playground"
  value="a"
  [checked]="true"
>
  size = {{ size() }}, color = {{ color() }}
</nxp-radio>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NxpRadio,
  type NxpRadioColor,
  type NxpRadioSize,
} from '@ngxpro/cdk/components/radio';

@Component({
  selector: 'app-playground',
  imports: [...NxpRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundRadioExample {
  readonly size = signal<NxpRadioSize>('m');
  readonly color = signal<NxpRadioColor>('primary');
}`;

  readonly sizesHtml = `<div class="flex items-center gap-8">
  @for (s of sizes; track s) {
    <nxp-radio [size]="s" name="size-demo" [value]="s" [(ngModel)]="selectedSize">
      <span class="capitalize">{{ s }}</span>
    </nxp-radio>
  }
</div>
<p class="mt-3">Selected: {{ selectedSize() }}</p>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpRadio, type NxpRadioSize } from '@ngxpro/cdk/components/radio';

@Component({
  selector: 'app-sizes',
  imports: [FormsModule, ...NxpRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes.html',
})
export class SizesRadioExample {
  readonly sizes: NxpRadioSize[] = ['s', 'm', 'l'];
  readonly selectedSize = signal<NxpRadioSize>('m');
}`;

  readonly colorsHtml = `<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
  @for (color of colors; track color) {
    <div class="space-y-2">
      <p class="text-xs font-medium uppercase tracking-wide">{{ color }}</p>
      <div class="space-y-2">
        <nxp-radio [color]="color" [name]="'color-' + color" value="option1" [checked]="true">
          <span class="text-sm">Option 1 (checked)</span>
        </nxp-radio>
        <nxp-radio [color]="color" [name]="'color-' + color" value="option2">
          <span class="text-sm">Option 2</span>
        </nxp-radio>
      </div>
    </div>
  }
</div>`;

  readonly colorsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpRadio, type NxpRadioColor } from '@ngxpro/cdk/components/radio';

@Component({
  selector: 'app-colors',
  imports: [...NxpRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './colors.html',
})
export class ColorsRadioExample {
  readonly colors: NxpRadioColor[] = ['primary', 'secondary', 'danger'];
}`;

  readonly disabledHtml = `<div class="flex flex-wrap gap-6">
  <nxp-radio name="disabled-demo" value="a" [disabled]="true">
    <span class="text-sm">Disabled unchecked</span>
  </nxp-radio>
  <nxp-radio name="disabled-demo" value="b" [checked]="true" [disabled]="true">
    <span class="text-sm">Disabled checked</span>
  </nxp-radio>
  <nxp-radio color="danger" name="disabled-demo-2" value="c" [disabled]="true">
    <span class="text-sm">Danger disabled</span>
  </nxp-radio>
</div>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpRadio } from '@ngxpro/cdk/components/radio';

@Component({
  selector: 'app-disabled',
  imports: [...NxpRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled.html',
})
export class DisabledRadioExample {}`;

  readonly reactiveFormsHtml = `<div class="space-y-3">
  @for (plan of plans; track plan) {
    <nxp-radio [formControl]="planControl" [value]="plan.value" name="plan">
      <div>
        <p class="text-sm font-medium">{{ plan.label }}</p>
        <p class="text-xs">{{ plan.description }}</p>
      </div>
    </nxp-radio>
  }
</div>
<div class="mt-4 p-3 rounded-lg text-xs font-mono">
  planControl.value = <strong>{{ planControl.value | json }}</strong>
</div>
<div class="flex gap-2 mt-3">
  <button type="button" (click)="planControl.disable()">Disable control</button>
  <button type="button" (click)="planControl.enable()">Enable control</button>
  <button type="button" (click)="planControl.reset()">Reset</button>
</div>`;

  readonly reactiveFormsTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpRadio } from '@ngxpro/cdk/components/radio';

@Component({
  selector: 'app-reactive-forms',
  imports: [JsonPipe, ReactiveFormsModule, ...NxpRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reactive-forms.html',
})
export class ReactiveFormsRadioExample {
  readonly plans = [
    { value: 'free', label: 'Free', description: 'Up to 3 projects, 5 GB storage' },
    { value: 'pro', label: 'Pro', description: 'Unlimited projects, 100 GB storage' },
    { value: 'enterprise', label: 'Enterprise', description: 'Custom storage, SSO, audit logs' },
  ];

  readonly planControl = new FormControl<string>('pro');
}`;

  readonly compareHtml = `<div class="space-y-3">
  @for (fruit of fruits; track fruit.id) {
    <nxp-radio
      [compareWith]="fruitMatcher"
      [formControl]="fruitControl"
      [value]="fruit"
      name="fruit"
    >
      <span class="text-sm">{{ fruit.label }}</span>
    </nxp-radio>
  }
</div>
<div class="mt-4 p-3 rounded-lg text-xs font-mono">
  fruitControl.value = <strong>{{ fruitControl.value | json }}</strong>
</div>
<button type="button" (click)="setFruitById(2)">
  Set to Banana (id=2) programmatically
</button>`;

  readonly compareTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpRadio } from '@ngxpro/cdk/components/radio';

interface Fruit {
  id: number;
  label: string;
}

@Component({
  selector: 'app-compare-with',
  imports: [JsonPipe, ReactiveFormsModule, ...NxpRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compare-with.html',
})
export class CompareWithRadioExample {
  readonly fruits: Fruit[] = [
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Banana' },
    { id: 3, label: 'Cherry' },
  ];

  readonly fruitControl = new FormControl<Fruit | null>(this.fruits[0]);

  /** Custom equality that compares fruits by id. */
  readonly fruitMatcher = (a: Fruit, b: Fruit): boolean => a?.id === b?.id;

  setFruitById(id: number): void {
    const found = this.fruits.find((f) => f.id === id);
    if (found) {
      this.fruitControl.setValue({ ...found });
    }
  }
}`;

  readonly darkHtml = `<div class="bg-gray-900 rounded-xl border border-gray-700 p-6 space-y-4">
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    @for (color of colors; track color) {
      <div class="space-y-2">
        <p class="text-xs font-medium uppercase tracking-wide">{{ color }}</p>
        <div class="space-y-2">
          <nxp-radio [color]="color" [name]="'dark-' + color" value="a" [checked]="true">
            <span class="text-sm">Checked</span>
          </nxp-radio>
          <nxp-radio [color]="color" [name]="'dark-' + color" value="b">
            <span class="text-sm">Unchecked</span>
          </nxp-radio>
          <nxp-radio [color]="color" [name]="'dark-disabled-' + color" value="c" [disabled]="true">
            <span class="text-sm">Disabled</span>
          </nxp-radio>
        </div>
      </div>
    }
  </div>
</div>`;

  readonly darkTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpRadio, type NxpRadioColor } from '@ngxpro/cdk/components/radio';

@Component({
  selector: 'app-dark-mode',
  imports: [...NxpRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dark-mode.html',
})
export class DarkModeRadioExample {
  readonly colors: NxpRadioColor[] = ['primary', 'secondary', 'danger'];
}`;
}
