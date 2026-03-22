import { NxpSliderReadonly } from './helpers/slider-readonly.directive';
import { NxpSliderThumbLabel } from './helpers/slider-thumb-label.component';
import { NxpSliderComponent } from './slider.component';

/**
 * All directives and components that make up the NxpSlider CDK primitive.
 *
 * Import this array into the `imports` of any standalone component that needs slider support.
 *
 * @example
 * ```ts
 * @Component({
 *   imports: [...NxpSlider],
 * })
 * ```
 */
export const NxpSlider = [
  NxpSliderComponent,
  NxpSliderThumbLabel,
  NxpSliderReadonly,
] as const;
