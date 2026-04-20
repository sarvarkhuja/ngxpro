/**
 * Checks if an element or any of its ancestors has position: fixed.
 */
export function nxpCheckFixedPosition(element?: HTMLElement | null): boolean {
  return !!element && (isFixed(element) || nxpCheckFixedPosition(element.parentElement));
}

function isFixed(element: HTMLElement): boolean {
  return (
    element.ownerDocument.defaultView
      ?.getComputedStyle(element)
      .getPropertyValue('position') === 'fixed'
  );
}
