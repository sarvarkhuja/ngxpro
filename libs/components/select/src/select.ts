import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import {
  DataListComponent,
  OptGroupDirective,
  OptionDirective,
} from '@ngxpro/components/data-list';
import { NxpSelectOptionComponent } from '@ngxpro/components/combo-box';
import { NxpSelectDirective } from './select.directive';
import { NxpSelectFilterComponent } from './select-filter.component';

/**
 * Convenience array — spread into `imports` to bring in all select pieces.
 *
 * Includes:
 * - `NxpSelectDirective` — the directive itself (`input[nxpSelect]`)
 * - `NxpSelectFilterComponent` — `<nxp-select-filter>` panel wrapper with
 *   filtering + auto "Create" affordance on empty results
 * - `NxpSelectOptionComponent` — shared option renderer (re-used from combo-box)
 * - `NxpTextfieldComponent` — textfield wrapper
 * - `NxpLabelDirective` — floating/block label
 * - `NxpInputDirective` — underlying input directive
 * - `DataListComponent` + `OptionDirective` + `OptGroupDirective` — listbox
 *   container, option button, and grouped section directive
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
 *
 * @example With filter, grouping and "create on no match":
 * ```html
 * <nxp-textfield>
 *   <label nxpLabel>Tag</label>
 *   <input nxpInput nxpSelect [formControl]="tagCtrl" />
 *   <ng-template nxpDropdown>
 *     <nxp-select-filter [items]="tags()" (create)="addTag($event)">
 *       <ng-template let-list>
 *         <div nxpOptGroup label="Recent">
 *           @for (t of list; track t) {
 *             <nxp-select-option [value]="t" />
 *           }
 *         </div>
 *       </ng-template>
 *     </nxp-select-filter>
 *   </ng-template>
 * </nxp-textfield>
 * ```
 */
export const NxpSelect = [
  NxpSelectDirective,
  NxpSelectFilterComponent,
  NxpSelectOptionComponent,
  NxpTextfieldComponent,
  NxpLabelDirective,
  NxpInputDirective,
  DataListComponent,
  OptionDirective,
  OptGroupDirective,
  NxpDropdownContent,
] as const;
