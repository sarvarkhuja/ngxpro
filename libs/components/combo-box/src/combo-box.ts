import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import {
  DataListComponent,
  OptionDirective,
} from '@ngxpro/components/data-list';
import { NxpComboBoxComponent } from './combo-box.component';
import { NxpComboBoxDirective } from './combo-box.directive';
import { NxpSelectOptionComponent } from './select-option.component';

/**
 * Convenience array — spread into a component's `imports` to bring in every
 * piece a combo-box needs.
 *
 * Two flavours share the same selection plumbing:
 * - `<nxp-combo-box>` (`NxpComboBoxComponent`) — self-contained, items-driven
 *   editable single-select with type-to-filter. One element + `[formControl]`.
 * - `input[nxpComboBox]` (`NxpComboBoxDirective`) inside `<nxp-textfield>` — the
 *   composable form for custom dropdown content.
 *
 * @example
 * ```typescript
 * \@Component({ imports: [...NxpComboBox] })
 * ```
 */
export const NxpComboBox = [
  NxpComboBoxComponent,
  NxpComboBoxDirective,
  NxpSelectOptionComponent,
  NxpTextfieldComponent,
  NxpLabelDirective,
  NxpInputDirective,
  DataListComponent,
  OptionDirective,
  NxpDropdownContent,
] as const;
