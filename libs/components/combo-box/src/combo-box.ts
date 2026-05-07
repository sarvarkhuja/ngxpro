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
 * Convenience array — spread into `imports` to bring in all combo-box pieces.
 *
 * Includes:
 * - `NxpComboBoxDirective` — the directive itself (`input[nxpComboBox]`)
 * - `NxpSelectOptionComponent` — individual option renderer
 * - `NxpTextfieldComponent` — textfield wrapper
 * - `NxpLabelDirective` — floating/block label
 * - `NxpInputDirective` — underlying input directive
 * - `DataListComponent` + `OptionDirective` — listbox container and options
 * - `NxpDropdownContent` — `ng-template[nxpDropdown]` for the dropdown panel
 *
 * @example
 * ```typescript
 * \@Component({ imports: [...NxpComboBox] })
 * ```
 *
 * @example
 * ```html
 * <nxp-textfield>
 *   <label nxpLabel>Country</label>
 *   <input nxpInput nxpComboBox #cb="nxpComboBox"
 *          [formControl]="countryCtrl"
 *          [items]="countries" />
 *   <ng-template nxpDropdown>
 *     <nxp-data-list>
 *       @for (item of cb.filteredItems(); track item) {
 *         <nxp-select-option [value]="item" />
 *       }
 *     </nxp-data-list>
 *   </ng-template>
 * </nxp-textfield>
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
