import { NxpSegmentedComponent } from './segmented.component';
import { NxpSegmentComponent } from './segment.component';

export { NxpSegmentedComponent } from './segmented.component';
export { NxpSegmentedDirective } from './segmented.directive';
export { NxpSegmentComponent } from './segment.component';
export type {
  NxpSegmentedOptions,
  NxpSegmentedOrientation,
  NxpSegmentedSize,
} from './segmented.options';
export {
  NXP_SEGMENTED_OPTIONS,
  nxpSegmentedOptionsProvider,
} from './segmented.options';

/**
 * Convenience re-export array for importing all segmented directives/components at once.
 *
 * @example
 * // In your component's imports array:
 * imports: [NxpSegmented]
 */
export const NxpSegmented = [
  NxpSegmentedComponent,
  NxpSegmentComponent,
] as const;
