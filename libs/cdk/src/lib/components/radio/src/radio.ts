import { NxpRadioComponent } from './radio.component';
import { NxpRadioDirective } from './radio.directive';

/**
 * Convenience array for importing all Radio-related declarations.
 *
 * @example
 * ```typescript
 * import { NxpRadio } from '@nxp/components/radio';
 *
 * @Component({
 *   imports: [...NxpRadio],
 * })
 * ```
 */
export const NxpRadio = [NxpRadioComponent, NxpRadioDirective] as const;
