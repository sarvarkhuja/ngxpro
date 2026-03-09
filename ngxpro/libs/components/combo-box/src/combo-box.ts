import { NxpDropdownContent } from '@nxp/cdk';
import { NxpTextfieldComponent } from '@nxp/cdk/components/textfield';
import { NxpLabelDirective } from '@nxp/cdk/components/label';
import { NxpInputDirective } from '@nxp/cdk/components/input';
import { DataListComponent, OptionDirective } from '@nxp/components/data-list';
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
