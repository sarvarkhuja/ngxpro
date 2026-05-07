import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { cx } from '@ngxpro/cdk';
import { NxpStepperComponent } from './stepper.component';

export type StepState = 'error' | 'normal' | 'pass';

/**
 * Step component for use inside nxp-stepper.
 * Use as an attribute on a button or anchor element.
 *
 * @example
 * <button nxpStep stepState="pass">Account Info</button>
 * <button nxpStep>Personal Details</button>
 * <button nxpStep stepState="error">Payment</button>
 */
@Component({
  selector: 'nxp-step, button[nxpStep], a[nxpStep]',
  standalone: true,
  template: `
    <!-- Step indicator circle -->
    <span [class]="indicatorClasses()" aria-hidden="true">
      @if (stepState() === 'pass') {
        <svg
          class="size-4 shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 8L6.5 11.5L13 4.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      } @else if (stepState() === 'error') {
        <svg
          class="size-4 shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4L12 12M12 4L4 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      } @else if (icon()) {
        <span class="text-xs leading-none">{{ icon() }}</span>
      } @else {
        <span class="text-xs font-semibold leading-none tabular-nums">{{
          stepIndex() + 1
        }}</span>
      }
    </span>

    <!-- Step label content -->
    <span class="flex flex-col min-w-0">
      <ng-content />
    </span>
  `,
  host: {
    '[class]': 'hostClasses()',
    '[tabindex]': 'isActive() ? 0 : -1',
    '[attr.aria-current]': 'isActive() ? "step" : null',
    '[attr.data-state]': 'stepState()',
    '[attr.data-active]': 'isActive() ? "" : null',
    '(click)': 'onClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpStepComponent {
  private readonly stepper = inject(NxpStepperComponent);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /** State of this step. */
  readonly stepState = input<StepState>('normal');

  /** Optional custom icon character or short text shown in the indicator. */
  readonly icon = input<string>('');

  /** Additional CSS classes. */
  readonly class = input<string>('');

  /** Zero-based index of this step in the parent stepper. */
  readonly stepIndex = computed(() =>
    this.stepper.indexOf(this.elementRef.nativeElement),
  );

  /** Whether this step is the currently active one. */
  readonly isActive = computed(() => this.stepper.isActive(this.stepIndex()));

  readonly hostClasses = computed(() =>
    cx(
      'group flex items-center gap-3 p-2 rounded-m cursor-pointer',
      'focus:outline-none focus-visible:ring-1 focus-visible:ring-border-focus',
      'hover:bg-bg-neutral-1',
      'transition-colors duration-normal',
      this.isActive() && 'bg-status-info-pale',
      this.class(),
    ),
  );

  readonly indicatorClasses = computed(() => {
    const state = this.stepState();
    const active = this.isActive();

    return cx(
      'size-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-normal',
      state === 'pass' && 'bg-status-positive text-text-on-accent',
      state === 'error' && 'bg-status-negative text-text-on-accent',
      state === 'normal' && active && 'bg-primary text-text-on-accent',
      state === 'normal' && !active && 'bg-bg-neutral-2 text-text-secondary',
    );
  });

  onClick(): void {
    this.stepper.activate(this.stepIndex());
  }
}
