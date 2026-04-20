import { NxpStepperComponent } from './stepper.component';
import { NxpStepComponent } from './step.component';
import { NxpConnectedDirective } from './connected.directive';

export { NxpStepperComponent } from './stepper.component';
export { NxpStepComponent } from './step.component';
export { NxpConnectedDirective } from './connected.directive';
export type { StepState } from './step.component';

export const NxpStepper = [
  NxpStepperComponent,
  NxpStepComponent,
  NxpConnectedDirective,
] as const;
