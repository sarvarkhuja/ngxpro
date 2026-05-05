import { NxpCheckboxComponent } from './checkbox.component';
import { NxpCheckboxDirective } from './checkbox.directive';

/**
 * Convenience array for importing all Checkbox-related declarations.
 *
 * @example
 * ```typescript
 * import { NxpCheckbox } from '@nxp/components/checkbox';
 *
 * @Component({
 *   imports: [...NxpCheckbox],
 * })
 * ```
 */
export const NxpCheckbox = [NxpCheckboxComponent, NxpCheckboxDirective] as const;
