import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpInputPinComponent } from '@nxp/components/input-pin';

@Component({
  selector: 'app-input-pin-demo',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NxpInputPinComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div class="max-w-4xl mx-auto space-y-16">
        <!-- Page header -->
        <div>
          <a routerLink="/" class="text-sm text-blue-500 hover:underline"
            >← Back to home</a
          >
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Input PIN
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            PIN / OTP code input with individual visual cells backed by a single
            hidden native input. Supports numeric and alphanumeric modes,
            password masking, configurable length, and full Angular forms
            integration.
          </p>
        </div>

        <!-- Section: Basic usage -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Basic usage
          </h2>

          <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
            <!-- Signal binding -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Signal binding (6-digit)
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Click any cell or use keyboard. Characters auto-advance to the
                next cell.
              </p>
              <nxp-input-pin
                [length]="6"
                (valueChange)="basicPin.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{ basicPin() || '(empty)' }}</code>
              </p>
            </div>

            <!-- ngModel -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Two-way [(ngModel)]
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Template-driven forms with two-way binding.
              </p>
              <nxp-input-pin [(ngModel)]="ngModelPin" [length]="4" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                ngModel:
                <code class="font-mono">{{ ngModelPin || '(empty)' }}</code>
              </p>
            </div>

            <!-- Reactive form -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Reactive FormControl
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Works with
                <code class="font-mono text-xs">FormControl&lt;string&gt;</code
                >.
              </p>
              <nxp-input-pin [formControl]="pinControl" [length]="6" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Control:
                <code class="font-mono">{{
                  pinControl.value || '(empty)'
                }}</code>
              </p>
            </div>

            <!-- 4-digit short PIN -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                4-digit PIN
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Shorter length for bank PINs or short codes.
              </p>
              <nxp-input-pin
                [length]="4"
                (valueChange)="shortPin.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{ shortPin() || '(empty)' }}</code>
              </p>
            </div>
          </div>
        </section>

        <!-- Section: Mask & type -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Mask & type
          </h2>

          <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
            <!-- Password mask (default) -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Password mask (default)
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Filled cells show bullets (●) instead of actual characters.
              </p>
              <nxp-input-pin
                [length]="6"
                mask="password"
                (valueChange)="maskedPin.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{ maskedPin() || '(empty)' }}</code>
              </p>
            </div>

            <!-- Visible text mask -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Visible text
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <code class="font-mono text-xs">mask="text"</code> shows the
                actual characters.
              </p>
              <nxp-input-pin
                [length]="6"
                mask="text"
                (valueChange)="visiblePin.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{ visiblePin() || '(empty)' }}</code>
              </p>
            </div>

            <!-- Alphanumeric -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Alphanumeric
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <code class="font-mono text-xs">type="alphanumeric"</code>
                accepts letters and digits.
              </p>
              <nxp-input-pin
                [length]="6"
                type="alphanumeric"
                mask="text"
                (valueChange)="alphaPin.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{ alphaPin() || '(empty)' }}</code>
              </p>
            </div>

            <!-- Numeric only (default) -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Numeric only (default)
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <code class="font-mono text-xs">type="numeric"</code>
                strips non-digit input automatically.
              </p>
              <nxp-input-pin
                [length]="6"
                type="numeric"
                mask="text"
                (valueChange)="numericPin.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{ numericPin() || '(empty)' }}</code>
              </p>
            </div>
          </div>
        </section>

        <!-- Section: States -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            States
          </h2>

          <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            <!-- Error / invalid -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Error state
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <code class="font-mono text-xs">[invalid]="true"</code>
                shows red borders and error ring on all cells.
              </p>
              <nxp-input-pin
                [length]="6"
                [invalid]="true"
                mask="text"
                (valueChange)="errorPin.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{ errorPin() || '(empty)' }}</code>
              </p>
            </div>

            <!-- Disabled -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Disabled state
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Non-interactive when disabled. Cells appear muted.
              </p>
              <nxp-input-pin [length]="6" [disabled]="true" />
            </div>

            <!-- Custom placeholder -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Custom placeholder
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Override the default "·" placeholder character with a dash.
              </p>
              <nxp-input-pin
                [length]="6"
                placeholder="-"
                mask="text"
                (valueChange)="placeholderPin.set($event)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Value:
                <code class="font-mono">{{
                  placeholderPin() || '(empty)'
                }}</code>
              </p>
            </div>
          </div>
        </section>

        <!-- Section: API reference -->
        <section class="space-y-6">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            API reference
          </h2>

          <div class="overflow-x-auto">
            <table
              class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300"
            >
              <thead
                class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <tr>
                  <th class="px-4 py-2">Input</th>
                  <th class="px-4 py-2">Type</th>
                  <th class="px-4 py-2">Default</th>
                  <th class="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-2 font-mono">length</td>
                  <td class="px-4 py-2 font-mono">number</td>
                  <td class="px-4 py-2 font-mono">6</td>
                  <td class="px-4 py-2">Number of PIN cells</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">type</td>
                  <td class="px-4 py-2 font-mono">
                    'numeric' | 'alphanumeric'
                  </td>
                  <td class="px-4 py-2 font-mono">'numeric'</td>
                  <td class="px-4 py-2">
                    Restrict to digits only or allow letters
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">mask</td>
                  <td class="px-4 py-2 font-mono">'password' | 'text'</td>
                  <td class="px-4 py-2 font-mono">'password'</td>
                  <td class="px-4 py-2">
                    Show bullets or actual characters in cells
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">placeholder</td>
                  <td class="px-4 py-2 font-mono">string</td>
                  <td class="px-4 py-2 font-mono">'·'</td>
                  <td class="px-4 py-2">
                    Character shown in empty cells
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">disabled</td>
                  <td class="px-4 py-2 font-mono">boolean</td>
                  <td class="px-4 py-2 font-mono">false</td>
                  <td class="px-4 py-2">Whether the input is disabled</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">invalid</td>
                  <td class="px-4 py-2 font-mono">boolean</td>
                  <td class="px-4 py-2 font-mono">false</td>
                  <td class="px-4 py-2">
                    Whether the input shows error styling
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="overflow-x-auto mt-4">
            <table
              class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300"
            >
              <thead
                class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <tr>
                  <th class="px-4 py-2">Output</th>
                  <th class="px-4 py-2">Type</th>
                  <th class="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-2 font-mono">valueChange</td>
                  <td class="px-4 py-2 font-mono">string</td>
                  <td class="px-4 py-2">
                    Emitted whenever the PIN value changes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class InputPinDemoComponent {
  readonly basicPin = signal('');
  ngModelPin = '';
  readonly pinControl = new FormControl<string>('');

  readonly shortPin = signal('');
  readonly maskedPin = signal('');
  readonly visiblePin = signal('');
  readonly alphaPin = signal('');
  readonly numericPin = signal('');
  readonly errorPin = signal('');
  readonly placeholderPin = signal('');
}
