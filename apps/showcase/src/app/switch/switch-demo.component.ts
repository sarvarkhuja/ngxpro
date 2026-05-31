import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';

import {
  NxpSwitch,
  type NxpSwitchColor,
  type NxpSwitchSize,
} from '@ngxpro/components/switch';
import { SwitchApiComponent } from './switch-api.component';

@Component({
  selector: 'app-switch-demo',
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...NxpSwitch,

    NxpDocComponentPage,
    NxpDocExampleComponent,
    SwitchApiComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nxp-doc-component-page
      header="Switch"
      package="components"
      type="component"
      path="components/switch"
    >
      <p class="text-base text-text-secondary mb-6">
        Toggle switch with spring animations, thumb morphing, and drag support.
        Hover for a pill shape, press for a squish, drag the thumb across the
        track for tactile control. Built on
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-switch</code
        >
        and integrates with Reactive Forms via
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >ControlValueAccessor</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Live preview driven by the API table — change values there to see the switch react. Drag the thumb across the track for a tactile toggle."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <nxp-switch
            [size]="size()"
            [color]="color()"
            [disabled]="disabled()"
            [class]="class()"
            [(checked)]="checked"
          >
            <span class="text-sm text-text-secondary">
              {{ checked() ? 'On' : 'Off' }}
            </span>
          </nxp-switch>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="Directive form — input[type=checkbox] nxpSwitch inside a label. Use the size input: s, m (default), l. The native-input toggle is CSS-only (no drag/spring); use <nxp-switch> for those."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="flex flex-wrap items-center gap-8 test 1">
            @for (s of sizes; track s) {
              <label class="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  nxpSwitch
                  [size]="s"
                  [(ngModel)]="sizeOn[s]"
                />
                <span
                  class="text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >{{ s }}</span
                >
              </label>
            }
          </div>
          <div class="flex flex-wrap items-center gap-8 mt-4">
            @for (s of sizes; track s) {}
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Color variants"
          description="Use the color input: primary, secondary, danger."
          [content]="{ HTML: colorsHtml, TypeScript: colorsTs }"
        >
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            @for (c of colors; track c) {
              <div class="space-y-3">
                <p
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  {{ c }}
                </p>
                <nxp-switch [color]="c" [checked]="true">
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >On</span
                  >
                </nxp-switch>
                <nxp-switch [color]="c">
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Off</span
                  >
                </nxp-switch>
              </div>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled"
          description="Use the disabled input to render at 50% opacity and block pointer interactions."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <div class="flex flex-wrap items-center gap-8">
            <nxp-switch [disabled]="true" [checked]="true">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >On (disabled)</span
              >
            </nxp-switch>
            <nxp-switch [disabled]="true">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Off (disabled)</span
              >
            </nxp-switch>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Reactive forms"
          description="Bind with [formControl] — the switch implements ControlValueAccessor, so it integrates seamlessly with reactive form controls."
          [content]="{ HTML: reactiveHtml, TypeScript: reactiveTs }"
        >
          <div class="flex flex-wrap items-center gap-6">
            <nxp-switch [formControl]="notificationsCtrl">
              <span class="text-sm text-gray-700 dark:text-gray-300"
                >Notifications</span
              >
            </nxp-switch>
            <nxp-switch [formControl]="darkModeCtrl">
              <span class="text-sm text-gray-700 dark:text-gray-300"
                >Dark mode</span
              >
            </nxp-switch>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Value: notifications={{ notificationsCtrl.value | json }},
            darkMode={{ darkModeCtrl.value | json }}
          </p>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Two-way binding"
          description="Use [(checked)] for simple two-way binding with signals — no FormControl required."
          [content]="{ HTML: twoWayHtml, TypeScript: twoWayTs }"
        >
          <div class="flex flex-wrap items-center gap-6">
            <nxp-switch [(checked)]="twoWayValue" size="l">
              <span class="text-sm text-gray-700 dark:text-gray-300"
                >Large toggle</span
              >
            </nxp-switch>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Signal value: {{ twoWayValue() }}
          </p>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Drag interaction"
          description="Click to toggle, or drag the thumb across the track. Hover for pill shape, press for squish."
          [content]="{ HTML: dragHtml, TypeScript: dragTs }"
        >
          <div class="flex flex-wrap items-center gap-8">
            @for (s of sizes; track s) {
              <nxp-switch [size]="s" color="primary">
                <span
                  class="text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >Drag me ({{ s }})</span
                >
              </nxp-switch>
            }
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-switch-api
          [(checked)]="checked"
          [(size)]="size"
          [(color)]="color"
          [(disabled)]="disabled"
          [(class)]="class"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class SwitchDemoComponent {
  // ── Playground state shared with the API tab ───────────────────────────────
  readonly checked = signal(false);
  readonly size = signal<NxpSwitchSize>('m');
  readonly color = signal<NxpSwitchColor>('primary');
  readonly disabled = signal(false);
  readonly class = signal('');

  // ── Preserved demo state ───────────────────────────────────────────────────
  readonly sizes: readonly NxpSwitchSize[] = ['s', 'm', 'l'];
  readonly colors: readonly NxpSwitchColor[] = [
    'primary',
    'secondary',
    'danger',
  ];

  // Per-size toggle state for the directive-based Sizes example.
  readonly sizeOn: Record<NxpSwitchSize, boolean> = {
    s: true,
    m: true,
    l: true,
  };
  readonly sizeOff: Record<NxpSwitchSize, boolean> = {
    s: false,
    m: false,
    l: false,
  };

  readonly notificationsCtrl = new FormControl<boolean>(true);
  readonly darkModeCtrl = new FormControl<boolean>(false);
  readonly twoWayValue = signal(false);

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly playgroundHtml = `<nxp-switch
  [size]="size()"
  [color]="color()"
  [disabled]="disabled()"
  [class]="class()"
  [(checked)]="checked"
>
  <span class="text-sm text-text-secondary">
    {{ checked() ? 'On' : 'Off' }}
  </span>
</nxp-switch>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NxpSwitch,
  type NxpSwitchColor,
  type NxpSwitchSize,
} from '@ngxpro/components/switch';

@Component({
  selector: 'app-playground',
  imports: [...NxpSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundSwitchExample {
  readonly checked = signal(false);
  readonly size = signal<NxpSwitchSize>('m');
  readonly color = signal<NxpSwitchColor>('primary');
  readonly disabled = signal(false);
  readonly class = signal('');
}`;

  readonly sizesHtml = `<div class="flex flex-wrap items-center gap-8">
  @for (s of sizes; track s) {
    <label class="inline-flex items-center gap-2">
      <input type="checkbox" nxpSwitch [size]="s" [(ngModel)]="sizeOn[s]" />
      <span class="text-sm capitalize">{{ s }}</span>
    </label>
  }
</div>
<div class="flex flex-wrap items-center gap-8 mt-4">
  @for (s of sizes; track s) {
    <label class="inline-flex items-center gap-2">
      <input type="checkbox" nxpSwitch [size]="s" [(ngModel)]="sizeOff[s]" />
      <span class="text-sm capitalize">{{ s }} (unchecked)</span>
    </label>
  }
</div>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NxpSwitchDirective,
  type NxpSwitchDirectiveSize,
} from '@ngxpro/cdk/components/switch';

@Component({
  selector: 'app-sizes',
  imports: [FormsModule, NxpSwitchDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes.html',
})
export class SizesSwitchExample {
  readonly sizes: readonly NxpSwitchDirectiveSize[] = ['s', 'm', 'l'];
  readonly sizeOn: Record<NxpSwitchDirectiveSize, boolean> = {
    s: true,
    m: true,
    l: true,
  };
  readonly sizeOff: Record<NxpSwitchDirectiveSize, boolean> = {
    s: false,
    m: false,
    l: false,
  };
}`;

  readonly colorsHtml = `<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
  @for (c of colors; track c) {
    <div class="space-y-3">
      <p class="text-xs font-medium uppercase tracking-wide">{{ c }}</p>
      <nxp-switch [color]="c" [checked]="true">
        <span class="text-sm">On</span>
      </nxp-switch>
      <nxp-switch [color]="c">
        <span class="text-sm">Off</span>
      </nxp-switch>
    </div>
  }
</div>`;

  readonly colorsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpSwitch, type NxpSwitchColor } from '@ngxpro/components/switch';

@Component({
  selector: 'app-colors',
  imports: [...NxpSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './colors.html',
})
export class ColorsSwitchExample {
  readonly colors: readonly NxpSwitchColor[] = ['primary', 'secondary', 'danger'];
}`;

  readonly disabledHtml = `<div class="flex flex-wrap items-center gap-8">
  <nxp-switch [disabled]="true" [checked]="true">
    <span class="text-sm">On (disabled)</span>
  </nxp-switch>
  <nxp-switch [disabled]="true">
    <span class="text-sm">Off (disabled)</span>
  </nxp-switch>
</div>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpSwitch } from '@ngxpro/components/switch';

@Component({
  selector: 'app-disabled',
  imports: [...NxpSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled.html',
})
export class DisabledSwitchExample {}`;

  readonly reactiveHtml = `<div class="flex flex-wrap items-center gap-6">
  <nxp-switch [formControl]="notificationsCtrl">
    <span class="text-sm">Notifications</span>
  </nxp-switch>
  <nxp-switch [formControl]="darkModeCtrl">
    <span class="text-sm">Dark mode</span>
  </nxp-switch>
</div>
<p class="mt-3 text-xs">
  Value: notifications={{ notificationsCtrl.value | json }},
  darkMode={{ darkModeCtrl.value | json }}
</p>`;

  readonly reactiveTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpSwitch } from '@ngxpro/components/switch';

@Component({
  selector: 'app-reactive',
  imports: [JsonPipe, ReactiveFormsModule, ...NxpSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reactive.html',
})
export class ReactiveSwitchExample {
  readonly notificationsCtrl = new FormControl<boolean>(true);
  readonly darkModeCtrl = new FormControl<boolean>(false);
}`;

  readonly twoWayHtml = `<div class="flex flex-wrap items-center gap-6">
  <nxp-switch [(checked)]="twoWayValue" size="l">
    <span class="text-sm">Large toggle</span>
  </nxp-switch>
</div>
<p class="mt-3 text-xs">Signal value: {{ twoWayValue() }}</p>`;

  readonly twoWayTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSwitch } from '@ngxpro/components/switch';

@Component({
  selector: 'app-two-way',
  imports: [...NxpSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './two-way.html',
})
export class TwoWaySwitchExample {
  readonly twoWayValue = signal(false);
}`;

  readonly dragHtml = `<div class="flex flex-wrap items-center gap-8">
  @for (s of sizes; track s) {
    <nxp-switch [size]="s" color="primary">
      <span class="text-sm capitalize">Drag me ({{ s }})</span>
    </nxp-switch>
  }
</div>`;

  readonly dragTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpSwitch, type NxpSwitchSize } from '@ngxpro/components/switch';

@Component({
  selector: 'app-drag',
  imports: [...NxpSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drag.html',
})
export class DragSwitchExample {
  readonly sizes: readonly NxpSwitchSize[] = ['s', 'm', 'l'];
}`;
}
