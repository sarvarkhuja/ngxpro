import { NxpInputDirective } from './input.directive';

/**
 * Convenience array for the full textfield system (textfield + label + input).
 * For standalone input only, just import NxpInputDirective.
 *
 * @example
 * // Full textfield system:
 * import { NxpTextfieldComponent } from '@nxp/components/textfield';
 * import { NxpLabelDirective } from '@nxp/components/label';
 * import { NxpInputDirective } from '@nxp/components/input';
 *
 * // Standalone:
 * import { NxpInputDirective } from '@nxp/components/input';
 */
export const NxpInput = [NxpInputDirective] as const;
