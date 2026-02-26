import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NxpBlockDirective,
  type NxpBlockAppearance,
  type NxpBlockSize,
} from '@nxp/components/block';

@Component({
  selector: 'app-block-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ReactiveFormsModule, NxpBlockDirective],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <!-- Back link -->
        <a routerLink="/" class="inline-flex items-center gap-1 mb-6 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          &larr; Back to showcase
        </a>

        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Block</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-10">
          Attribute directive that turns a <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">label</code>
          into a selectable card. Wrap a checkbox or radio inside to make the entire block clickable.
        </p>

        <!-- Size variants -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Sizes</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Three sizes: s, m, l. All with outline appearance.</p>
          <div class="flex flex-col gap-3 max-w-sm">
            @for (s of sizes; track s) {
              <label nxpBlock [size]="s" [formControl]="sizeControls[s]">
                <input type="checkbox" class="mt-0.5 rounded text-blue-600" [formControl]="sizeControls[s]" />
                <span class="flex flex-col">
                  <span class="font-medium text-gray-900 dark:text-white">Size {{ s }}</span>
                  <span class="text-gray-500 dark:text-gray-400">
                    @if (s === 's') { Compact padding px-3 py-2 }
                    @if (s === 'm') { Medium padding px-4 py-3 }
                    @if (s === 'l') { Large padding px-4 py-4 }
                  </span>
                </span>
              </label>
            }
          </div>
        </section>

        <!-- Appearance variants -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Appearances</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Five semantic appearances at size m.</p>
          <div class="flex flex-col gap-3 max-w-sm">
            @for (a of appearances; track a) {
              <label nxpBlock size="m" [appearance]="a" [formControl]="appearanceControls[a]">
                <input type="checkbox" class="mt-0.5 rounded text-blue-600" [formControl]="appearanceControls[a]" />
                <span class="flex flex-col">
                  <span class="font-medium text-gray-900 dark:text-white capitalize">{{ a }}</span>
                  <span class="text-gray-500 dark:text-gray-400">{{ appearanceDescriptions[a] }}</span>
                </span>
              </label>
            }
          </div>
        </section>

        <!-- Radio group example -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Radio group</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Blocks also work with radio inputs for single-choice selection.</p>
          <div class="flex flex-col gap-3 max-w-sm">
            <label nxpBlock size="m" appearance="outline">
              <input type="radio" name="plan" value="free" class="mt-0.5" />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Free</span>
                <span class="text-gray-500 dark:text-gray-400">Up to 3 projects, 1 GB storage</span>
              </span>
            </label>
            <label nxpBlock size="m" appearance="outline">
              <input type="radio" name="plan" value="pro" class="mt-0.5" />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Pro</span>
                <span class="text-gray-500 dark:text-gray-400">Unlimited projects, 100 GB storage</span>
              </span>
            </label>
            <label nxpBlock size="m" appearance="outline">
              <input type="radio" name="plan" value="enterprise" class="mt-0.5" />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Enterprise</span>
                <span class="text-gray-500 dark:text-gray-400">Custom limits, SSO, dedicated support</span>
              </span>
            </label>
          </div>
        </section>

        <!-- Disabled state -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Disabled state</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Disabled state is mirrored automatically from a nested <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">NgControl</code>.
          </p>
          <div class="flex flex-col gap-3 max-w-sm">
            <label nxpBlock size="m" [formControl]="disabledControl">
              <input type="checkbox" class="mt-0.5 rounded" [formControl]="disabledControl" />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Disabled option</span>
                <span class="text-gray-500 dark:text-gray-400">This block is not interactive</span>
              </span>
            </label>
            <label nxpBlock size="m" appearance="primary" [formControl]="disabledCheckedControl">
              <input type="checkbox" class="mt-0.5 rounded" [formControl]="disabledCheckedControl" />
              <span class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-white">Disabled + checked</span>
                <span class="text-gray-500 dark:text-gray-400">Checked but cannot be changed</span>
              </span>
            </label>
          </div>
        </section>

        <!-- Full matrix -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Full matrix</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Every appearance at every size.</p>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr>
                  <th class="text-left pr-4 py-2 font-medium text-gray-500 dark:text-gray-400">Appearance</th>
                  @for (s of sizes; track s) {
                    <th class="px-3 py-2 font-medium text-gray-500 dark:text-gray-400 text-center">{{ s }}</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (a of appearances; track a) {
                  <tr class="border-t border-gray-200 dark:border-gray-700">
                    <td class="pr-4 py-3 text-gray-700 dark:text-gray-300 capitalize font-medium">{{ a }}</td>
                    @for (s of sizes; track s) {
                      <td class="px-3 py-3">
                        <label nxpBlock [appearance]="a" [size]="s">
                          <input type="checkbox" class="rounded text-blue-600" />
                          <span class="text-gray-700 dark:text-gray-300 whitespace-nowrap">Option</span>
                        </label>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class BlockDemoComponent {
  readonly sizes: NxpBlockSize[] = ['s', 'm', 'l'];

  readonly appearances: NxpBlockAppearance[] = [
    'outline',
    'filled',
    'primary',
    'success',
    'danger',
  ];

  readonly appearanceDescriptions: Record<NxpBlockAppearance, string> = {
    outline: 'Default bordered style',
    filled:  'Subtle filled background',
    primary: 'Blue tint, selection intent',
    success: 'Green tint, positive option',
    danger:  'Red tint, destructive or warning',
  };

  readonly sizeControls: Record<NxpBlockSize, FormControl<boolean>> = {
    s: new FormControl<boolean>(false, { nonNullable: true }),
    m: new FormControl<boolean>(true,  { nonNullable: true }),
    l: new FormControl<boolean>(false, { nonNullable: true }),
  };

  readonly appearanceControls: Record<NxpBlockAppearance, FormControl<boolean>> = {
    outline: new FormControl<boolean>(false, { nonNullable: true }),
    filled:  new FormControl<boolean>(true,  { nonNullable: true }),
    primary: new FormControl<boolean>(false, { nonNullable: true }),
    success: new FormControl<boolean>(false, { nonNullable: true }),
    danger:  new FormControl<boolean>(false, { nonNullable: true }),
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
