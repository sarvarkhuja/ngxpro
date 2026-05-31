import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NxpBlockDirective,
  NxpBlockGroupComponent,
} from '@ngxpro/components/block';
import { NxpRadioComponent } from '@ngxpro/cdk/components/radio';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { DateInputsApiComponent } from '../date-inputs/date-inputs-api.component';

@Component({
  selector: 'app-block-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NxpBlockDirective,
    NxpBlockGroupComponent,
    NxpRadioComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    DateInputsApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Block"
      package="components"
      type="component"
      path="components/block"
    >
      <p class="text-base text-text-secondary mb-6">
        A
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >block</code
        >
        is a styled, selectable container — typically wrapping a radio or
        checkbox — used to build segmented option pickers, plan selectors, and
        settings cards.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Plan selector"
          description="Three blocks wrapping radios. Click a block to select it."
          [content]="{ HTML: planHtml, TypeScript: planTs }"
        >
          <nxp-block-group class="flex flex-col gap-3 max-w-md">
            <div nxpBlock class="cursor-pointer">
              <nxp-radio name="plan" value="free" [checked]="true">
                <div>
                  <p class="font-medium text-text-primary">Free</p>
                  <p class="text-sm text-text-secondary">
                    Up to 3 projects, 5 GB storage
                  </p>
                </div>
              </nxp-radio>
            </div>
            <div nxpBlock class="cursor-pointer">
              <nxp-radio name="plan" value="pro">
                <div>
                  <p class="font-medium text-text-primary">Pro</p>
                  <p class="text-sm text-text-secondary">
                    Unlimited projects, 100 GB storage
                  </p>
                </div>
              </nxp-radio>
            </div>
            <div nxpBlock class="cursor-pointer">
              <nxp-radio name="plan" value="enterprise">
                <div>
                  <p class="font-medium text-text-primary">Enterprise</p>
                  <p class="text-sm text-text-secondary">
                    Custom storage, SSO, audit logs
                  </p>
                </div>
              </nxp-radio>
            </div>
          </nxp-block-group>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="Blocks come in three sizes via the size input."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="space-y-6">
            @for (size of sizes; track size) {
              <div>
                <p
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2"
                >
                  {{ size }}
                </p>
                <nxp-block-group class="flex flex-wrap gap-3">
                  <div nxpBlock [size]="size" class="cursor-pointer">
                    <nxp-radio
                      [name]="'size-' + size"
                      value="a"
                      [checked]="true"
                    >
                      <span class="text-sm text-text-primary">Option A</span>
                    </nxp-radio>
                  </div>
                  <div nxpBlock [size]="size" class="cursor-pointer">
                    <nxp-radio [name]="'size-' + size" value="b">
                      <span class="text-sm text-text-primary">Option B</span>
                    </nxp-radio>
                  </div>
                </nxp-block-group>
              </div>
            }
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-date-inputs-api />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class BlockDemoComponent {
  readonly sizes = ['s', 'm', 'l'] as const;

  // ─────────── Source snippets ───────────
  readonly planHtml = `<nxp-block-group class="flex flex-col gap-3 max-w-md">
  <div nxpBlock class="cursor-pointer">
    <nxp-radio name="plan" value="free" [checked]="true">
      <div>
        <p class="font-medium text-text-primary">Free</p>
        <p class="text-sm text-text-secondary">Up to 3 projects, 5 GB storage</p>
      </div>
    </nxp-radio>
  </div>
  <div nxpBlock class="cursor-pointer">
    <nxp-radio name="plan" value="pro">
      <div>
        <p class="font-medium text-text-primary">Pro</p>
        <p class="text-sm text-text-secondary">Unlimited projects, 100 GB storage</p>
      </div>
    </nxp-radio>
  </div>
  <div nxpBlock class="cursor-pointer">
    <nxp-radio name="plan" value="enterprise">
      <div>
        <p class="font-medium text-text-primary">Enterprise</p>
        <p class="text-sm text-text-secondary">Custom storage, SSO, audit logs</p>
      </div>
    </nxp-radio>
  </div>
</nxp-block-group>`;

  readonly planTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpBlockDirective, NxpBlockGroupComponent } from '@ngxpro/components/block';
import { NxpRadioComponent } from '@ngxpro/cdk/components/radio';

@Component({
  selector: 'app-plan-selector',
  imports: [NxpBlockDirective, NxpBlockGroupComponent, NxpRadioComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plan-selector.html',
})
export class PlanSelectorExample {}`;

  readonly sizesHtml = `<div class="space-y-6">
  @for (size of sizes; track size) {
    <div>
      <p class="text-xs font-medium uppercase tracking-wide mb-2">{{ size }}</p>
      <nxp-block-group class="flex flex-wrap gap-3">
        <div nxpBlock [size]="size" class="cursor-pointer">
          <nxp-radio [name]="'size-' + size" value="a" [checked]="true">
            <span class="text-sm text-text-primary">Option A</span>
          </nxp-radio>
        </div>
        <div nxpBlock [size]="size" class="cursor-pointer">
          <nxp-radio [name]="'size-' + size" value="b">
            <span class="text-sm text-text-primary">Option B</span>
          </nxp-radio>
        </div>
      </nxp-block-group>
    </div>
  }
</div>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpBlockDirective, NxpBlockGroupComponent } from '@ngxpro/components/block';
import { NxpRadioComponent } from '@ngxpro/cdk/components/radio';

@Component({
  selector: 'app-block-sizes',
  imports: [NxpBlockDirective, NxpBlockGroupComponent, NxpRadioComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './block-sizes.html',
})
export class BlockSizesExample {}`;
}
