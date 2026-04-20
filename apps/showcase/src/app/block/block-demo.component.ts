import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpCheckboxComponent } from '@nxp/cdk/components/checkbox';
import { NxpRadioComponent } from '@nxp/cdk/components/radio';
import { NxpBlockDirective, NxpBlockGroupComponent } from '@nxp/components/block';

@Component({
  selector: 'app-block-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ReactiveFormsModule, NxpBlockDirective, NxpBlockGroupComponent, NxpCheckboxComponent, NxpRadioComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <a routerLink="/" class="inline-flex items-center gap-1 mb-6 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          &larr; Back to showcase
        </a>

        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Block</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-10">
          Selectable cards with animated proximity indicators for hover, focus, and selection.
        </p>

        <!-- Radio selection -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Radio selection</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Single-choice plan picker with animated active pill.</p>
          <nxp-block-group [(checkedIndex)]="selectedPlan" class="max-w-sm">
            <label nxpBlock size="m">
              <input type="radio" name="plan" value="free" nxpRadio checked />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Free</span>
                <span class="text-gray-500 dark:text-gray-400">Up to 3 projects, 1 GB storage</span>
              </span>
            </label>
            <label nxpBlock size="m">
              <input type="radio" name="plan" value="pro" nxpRadio />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Pro</span>
                <span class="text-gray-500 dark:text-gray-400">Unlimited projects, 100 GB storage</span>
              </span>
            </label>
            <label nxpBlock size="m">
              <input type="radio" name="plan" value="enterprise" nxpRadio />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Enterprise</span>
                <span class="text-gray-500 dark:text-gray-400">Custom limits, SSO, dedicated support</span>
              </span>
            </label>
          </nxp-block-group>
        </section>

        <!-- Checkbox selection -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Checkbox selection</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Multi-choice with animated hover and focus tracking.</p>
          <nxp-block-group class="max-w-sm">
            <label nxpBlock size="m">
              <input type="checkbox" nxpCheckbox [formControl]="features['notifications']" />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Notifications</span>
                <span class="text-gray-500 dark:text-gray-400">Email and push alerts</span>
              </span>
            </label>
            <label nxpBlock size="m">
              <input type="checkbox" nxpCheckbox [formControl]="features['analytics']" />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Analytics</span>
                <span class="text-gray-500 dark:text-gray-400">Usage reports and dashboards</span>
              </span>
            </label>
            <label nxpBlock size="m">
              <input type="checkbox" nxpCheckbox [formControl]="features['api']" />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">API access</span>
                <span class="text-gray-500 dark:text-gray-400">REST and GraphQL endpoints</span>
              </span>
            </label>
          </nxp-block-group>
        </section>

        <!-- Sizes -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Sizes</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Three sizes: s, m, l.</p>
          <nxp-block-group [(checkedIndex)]="selectedSize" class="max-w-sm">
            <label nxpBlock size="s">
              <input type="radio" name="size" value="s" nxpRadio checked />
              <span class="font-medium text-gray-900 dark:text-white">Small</span>
            </label>
            <label nxpBlock size="m">
              <input type="radio" name="size" value="m" nxpRadio />
              <span class="font-medium text-gray-900 dark:text-white">Medium</span>
            </label>
            <label nxpBlock size="l">
              <input type="radio" name="size" value="l" nxpRadio />
              <span class="font-medium text-gray-900 dark:text-white">Large</span>
            </label>
          </nxp-block-group>
        </section>

        <!-- Disabled -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Disabled state</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Disabled blocks remain visible but non-interactive.</p>
          <nxp-block-group class="max-w-sm">
            <label nxpBlock size="m">
              <input type="checkbox" nxpCheckbox [formControl]="disabledControl" />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Disabled option</span>
                <span class="text-gray-500 dark:text-gray-400">This block is not interactive</span>
              </span>
            </label>
            <label nxpBlock size="m">
              <input type="checkbox" nxpCheckbox [formControl]="disabledCheckedControl" />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Disabled + checked</span>
                <span class="text-gray-500 dark:text-gray-400">Checked but cannot be changed</span>
              </span>
            </label>
          </nxp-block-group>
        </section>
      </div>
    </div>
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
}
