import { NxpTextfieldComponent } from './textfield.component';
import { NxpTextfieldOptionsDirective } from './textfield.options';

/**
 * Convenience array of all textfield-related exports.
 * Import in your component's `imports` array.
 *
 * @example
 * imports: [...NxpTextfield]
 */
export const NxpTextfield = [
  NxpTextfieldComponent,
  NxpTextfieldOptionsDirective,
] as const;
