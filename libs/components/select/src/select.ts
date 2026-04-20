import { NxpDropdownContent } from '@nxp/cdk';
import { NxpTextfieldComponent } from '@nxp/cdk/components/textfield';
import { NxpLabelDirective } from '@nxp/cdk/components/label';
import { NxpInputDirective } from '@nxp/cdk/components/input';
import { DataListComponent, OptionDirective } from '@nxp/components/data-list';
import { NxpSelectOptionComponent } from '@nxp/components/combo-box';
import { NxpSelectDirective } from './select.directive';

/**
 * Convenience array — spread into `imports` to bring in all select pieces.
 *
 * Includes:
 * - `NxpSelectDirective` — the directive itself (`input[nxpSelect]`)
 * - `NxpSelectOptionComponent` — shared option renderer (re-used from combo-box)
 * - `NxpTextfieldComponent` — textfield wrapper
 * - `NxpLabelDirective` — floating/block label
 * - `NxpInputDirective` — underlying input directive
 * - `DataListComponent` + `OptionDirective` — listbox container and options
 * - `NxpDropdownContent` — `ng-template[nxpDropdown]` for the dropdown panel
 *
 * @example
 * ```typescript
 * \@Component({ imports: [...NxpSelect] })
 * ```
 *
 * @example
 * ```html
 * <nxp-textfield>
 *   <label nxpLabel>Country</label>
 *   <input nxpInput nxpSelect [formControl]="countryCtrl" />
 *   <ng-template nxpDropdown>
 *     <nxp-data-list>
 *       @for (item of items; track item) {
 *         <nxp-select-option [value]="item" />
 *       }
 *     </nxp-data-list>
 *   </ng-template>
 * </nxp-textfield>
 * ```
 */
export const NxpSelect = [
  NxpSelectDirective,
  NxpSelectOptionComponent,
  NxpTextfieldComponent,
  NxpLabelDirective,
  NxpInputDirective,
  DataListComponent,
  OptionDirective,
  NxpDropdownContent,
] as const;
