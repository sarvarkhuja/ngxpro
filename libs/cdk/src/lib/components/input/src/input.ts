import { NxpInputDirective } from './input.directive';

/**
 * Convenience array for the full textfield system (textfield + label + input).
 * For standalone input only, just import NxpInputDirective.
 *
 * @example
 * // Full textfield system:
 * import { NxpTextfieldComponent } from '@ngxpro/components/textfield';
 * import { NxpLabelDirective } from '@ngxpro/components/label';
 * import { NxpInputDirective } from '@ngxpro/components/input';
 *
 * // Standalone:
 * import { NxpInputDirective } from '@ngxpro/components/input';
 */
export const NxpInput = [NxpInputDirective] as const;
