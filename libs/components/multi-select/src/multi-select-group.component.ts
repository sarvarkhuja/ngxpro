import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
} from '@angular/core';
import { NXP_MULTI_SELECT_TEXTS } from '@ngxpro/cdk';
import {
  NXP_TEXTFIELD,
  NXP_TEXTFIELD_ACCESSOR,
} from '@ngxpro/cdk/components/textfield';
import { NxpMultiSelectComponent } from './multi-select.component';
import { NxpMultiSelectDirective } from './multi-select.directive';
import { NxpMultiSelectOptionComponent } from './multi-select-option.component';

/** Anything that exposes the multi-select selection mutation API. */
type MultiSelectHost<T> = {
  isItemSelected(item: T): boolean;
  selectedItems(): readonly T[];
  setItems(items: readonly T[]): void;
  getIdentity(): (a: T, b: T) => boolean;
};

function isMultiSelectHost<T>(value: unknown): value is MultiSelectHost<T> {
  return (
    value instanceof NxpMultiSelectComponent ||
    value instanceof NxpMultiSelectDirective
  );
}

/**
 * Group header with "Select All / Deselect All" toggle.
 *
 * Wrap option components inside this to add a labeled group. The button
 * text comes from `NXP_MULTI_SELECT_TEXTS` (override for i18n).
 *
 * The toggle adds every group item missing from the selection, or removes
 * every group item when all are already selected. Items from other groups
 * are preserved.
 *
 * Host resolution mirrors `NxpMultiSelectOptionComponent` — supports both
 * the wrapper component (`<nxp-multi-select>`) and the textfield-wrapped
 * directive (`input[nxpMultiSelect]`).
 *
 * @example
 * ```html
 * <nxp-multi-select [formControl]="ctrl" [items]="[]">
 *   <div nxpMultiSelectGroup label="Europe">
 *     <nxp-multi-select-option [value]="france" />
 *     <nxp-multi-select-option [value]="germany" />
 *   </div>
 * </nxp-multi-select>
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
          class="font-mono text-xs font-medium uppercase text-text-tertiary"
        >
          {{ label() }}
        </span>
      }
      @if (groupValues().length > 0) {
        <button
          type="button"
          class="text-xs font-medium text-text-action hover:underline outline-none focus-visible:underline"
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
  private readonly directHost = inject(NxpMultiSelectComponent, {
    optional: true,
  }) as NxpMultiSelectComponent<T> | null;
  private readonly textfield = inject(NXP_TEXTFIELD, { optional: true }) as {
    accessor?: () => unknown;
  } | null;
  private readonly directAccessor = inject(NXP_TEXTFIELD_ACCESSOR, {
    optional: true,
  });

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
    const host = this.resolveHost();
    if (!values.length || !host) return false;
    return values.every((v) => host.isItemSelected(v));
  });

  /** Toggle all items in the group on or off. */
  protected toggle(): void {
    const host = this.resolveHost();
    if (!host) return;

    const groupVals = this.groupValues();
    const matcher = host.getIdentity();
    const current = host.selectedItems();

    if (this.allSelected()) {
      host.setItems(
        current.filter(
          (v) => !groupVals.some((gv) => matcher(v as unknown as T, gv)),
        ),
      );
      return;
    }

    const toAdd = groupVals.filter(
      (gv) => !current.some((v) => matcher(v as unknown as T, gv)),
    );
    host.setItems([...current, ...toAdd] as readonly T[]);
  }

  private resolveHost(): MultiSelectHost<T> | null {
    if (this.directHost) return this.directHost;
    const fromTextfield = this.textfield?.accessor?.();
    if (isMultiSelectHost<T>(fromTextfield)) return fromTextfield;
    if (isMultiSelectHost<T>(this.directAccessor)) return this.directAccessor;
    return null;
  }
}
