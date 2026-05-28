import type { NxpCheckboxValue } from '@ngxpro/cdk/components/checkbox';
import type { NxpTreeHandler } from './tree.interfaces';

/**
 * Aggregate checked state for `item`, walking its descendants via
 * `childrenHandler`. Internal nodes are derived from their children, so
 * callers do not need to write parent entries into the map themselves.
 *
 * Returns an `NxpCheckboxValue` directly consumable by `nxpCheckbox` via
 * `[(ngModel)]`:
 * - `true` if every reachable leaf is checked,
 * - `false` if every reachable leaf is unchecked,
 * - `null` (indeterminate) if the descendants disagree.
 *
 * @example
 * // Bound through the nxpMapper pipe:
 * // [ngModel]="item | nxpMapper: getValue : map"
 * protected readonly getValue = (
 *   item: T,
 *   map: ReadonlyMap<T, NxpCheckboxValue>,
 * ): NxpCheckboxValue =>
 *   nxpComputeTreeChecked(item, map, this.handler);
 */
export function nxpComputeTreeChecked<T>(
  item: T,
  map: ReadonlyMap<T, NxpCheckboxValue>,
  childrenHandler: NxpTreeHandler<T>,
): NxpCheckboxValue {
  const children = childrenHandler(item);
  if (children.length === 0) {
    return map.get(item) ?? false;
  }

  let allChecked = true;
  let allUnchecked = true;
  for (const child of children) {
    const childState = nxpComputeTreeChecked(child, map, childrenHandler);
    if (childState === null) return null;
    if (childState) allUnchecked = false;
    else allChecked = false;
  }
  if (allChecked) return true;
  if (allUnchecked) return false;
  return null;
}

/**
 * Cascade `value` to `item` and every descendant returned by
 * `childrenHandler`. Returns a fresh `Map` so consumers using a signal /
 * pure pipe pick up the change via reference equality.
 *
 * Parent state is not stored — `nxpComputeTreeChecked` derives it on read.
 *
 * @example
 * protected readonly onChecked = (item: T, value: boolean): void => {
 *   this.map.set(
 *     nxpToggleTreeChecked(item, value, this.map(), this.handler),
 *   );
 * };
 */
export function nxpToggleTreeChecked<T>(
  item: T,
  value: boolean,
  map: ReadonlyMap<T, NxpCheckboxValue>,
  childrenHandler: NxpTreeHandler<T>,
): Map<T, NxpCheckboxValue> {
  const next = new Map<T, NxpCheckboxValue>(map);
  const cascade = (node: T): void => {
    next.set(node, value);
    for (const child of childrenHandler(node)) cascade(child);
  };
  cascade(item);
  return next;
}
