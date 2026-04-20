/**
 * Proximity-hover helpers — port of `fluidfunctionalizm/hooks/use-proximity-hover.ts`.
 *
 * Pure functions for measuring item rects and finding the closest item to a
 * pointer position along a single axis. Callers are responsible for
 * scheduling (e.g. via `requestAnimationFrame`) and signal storage.
 */

/** Layout rect of an item relative to its offset parent (the container). */
export interface NxpItemRect {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Measure a set of items using `offset*` so that CSS transforms on siblings
 * (e.g. an animating indicator pill) do not corrupt the readings.
 */
export function nxpMeasureItems(
  _container: HTMLElement,
  items: readonly HTMLElement[],
): NxpItemRect[] {
  return items.map((el) => ({
    top: el.offsetTop,
    left: el.offsetLeft,
    width: el.offsetWidth,
    height: el.offsetHeight,
  }));
}

/**
 * Find the index of the item closest to the given pointer position along
 * `axis`. Items that strictly contain the pointer take priority over the
 * closest-by-center fallback (matches the reference behaviour).
 *
 * Returns `null` when there are no rects to search.
 */
export function nxpFindProximityIndex(
  container: HTMLElement,
  rects: readonly NxpItemRect[],
  clientX: number,
  clientY: number,
  axis: 'x' | 'y',
): number | null {
  if (rects.length === 0) return null;

  const containerRect = container.getBoundingClientRect();
  const mousePos = axis === 'x' ? clientX : clientY;
  const scrollOffset = axis === 'x' ? container.scrollLeft : container.scrollTop;
  const borderOffset = axis === 'x' ? container.clientLeft : container.clientTop;
  const containerEdge = axis === 'x' ? containerRect.left : containerRect.top;

  let closestIndex: number | null = null;
  let closestDistance = Infinity;
  let containingIndex: number | null = null;

  for (let index = 0; index < rects.length; index++) {
    const r = rects[index];
    if (!r) continue;

    const contentPos = axis === 'x' ? r.left : r.top;
    const itemStart = containerEdge + borderOffset + contentPos - scrollOffset;
    const itemSize = axis === 'x' ? r.width : r.height;
    const itemEnd = itemStart + itemSize;

    if (mousePos >= itemStart && mousePos <= itemEnd) {
      containingIndex = index;
    }

    const itemCenter = itemStart + itemSize / 2;
    const distance = Math.abs(mousePos - itemCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }

  return containingIndex ?? closestIndex;
}
