import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpRangeComponent, type NxpKeySteps } from '@ngxpro/components/range';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { RangeApiComponent } from './range-api.component';

@Component({
  selector: 'app-range-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NxpRangeComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    RangeApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Range"
      package="components"
      type="component"
      path="components/range"
    >
      <p class="text-base text-text-secondary mb-6">
        Dual-thumb range slider
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-range</code
        >. Styled to match
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-slider-visual</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Basic range"
          description="Simple 0–100 range with ngModel."
          [content]="{ HTML: basicHtml, TypeScript: basicTs }"
        >
          <div class="w-full max-w-md space-y-2">
            <nxp-range
              [min]="min()"
              [max]="max()"
              [step]="step()"
              [margin]="margin()"
              [limit]="limit()"
              [showSteps]="showSteps()"
              [themeColor]="themeColor()"
              [label]="label()"
              [(disabled)]="disabled"
              [(ngModel)]="basicValue"
            />
            <p class="text-xs text-text-tertiary">
              Value: {{ basicValue | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Step dots"
          description="Pass showSteps with a coarse step to render dots along the track."
          [content]="{ HTML: steppedHtml, TypeScript: steppedTs }"
        >
          <div class="w-full max-w-md space-y-2">
            <nxp-range
              [showSteps]="true"
              [step]="10"
              [(ngModel)]="steppedValue"
            />
            <p class="text-xs text-text-tertiary">
              Value: {{ steppedValue | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Theme color"
          description="themeColor switches the fill, thumb, and focus ring to the primary theme color."
          [content]="{ HTML: themedHtml, TypeScript: themedTs }"
        >
          <div class="w-full max-w-md space-y-4">
            <div class="space-y-2">
              <nxp-range [themeColor]="true" [(ngModel)]="themedValue" />
              <p class="text-xs text-text-tertiary">
                Value: {{ themedValue | json }}
              </p>
            </div>
            <div class="space-y-2">
              <nxp-range
                [themeColor]="true"
                [showSteps]="true"
                [step]="10"
                [(ngModel)]="themedSteppedValue"
              />
              <p class="text-xs text-text-tertiary">
                Value: {{ themedSteppedValue | json }}
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Key Steps (non-linear)"
          description="Map slider positions to non-linear domain values."
          [content]="{ HTML: keyStepsHtml, TypeScript: keyStepsTs }"
        >
          <div class="w-full max-w-md space-y-2">
            <nxp-range
              [keySteps]="priceKeySteps"
              [step]="1"
              [(ngModel)]="keyStepValue"
            />
            <p class="text-xs text-text-tertiary">
              Value: {{ keyStepValue | json }} (range: 50k – 30M)
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Constraints (margin & limit)"
          description="margin enforces minimum distance; limit enforces maximum distance."
          [content]="{ HTML: constraintsHtml, TypeScript: constraintsTs }"
        >
          <div class="w-full max-w-md space-y-4">
            <div>
              <p class="text-xs text-text-tertiary mb-2">Margin = 10</p>
              <nxp-range [margin]="10" [(ngModel)]="marginValue" />
              <p class="text-xs text-text-tertiary">
                {{ marginValue | json }}
              </p>
            </div>
            <div>
              <p class="text-xs text-text-tertiary mb-2">Limit = 50</p>
              <nxp-range [limit]="50" [(ngModel)]="limitValue" />
              <p class="text-xs text-text-tertiary">
                {{ limitValue | json }}
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Reactive forms"
          description="Bind with [formControl]."
          [content]="{ HTML: reactiveHtml, TypeScript: reactiveTs }"
        >
          <div class="w-full max-w-md space-y-2">
            <nxp-range [formControl]="rangeCtrl" />
            <p class="text-xs text-text-tertiary">
              FormControl value: {{ rangeCtrl.value | json }}
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled"
          description="Set disabled to dim the slider and disable interaction."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <div class="w-full max-w-md space-y-2">
            <nxp-range [disabled]="true" [(ngModel)]="disabledValue" />
            <p class="text-xs text-text-tertiary">
              {{ disabledValue | json }}
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-range-api
          [(min)]="min"
          [(max)]="max"
          [(step)]="step"
          [(margin)]="margin"
          [(limit)]="limit"
          [(showSteps)]="showSteps"
          [(themeColor)]="themeColor"
          [(label)]="label"
          [(disabled)]="disabled"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class RangeDemoComponent {
  // ── Playground state shared with the API tab ──
  readonly min = signal(0);
  readonly max = signal(100);
  readonly step = signal(1);
  readonly margin = signal(0);
  readonly limit = signal(Infinity);
  readonly showSteps = signal(false);
  readonly themeColor = signal(false);
  readonly label = signal<string | undefined>(undefined);
  readonly disabled = signal(false);

  // ── Per-example state ──
  basicValue: [number, number] = [20, 80];
  steppedValue: [number, number] = [20, 80];
  themedValue: [number, number] = [25, 75];
  themedSteppedValue: [number, number] = [30, 70];

  priceKeySteps: NxpKeySteps = [
    [0, 50_000],
    [25, 200_000],
    [50, 1_000_000],
    [75, 5_000_000],
    [100, 30_000_000],
  ];
  keyStepValue: [number, number] = [200_000, 5_000_000];

  marginValue: [number, number] = [20, 60];
  limitValue: [number, number] = [30, 70];
  disabledValue: [number, number] = [25, 75];

  rangeCtrl = new FormControl<[number, number]>([15, 85]);

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly basicHtml = `<nxp-range [(ngModel)]="basicValue" />
<p>Value: {{ basicValue | json }}</p>`;

  readonly basicTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpRangeComponent } from '@ngxpro/components/range';

@Component({
  selector: 'app-basic-range',
  imports: [JsonPipe, FormsModule, NxpRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basic-range.html',
})
export class BasicRangeExample {
  basicValue: [number, number] = [20, 80];
}`;

  readonly steppedHtml = `<nxp-range
  [showSteps]="true"
  [step]="10"
  [(ngModel)]="steppedValue"
/>
<p>Value: {{ steppedValue | json }}</p>`;

  readonly steppedTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpRangeComponent } from '@ngxpro/components/range';

@Component({
  selector: 'app-stepped-range',
  imports: [JsonPipe, FormsModule, NxpRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stepped-range.html',
})
export class SteppedRangeExample {
  steppedValue: [number, number] = [20, 80];
}`;

  readonly themedHtml = `<nxp-range [themeColor]="true" [(ngModel)]="themedValue" />
<p>Value: {{ themedValue | json }}</p>

<nxp-range
  [themeColor]="true"
  [showSteps]="true"
  [step]="10"
  [(ngModel)]="themedSteppedValue"
/>
<p>Value: {{ themedSteppedValue | json }}</p>`;

  readonly themedTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpRangeComponent } from '@ngxpro/components/range';

@Component({
  selector: 'app-themed-range',
  imports: [JsonPipe, FormsModule, NxpRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './themed-range.html',
})
export class ThemedRangeExample {
  themedValue: [number, number] = [25, 75];
  themedSteppedValue: [number, number] = [30, 70];
}`;

  readonly keyStepsHtml = `<nxp-range
  [keySteps]="priceKeySteps"
  [step]="1"
  [(ngModel)]="keyStepValue"
/>
<p>Value: {{ keyStepValue | json }} (range: 50k – 30M)</p>`;

  readonly keyStepsTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpRangeComponent, type NxpKeySteps } from '@ngxpro/components/range';

@Component({
  selector: 'app-key-steps-range',
  imports: [JsonPipe, FormsModule, NxpRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './key-steps-range.html',
})
export class KeyStepsRangeExample {
  priceKeySteps: NxpKeySteps = [
    [0, 50_000],
    [25, 200_000],
    [50, 1_000_000],
    [75, 5_000_000],
    [100, 30_000_000],
  ];
  keyStepValue: [number, number] = [200_000, 5_000_000];
}`;

  readonly constraintsHtml = `<!-- Margin enforces minimum distance between thumbs -->
<nxp-range [margin]="10" [(ngModel)]="marginValue" />
<p>{{ marginValue | json }}</p>

<!-- Limit enforces maximum distance between thumbs -->
<nxp-range [limit]="50" [(ngModel)]="limitValue" />
<p>{{ limitValue | json }}</p>`;

  readonly constraintsTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpRangeComponent } from '@ngxpro/components/range';

@Component({
  selector: 'app-constraints-range',
  imports: [JsonPipe, FormsModule, NxpRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './constraints-range.html',
})
export class ConstraintsRangeExample {
  marginValue: [number, number] = [20, 60];
  limitValue: [number, number] = [30, 70];
}`;

  readonly reactiveHtml = `<nxp-range [formControl]="rangeCtrl" />
<p>FormControl value: {{ rangeCtrl.value | json }}</p>`;

  readonly reactiveTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpRangeComponent } from '@ngxpro/components/range';

@Component({
  selector: 'app-reactive-range',
  imports: [JsonPipe, ReactiveFormsModule, NxpRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reactive-range.html',
})
export class ReactiveRangeExample {
  rangeCtrl = new FormControl<[number, number]>([15, 85]);
}`;

  readonly disabledHtml = `<nxp-range [disabled]="true" [(ngModel)]="disabledValue" />
<p>{{ disabledValue | json }}</p>`;

  readonly disabledTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpRangeComponent } from '@ngxpro/components/range';

@Component({
  selector: 'app-disabled-range',
  imports: [JsonPipe, FormsModule, NxpRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-range.html',
})
export class DisabledRangeExample {
  disabledValue: [number, number] = [25, 75];
}`;
}
