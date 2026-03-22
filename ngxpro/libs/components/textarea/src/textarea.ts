import { NxpTextfieldComponent, NxpTextfieldOptionsDirective } from '@nxp/cdk/components/textfield';
import { NxpLabelDirective } from '@nxp/cdk/components/label';
import { NxpTextareaComponent } from './textarea.component';
import { NxpTextareaLimitDirective } from './textarea.directive';

/**
 * Convenience array — spread into `imports` to bring in all textarea-related pieces.
 *
 * Includes:
 * - `NxpTextareaComponent` — auto-resizing textarea (`textarea[nxpTextarea]`)
 * - `NxpTextareaLimitDirective` — character limit + counter (`textarea[nxpTextarea][limit]`)
 * - `NxpTextfieldComponent` — textfield wrapper (`nxp-textfield`)
 * - `NxpLabelDirective` — floating/block label (`label[nxpLabel]`)
 * - `NxpTextfieldOptionsDirective` — size/cleaner options
 *
 * @example
 * ```typescript
 * \@Component({ imports: [...NxpTextarea] })
 * ```
 *
 * @example
 * ```html
 * <nxp-textfield>
 *   <label nxpLabel>Description</label>
 *   <textarea nxpTextarea placeholder=" "></textarea>
 * </nxp-textfield>
 * ```
 */
export const NxpTextarea = [
  NxpTextareaComponent,
  NxpTextareaLimitDirective,
  NxpLabelDirective,
  NxpTextfieldComponent,
  NxpTextfieldOptionsDirective,
] as const;
