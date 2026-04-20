import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  contentChildren,
  forwardRef,
  input,
  model,
} from '@angular/core';
import { cx } from '@nxp/cdk';
import { NxpStepComponent } from './step.component';

/**
 * Stepper component (Taiga architecture + Tremor styling).
 * Displays a sequence of steps with state indicators.
 *
 * @example
 * <!-- Horizontal stepper (default) -->
 * <nxp-stepper [(activeItemIndex)]="currentStep">
 *   <button nxpStep stepState="pass">Account</button>
 *   <button nxpStep>Details</button>
 *   <button nxpStep>Review</button>
 * </nxp-stepper>
 *
 * @example
 * <!-- Vertical stepper -->
 * <nxp-stepper orientation="vertical" [(activeItemIndex)]="currentStep">
 *   <button nxpStep stepState="pass">Step 1</button>
 *   <button nxpStep>Step 2</button>
 * </nxp-stepper>
 */
@Component({
  selector: 'nxp-stepper',
  standalone: true,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-orientation]': 'orientation()',
    'tabindex': '-1',
    '(keydown.arrowRight)': 'onArrowKey($event, 1)',
    '(keydown.arrowLeft)': 'onArrowKey($event, -1)',
    '(keydown.arrowDown)': 'onArrowKey($event, 1)',
    '(keydown.arrowUp)': 'onArrowKey($event, -1)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpStepperComponent {
  /** Layout orientation of the stepper. */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  /** Index of the currently active step (two-way bindable). */
  readonly activeItemIndex = model(0);

  readonly steps = contentChildren(forwardRef(() => NxpStepComponent), {
    read: ElementRef,
  });

  readonly hostClasses = () =>
    cx(
      'flex outline-none overflow-auto',
      this.orientation() === 'horizontal'
        ? 'flex-row items-center overflow-x-auto'
        : 'flex-col items-stretch overflow-y-auto',
    );

  /** Returns the index of a step element within this stepper. */
  indexOf(el: HTMLElement): number {
    return this.steps().findIndex((ref) => ref.nativeElement === el);
  }

  /** Returns true if the step at the given index is active. */
  isActive(index: number): boolean {
    return this.activeItemIndex() === index;
  }

  /** Sets the given index as active and scrolls it into view. */
  activate(index: number): void {
    const steps = this.steps();
    if (index < 0 || index >= steps.length) return;

    this.activeItemIndex.set(index);
    this.scrollIntoView(index);
  }

  private scrollIntoView(index: number): void {
    const steps = this.steps();
    const el = steps[index]?.nativeElement as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    el?.focus();
  }

  /** Handles arrow key navigation between steps. */
  onArrowKey(event: Event, delta: number): void {
    if (!(event instanceof KeyboardEvent)) return;

    const isHorizontal = this.orientation() === 'horizontal';
    const isVertical = this.orientation() === 'vertical';
    const key = event.key;

    // Only respond to the relevant axis
    if (isHorizontal && (key === 'ArrowDown' || key === 'ArrowUp')) return;
    if (isVertical && (key === 'ArrowLeft' || key === 'ArrowRight')) return;

    event.preventDefault();
    const steps = this.steps();
    const next = this.activeItemIndex() + delta;
    if (next >= 0 && next < steps.length) {
      this.activate(next);
    }
  }
}
