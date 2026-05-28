import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpCheckboxComponent } from '@ngxpro/cdk/components/checkbox';
import { NxpRadioComponent } from '@ngxpro/cdk/components/radio';
import {
  NxpBlockDirective,
  NxpBlockGroupComponent,
} from '@ngxpro/components/block';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { BlockApiComponent } from './block-api.component';

@Component({
  selector: 'app-block-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NxpBlockDirective,
    NxpBlockGroupComponent,
    NxpCheckboxComponent,
    NxpRadioComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    BlockApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Block"
      package="components"
      type="component"
      path="components/block"
    >
      <p class="text-base text-text-secondary mb-6">
        Selectable cards with animated proximity indicators for hover, focus,
        and selection. Wrap a checkbox or radio in a
        <code class="text-sm bg-bg-neutral-1 dark:bg-bg-neutral-2 px-1 rounded"
          >[nxpBlock]</code
        >
        host and group them under
        <code class="text-sm bg-bg-neutral-1 dark:bg-bg-neutral-2 px-1 rounded"
          >nxp-block-group</code
        >
        for a fluid, animated selection surface.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Radio selection"
          description="Single-choice plan picker. The block group animates a pill to the selected item and tracks hover on the others."
          [content]="{ HTML: radioHtml, TypeScript: radioTs }"
        >
          <nxp-block-group
            [(checkedIndex)]="selectedPlan"
            class="w-full max-w-sm"
          >
            <label nxpBlock size="m">
              <input type="radio" name="plan" value="free" nxpRadio checked />
              <span class="flex flex-col">
                <span class="font-medium text-text-primary">Free</span>
                <span class="text-text-secondary"
                  >Up to 3 projects, 1 GB storage</span
                >
              </span>
            </label>
            <label nxpBlock size="m">
              <input type="radio" name="plan" value="pro" nxpRadio />
              <span class="flex flex-col">
                <span class="font-medium text-text-primary">Pro</span>
                <span class="text-text-secondary"
                  >Unlimited projects, 100 GB storage</span
                >
              </span>
            </label>
            <label nxpBlock size="m">
              <input type="radio" name="plan" value="enterprise" nxpRadio />
              <span class="flex flex-col">
                <span class="font-medium text-text-primary">Enterprise</span>
                <span class="text-text-secondary"
                  >Custom limits, SSO, dedicated support</span
                >
              </span>
            </label>
          </nxp-block-group>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Checkbox selection"
          description="Multi-choice variant using <nxp-checkbox> inside [nxpBlock]. The checkbox component owns its toggle, so the wrapper is a plain <div> — no <label> forwarding."
          [content]="{ HTML: checkboxHtml, TypeScript: checkboxTs }"
        >
          <nxp-block-group class="w-full max-w-sm">
            <div nxpBlock size="m">
              <nxp-checkbox [formControl]="features['notifications']">
                <span class="flex flex-col">
                  <span class="font-medium text-text-primary"
                    >Notifications</span
                  >
                  <span class="text-text-secondary">Email and push alerts</span>
                </span>
              </nxp-checkbox>
            </div>
            <div nxpBlock size="m">
              <nxp-checkbox [formControl]="features['analytics']">
                <span class="flex flex-col">
                  <span class="font-medium text-text-primary">Analytics</span>
                  <span class="text-text-secondary"
                    >Usage reports and dashboards</span
                  >
                </span>
              </nxp-checkbox>
            </div>
            <div nxpBlock size="m">
              <nxp-checkbox [formControl]="features['api']">
                <span class="flex flex-col">
                  <span class="font-medium text-text-primary">API access</span>
                  <span class="text-text-secondary"
                    >REST and GraphQL endpoints</span
                  >
                </span>
              </nxp-checkbox>
            </div>
          </nxp-block-group>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="Three sizes — s, m, l — adjust padding and typography."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <nxp-block-group
            [(checkedIndex)]="selectedSize"
            class="w-full max-w-sm"
          >
            <label nxpBlock size="s">
              <input type="radio" name="size" value="s" nxpRadio checked />
              <span class="font-medium text-text-primary">Small</span>
            </label>
            <label nxpBlock size="m">
              <input type="radio" name="size" value="m" nxpRadio />
              <span class="font-medium text-text-primary">Medium</span>
            </label>
            <label nxpBlock size="l">
              <input type="radio" name="size" value="l" nxpRadio />
              <span class="font-medium text-text-primary">Large</span>
            </label>
          </nxp-block-group>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled state"
          description="Disabled blocks remain visible but non-interactive — the disabled signal is mirrored from the projected NgControl on <nxp-checkbox>."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <nxp-block-group class="w-full max-w-sm">
            <div nxpBlock size="m">
              <nxp-checkbox [formControl]="disabledControl">
                <span class="flex flex-col">
                  <span class="font-medium text-text-primary"
                    >Disabled option</span
                  >
                  <span class="text-text-secondary"
                    >This block is not interactive</span
                  >
                </span>
              </nxp-checkbox>
            </div>
            <div nxpBlock size="m">
              <nxp-checkbox [formControl]="disabledCheckedControl">
                <span class="flex flex-col">
                  <span class="font-medium text-text-primary"
                    >Disabled + checked</span
                  >
                  <span class="text-text-secondary"
                    >Checked but cannot be changed</span
                  >
                </span>
              </nxp-checkbox>
            </div>
          </nxp-block-group>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-block-api />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class BlockDemoComponent {
  readonly selectedPlan = signal<number | null>(0);
  readonly selectedSize = signal<number | null>(0);

  readonly features: Record<string, FormControl<boolean>> = {
    notifications: new FormControl<boolean>(true, { nonNullable: true }),
    analytics: new FormControl<boolean>(false, { nonNullable: true }),
    api: new FormControl<boolean>(false, { nonNullable: true }),
  };

  readonly disabledControl = new FormControl<boolean>(
    { value: false, disabled: true },
    { nonNullable: true },
  );

  readonly disabledCheckedControl = new FormControl<boolean>(
    { value: true, disabled: true },
    { nonNullable: true },
  );

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly radioHtml = `<nxp-block-group [(checkedIndex)]="selectedPlan" class="w-full max-w-sm">
  <label nxpBlock size="m">
    <input type="radio" name="plan" value="free" nxpRadio checked />
    <span class="flex flex-col">
      <span class="font-medium text-text-primary">Free</span>
      <span class="text-text-secondary">Up to 3 projects, 1 GB storage</span>
    </span>
  </label>
  <label nxpBlock size="m">
    <input type="radio" name="plan" value="pro" nxpRadio />
    <span class="flex flex-col">
      <span class="font-medium text-text-primary">Pro</span>
      <span class="text-text-secondary">Unlimited projects, 100 GB storage</span>
    </span>
  </label>
  <label nxpBlock size="m">
    <input type="radio" name="plan" value="enterprise" nxpRadio />
    <span class="flex flex-col">
      <span class="font-medium text-text-primary">Enterprise</span>
      <span class="text-text-secondary">Custom limits, SSO, dedicated support</span>
    </span>
  </label>
</nxp-block-group>`;

  readonly radioTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpRadioComponent } from '@ngxpro/cdk/components/radio';
import {
  NxpBlockDirective,
  NxpBlockGroupComponent,
} from '@ngxpro/components/block';

@Component({
  selector: 'app-radio-blocks',
  imports: [NxpBlockDirective, NxpBlockGroupComponent, NxpRadioComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-blocks.html',
})
export class RadioBlocksExample {
  readonly selectedPlan = signal<number | null>(0);
}`;

  readonly checkboxHtml = `<nxp-block-group class="w-full max-w-sm">
  <div nxpBlock size="m">
    <nxp-checkbox [formControl]="features['notifications']">
      <span class="flex flex-col">
        <span class="font-medium text-text-primary">Notifications</span>
        <span class="text-text-secondary">Email and push alerts</span>
      </span>
    </nxp-checkbox>
  </div>
  <div nxpBlock size="m">
    <nxp-checkbox [formControl]="features['analytics']">
      <span class="flex flex-col">
        <span class="font-medium text-text-primary">Analytics</span>
        <span class="text-text-secondary">Usage reports and dashboards</span>
      </span>
    </nxp-checkbox>
  </div>
  <div nxpBlock size="m">
    <nxp-checkbox [formControl]="features['api']">
      <span class="flex flex-col">
        <span class="font-medium text-text-primary">API access</span>
        <span class="text-text-secondary">REST and GraphQL endpoints</span>
      </span>
    </nxp-checkbox>
  </div>
</nxp-block-group>`;

  readonly checkboxTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpCheckboxComponent } from '@ngxpro/cdk/components/checkbox';
import {
  NxpBlockDirective,
  NxpBlockGroupComponent,
} from '@ngxpro/components/block';

@Component({
  selector: 'app-checkbox-blocks',
  imports: [
    ReactiveFormsModule,
    NxpBlockDirective,
    NxpBlockGroupComponent,
    NxpCheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox-blocks.html',
})
export class CheckboxBlocksExample {
  readonly features: Record<string, FormControl<boolean>> = {
    notifications: new FormControl<boolean>(true, { nonNullable: true }),
    analytics: new FormControl<boolean>(false, { nonNullable: true }),
    api: new FormControl<boolean>(false, { nonNullable: true }),
  };
}`;

  readonly sizesHtml = `<nxp-block-group [(checkedIndex)]="selectedSize" class="w-full max-w-sm">
  <label nxpBlock size="s">
    <input type="radio" name="size" value="s" nxpRadio checked />
    <span class="font-medium text-text-primary">Small</span>
  </label>
  <label nxpBlock size="m">
    <input type="radio" name="size" value="m" nxpRadio />
    <span class="font-medium text-text-primary">Medium</span>
  </label>
  <label nxpBlock size="l">
    <input type="radio" name="size" value="l" nxpRadio />
    <span class="font-medium text-text-primary">Large</span>
  </label>
</nxp-block-group>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpRadioComponent } from '@ngxpro/cdk/components/radio';
import {
  NxpBlockDirective,
  NxpBlockGroupComponent,
} from '@ngxpro/components/block';

@Component({
  selector: 'app-block-sizes',
  imports: [NxpBlockDirective, NxpBlockGroupComponent, NxpRadioComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './block-sizes.html',
})
export class BlockSizesExample {
  readonly selectedSize = signal<number | null>(0);
}`;

  readonly disabledHtml = `<nxp-block-group class="w-full max-w-sm">
  <div nxpBlock size="m">
    <nxp-checkbox [formControl]="disabledControl">
      <span class="flex flex-col">
        <span class="font-medium text-text-primary">Disabled option</span>
        <span class="text-text-secondary">This block is not interactive</span>
      </span>
    </nxp-checkbox>
  </div>
  <div nxpBlock size="m">
    <nxp-checkbox [formControl]="disabledCheckedControl">
      <span class="flex flex-col">
        <span class="font-medium text-text-primary">Disabled + checked</span>
        <span class="text-text-secondary">Checked but cannot be changed</span>
      </span>
    </nxp-checkbox>
  </div>
</nxp-block-group>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpCheckboxComponent } from '@ngxpro/cdk/components/checkbox';
import {
  NxpBlockDirective,
  NxpBlockGroupComponent,
} from '@ngxpro/components/block';

@Component({
  selector: 'app-disabled-blocks',
  imports: [
    ReactiveFormsModule,
    NxpBlockDirective,
    NxpBlockGroupComponent,
    NxpCheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-blocks.html',
})
export class DisabledBlocksExample {
  readonly disabledControl = new FormControl<boolean>(
    { value: false, disabled: true },
    { nonNullable: true },
  );

  readonly disabledCheckedControl = new FormControl<boolean>(
    { value: true, disabled: true },
    { nonNullable: true },
  );
}`;
}
