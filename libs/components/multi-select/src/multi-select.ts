import { NxpDropdownContent } from '@ngxpro/cdk';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpInputDirective } from '@ngxpro/cdk/components/input';
import {
  DataListComponent,
  OptionDirective,
} from '@ngxpro/components/data-list';
import { NxpMultiSelectComponent } from './multi-select.component';
import { NxpMultiSelectDirective } from './multi-select.directive';
import { NxpMultiSelectOptionComponent } from './multi-select-option.component';
import { NxpMultiSelectGroupComponent } from './multi-select-group.component';

/**
 * Convenience array — spread into a component's `imports` to bring in every
 * piece a multi-select needs.
 *
 * Two flavours share the same selection plumbing:
 *
 * 1. **Chip-based** (`<nxp-multi-select>`) — self-contained component that
 *    renders selected items as `<nxp-input-chip-item>` pills. Best for
 *    most forms.
 *
 * 2. **Chip-less directive** (`input[nxpMultiSelect]` inside `<nxp-textfield>`)
 *    — mirrors the `nxpComboBox` architecture; selection appears as
 *    comma-separated text in the input. Use when you want the field to
 *    look identical to single-value combo / select inputs.
 *
 * @example
 * ```typescript
 * @Component({ imports: [...NxpMultiSelect] })
 * ```
 *
 * @example
 * ```html
 * <!-- Chip-based -->
 * <nxp-multi-select
 *   [formControl]="ctrl"
 *   [items]="items"
 *   placeholder="Select..."
 * />
 *
 * <!-- Chip-less, textfield-wrapped -->
 * <nxp-textfield>
 *   <label nxpLabel>Items</label>
 *   <input
 *     nxpInput
 *     nxpMultiSelect
 *     #ms="nxpMultiSelect"
 *     [formControl]="ctrl"
 *     [items]="items"
 *     readonly
 *   />
 *   <ng-template nxpDropdown>
 *     <nxp-data-list>
 *       @for (item of ms.items(); track item) {
 *         <nxp-multi-select-option [value]="item" />
 *       }
 *     </nxp-data-list>
 *   </ng-template>
 * </nxp-textfield>
 * ```
 */
export const NxpMultiSelect = [
  NxpMultiSelectComponent,
  NxpMultiSelectDirective,
  NxpMultiSelectOptionComponent,
  NxpMultiSelectGroupComponent,
  NxpTextfieldComponent,
  NxpLabelDirective,
  NxpInputDirective,
  DataListComponent,
  OptionDirective,
  NxpDropdownContent,
] as const;
