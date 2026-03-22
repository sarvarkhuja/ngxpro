import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpStepper } from '@nxp/components/stepper';

@Component({
  selector: 'app-stepper-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, ...NxpStepper],
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-3xl mx-auto">
        <a
          routerLink="/"
          class="inline-flex items-center gap-1 mb-6 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Back to showcase
        </a>

        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Stepper
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-10">
          Linear step navigation with numbered, completed, and error indicators.
          Use
          <code
            class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
            >[(activeItemIndex)]</code
          >
          for the current step. Click a step or focus the stepper and use arrow
          keys to move. Steps use
          <code
            class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
            >nxpStep</code
          >
          on
          <code
            class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
            >button</code
          >
          elements. For a vertical layout, add
          <code
            class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
            >nxpConnected</code
          >
          on
          <code
            class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
            >nxp-stepper</code
          >
          to draw dashed lines between step circles (styles are injected once
          per document).
        </p>

        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Horizontal (default)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Typical wizard flow: previous and next update the same index as the
            stepper.
          </p>
          <nxp-stepper
            [activeItemIndex]="wizardStep()"
            (activeItemIndexChange)="onWizardStep($event)"
            class="mb-4"
            nxpConnected
          >
            <button nxpStep stepState="pass" type="button">
              <span class="text-left">
                <span class="font-medium text-gray-900 dark:text-white"
                  >Account</span
                >
                <span class="text-xs text-gray-500 dark:text-gray-400 block"
                  >Sign in or register</span
                >
              </span>
            </button>
            <button nxpStep type="button">
              <span class="text-left">
                <span class="font-medium text-gray-900 dark:text-white"
                  >Shipping</span
                >
                <span class="text-xs text-gray-500 dark:text-gray-400 block"
                  >Address &amp; delivery</span
                >
              </span>
            </button>
            <button nxpStep stepState="error" type="button">
              <span class="text-left">
                <span class="font-medium text-gray-900 dark:text-white"
                  >Payment</span
                >
                <span class="text-xs text-gray-500 dark:text-gray-400 block"
                  >Card details</span
                >
              </span>
            </button>
            <button nxpStep type="button">
              <span class="text-left">
                <span class="font-medium text-gray-900 dark:text-white"
                  >Review</span
                >
                <span class="text-xs text-gray-500 dark:text-gray-400 block"
                  >Confirm order</span
                >
              </span>
            </button>
          </nxp-stepper>
          <div
            class="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 mb-4"
          >
            @switch (wizardStep()) {
              @case (0) {
                <p>
                  <strong>Account</strong> — Step marked complete with
                  <code
                    class="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded"
                    >stepState="pass"</code
                  >.
                </p>
              }
              @case (1) {
                <p>
                  <strong>Shipping</strong> — In progress (<code
                    class="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded"
                    >normal</code
                  >).
                </p>
              }
              @case (2) {
                <p>
                  <strong>Payment</strong> — Validation issue shown with
                  <code
                    class="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded"
                    >stepState="error"</code
                  >.
                </p>
              }
              @case (3) {
                <p><strong>Review</strong> — Final confirmation.</p>
              }
            }
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Active index: {{ wizardStep() }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
              [disabled]="wizardStep() === 0"
              (click)="wizardBack()"
            >
              Back
            </button>
            <button
              type="button"
              class="px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
              [disabled]="wizardStep() === 3"
              (click)="wizardNext()"
            >
              Next
            </button>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Vertical with <code class="text-base font-mono">nxpConnected</code>
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Set
            <code
              class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >orientation="vertical"</code
            >
            and the host attribute
            <code
              class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >nxpConnected</code
            >
            so dashed connector lines run between consecutive step indicators.
            Use up/down arrows when the stepper is focused.
          </p>
          <div class="flex flex-col sm:flex-row gap-6">
            <nxp-stepper
              nxpConnected
              orientation="vertical"
              [activeItemIndex]="verticalStep()"
              (activeItemIndexChange)="onVerticalStep($event)"
              class="sm:w-56 shrink-0"
            >
              <button nxpStep stepState="pass" type="button">Basics</button>
              <button nxpStep type="button">Details</button>
              <button nxpStep type="button">Done</button>
            </nxp-stepper>
            <div
              class="flex-1 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 min-h-[120px]"
            >
              @switch (verticalStep()) {
                @case (0) {
                  <p>Vertical step 1 — basics.</p>
                }
                @case (1) {
                  <p>Vertical step 2 — details.</p>
                }
                @case (2) {
                  <p>Vertical step 3 — done.</p>
                }
              }
            </div>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Custom indicator
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Optional
            <code
              class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded"
              >icon</code
            >
            input replaces the step number when state is normal.
          </p>
          <nxp-stepper
            [activeItemIndex]="iconStep()"
            (activeItemIndexChange)="onIconStep($event)"
          >
            <button nxpStep icon="★" type="button">Favorite</button>
            <button nxpStep icon="⚙" type="button">Settings</button>
            <button nxpStep type="button">Plain number</button>
          </nxp-stepper>
        </section>
      </div>
    </div>
  `,
})
export class StepperDemoComponent {
  readonly wizardStep = signal(1);
  readonly verticalStep = signal(0);
  readonly iconStep = signal(0);

  onWizardStep(index: number): void {
    this.wizardStep.set(index);
  }

  onVerticalStep(index: number): void {
    this.verticalStep.set(index);
  }

  onIconStep(index: number): void {
    this.iconStep.set(index);
  }

  wizardBack(): void {
    this.wizardStep.update((i) => Math.max(0, i - 1));
  }

  wizardNext(): void {
    this.wizardStep.update((i) => Math.min(3, i + 1));
  }
}
