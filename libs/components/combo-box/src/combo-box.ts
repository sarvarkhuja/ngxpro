import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import {
  DataListComponent,
  OptionDirective,
} from '@ngxpro/components/data-list';
import { NxpComboBoxDirective } from './combo-box.directive';
import { NxpSelectOptionComponent } from './select-option.component';

/**
 * Convenience array — spread into a component's `imports` to bring in every
 * piece a combo-box needs (directive, textfield wrapper, label, input,
 * data-list, select-option, dropdown template).
 *
 * @example
 * ```typescript
 * \@Component({ imports: [...NxpComboBox] })
 * ```
 */
export const NxpComboBox = [
  NxpComboBoxDirective,
  NxpSelectOptionComponent,
  NxpTextfieldComponent,
  NxpLabelDirective,
  NxpInputDirective,
  DataListComponent,
  OptionDirective,
  NxpDropdownContent,
] as const;
