import { NxpMultiSelectComponent } from './multi-select.component';
import { NxpMultiSelectOptionComponent } from './multi-select-option.component';
import { NxpMultiSelectGroupComponent } from './multi-select-group.component';
import { DataListComponent } from '@nxp/components/data-list';

/**
 * Convenience import array — spread into `imports` to bring in all multi-select pieces.
 *
 * Includes:
 * - `NxpMultiSelectComponent` — main chip-based select (`nxp-multi-select`)
 * - `NxpMultiSelectOptionComponent` — option item with checkbox (`nxp-multi-select-option`)
 * - `NxpMultiSelectGroupComponent` — group header with Select All (`div[nxpMultiSelectGroup]`)
 * - `DataListComponent` — listbox container (`nxp-data-list`)
 *
 * @example
 * ```typescript
 * \@Component({ imports: [...NxpMultiSelect] })
 * ```
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <nxp-multi-select
 *   [formControl]="ctrl"
 *   [items]="options"
 *   placeholder="Pick options..."
 * />
 * ```
 *
 * @example
 * ```html
 * <!-- With custom stringify -->
 * <nxp-multi-select
 *   [formControl]="ctrl"
 *   [items]="countries"
 *   placeholder="Select countries..."
 * />
 * <!-- provider: nxpItemsHandlersProvider({ stringify: signal(c => c.name) }) -->
 * ```
 */
export const NxpMultiSelect = [
  NxpMultiSelectComponent,
  NxpMultiSelectOptionComponent,
  NxpMultiSelectGroupComponent,
  DataListComponent,
] as const;
