import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
} from '@angular/core';
import { NXP_ITEMS_HANDLERS, NXP_MULTI_SELECT_TEXTS } from '@ngxpro/cdk';
import { NxpMultiSelectComponent } from './multi-select.component';
import { NxpMultiSelectOptionComponent } from './multi-select-option.component';

/**
 * Multi-select group header with "Select All / Deselect All" toggle.
 *
 * Wrap option components inside this to add a labeled group with a toggle button.
 * The button text is driven by `NXP_MULTI_SELECT_TEXTS` (injectable for i18n).
 *
 * The toggle selects all items in the group when any are missing from the
 * selection, or deselects all when every item in the group is already selected.
 * Items from other groups are preserved.
 *
 * @example
 * ```html
 * <nxp-multi-select [formControl]="ctrl" [items]="[]">
 *   <!-- Manually projected content with groups -->
 * </nxp-multi-select>
 *
 * <!-- Inside nxp-data-list in custom dropdown: -->
 * <div nxpMultiSelectGroup label="Europe">
 *   <nxp-multi-select-option [value]="france" />
 *   <nxp-multi-select-option [value]="germany" />
 * </div>
 * ```
 */
@Component({
  selector: 'nxp-multi-select-group, div[nxpMultiSelectGroup]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    '[attr.aria-label]': 'label()',
    class: 'block',
  },
  template: `
    <div class="flex items-center justify-between px-3 py-1.5">
      @if (label()) {
        <span
          class="text-xs font-semibold uppercase tracking-wide text-text-tertiary"
        >
          {{ label() }}
        </span>
      }
      @if (groupValues().length > 0) {
        <button
          type="button"
          class="text-xs font-medium text-text-action hover:underline focus:outline-none focus:underline"
          (pointerdown)="$event.preventDefault()"
          (click)="toggle()"
          [attr.aria-label]="allSelected() ? texts().none : texts().all"
        >
          {{ allSelected() ? texts().none : texts().all }}
        </button>
      }
    </div>
    <ng-content />
  `,
})
export class NxpMultiSelectGroupComponent<T = unknown> {
  private readonly multiSelect = inject(NxpMultiSelectComponent, {
    optional: true,
  }) as NxpMultiSelectComponent<T> | null;
  private readonly handlers = inject(NXP_ITEMS_HANDLERS);

  protected readonly texts = inject(NXP_MULTI_SELECT_TEXTS);

  /** Group label displayed in the header. */
  readonly label = input('');

  private readonly options = contentChildren(NxpMultiSelectOptionComponent);

  /** Values of all option components in this group. */
  protected readonly groupValues = computed(() =>
    this.options().map((o) => o.value() as T),
  );

  /** True when every item in the group is currently selected. */
  protected readonly allSelected = computed(() => {
    const values = this.groupValues();
    const ms = this.multiSelect;
    if (!values.length || !ms) return false;
    return values.every((v) => ms.isItemSelected(v));
  });

  /** Toggle all items in the group on or off. */
  protected toggle(): void {
    const ms = this.multiSelect;
    if (!ms) return;

    const groupVals = this.groupValues();
    const matcher = this.handlers.identityMatcher();
    const current = ms.value();

    if (this.allSelected()) {
      // Deselect all group items, preserve rest
      ms.setItems(
        current.filter(
          (v) => !groupVals.some((gv) => matcher(v as unknown as T, gv)),
        ),
      );
    } else {
      // Add missing group items to selection
      const toAdd = groupVals.filter(
        (gv) => !current.some((v) => matcher(v as unknown as T, gv)),
      );
      ms.setItems([...current, ...toAdd] as readonly T[]);
    }
  }
}
