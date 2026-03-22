import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpInputDirective } from '@nxp/cdk/components/input';
import { NxpLabelDirective } from '@nxp/cdk/components/label';

@Component({
  selector: 'app-textfield-demo',
  standalone: true,
  imports: [RouterModule, NxpLabelDirective, NxpInputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div class="max-w-lg mx-auto space-y-8">

        <div>
          <a routerLink="/" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back
          </a>
          <h1 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Label &amp; Input</h1>
        </div>

        <!-- Search -->
        <div class="mx-auto max-w-xs space-y-2">
          <label nxpLabel for="search">Search</label>
          <input nxpInput placeholder="Search addresses" id="search" name="search" type="search" />
        </div>

        <!-- Email -->
        <div class="mx-auto max-w-xs space-y-2">
          <label nxpLabel for="email">Email address</label>
          <input nxpInput placeholder="you@example.com" id="email" name="email" type="email" />
        </div>

        <!-- Password -->
        <div class="mx-auto max-w-xs space-y-2">
          <label nxpLabel for="password">Password</label>
          <input nxpInput placeholder="••••••••" id="password" name="password" type="password" />
        </div>

        <!-- Disabled -->
        <div class="mx-auto max-w-xs space-y-2">
          <label nxpLabel [disabled]="true" for="disabled">Disabled</label>
          <input nxpInput id="disabled" name="disabled" type="text" value="john.doe" disabled />
        </div>

        <!-- Error -->
        <div class="mx-auto max-w-xs space-y-2">
          <label nxpLabel for="error">Email (error)</label>
          <input nxpInput id="error" name="error" type="email" value="not-an-email" [hasError]="true" />
          <p class="text-xs text-red-600 dark:text-red-400">Please enter a valid email address.</p>
        </div>

      </div>
    </div>
  `,
})
export class TextfieldDemoComponent {}
